import { SKU_POSITIONS } from '../utils/processAmazonPdf';
import { formatFileSize } from '../utils/validateAmazonPdf';

export default function AmazonSkuWorkspace({
  file,
  pageCount,
  orderCount,
  orderPairs,
  positionId,
  setPositionId,
  customX,
  setCustomX,
  customY,
  setCustomY,
  includeOrderCount,
  setIncludeOrderCount,
  isProcessing,
  onClearFile,
  onProcessAndDownload,
}) {
  const missingCount = orderPairs.filter((p) => !p.sku).length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* File Overview Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 break-all">{file?.name}</h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
              <span>Size: {formatFileSize(file?.size || 0)}</span>
              <span>•</span>
              <span className="font-semibold text-slate-700">{pageCount} total pages</span>
              <span>•</span>
              <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                {orderCount} Amazon order pair{orderCount === 1 ? '' : 's'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClearFile}
            disabled={isProcessing}
            className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-2xs"
          >
            Choose Another File
          </button>
          <button
            type="button"
            onClick={() => onProcessAndDownload()}
            disabled={isProcessing}
            className="px-6 py-2.5 text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 rounded-xl transition-all duration-200 shadow-sm flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Injecting SKUs…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Inject SKUs & Download PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* Position & Order Count Selection Panel */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">SKU Injection Format & Location</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure SKU text format and placement on the shipping label.
            </p>
          </div>

          <label className="inline-flex items-center gap-2.5 px-3 py-1.5 bg-amber-50/80 border border-amber-200/80 rounded-xl cursor-pointer select-none hover:bg-amber-100/50 transition-colors">
            <input
              type="checkbox"
              checked={includeOrderCount}
              onChange={(e) => setIncludeOrderCount(e.target.checked)}
              className="w-4 h-4 text-amber-600 rounded border-amber-300 focus:ring-amber-500"
            />
            <span className="text-xs font-bold text-amber-900">
              Include order count (e.g. <code className="font-mono text-amber-700 bg-white px-1.5 py-0.5 rounded border border-amber-200">SKU: floral perfume = 2 order</code>)
            </span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {Object.values(SKU_POSITIONS).map((pos) => {
            const isSelected = positionId === pos.id;
            return (
              <button
                key={pos.id}
                type="button"
                onClick={() => setPositionId(pos.id)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-500/20'
                    : 'border-slate-200 hover:border-amber-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`font-semibold text-xs ${
                      isSelected ? 'text-amber-900' : 'text-slate-800'
                    }`}
                  >
                    {pos.label}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-amber-600 inline-block" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">{pos.hint}</p>
              </button>
            );
          })}
        </div>

        {/* Custom Coordinates Control if custom position is picked */}
        {positionId === 'custom' && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <label htmlFor="custom-x-input" className="font-semibold text-slate-700">X Position (points):</label>
              <input
                id="custom-x-input"
                type="number"
                value={customX}
                onChange={(e) => setCustomX(Number(e.target.value))}
                className="w-24 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-mono font-medium focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="custom-y-input" className="font-semibold text-slate-700">Y Position (points from bottom):</label>
              <input
                id="custom-y-input"
                type="number"
                value={customY}
                onChange={(e) => setCustomY(Number(e.target.value))}
                className="w-24 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-mono font-medium focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            <span className="text-slate-400 italic">
              (A4 page is 595 × 842 pt. Upper white space above STVT box is ~X: 60, Y: 155)
            </span>
          </div>
        )}
      </div>

      {/* Summary Status Bar */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
          <span>
            <strong className="text-slate-800">{orderCount - missingCount}</strong> of{' '}
            <strong className="text-slate-800">{orderCount}</strong> order SKUs extracted successfully
          </span>
        </div>
        {missingCount > 0 && (
          <span className="text-amber-700 bg-amber-100/80 font-medium px-2.5 py-1 rounded-md">
            ⚠️ {missingCount} order{missingCount === 1 ? '' : 's'} missing SKU parentheses (will tag as SKU: Not Found)
          </span>
        )}
      </div>

      {/* Order Pairs List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm">
            Order Pairs Preview ({orderPairs.length} Pairs)
          </h3>
          <span className="text-xs text-slate-400">
            Page i (Label) ⬅️ Page i+1 (Invoice SKU)
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {orderPairs.map((pair) => {
            const formattedTag = pair.sku
              ? includeOrderCount
                ? `SKU: ${pair.sku} = ${pair.skuCount || 1} order`
                : `SKU: ${pair.sku}`
              : 'SKU: Not Found';

            return (
              <div
                key={pair.orderIndex}
                className="p-5 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0">
                    #{pair.orderIndex}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                        Label: Page {pair.labelPageNum}
                      </span>
                      <span>⬅️</span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                        Invoice: Page {pair.invoicePageNum}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 max-w-xl font-mono">
                      {pair.fullText
                        ? pair.fullText.substring(0, 140) + '...'
                        : 'No text extracted'}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  {pair.sku ? (
                    <div className="px-3.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold font-mono shadow-2xs">
                      {formattedTag}
                    </div>
                  ) : (
                    <div className="px-3.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold font-mono">
                      SKU: Not Found
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
