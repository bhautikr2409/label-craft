import { PDFDocument } from 'pdf-lib';

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Validate input Amazon PDF for page pairing requirements.
 *
 * @param {File} file
 * @returns {Promise<{ valid: boolean, pageCount?: number, error?: string }>}
 */
export async function validateAmazonPdfFile(file) {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  if (file.type !== 'application/pdf' && !/\.pdf$/i.test(file.name)) {
    return { valid: false, error: 'File must be a PDF document.' };
  }

  if (file.size === 0) {
    return { valid: false, error: 'The selected PDF file is empty.' };
  }

  try {
    const bytes = await file.arrayBuffer();
    const doc = await PDFDocument.load(bytes, { ignoreEncryption: false });
    const pageCount = doc.getPageCount();

    if (pageCount < 2) {
      return {
        valid: false,
        pageCount,
        error: `PDF has only ${pageCount} page. Amazon order PDFs must contain pairs of 2 pages (Label + Invoice).`,
      };
    }

    if (pageCount % 2 !== 0) {
      return {
        valid: false,
        pageCount,
        error: `PDF has an odd number of pages (${pageCount} pages). Each Amazon order must consist of exactly 2 pages (Label + Invoice).`,
      };
    }

    return { valid: true, pageCount };
  } catch (error) {
    console.error('Validation error:', error);
    const msg = String(error?.message || '');
    if (/password|encrypt/i.test(msg)) {
      return {
        valid: false,
        error: 'This PDF is password-protected. Please unlock it using Unlock PDF first.',
      };
    }
    return { valid: false, error: 'Failed to read PDF. File may be corrupted or invalid.' };
  }
}
