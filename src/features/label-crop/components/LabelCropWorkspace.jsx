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
  outputSizeId,
  setOutputSizeId,
  isProcessing,
  progress,
  onClear,
  onCrop,
  formatFileSize,
}) {
  const canRun = !isLoading && !loadError && pageCount > 0 && !isProcessing;
  const progressPercent =
    progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;
  const platformName = PLATFORM_LABEL[platformId] || platformId;

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
              ? ' · Reading…'
              : pageCount > 0
                ? ` · ${pageCount} page${pageCount === 1 ? '' : 's'}`
                : ''}
            {platformName ? ` · ${platformName}` : ''}
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
              {isProcessing ? 'Cropping…' : `Crop ${platformName} labels & Download`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
