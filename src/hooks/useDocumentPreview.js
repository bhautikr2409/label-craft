import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Holds the processed PDF for DocumentPreviewModal.
 * Revokes the object URL when closed or replaced.
 */
export function useDocumentPreview() {
  const [preview, setPreview] = useState(null);
  const urlRef = useRef(null);

  const revokeCurrent = useCallback(() => {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
  }, []);

  const openPreview = useCallback(
    ({ blob, filename, platformLabel, pageCount }) => {
      if (!blob) return;
      revokeCurrent();
      const url = URL.createObjectURL(blob);
      urlRef.current = url;
      setPreview({
        blob,
        filename: filename || 'labels.pdf',
        platformLabel: platformLabel || 'LABELS',
        pageCount: pageCount || null,
        url,
      });
    },
    [revokeCurrent]
  );

  const closePreview = useCallback(() => {
    revokeCurrent();
    setPreview(null);
  }, [revokeCurrent]);

  useEffect(() => {
    return () => {
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
        urlRef.current = null;
      }
    };
  }, []);

  return {
    preview,
    isPreviewOpen: Boolean(preview),
    openPreview,
    closePreview,
  };
}
