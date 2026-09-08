import { useCallback, useRef, useState } from 'react';
import { MAX_IMAGE_BYTES } from '../../../constants';

export default function AddLogoImageUpload({
  pdfName,
  pageCount,
  isLoading,
  onLogoChange,
  onLogoDrop,
  onBack,
  disabled,
}) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const maxMb = Math.round(MAX_IMAGE_BYTES / (1024 * 1024));

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
      if (file) onLogoDrop?.(file);
    },
    [disabled, onLogoDrop]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900" title={pdfName}>
            {pdfName}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            {isLoading
              ? 'Reading PDF…'
              : pageCount > 0
                ? `${pageCount} page${pageCount === 1 ? '' : 's'}`
                : 'PDF ready'}
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          disabled={disabled}
          className="text-sm font-semibold text-slate-600 underline-offset-2 hover:text-violet-700 hover:underline disabled:opacity-40"
        >
          Change PDF
        </button>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={[
          'relative rounded-2xl border-2 border-dashed bg-white px-6 py-10 text-center transition-all duration-200 sm:px-10 sm:py-12',
          isDragging
            ? 'scale-[1.01] border-violet-500 bg-violet-50/70'
            : 'border-slate-200 hover:border-violet-300 hover:bg-slate-50/40',
          disabled ? 'pointer-events-none opacity-60' : '',
        ].join(' ')}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
          onChange={onLogoChange}
          className="sr-only"
          id="add-logo-image-upload"
        />

        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
          <svg viewBox="0 0 48 48" fill="none" className="h-8 w-8" aria-hidden="true">
            <rect x="8" y="10" width="32" height="28" rx="3" stroke="currentColor" strokeWidth="2.5" />
            <circle cx="18" cy="20" r="3" stroke="currentColor" strokeWidth="2.5" />
            <path
              d="M10 32l8-8 6 6 4-4 10 10"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-violet-600">Step 2</p>
        <h2 className="mb-2 text-xl font-bold text-slate-900">
          {isDragging ? 'Drop logo here' : 'Upload your logo'}
        </h2>
        <p className="mb-6 text-sm text-slate-500">
          JPG, PNG, or WEBP · Max {maxMb} MB
        </p>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-7 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-violet-700"
        >
          Choose logo image
        </button>
      </div>
    </div>
  );
}
