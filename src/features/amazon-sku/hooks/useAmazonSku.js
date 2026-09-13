import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import {
  trackDownload,
  trackFileUpload,
  trackProcessComplete,
} from '../../../lib/analytics';
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

  const handleFileSelect = useCallback(async (selectedFile) => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);

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
      try {
        const ok = await processAmazonOrderPDF(file, {
          positionId,
          customX,
          customY,
          includeOrderCount,
          ...options,
        });
        if (ok) {
          const orders = Math.floor(pageCount / 2);
          trackProcessComplete(TOOL_ID, {
            page_count: pageCount,
            order_count: orders,
          });
          trackDownload(TOOL_ID, {
            page_count: pageCount,
            order_count: orders,
          });
        }
      } finally {
        setIsProcessing(false);
      }
    },
    [file, pageCount, positionId, customX, customY, includeOrderCount]
  );

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
  };
}
