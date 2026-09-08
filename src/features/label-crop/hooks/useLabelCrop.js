import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { validatePdfFile } from '../../crop/utils/validatePdfFile';
import { cropLabelsAndDownload } from '../utils/cropLabels';
import { formatFileSize, loadPdfDocument } from '../utils/detectLabel';

/**
 * Label crop flow:
 * 1) User picks Flipkart or Meesho (required — no auto-detect)
 * 2) User uploads PDF
 * 3) User crops & downloads
 */
export function useLabelCrop() {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  /** null until user chooses Flipkart or Meesho */
  const [platformId, setPlatformId] = useState(null);
  const [outputSizeId, setOutputSizeId] = useState('4x6');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  useEffect(() => {
    if (!file) {
      setPageCount(0);
      setLoadError(null);
      return undefined;
    }

    let cancelled = false;
    setIsLoading(true);
    setLoadError(null);

    (async () => {
      try {
        const pdf = await loadPdfDocument(file);
        if (cancelled) return;
        if (!pdf.numPages) {
          setLoadError('Could not read this PDF.');
          toast.error('Could not read this PDF.');
          setIsLoading(false);
          return;
        }
        setPageCount(pdf.numPages);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          setLoadError('Failed to load PDF.');
          setIsLoading(false);
          toast.error('Failed to load PDF.');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [file]);

  const selectPlatform = useCallback((id) => {
    if (id !== 'flipkart' && id !== 'meesho') return;
    setPlatformId(id);
  }, []);

  /** Go back to marketplace choice and clear any uploaded file. */
  const changePlatform = useCallback(() => {
    setFile(null);
    setPageCount(0);
    setLoadError(null);
    setProgress({ current: 0, total: 0 });
    setPlatformId(null);
  }, []);

  const acceptFile = useCallback(
    (incoming) => {
      if (!platformId) {
        toast.error('Select Flipkart or Meesho first.');
        return;
      }
      if (!validatePdfFile(incoming)) return;
      setFile(incoming);
    },
    [platformId]
  );

  const loadFile = useCallback(
    (event) => {
      const incoming = event?.target?.files?.[0];
      if (incoming) acceptFile(incoming);
      if (event?.target) event.target.value = '';
    },
    [acceptFile]
  );

  const clearFile = useCallback(() => {
    setFile(null);
    setPageCount(0);
    setLoadError(null);
    setProgress({ current: 0, total: 0 });
    // Keep platform so user can upload another file of the same type
  }, []);

  const runCrop = useCallback(async () => {
    if (!file || pageCount < 1 || isProcessing) return;
    if (platformId !== 'flipkart' && platformId !== 'meesho') {
      toast.error('Select Flipkart or Meesho first.');
      return;
    }
    setIsProcessing(true);
    setProgress({ current: 0, total: pageCount });
    try {
      await cropLabelsAndDownload(file, {
        platformId,
        outputSizeId,
        onProgress: setProgress,
      });
    } finally {
      setIsProcessing(false);
      setProgress({ current: 0, total: 0 });
    }
  }, [file, pageCount, isProcessing, platformId, outputSizeId]);

  return {
    file,
    pageCount,
    isLoading,
    loadError,
    platformId,
    setPlatformId: selectPlatform,
    changePlatform,
    outputSizeId,
    setOutputSizeId,
    isProcessing,
    progress,
    loadFile,
    acceptFile,
    clearFile,
    runCrop,
    formatFileSize,
  };
}
