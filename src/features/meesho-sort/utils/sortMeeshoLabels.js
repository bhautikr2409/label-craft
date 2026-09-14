import { PDFDocument } from 'pdf-lib';
import toast from 'react-hot-toast';
import { loadPdfDocument } from '../../label-crop/utils/detectLabel';
import { cropMeeshoPageIntoDoc } from '../../label-crop/utils/cropLabels';
import { extractMeeshoPageMeta } from './extractMeeshoMeta';

export const SORT_MODES = {
  sku: {
    id: 'sku',
    label: 'SKU & Courier',
    hint: 'Group by Product SKU first, then Courier company',
  },
  courier: {
    id: 'courier',
    label: 'Delivery Partner (Courier)',
    hint: 'Group by Shipping Courier (Delhivery, Expressbees, etc.)',
  },
};

function compareLabelPagesBySku(a, b) {
  const skuCmp = String(a.sku).localeCompare(String(b.sku), undefined, {
    sensitivity: 'base',
    numeric: true,
  });
  if (skuCmp !== 0) return skuCmp;
  return String(a.courier).localeCompare(String(b.courier), undefined, {
    sensitivity: 'base',
  });
}

function compareLabelPagesByCourier(a, b) {
  const courierCmp = String(a.courier).localeCompare(String(b.courier), undefined, {
    sensitivity: 'base',
  });
  if (courierCmp !== 0) return courierCmp;
  return String(a.sku).localeCompare(String(b.sku), undefined, {
    sensitivity: 'base',
    numeric: true,
  });
}

/**
 * Build a summary tree by SKU: SKU → courier → count
 */
export function buildSortSummaryBySku(sortedPages) {
  const map = new Map();
  for (const page of sortedPages) {
    if (!map.has(page.sku)) map.set(page.sku, new Map());
    const couriers = map.get(page.sku);
    couriers.set(page.courier, (couriers.get(page.courier) || 0) + 1);
  }

  return [...map.entries()].map(([sku, couriers]) => ({
    mode: 'sku',
    sku,
    total: [...couriers.values()].reduce((a, b) => a + b, 0),
    couriers: [...couriers.entries()].map(([courier, count]) => ({ courier, count })),
  }));
}

/**
 * Build a summary tree by Courier: Courier → SKU → count
 */
export function buildSortSummaryByCourier(sortedPages) {
  const map = new Map();
  for (const page of sortedPages) {
    if (!map.has(page.courier)) map.set(page.courier, new Map());
    const skus = map.get(page.courier);
    skus.set(page.sku, (skus.get(page.sku) || 0) + 1);
  }

  return [...map.entries()].map(([courier, skus]) => ({
    mode: 'courier',
    courier,
    total: [...skus.values()].reduce((a, b) => a + b, 0),
    skus: [...skus.entries()].map(([sku, count]) => ({ sku, count })),
  }));
}

/**
 * Upload Meesho labels → sort by SKU/courier → Meesho crop (4×6).
 * Returns { ok, blob, filename, sorted, summary, totalPages } for preview
 * (does not auto-download).
 */
export async function sortMeeshoLabelsAndDownload(items, options = {}) {
  const { onProgress, outputSizeId = '4x6', sortBy = 'sku', signal } = options;

  const assertNotCancelled = () => {
    if (signal?.aborted) {
      const err = new Error('Cancelled');
      err.name = 'AbortError';
      throw err;
    }
  };

  if (!items?.length) {
    toast.error('Upload at least one Meesho label PDF.');
    return false;
  }

  const activeJsDocs = new Map();

  try {
    assertNotCancelled();
    onProgress?.({ phase: 'reading', current: 0, total: 0 });

    const itemMap = new Map();
    const pages = [];

    // 1) Read SKU + courier from every page of each PDF sequentially.
    // Destroy pdfjsDoc immediately after reading each file to keep RAM usage minimal.
    for (const item of items) {
      assertNotCancelled();
      itemMap.set(item.id, item);

      const pdf = await loadPdfDocument(item.file);
      try {
        const pageCount = pdf.numPages;
        for (let pageNumber = 1; pageNumber <= pageCount; pageNumber++) {
          assertNotCancelled();

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

          onProgress?.({ phase: 'reading', current: pages.length, total: pages.length });
        }
      } finally {
        await pdf.destroy?.();
      }
    }

    if (pages.length < 1) {
      toast.error('No pages found in the selected PDFs.');
      return false;
    }

    // 2) Sort: Delivery partner (courier) or SKU based on user selection
    const isCourierSort = sortBy === 'courier';
    const sorted = [...pages].sort(
      isCourierSort ? compareLabelPagesByCourier : compareLabelPagesBySku
    );

    // 3) Crop each sorted page with Meesho Label Crop path (high-DPI raster + rotate)
    const outDoc = await PDFDocument.create();
    let croppedOk = 0;

    for (let i = 0; i < sorted.length; i++) {
      assertNotCancelled();
      const entry = sorted[i];
      onProgress?.({ phase: 'cropping', current: i + 1, total: sorted.length });

      let pdfjsDoc = activeJsDocs.get(entry.fileId);
      if (!pdfjsDoc) {
        const item = itemMap.get(entry.fileId);
        if (!item) continue;
        pdfjsDoc = await loadPdfDocument(item.file);
        activeJsDocs.set(entry.fileId, pdfjsDoc);
      }

      try {
        await cropMeeshoPageIntoDoc(
          outDoc,
          pdfjsDoc,
          entry.pageNumber,
          outputSizeId,
        );
        croppedOk += 1;
      } catch (error) {
        if (error?.name === 'AbortError') throw error;
        console.warn(
          `Meesho crop failed for page ${entry.pageNumber} (${entry.sku})`,
          error,
        );
      }
    }

    assertNotCancelled();

    if (outDoc.getPageCount() < 1 || croppedOk < 1) {
      toast.error('Could not crop any label pages.');
      return false;
    }

    // 4) Build PDF for preview
    onProgress?.({ phase: 'saving', current: sorted.length, total: sorted.length });
    const outBytes = await outDoc.save();
    const blob = new Blob([outBytes], { type: 'application/pdf' });
    const stamp = new Date().toISOString().slice(0, 10);
    const filename = `meesho-labels-sorted-cropped-${stamp}.pdf`;

    const summary = isCourierSort
      ? buildSortSummaryByCourier(sorted)
      : buildSortSummaryBySku(sorted);
    const summaryLabel = isCourierSort ? 'Courier' : 'SKU';
    const failNote =
      croppedOk < sorted.length
        ? ` · ${sorted.length - croppedOk} page${sorted.length - croppedOk === 1 ? '' : 's'} skipped`
        : '';
    toast.success(
      `Sorted & cropped ${croppedOk} label${croppedOk === 1 ? '' : 's'} · ${summary.length} ${summaryLabel}${summary.length === 1 ? '' : 's'}${failNote}`
    );

    return {
      ok: true,
      blob,
      filename,
      sorted,
      summary,
      totalPages: croppedOk,
      platformId: 'meesho',
    };
  } catch (error) {
    if (error?.name === 'AbortError' || signal?.aborted) {
      toast('Processing cancelled.', { icon: '⏹️' });
      return { ok: false, cancelled: true };
    }
    console.error('Meesho sort+crop error:', error);
    const msg = String(error?.message || '');
    if (/password|encrypt/i.test(msg)) {
      toast.error('A PDF is password-protected. Unlock it first.');
    } else {
      toast.error('Could not sort and crop Meesho labels.');
    }
    return false;
  } finally {
    for (const pdfDoc of activeJsDocs.values()) {
      try {
        await pdfDoc.destroy?.();
      } catch {
        /* ignore */
      }
    }
    activeJsDocs.clear();
  }
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
