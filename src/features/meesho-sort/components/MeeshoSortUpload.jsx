import { useCallback, useRef, useState } from 'react';
import { MAX_MERGE_FILES, MAX_PDF_BYTES } from '../../../constants';

export default function MeeshoSortUpload({ onAddFiles, disabled }) {
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
      const dropped = e.dataTransfer.files;
      if (dropped?.length) onAddFiles(dropped);
    },
    [disabled, onAddFiles]
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
          ? 'scale-[1.01] border-orange-500 bg-orange-50/70'
          : 'border-slate-200 hover:border-orange-300 hover:bg-slate-50/40',
        disabled ? 'pointer-events-none opacity-60' : '',
      ].join(' ')}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        multiple
        onChange={(e) => {
          if (e.target.files?.length) {
            onAddFiles(e.target.files);
            e.target.value = '';
          }
        }}
        className="sr-only"
        id="meesho-sort-upload"
      />

      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
        <svg viewBox="0 0 48 48" fill="none" className="h-8 w-8" aria-hidden="true">
          <rect x="8" y="6" width="20" height="28" rx="2" stroke="currentColor" strokeWidth="2.5" />
          <path
            d="M14 14h8M14 20h8M14 26h5"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M30 18v16M26 22l4-4 4 4M26 30l4 4 4-4"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h2 className="mb-2 text-xl font-bold text-slate-900">
        {isDragging ? 'Drop Meesho label PDFs' : 'Upload Meesho label PDFs'}
      </h2>
      <p className="mb-6 text-sm text-slate-500">
        Multiple files · up to {MAX_MERGE_FILES} PDFs · {maxMb} MB each
      </p>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-7 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-orange-700"
      >
        Choose PDF files
      </button>
    </div>
  );
}
