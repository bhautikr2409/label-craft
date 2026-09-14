import { useCallback, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { validateMergeFiles } from '../../merge/utils/validateMergeFiles';
import { getPdfPageCount } from '../../merge/utils/mergePdfs';
import {
  trackDownload,
  trackFileUpload,
  trackProcessComplete,
} from '../../../lib/analytics';
import { useDocumentPreview } from '../../../hooks/useDocumentPreview';
import { sortMeeshoLabelsAndDownload } from '../utils/sortMeeshoLabels';

const TOOL_ID = 'meesho-sort';

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Multi-PDF Meesho labels: upload → sort (SKU, courier) → crop → preview.
 */
export function useMeeshoSort() {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ phase: null, current: 0, total: 0 });
  const [lastSummary, setLastSummary] = useState(null);
  const [outputSizeId, setOutputSizeId] = useState('4x6');
  const [sortBy, setSortBy] = useState('sku');
  const filesRef = useRef(files);
  filesRef.current = files;
  const abortRef = useRef(null);
  const { preview, isPreviewOpen, openPreview, closePreview } = useDocumentPreview();

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
    trackFileUpload(TOOL_ID, { file_count: accepted.length });

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

  const cancelProcessing = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const runSort = useCallback(async () => {
    const ready = filesRef.current.filter((item) => item.status === 'ready');
    if (ready.length < 1) {
      toast.error('Upload at least one valid Meesho label PDF.');
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;
    setIsProcessing(true);
    setLastSummary(null);
    setProgress({ phase: 'reading', current: 0, total: 0 });

    let result = null;
    try {
      result = await sortMeeshoLabelsAndDownload(ready, {
        onProgress: setProgress,
        outputSizeId,
        sortBy,
        signal: controller.signal,
      });
    } finally {
      abortRef.current = null;
      setIsProcessing(false);
      setProgress({ phase: null, current: 0, total: 0 });
    }

    if (result?.ok && result.blob) {
      setLastSummary(result.summary);
      const pages = result.totalPages || 0;
      trackProcessComplete(TOOL_ID, {
        page_count: pages,
        file_count: ready.length,
        output_size: outputSizeId,
        sort_by: sortBy,
      });
      openPreview({
        blob: result.blob,
        filename: result.filename,
        platformLabel: 'MEESHO',
        pageCount: pages,
      });
    }
  }, [outputSizeId, sortBy, openPreview]);

  const handlePreviewDownload = useCallback(() => {
    const ready = filesRef.current.filter((item) => item.status === 'ready');
    trackDownload(TOOL_ID, {
      page_count: preview?.pageCount || 0,
      file_count: ready.length,
      output_size: outputSizeId,
      sort_by: sortBy,
    });
  }, [preview, outputSizeId, sortBy]);

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
    sortBy,
    setSortBy,
    addFiles,
    removeFile,
    clearFiles,
    runSort,
    cancelProcessing,
    preview,
    isPreviewOpen,
    closePreview,
    handlePreviewDownload,
  };
}
