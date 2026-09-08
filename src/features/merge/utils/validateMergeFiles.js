import toast from 'react-hot-toast';
import {
  MAX_MERGE_FILES,
  MAX_MERGE_TOTAL_BYTES,
  MAX_PDF_BYTES,
} from '../../../constants';

function isPdfFile(file) {
  const isPdfMime = file.type === 'application/pdf';
  const isPdfName = file.name.toLowerCase().endsWith('.pdf');
  return isPdfMime || isPdfName;
}

/**
 * Validate one or more PDF files for the merge queue.
 * @returns {File[]} files that passed validation
 */
export function validateMergeFiles(incomingFiles, existingFiles = []) {
  const incoming = Array.from(incomingFiles || []);

  if (incoming.length === 0) {
    toast.error('Please select at least one PDF file.');
    return [];
  }

  const accepted = [];
  let runningTotal = existingFiles.reduce((sum, item) => sum + item.file.size, 0);

  for (const file of incoming) {
    if (!isPdfFile(file)) {
      toast.error(`"${file.name}" is not a PDF file.`);
      continue;
    }

    if (file.size === 0) {
      toast.error(`"${file.name}" appears to be empty.`);
      continue;
    }

    if (file.size > MAX_PDF_BYTES) {
      toast.error(`"${file.name}" must be under 25 MB.`);
      continue;
    }

    if (existingFiles.length + accepted.length >= MAX_MERGE_FILES) {
      toast.error(`You can merge up to ${MAX_MERGE_FILES} PDFs at once.`);
      break;
    }

    if (runningTotal + file.size > MAX_MERGE_TOTAL_BYTES) {
      toast.error('Total selected size exceeds 100 MB.');
      break;
    }

    const duplicate = [...existingFiles, ...accepted].some(
      (item) => item.file.name === file.name && item.file.size === file.size
    );
    if (duplicate) {
      toast.error(`"${file.name}" is already in the list.`);
      continue;
    }

    accepted.push(file);
    runningTotal += file.size;
  }

  if (accepted.length === 0 && incoming.length > 0) {
    // Specific toasts already shown for each rejection
  }

  return accepted;
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
