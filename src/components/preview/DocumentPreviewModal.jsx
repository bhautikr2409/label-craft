import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { downloadFile } from '../../lib/downloadFile';

function isTypingTarget(el) {
  if (!el) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
}

const shellStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 99999,
  width: '100vw',
  height: '100dvh',
  maxHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#0b1220',
  color: '#ffffff',
};

const barStyle = {
  position: 'relative',
  zIndex: 2,
  flexShrink: 0,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '10px',
  padding: '10px 14px',
  backgroundColor: '#0f172a',
  borderBottom: '1px solid #1e293b',
  color: '#f8fafc',
};

const footerStyle = {
  ...barStyle,
  borderBottom: 'none',
  borderTop: '1px solid #1e293b',
  padding: '8px 14px',
  fontSize: '12px',
  color: '#94a3b8',
};

const badgeStyle = {
  flexShrink: 0,
  borderRadius: '4px',
  padding: '3px 8px',
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  backgroundColor: '#0369a1',
  color: '#e0f2fe',
};

const btnBase = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  height: '36px',
  padding: '0 12px',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer',
  border: '1px solid transparent',
  lineHeight: 1,
};

const downloadBtnStyle = {
  ...btnBase,
  backgroundColor: '#0f172a',
  borderColor: '#38bdf8',
  color: '#e0f2fe',
};

const printBtnStyle = {
  ...btnBase,
  backgroundColor: '#0284c7',
  borderColor: '#0284c7',
  color: '#ffffff',
};

const ghostBtnStyle = {
  ...btnBase,
  backgroundColor: '#1e293b',
  borderColor: '#334155',
  color: '#f1f5f9',
};

const iconBtnStyle = {
  ...ghostBtnStyle,
  width: '36px',
  padding: 0,
};

/**
 * Full-screen document preview after processing labels.
 * Solid inline colors so controls stay visible over any page chrome.
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
  const shellRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const toggleFullscreen = useCallback(async () => {
    const el = shellRef.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.warn('Fullscreen failed', error);
    }
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);

    const onKey = (event) => {
      if (isTypingTarget(event.target)) return;

      if (event.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
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
        toggleFullscreen();
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
  }, [open, onClose, handleDownload, handlePrint, toggleFullscreen]);

  if (!mounted || !open || !url) return null;

  // Explicit 100% zoom — FitH makes small 4×6 pages open at ~200–300%.
  const viewerSrc = url.includes('#') ? url : `${url}#zoom=100`;

  return createPortal(
    <div
      ref={shellRef}
      style={shellStyle}
      role="dialog"
      aria-modal="true"
      aria-label="Document preview"
    >
      <header style={barStyle}>
        <div style={{ display: 'flex', minWidth: 0, flex: 1, alignItems: 'center', gap: '10px' }}>
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

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
          <button
            type="button"
            onClick={handleDownload}
            style={downloadBtnStyle}
            title="Download (Ctrl+S)"
          >
            <DownloadIcon />
            <span>Download</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            style={printBtnStyle}
            title="Print (Ctrl+P)"
          >
            <PrintIcon />
            <span>Print</span>
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            style={ghostBtnStyle}
            title="Fullscreen (F)"
          >
            <FullscreenIcon active={isFullscreen} />
            <span style={{ display: 'inline' }}>
              {isFullscreen ? 'Exit' : 'Fullscreen'}
            </span>
          </button>

          <button
            type="button"
            onClick={onClose}
            style={iconBtnStyle}
            title="Close (Esc)"
            aria-label="Close preview"
          >
            <CloseIcon />
          </button>
        </div>
      </header>

      <div style={{ position: 'relative', flex: 1, minHeight: 0, backgroundColor: '#1e293b' }}>
        <iframe
          ref={iframeRef}
          title={filename}
          src={viewerSrc}
          style={{
            width: '100%',
            height: '100%',
            border: 0,
            backgroundColor: '#1e293b',
          }}
        />
      </div>

      <footer style={footerStyle}>
        <div style={{ display: 'flex', minWidth: 0, flex: 1, alignItems: 'center', gap: '8px' }}>
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399' }}>
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
    </div>,
    document.body
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

function FullscreenIcon({ active }) {
  if (active) {
    return (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9H5v4M15 9h4v4M9 15H5v-4M15 15h4v-4" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
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
