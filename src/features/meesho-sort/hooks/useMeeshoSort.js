import { useCallback, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { validateMergeFiles } from '../../merge/utils/validateMergeFiles';
import { getPdfPageCount } from '../../merge/utils/mergePdfs';
import { sortMeeshoLabelsAndDownload } from '../utils/sortMeeshoLabels';

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Multi-PDF Meesho labels: upload → sort (SKU, courier) → crop → download.
 */
export function useMeeshoSort() {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ phase: null, current: 0, total: 0 });
  const [lastSummary, setLastSummary] = useState(null);
  const [outputSizeId, setOutputSizeId] = useState('4x6');
  const filesRef = useRef(files);
  filesRef.current = files;

  const addFiles = useCallback(async (incoming) => {
    const accepted = validateMergeFiles(incoming, filesRef.current);
    if (accepted.length === 0) return;

    const newItems = accepted.map((file) => ({
      id: createId(),
      file,
      pageCount: null,
      status: 'loading',
    }));

    setFiles((prev) => [...prev, ...newItems]);
    setLastSummary(null);

    await Promise.all(
      newItems.map(async (item) => {
        const pageCount = await getPdfPageCount(item.file);
        setFiles((prev) =>
          prev.map((entry) =>
            entry.id === item.id
              ? {
                  ...entry,
                  pageCount,
                  status: pageCount == null ? 'error' : 'ready',
                }
              : entry
          )
        );
      })
    );

    toast.success(
      accepted.length === 1
        ? `Added "${accepted[0].name}"`
        : `Added ${accepted.length} PDFs`
    );
  }, []);

  const removeFile = useCallback((id) => {
    setFiles((prev) => prev.filter((item) => item.id !== id));
    setLastSummary(null);
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
    setLastSummary(null);
    setProgress({ phase: null, current: 0, total: 0 });
  }, []);

  const runSort = useCallback(async () => {
    const ready = filesRef.current.filter((item) => item.status === 'ready');
    if (ready.length < 1) {
      toast.error('Upload at least one valid Meesho label PDF.');
      return;
    }

    setIsProcessing(true);
    setLastSummary(null);
    setProgress({ phase: 'reading', current: 0, total: 0 });

    try {
      const result = await sortMeeshoLabelsAndDownload(ready, {
        onProgress: setProgress,
        outputSizeId,
      });
      if (result?.ok) {
        setLastSummary(result.summary);
      }
    } finally {
      setIsProcessing(false);
      setProgress({ phase: null, current: 0, total: 0 });
    }
  }, [outputSizeId]);

  const totalPages = files.reduce(
    (sum, item) => sum + (item.pageCount > 0 ? item.pageCount : 0),
    0
  );

  return {
    files,
    isProcessing,
    progress,
    lastSummary,
    totalPages,
    outputSizeId,
    setOutputSizeId,
    addFiles,
    removeFile,
    clearFiles,
    runSort,
  };
}
