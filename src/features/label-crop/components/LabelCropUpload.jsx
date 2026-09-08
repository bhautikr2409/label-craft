import { useCallback, useRef, useState } from 'react';
import { MAX_PDF_BYTES } from '../../../constants';

export default function LabelCropUpload({
  platformLabel = 'label',
  onFileChange,
  onFileDrop,
  disabled,
}) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const maxMb = Math.round(MAX_PDF_BYTES / (1024 * 1024));

  const handleDragOver = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) setIsDragging(true);
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (disabled) return;
      const file = e.dataTransfer.files?.[0];
      if (file) onFileDrop?.(file);
    },
    [disabled, onFileDrop]
  );

  return (
    <div
      onDragOver={handleDragOver}
      onDragEnter={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={[
        'relative rounded-2xl border-2 border-dashed bg-white px-6 py-10 text-center transition-all duration-200 sm:px-10 sm:py-12',
        isDragging
          ? 'scale-[1.01] border-rose-500 bg-rose-50/70'
          : 'border-slate-200 hover:border-rose-300 hover:bg-slate-50/40',
        disabled ? 'pointer-events-none opacity-60' : '',
      ].join(' ')}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        onChange={onFileChange}
        className="sr-only"
        id="label-crop-upload"
      />

      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
        <svg viewBox="0 0 48 48" fill="none" className="h-8 w-8" aria-hidden="true">
          <rect x="8" y="6" width="24" height="36" rx="2" stroke="currentColor" strokeWidth="2.5" />
          <path
            d="M14 14h12M14 20h12M14 26h8"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <rect
            x="28"
            y="22"
            width="14"
            height="20"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="2.5"
          />
          <path
            d="M31 28h8M31 33h8M31 38h5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <h2 className="mb-2 text-xl font-bold text-slate-900">
        {isDragging ? 'Drop label PDF here' : `Upload ${platformLabel} label PDF`}
      </h2>
      <p className="mb-6 text-sm text-slate-500">
        A4 shipping label · Max {maxMb} MB · Processed locally in your browser
      </p>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-7 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-rose-700"
      >
        Choose PDF file
      </button>
    </div>
  );
}
