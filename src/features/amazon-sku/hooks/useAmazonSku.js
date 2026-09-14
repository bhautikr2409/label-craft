import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import {
  trackDownload,
  trackFileUpload,
  trackProcessComplete,
} from '../../../lib/analytics';
import { useDocumentPreview } from '../../../hooks/useDocumentPreview';
import {
  identifyLabelMarketplace,
  loadPdfDocument,
} from '../../label-crop/utils/detectLabel';
import { parseAmazonOrderPairs, processAmazonOrderPDF } from '../utils/processAmazonPdf';
import { validateAmazonPdfFile } from '../utils/validateAmazonPdf';

const TOOL_ID = 'amazon-sku';

export function useAmazonSku() {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [orderPairs, setOrderPairs] = useState([]);
  const [positionId, setPositionId] = useState('aboveStationBox');
  const [customX, setCustomX] = useState(60);
  const [customY, setCustomY] = useState(155);
  const [includeOrderCount, setIncludeOrderCount] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const { preview, isPreviewOpen, openPreview, closePreview } = useDocumentPreview();

  const handleFileSelect = useCallback(async (selectedFile) => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);

    try {
      const pdf = await loadPdfDocument(selectedFile);
      const detected = await identifyLabelMarketplace(pdf, selectedFile.name);
      await pdf.destroy?.();

      // Only reject if positively identified as Flipkart or Meesho with non-low confidence
      if ((detected.id === 'flipkart' || detected.id === 'meesho') && detected.confidence !== 'low') {
        const message = `This looks like a ${detected.label} label PDF, not Amazon.`;
        setError(message);
        toast.error(message, { duration: 5000, id: 'amazon-sku-only' });
        setIsLoading(false);
        return;
      }
    } catch (err) {
      console.error('Amazon label detect failed:', err);
      const message = 'Could not read this PDF. Please try an Amazon label file.';
      setError(message);
      toast.error(message);
      setIsLoading(false);
      return;
    }

    const validation = await validateAmazonPdfFile(selectedFile);

    if (!validation.valid) {
      setError(validation.error);
      toast.error(validation.error);
      setIsLoading(false);
      return;
    }

    const url = URL.createObjectURL(selectedFile);
    setFile(selectedFile);
    setFileUrl(url);
    setPageCount(validation.pageCount);
    trackFileUpload(TOOL_ID, {
      file_count: 1,
      page_count: validation.pageCount,
      platform: 'amazon',
      detected: 'amazon',
    });

    try {
      const pairs = await parseAmazonOrderPairs(selectedFile);
      setOrderPairs(pairs);
    } catch (err) {
      console.error('Error parsing order pairs:', err);
      toast.error('Failed to parse order pages.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleClearFile = useCallback(() => {
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
    }
    setFile(null);
    setFileUrl(null);
    setPageCount(0);
    setOrderPairs([]);
    setError(null);
    setIsLoading(false);
    setIsProcessing(false);
  }, [fileUrl]);

  const handleProcessAndDownload = useCallback(
    async (options = {}) => {
      if (!file) {
        toast.error('Please upload a PDF first.');
        return;
      }

      setIsProcessing(true);
      let result = null;
      try {
        result = await processAmazonOrderPDF(file, {
          positionId,
          customX,
          customY,
          includeOrderCount,
          ...options,
        });
      } finally {
        setIsProcessing(false);
      }

      if (result?.ok && result.blob) {
        const orders = Math.floor(pageCount / 2);
        trackProcessComplete(TOOL_ID, {
          page_count: pageCount,
          order_count: orders,
        });
        openPreview({
          blob: result.blob,
          filename: result.filename,
          platformLabel: 'AMAZON',
          pageCount: result.pageCount,
        });
      }
    },
    [file, pageCount, positionId, customX, customY, includeOrderCount, openPreview]
  );

  const handlePreviewDownload = useCallback(() => {
    const orders = Math.floor(pageCount / 2);
    trackDownload(TOOL_ID, {
      page_count: pageCount,
      order_count: orders,
    });
  }, [pageCount]);

  return {
    file,
    fileUrl,
    pageCount,
    orderPairs,
    orderCount: Math.floor(pageCount / 2),
    positionId,
    setPositionId,
    customX,
    setCustomX,
    customY,
    setCustomY,
    includeOrderCount,
    setIncludeOrderCount,
    isLoading,
    isProcessing,
    error,
    handleFileSelect,
    handleClearFile,
    handleProcessAndDownload,
    preview,
    isPreviewOpen,
    closePreview,
    handlePreviewDownload,
  };
}
