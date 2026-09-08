import { PDFDocument } from 'pdf-lib';
import toast from 'react-hot-toast';

/**
 * Merge PDF files in order into a single document and trigger download.
 * @param {{ id: string, file: File }[]} items
 */
export async function mergeAndDownloadPdfs(items) {
  if (!items?.length) {
    toast.error('Add at least one PDF to merge.');
    return false;
  }

  if (items.length < 2) {
    toast.error('Add at least two PDFs to merge.');
    return false;
  }

  try {
    const mergedPdf = await PDFDocument.create();

    for (const item of items) {
      const bytes = await item.file.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: false });
      const pageIndices = doc.getPageIndices();
      const copiedPages = await mergedPdf.copyPages(doc, pageIndices);
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    if (mergedPdf.getPageCount() === 0) {
      toast.error('No pages found in the selected PDFs.');
      return false;
    }

    const pdfBytes = await mergedPdf.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'merged.pdf';
    link.click();
    URL.revokeObjectURL(url);

    toast.success(`Merged ${items.length} PDFs (${mergedPdf.getPageCount()} pages).`);
    return true;
  } catch (error) {
    console.error('Merge PDF error:', error);
    if (String(error?.message || error).toLowerCase().includes('encrypt')) {
      toast.error('One of the PDFs is password-protected and cannot be merged.');
    } else {
      toast.error('Failed to merge PDFs. One file may be damaged.');
    }
    return false;
  }
}

/**
 * Read page count for a single PDF file.
 */
export async function getPdfPageCount(file) {
  try {
    const bytes = await file.arrayBuffer();
    const doc = await PDFDocument.load(bytes);
    return doc.getPageCount();
  } catch {
    return null;
  }
}
