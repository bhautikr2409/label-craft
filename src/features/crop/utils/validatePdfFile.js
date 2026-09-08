import toast from 'react-hot-toast';
import { MAX_PDF_BYTES } from '../../../constants';

/**
 * Validate a user-selected file before creating an object URL.
 * @returns {boolean} true if the file may be loaded
 */
export function validatePdfFile(file) {
  if (!file) {
    toast.error('Please select a PDF file.');
    return false;
  }

  const isPdfMime = file.type === 'application/pdf';
  const isPdfName = file.name.toLowerCase().endsWith('.pdf');

  if (!isPdfMime && !isPdfName) {
    toast.error('Please select a PDF file.');
    return false;
  }

  if (file.size > MAX_PDF_BYTES) {
    toast.error('PDF must be under 25 MB for browser processing.');
    return false;
  }

  if (file.size === 0) {
    toast.error('This file appears to be empty.');
    return false;
  }

  return true;
}
