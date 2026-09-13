import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { validatePdfFile } from '../../crop/utils/validatePdfFile';
import {
  trackDownload,
  trackFileUpload,
  trackProcessComplete,
} from '../../../lib/analytics';
import { useDocumentPreview } from '../../../hooks/useDocumentPreview';
import { cropLabelsAndDownload } from '../utils/cropLabels';
import {
  formatFileSize,
  identifyLabelMarketplace,
  loadPdfDocument,
} from '../utils/detectLabel';

const TOOL_ID = 'label-crop';

const PLATFORM_BADGE = {
  flipkart: 'FLIPKART',
  meesho: 'MEESHO',
};

const PLATFORM_LABEL = {
  flipkart: 'Flipkart',
  meesho: 'Meesho',
};

/**
 * Label crop flow:
 * 1) User picks Flipkart or Meesho
 * 2) User uploads PDF (marketplace is verified)
 * 3) User crops → Document Preview
 */
export function useLabelCrop() {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  /** null until user chooses Flipkart or Meesho */
  const [platformId, setPlatformId] = useState(null);
  const [detectedMarketplace, setDetectedMarketplace] = useState(null);
  const [outputSizeId, setOutputSizeId] = useState('4x6');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const { preview, isPreviewOpen, openPreview, closePreview } = useDocumentPreview();

  useEffect(() => {
    if (!file) {
      setPageCount(0);
      setLoadError(null);
      setDetectedMarketplace(null);
      return undefined;
    }

    let cancelled = false;
    setIsLoading(true);
    setLoadError(null);
    setDetectedMarketplace(null);

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

        const detected = await identifyLabelMarketplace(pdf, file.name);
        if (cancelled) return;

        // Amazon labels do not belong in Label Crop
        if (detected.id === 'amazon' && detected.confidence !== 'low') {
          setFile(null);
          setPageCount(0);
          setDetectedMarketplace(null);
          setIsLoading(false);
          setLoadError(null);
          toast.error(
            'This looks like an Amazon label PDF. Use Amazon SKU Injector instead of Label Crop.',
            { duration: 6000 }
          );
          return;
        }

        // Wrong Flipkart ↔ Meesho choice: auto-switch so crop uses the right path
        let activePlatform = platformId;
        if (
          (detected.id === 'flipkart' || detected.id === 'meesho') &&
          detected.confidence !== 'low' &&
          platformId &&
          detected.id !== platformId
        ) {
          activePlatform = detected.id;
          setPlatformId(detected.id);
          toast.success(
            `Detected ${detected.label} labels — switched from ${PLATFORM_LABEL[platformId]}.`,
            { duration: 5000 }
          );
        } else if (
          (detected.id === 'flipkart' || detected.id === 'meesho') &&
          detected.id === platformId
        ) {
          toast.success(`Detected ${detected.label} labels.`, { duration: 2500 });
        } else if (detected.id === 'unknown') {
          toast(
            `Couldn’t confirm marketplace. Cropping as ${PLATFORM_LABEL[platformId] || 'selected type'} — double-check if results look wrong.`,
            { duration: 5000, icon: '⚠️' }
          );
        }

        setDetectedMarketplace(detected);
        setPageCount(pdf.numPages);
        setIsLoading(false);
        trackFileUpload(TOOL_ID, {
          file_count: 1,
          platform: activePlatform || platformId,
          detected: detected.id,
          detect_confidence: detected.confidence,
        });
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
    // platformId intentionally read at upload time; switching later is user-driven
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setDetectedMarketplace(null);
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
    setDetectedMarketplace(null);
    setProgress({ current: 0, total: 0 });
  }, []);

  const applyDetectedPlatform = useCallback(() => {
    if (detectedMarketplace?.id !== 'flipkart' && detectedMarketplace?.id !== 'meesho') {
      return;
    }
    setPlatformId(detectedMarketplace.id);
    toast.success(`Switched to ${detectedMarketplace.label}.`);
  }, [detectedMarketplace]);

  const runCrop = useCallback(async () => {
    if (!file || pageCount < 1 || isProcessing) return;
    if (platformId !== 'flipkart' && platformId !== 'meesho') {
      toast.error('Select Flipkart or Meesho first.');
      return;
    }

    // Final guard if user ignored detection banner
    if (
      detectedMarketplace &&
      (detectedMarketplace.id === 'flipkart' || detectedMarketplace.id === 'meesho') &&
      detectedMarketplace.confidence !== 'low' &&
      detectedMarketplace.id !== platformId
    ) {
      toast.error(
        `This PDF looks like ${detectedMarketplace.label}, but ${PLATFORM_LABEL[platformId]} is selected. Switch type first.`
      );
      return;
    }

    setIsProcessing(true);
    setProgress({ current: 0, total: pageCount });
    let result = null;
    try {
      result = await cropLabelsAndDownload(file, {
        platformId,
        outputSizeId,
        onProgress: setProgress,
      });
    } finally {
      setIsProcessing(false);
      setProgress({ current: 0, total: 0 });
    }

    if (result?.ok && result.blob) {
      trackProcessComplete(TOOL_ID, {
        page_count: pageCount,
        platform: platformId,
        output_size: outputSizeId,
        detected: detectedMarketplace?.id || 'n/a',
      });
      openPreview({
        blob: result.blob,
        filename: result.filename,
        platformLabel:
          PLATFORM_BADGE[result.platformId] ||
          PLATFORM_BADGE[platformId] ||
          'LABELS',
        pageCount: result.pageCount,
      });
    }
  }, [
    file,
    pageCount,
    isProcessing,
    platformId,
    outputSizeId,
    openPreview,
    detectedMarketplace,
  ]);

  const handlePreviewDownload = useCallback(() => {
    trackDownload(TOOL_ID, {
      page_count: pageCount,
      platform: platformId,
      output_size: outputSizeId,
    });
  }, [pageCount, platformId, outputSizeId]);

  const marketplaceMismatch =
    Boolean(detectedMarketplace) &&
    (detectedMarketplace.id === 'flipkart' || detectedMarketplace.id === 'meesho') &&
    detectedMarketplace.confidence !== 'low' &&
    platformId &&
    detectedMarketplace.id !== platformId;

  return {
    file,
    pageCount,
    isLoading,
    loadError,
    platformId,
    setPlatformId: selectPlatform,
    changePlatform,
    detectedMarketplace,
    marketplaceMismatch,
    applyDetectedPlatform,
    outputSizeId,
    setOutputSizeId,
    isProcessing,
    progress,
    loadFile,
    acceptFile,
    clearFile,
    runCrop,
    formatFileSize,
    preview,
    isPreviewOpen,
    closePreview,
    handlePreviewDownload,
  };
}
