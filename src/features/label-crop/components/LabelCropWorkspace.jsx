import { Link } from 'react-router-dom';
import { OUTPUT_SIZES } from '../utils/detectLabel';

const PLATFORM_LABEL = {
  flipkart: 'Flipkart',
  meesho: 'Meesho',
};

export default function LabelCropWorkspace({
  file,
  pageCount,
  isLoading,
  loadError,
  platformId,
  onChangePlatform,
  detectedMarketplace,
  marketplaceMismatch,
  onApplyDetectedPlatform,
  outputSizeId,
  setOutputSizeId,
  isProcessing,
  progress,
  onClear,
  onCrop,
  formatFileSize,
}) {
  const canRun =
    !isLoading &&
    !loadError &&
    pageCount > 0 &&
    !isProcessing &&
    !marketplaceMismatch;
  const progressPercent =
    progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;
  const platformName = PLATFORM_LABEL[platformId] || platformId;
  const detectedLabel = detectedMarketplace?.label;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-4 py-4 sm:px-5">
        <div className="min-w-0">
          <h2 className="truncate font-semibold text-slate-900" title={file.name}>
            {file.name}
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            {formatFileSize(file.size)}
            {isLoading
              ? ' · Reading & detecting marketplace…'
              : pageCount > 0
                ? ` · ${pageCount} page${pageCount === 1 ? '' : 's'}`
                : ''}
            {platformName ? ` · ${platformName}` : ''}
            {!isLoading && detectedLabel && detectedMarketplace?.id !== 'unknown'
              ? ` · Detected: ${detectedLabel}`
              : ''}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onChangePlatform}
            disabled={isProcessing}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
          >
            Change type
          </button>
          <button
            type="button"
            onClick={onClear}
            disabled={isProcessing}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
          >
            New file
          </button>
        </div>
      </div>

      <div className="space-y-5 p-4 sm:p-5">
        {loadError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {loadError}
          </div>
        ) : (
          <>
            {marketplaceMismatch ? (
              <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
                <p className="font-semibold">
                  This PDF looks like {detectedLabel}, but you selected {platformName}.
                </p>
                <p className="mt-1 text-amber-900/80">
                  Cropping with the wrong marketplace gives bad results. Switch type to continue.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={onApplyDetectedPlatform}
                    disabled={isProcessing}
                    className="rounded-lg bg-amber-700 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-40"
                  >
                    Switch to {detectedLabel}
                  </button>
                  <button
                    type="button"
                    onClick={onChangePlatform}
                    disabled={isProcessing}
                    className="rounded-lg border border-amber-300 bg-white px-3 py-2 text-sm font-medium text-amber-900 hover:bg-amber-100 disabled:opacity-40"
                  >
                    Choose again
                  </button>
                </div>
              </div>
            ) : null}

            {!isLoading && detectedMarketplace?.id === 'unknown' ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                Couldn’t confirm Flipkart or Meesho from this PDF. Cropping as{' '}
                <span className="font-semibold text-slate-900">{platformName}</span>. If the
                crop looks wrong, pick the other marketplace or try{' '}
                <Link to="/amazon-sku" className="font-semibold text-rose-700 hover:underline">
                  Amazon SKU
                </Link>
                .
              </div>
            ) : null}

            {!isLoading &&
            detectedMarketplace &&
            (detectedMarketplace.id === 'flipkart' || detectedMarketplace.id === 'meesho') &&
            detectedMarketplace.id === platformId ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                Detected <span className="font-semibold">{detectedLabel}</span> labels — ready to
                crop.
              </div>
            ) : null}

            <fieldset>
              <legend className="mb-3 text-sm font-semibold text-slate-900">Output size</legend>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {Object.values(OUTPUT_SIZES).map((option) => {
                  const active = outputSizeId === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setOutputSizeId(option.id)}
                      disabled={isProcessing}
                      className={[
                        'rounded-xl border px-4 py-3 text-left transition-colors',
                        active
                          ? 'border-rose-500 bg-rose-50 ring-1 ring-rose-500'
                          : 'border-slate-200 bg-white hover:border-rose-300',
                      ].join(' ')}
                    >
                      <span className="block text-sm font-semibold text-slate-900">
                        {option.label}
                      </span>
                      <span className="mt-1 block text-xs text-slate-500">{option.hint}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {isProcessing ? (
              <div className="rounded-xl border border-rose-100 bg-rose-50/60 px-4 py-3">
                <div className="mb-2 flex items-center justify-between text-xs font-medium text-rose-800">
                  <span>
                    Cropping page {progress.current} of {progress.total}…
                  </span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-rose-100">
                  <div
                    className="h-full rounded-full bg-rose-600 transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            ) : null}

            <button
              type="button"
              onClick={onCrop}
              disabled={!canRun}
              className="w-full rounded-xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-rose-700 disabled:opacity-40 disabled:hover:bg-rose-600 sm:w-auto"
            >
              {isProcessing ? 'Cropping…' : `Crop ${platformName} labels & Preview`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
