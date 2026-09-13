import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { downloadFile } from '../../lib/downloadFile';

function isTypingTarget(el) {
  if (!el) return false;
  const tag = el.tagName;
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    el.isContentEditable
  );
}

/** Dimmed page behind the centered modal (standard view). */
const backdropStyle = {
  position: 'fixed',
  inset: 0,
  zIndex: 99999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  boxSizing: 'border-box',
  backgroundColor: 'rgba(15, 23, 42, 0.55)',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
};

/**
 * Standard view = centered modal card (not edge-to-edge).
 * Full screen = fills viewport / browser fullscreen.
 */
const modalStandardStyle = {
  display: 'flex',
  flexDirection: 'column',
  width: 'min(1100px, 96vw)',
  height: 'min(860px, 92dvh)',
  maxHeight: '92vh',
  borderRadius: '12px',
  overflow: 'hidden',
  backgroundColor: '#0b1220',
  color: '#ffffff',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.55)',
  border: '1px solid #1e293b',
};

const modalFullscreenStyle = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  maxHeight: 'none',
  borderRadius: 0,
  overflow: 'hidden',
  backgroundColor: '#0b1220',
  color: '#ffffff',
  boxShadow: 'none',
  border: 'none',
};

const barStyle = {
  position: 'relative',
  zIndex: 2,
  flexShrink: 0,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '12px',
  padding: '10px 16px',
  backgroundColor: '#0f172a',
  borderBottom: '1px solid #1e293b',
  color: '#f8fafc',
};

const footerStyle = {
  ...barStyle,
  borderBottom: 'none',
  borderTop: '1px solid #1e293b',
  padding: '8px 16px',
  fontSize: '12px',
  color: '#94a3b8',
  justifyContent: 'space-between',
};

const badgeStyle = {
  flexShrink: 0,
  borderRadius: '4px',
  padding: '3px 8px',
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  backgroundColor: '#0ea5e9',
  color: '#ffffff',
};

const btnBase = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  flex: '0 0 auto',
  width: 'auto',
  maxWidth: '100%',
  height: '38px',
  padding: '0 12px',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer',
  border: '1px solid transparent',
  lineHeight: 1,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
};

const kbdStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  flexShrink: 0,
  borderRadius: '4px',
  padding: '2px 6px',
  fontSize: '10px',
  fontWeight: 600,
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  backgroundColor: 'rgba(15,23,42,0.75)',
  color: 'rgba(255,255,255,0.85)',
};

function ShortcutKbd({ children, dark }) {
  return (
    <span
      style={{
        ...kbdStyle,
        backgroundColor: dark ? 'rgba(0,0,0,0.28)' : 'rgba(15,23,42,0.75)',
      }}
    >
      {children}
    </span>
  );
}

/**
 * Document preview after processing.
 * Standard view = centered modal over dimmed page.
 * Full Screen (F) = expand to fill the screen; Standard View returns to the modal.
 */
export default function DocumentPreviewModal({
  open,
  url,
  blob,
  filename = 'labels.pdf',
  platformLabel = 'LABELS',
  onClose,
  onDownload,
}) {
  const iframeRef = useRef(null);
  const panelRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [viewerNonce, setViewerNonce] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  /** Always open as centered modal (standard view). */
  useEffect(() => {
    if (!open) return undefined;
    setIsFullscreen(false);
    setViewerNonce(0);
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    return undefined;
  }, [open, url]);

  const handleDownload = useCallback(() => {
    if (!blob) return;
    downloadFile(blob, filename);
    onDownload?.();
  }, [blob, filename, onDownload]);

  const handlePrint = useCallback(() => {
    const frame = iframeRef.current;
    try {
      if (frame?.contentWindow) {
        frame.contentWindow.focus();
        frame.contentWindow.print();
        return;
      }
    } catch {
      // ignore
    }
    if (url) {
      const win = window.open(url, '_blank', 'noopener,noreferrer');
      if (win) {
        const tryPrint = () => {
          try {
            win.print();
          } catch {
            /* ignore */
          }
        };
        win.addEventListener('load', tryPrint);
        setTimeout(tryPrint, 800);
      }
    }
  }, [url]);

  const resetZoomToStandard = useCallback(() => {
    setViewerNonce((n) => n + 1);
  }, []);

  const enterFullscreen = useCallback(async () => {
    const el = panelRef.current;
    setIsFullscreen(true);
    if (!el) return;
    try {
      if (!document.fullscreenElement && el.requestFullscreen) {
        await el.requestFullscreen();
      }
    } catch (error) {
      // CSS fullscreen fallback already applied via isFullscreen
      console.warn('Fullscreen API unavailable', error);
    }
  }, []);

  const exitToStandardView = useCallback(async () => {
    setIsFullscreen(false);
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch {
      // ignore
    }
    resetZoomToStandard();
  }, [resetZoomToStandard]);

  const toggleViewMode = useCallback(async () => {
    if (isFullscreen || document.fullscreenElement) {
      await exitToStandardView();
    } else {
      await enterFullscreen();
    }
  }, [isFullscreen, enterFullscreen, exitToStandardView]);

  useEffect(() => {
    if (!open) return undefined;

    const onFsChange = () => {
      const fs = Boolean(document.fullscreenElement);
      setIsFullscreen(fs);
      if (!fs) resetZoomToStandard();
    };
    document.addEventListener('fullscreenchange', onFsChange);

    const onKey = (event) => {
      if (isTypingTarget(event.target)) return;

      if (event.key === 'Escape') {
        if (document.fullscreenElement || isFullscreen) {
          event.preventDefault();
          exitToStandardView();
          return;
        }
        event.preventDefault();
        onClose?.();
        return;
      }

      const key = event.key.toLowerCase();
      const mod = event.ctrlKey || event.metaKey;

      if (key === 's' && mod) {
        event.preventDefault();
        handleDownload();
        return;
      }
      if (key === 'd' && !mod) {
        event.preventDefault();
        handleDownload();
        return;
      }
      if (key === 'p') {
        event.preventDefault();
        handlePrint();
        return;
      }
      if (key === 'f' && !mod) {
        event.preventDefault();
        toggleViewMode();
      }
    };

    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('document-preview-open');

    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      document.body.classList.remove('document-preview-open');
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, [
    open,
    onClose,
    handleDownload,
    handlePrint,
    toggleViewMode,
    resetZoomToStandard,
    exitToStandardView,
    isFullscreen,
  ]);

  if (!mounted || !open || !url) return null;

  const baseUrl = url.split('#')[0];
  const viewerSrc = `${baseUrl}#page=1&zoom=100`;

  const viewBtnLabel = isFullscreen ? 'Standard View' : 'Full Screen';
  const viewBtnTitle = isFullscreen
    ? 'Return to modal (standard view) — F'
    : 'Expand to full screen — F';

  const backdropActiveStyle = isFullscreen
    ? {
        ...backdropStyle,
        padding: 0,
        backgroundColor: '#0b1220',
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none',
        alignItems: 'stretch',
        justifyContent: 'stretch',
      }
    : backdropStyle;

  const panelStyle = isFullscreen ? modalFullscreenStyle : modalStandardStyle;

  return createPortal(
    <div
      style={backdropActiveStyle}
      role="presentation"
      onMouseDown={(event) => {
        // Click outside modal closes (standard view only)
        if (!isFullscreen && event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <div
        ref={panelRef}
        style={panelStyle}
        role="dialog"
        aria-modal="true"
        aria-label="Document preview"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header style={barStyle}>
          <div
            style={{
              display: 'flex',
              minWidth: 0,
              flex: '1 1 auto',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span style={badgeStyle}>{platformLabel}</span>
            <h2
              style={{
                margin: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontSize: '15px',
                fontWeight: 650,
                color: '#ffffff',
              }}
            >
              Document Preview
            </h2>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'flex-end',
              flex: '0 1 auto',
              gap: '8px',
            }}
          >
            <button
              type="button"
              onClick={handleDownload}
              style={{
                ...btnBase,
                backgroundColor: 'transparent',
                borderColor: '#38bdf8',
                color: '#e0f2fe',
              }}
              title="Download (Ctrl+S)"
            >
              <DownloadIcon />
              <span>Download</span>
              <ShortcutKbd>Ctrl+S</ShortcutKbd>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              style={{
                ...btnBase,
                backgroundColor: '#4f46e5',
                borderColor: '#4f46e5',
                color: '#ffffff',
              }}
              title="Print (Ctrl+P)"
            >
              <PrintIcon />
              <span>Print</span>
              <ShortcutKbd dark>Ctrl+P</ShortcutKbd>
            </button>

            <button
              type="button"
              onClick={toggleViewMode}
              style={{
                ...btnBase,
                backgroundColor: 'transparent',
                borderColor: '#64748b',
                color: '#f1f5f9',
              }}
              title={viewBtnTitle}
            >
              {isFullscreen ? <StandardViewIcon /> : <FullScreenIcon />}
              <span>{viewBtnLabel}</span>
              <ShortcutKbd>F</ShortcutKbd>
            </button>

            <span
              aria-hidden="true"
              style={{
                width: 1,
                height: 22,
                flexShrink: 0,
                backgroundColor: '#334155',
                margin: '0 2px',
              }}
            />

            <button
              type="button"
              onClick={onClose}
              style={{
                ...btnBase,
                backgroundColor: 'transparent',
                borderColor: 'transparent',
                color: '#f8fafc',
                padding: '0 8px',
                gap: '6px',
              }}
              title="Close (Esc)"
              aria-label="Close preview"
            >
              <CloseIcon />
              <ShortcutKbd>Esc</ShortcutKbd>
            </button>
          </div>
        </header>

        <div
          style={{
            position: 'relative',
            flex: '1 1 auto',
            minHeight: 0,
            backgroundColor: '#525659',
          }}
        >
          <iframe
            key={`${baseUrl}-${viewerNonce}`}
            ref={iframeRef}
            title={filename}
            src={viewerSrc}
            style={{
              width: '100%',
              height: '100%',
              border: 0,
              backgroundColor: '#525659',
            }}
          />
        </div>

        <footer style={footerStyle}>
          <div
            style={{
              display: 'flex',
              minWidth: 0,
              flex: '1 1 auto',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <DocIcon />
            <span
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontWeight: 500,
                color: '#cbd5e1',
              }}
              title={filename}
            >
              {filename}
            </span>
          </div>

          <div
            style={{
              display: 'none',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px',
              color: '#94a3b8',
              flex: '1 1 auto',
            }}
            className="preview-footer-shortcuts"
          >
            <FooterHint keys="P / Ctrl+P" label="Print" />
            <FooterHint keys="D / Ctrl+S" label="Download" />
            <FooterHint keys="F" label={isFullscreen ? 'Standard View' : 'Fullscreen'} />
            <FooterHint keys="Esc" label="Close" />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '6px',
              color: '#34d399',
              flex: '1 1 auto',
              flexShrink: 0,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '999px',
                backgroundColor: '#34d399',
              }}
            />
            <span style={{ fontWeight: 600 }}>Ready to Print</span>
          </div>
        </footer>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .preview-footer-shortcuts { display: flex !important; }
        }
        .document-preview-panel:fullscreen {
          width: 100% !important;
          height: 100% !important;
          border-radius: 0 !important;
        }
      `}</style>
    </div>,
    document.body
  );
}

function FooterHint({ keys, label }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <ShortcutKbd>{keys}</ShortcutKbd>
      <span>{label}</span>
    </span>
  );
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
    </svg>
  );
}

function PrintIcon() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 9V4h12v5M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v6H6v-6z"
      />
    </svg>
  );
}

function FullScreenIcon() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
    </svg>
  );
}

function StandardViewIcon() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 9L4 4m0 0v4m0-4h4M15 9l5-5m0 0v4m0-4h-4M9 15l-5 5m0 0h4m-4 0v-4M15 15l5 5m0 0h-4m4 0v-4"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.25">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#64748b" strokeWidth="2">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z"
      />
    </svg>
  );
}
