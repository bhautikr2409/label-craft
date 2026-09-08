import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { validatePdfFile } from '../../crop/utils/validatePdfFile';
import { addLogoAndDownload, getPdfPageCount } from '../utils/addLogoToPdf';
import { validateLogoFile } from '../utils/validateLogo';

/**
 * Flow: upload PDF → upload logo → size → stamp bottom white space on all pages.
 */
export function useAddLogo() {
  const [pdfFile, setPdfFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState(null);
  const [sizeId, setSizeId] = useState('medium');
  const [isProcessing, setIsProcessing] = useState(false);

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

  const acceptPdf = useCallback((file) => {
    if (!validatePdfFile(file)) return;
    setPdfFile(file);
  }, []);

  const loadPdf = useCallback(
    (event) => {
      const file = event?.target?.files?.[0];
      if (file) acceptPdf(file);
      if (event?.target) event.target.value = '';
    },
    [acceptPdf]
  );

  const acceptLogo = useCallback((file) => {
    if (!validateLogoFile(file)) return;
    setLogoFile(file);
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
      toast.error('Upload a PDF first.');
      return;
    }
    if (!logoFile) {
      toast.error('Upload a logo image next.');
      return;
    }
    setIsProcessing(true);
    try {
      await addLogoAndDownload(pdfFile, logoFile, { sizeId });
    } finally {
      setIsProcessing(false);
    }
  }, [pdfFile, logoFile, pageCount, sizeId]);

  return {
    pdfFile,
    pageCount,
    isLoading,
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
  };
}
