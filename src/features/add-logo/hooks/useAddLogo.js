import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { validatePdfFile } from '../../crop/utils/validatePdfFile';
import {
  identifyLabelMarketplace,
  loadPdfDocument,
} from '../../label-crop/utils/detectLabel';
import {
  trackDownload,
  trackFileUpload,
  trackProcessComplete,
} from '../../../lib/analytics';
import { useDocumentPreview } from '../../../hooks/useDocumentPreview';
import { addLogoAndDownload, getPdfPageCount } from '../utils/addLogoToPdf';
import { validateLogoFile } from '../utils/validateLogo';

const TOOL_ID = 'add-logo';

/**
 * Flow: upload Meesho label PDF → upload logo → size → stamp → Document Preview.
 */
export function useAddLogo() {
  const [pdfFile, setPdfFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState(null);
  const [sizeId, setSizeId] = useState('medium');
  const [isProcessing, setIsProcessing] = useState(false);
  const { preview, isPreviewOpen, openPreview, closePreview } = useDocumentPreview();

  useEffect(() => {
    if (!pdfFile) {
      setPageCount(0);
      setLoadError(null);
      return undefined;
    }

    let cancelled = false;
    setIsLoading(true);
    setLoadError(null);

    getPdfPageCount(pdfFile).then((count) => {
      if (cancelled) return;
      setIsLoading(false);
      if (count == null || count < 1) {
        setLoadError('Could not read this PDF. It may be damaged or password-protected.');
        setPageCount(0);
        toast.error('Could not read this PDF.');
        return;
      }
      setPageCount(count);
    });

    return () => {
      cancelled = true;
    };
  }, [pdfFile]);

  useEffect(() => {
    if (!logoFile) {
      setLogoPreviewUrl(null);
      return undefined;
    }
    const url = URL.createObjectURL(logoFile);
    setLogoPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [logoFile]);

  const acceptPdf = useCallback(async (file) => {
    if (!validatePdfFile(file)) return;

    setIsDetecting(true);
    try {
      const pdf = await loadPdfDocument(file);
      const detected = await identifyLabelMarketplace(pdf, file.name);
      await pdf.destroy?.();

      if (detected.id !== 'meesho') {
        toast.error('This tool only accepts Meesho labels.', {
          duration: 5000,
          id: 'add-logo-meesho-only',
        });
        return;
      }

      setPdfFile(file);
      trackFileUpload(TOOL_ID, {
        file_count: 1,
        file_kind: 'pdf',
        platform: 'meesho',
        detected: detected.id,
      });
      toast.success('Meesho label detected.', { duration: 2200 });
    } catch (error) {
      console.error(error);
      toast.error('Could not read this PDF. Please try another Meesho label file.');
    } finally {
      setIsDetecting(false);
    }
  }, []);

  const loadPdf = useCallback(
    (event) => {
      const file = event?.target?.files?.[0];
      if (file) void acceptPdf(file);
      if (event?.target) event.target.value = '';
    },
    [acceptPdf]
  );

  const acceptLogo = useCallback((file) => {
    if (!validateLogoFile(file)) return;
    setLogoFile(file);
    trackFileUpload(TOOL_ID, { file_count: 1, file_kind: 'logo' });
  }, []);

  const loadLogo = useCallback(
    (event) => {
      const file = event?.target?.files?.[0];
      if (file) acceptLogo(file);
      if (event?.target) event.target.value = '';
    },
    [acceptLogo]
  );

  const clearLogo = useCallback(() => {
    setLogoFile(null);
  }, []);

  const clearAll = useCallback(() => {
    setPdfFile(null);
    setPageCount(0);
    setLoadError(null);
    setLogoFile(null);
    setSizeId('medium');
  }, []);

  const clearPdfKeepLogo = useCallback(() => {
    setPdfFile(null);
    setPageCount(0);
    setLoadError(null);
  }, []);

  const runAddLogo = useCallback(async () => {
    if (!pdfFile || pageCount < 1) {
      toast.error('Upload a Meesho label PDF first.');
      return;
    }
    if (!logoFile) {
      toast.error('Upload a logo image next.');
      return;
    }
    setIsProcessing(true);
    let result = null;
    try {
      result = await addLogoAndDownload(pdfFile, logoFile, { sizeId });
    } finally {
      setIsProcessing(false);
    }

    if (result?.ok && result.blob) {
      trackProcessComplete(TOOL_ID, {
        page_count: pageCount,
        logo_size: sizeId,
        platform: 'meesho',
      });
      openPreview({
        blob: result.blob,
        filename: result.filename,
        platformLabel: 'MEESHO',
        pageCount: result.pageCount,
      });
    }
  }, [pdfFile, logoFile, pageCount, sizeId, openPreview]);

  const handlePreviewDownload = useCallback(() => {
    trackDownload(TOOL_ID, {
      page_count: pageCount,
      logo_size: sizeId,
      platform: 'meesho',
    });
  }, [pageCount, sizeId]);

  return {
    pdfFile,
    pageCount,
    isLoading,
    isDetecting,
    loadError,
    logoFile,
    logoPreviewUrl,
    sizeId,
    setSizeId,
    isProcessing,
    loadPdf,
    acceptPdf,
    loadLogo,
    acceptLogo,
    clearLogo,
    clearAll,
    clearPdfKeepLogo,
    runAddLogo,
    preview,
    isPreviewOpen,
    closePreview,
    handlePreviewDownload,
  };
}
