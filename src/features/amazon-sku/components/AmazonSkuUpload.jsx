import { useRef, useState } from 'react';

export default function AmazonSkuUpload({ onFileSelect, isLoading }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 bg-white shadow-sm hover:shadow-md ${
          isDragOver
            ? 'border-amber-500 bg-amber-50/50 scale-[1.01]'
            : 'border-slate-300 hover:border-amber-400'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shadow-inner">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-1">
              Upload Amazon Order PDF
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Select an Amazon order batch PDF. Each order must consist of 2 consecutive pages (Shipping Label + Invoice).
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm rounded-xl transition-colors shadow-sm">
            {isLoading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Reading PDF…
              </>
            ) : (
              'Choose PDF File'
            )}
          </div>

          <p className="text-xs text-slate-400">
            Supports multi-order PDFs (e.g. 2, 4, 20, 100 pages). 100% private local browser processing.
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm mb-3">
            1
          </div>
          <h4 className="font-semibold text-slate-800 text-sm mb-1">Page Pairing</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Page 1 (Label) + Page 2 (Invoice), Page 3 (Label) + Page 4 (Invoice).
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm mb-3">
            2
          </div>
          <h4 className="font-semibold text-slate-800 text-sm mb-1">Auto SKU Extraction</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Extracts SKU text inside parentheses <code className="text-amber-700 bg-amber-50 px-1 rounded">(...)</code> from the invoice description.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm mb-3">
            3
          </div>
          <h4 className="font-semibold text-slate-800 text-sm mb-1">Label Injection</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Injects <code className="text-slate-800 font-semibold">SKU: ...</code> onto the label's blank space while preserving invoice pages.
          </p>
        </div>
      </div>
    </div>
  );
}
