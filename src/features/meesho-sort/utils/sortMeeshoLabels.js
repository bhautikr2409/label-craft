import { PDFDocument } from 'pdf-lib';
import toast from 'react-hot-toast';
import { loadPdfDocument } from '../../label-crop/utils/detectLabel';
import { cropMeeshoPageIntoDoc } from '../../label-crop/utils/cropLabels';
import { extractMeeshoPageMeta } from './extractMeeshoMeta';

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function compareLabelPages(a, b) {
  const skuCmp = String(a.sku).localeCompare(String(b.sku), undefined, {
    sensitivity: 'base',
    numeric: true,
  });
  if (skuCmp !== 0) return skuCmp;
  return String(a.courier).localeCompare(String(b.courier), undefined, {
    sensitivity: 'base',
  });
}

/**
 * Build a summary tree: SKU → courier → count
 */
export function buildSortSummary(sortedPages) {
  const map = new Map();
  for (const page of sortedPages) {
    if (!map.has(page.sku)) map.set(page.sku, new Map());
    const couriers = map.get(page.sku);
    couriers.set(page.courier, (couriers.get(page.courier) || 0) + 1);
  }

  return [...map.entries()].map(([sku, couriers]) => ({
    sku,
    total: [...couriers.values()].reduce((a, b) => a + b, 0),
    couriers: [...couriers.entries()].map(([courier, count]) => ({ courier, count })),
  }));
}

/**
 * Upload Meesho labels → sort by SKU/courier → Meesho crop (4×6) → download.
 * @param {{ id: string, file: File }[]} items
 * @param {{ onProgress?: Function, outputSizeId?: string }} [options]
 */
export async function sortMeeshoLabelsAndDownload(items, options = {}) {
  const { onProgress, outputSizeId = '4x6' } = options;

  if (!items?.length) {
    toast.error('Upload at least one Meesho label PDF.');
    return false;
  }

  try {
    onProgress?.({ phase: 'reading', current: 0, total: 0 });

    const jsDocs = new Map();
    const loaded = [];

    for (const item of items) {
      const pdf = await loadPdfDocument(item.file);
      jsDocs.set(item.id, pdf);
      loaded.push({ item, pdf, pageCount: pdf.numPages });
    }

    const totalPages = loaded.reduce((sum, d) => sum + d.pageCount, 0);
    if (totalPages < 1) {
      toast.error('No pages found in the selected PDFs.');
      return false;
    }

    // 1) Read SKU + courier from every page
    const pages = [];
    let scanned = 0;

    for (const { item, pdf, pageCount } of loaded) {
      for (let pageNumber = 1; pageNumber <= pageCount; pageNumber++) {
        scanned += 1;
        onProgress?.({ phase: 'reading', current: scanned, total: totalPages });

        const pdfPage = await pdf.getPage(pageNumber);
        let meta;
        try {
          meta = await extractMeeshoPageMeta(pdfPage);
        } catch (error) {
          console.warn('Meesho page meta failed', error);
          meta = { sku: 'Unknown SKU', courier: 'Unknown' };
        }

        pages.push({
          fileId: item.id,
          pageIndex: pageNumber - 1,
          pageNumber,
          sku: meta.sku,
          courier: meta.courier,
        });
      }
    }

    // 2) Sort: SKU first, then shipping company
    const sorted = [...pages].sort(compareLabelPages);

    // 3) Crop each sorted page with existing Meesho Label Crop path
    const outDoc = await PDFDocument.create();
    for (let i = 0; i < sorted.length; i++) {
      const entry = sorted[i];
      onProgress?.({ phase: 'cropping', current: i + 1, total: sorted.length });

      const pdfjsDoc = jsDocs.get(entry.fileId);
      if (!pdfjsDoc) continue;

      await cropMeeshoPageIntoDoc(outDoc, pdfjsDoc, entry.pageNumber, outputSizeId);
    }

    if (outDoc.getPageCount() < 1) {
      toast.error('Could not crop any label pages.');
      return false;
    }

    // 4) Download
    onProgress?.({ phase: 'saving', current: sorted.length, total: sorted.length });
    const outBytes = await outDoc.save();
    const blob = new Blob([outBytes], { type: 'application/pdf' });
    const stamp = new Date().toISOString().slice(0, 10);
    triggerDownload(blob, `meesho-labels-sorted-cropped-${stamp}.pdf`);

    const summary = buildSortSummary(sorted);
    toast.success(
      `Sorted & cropped ${sorted.length} label${sorted.length === 1 ? '' : 's'} · ${summary.length} SKU${summary.length === 1 ? '' : 's'}`
    );

    return { ok: true, sorted, summary, totalPages: sorted.length };
  } catch (error) {
    console.error('Meesho sort+crop error:', error);
    const msg = String(error?.message || '');
    if (/password|encrypt/i.test(msg)) {
      toast.error('A PDF is password-protected. Unlock it first.');
    } else {
      toast.error('Could not sort and crop Meesho labels.');
    }
    return false;
  }
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
