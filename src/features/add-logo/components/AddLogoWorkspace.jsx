import { LOGO_SIZES, formatFileSize } from '../utils/addLogoToPdf';

export default function AddLogoWorkspace({
  pdfFile,
  pageCount,
  isLoading,
  loadError,
  logoFile,
  logoPreviewUrl,
  sizeId,
  setSizeId,
  isProcessing,
  onClearLogo,
  onClearAll,
  onApply,
}) {
  const canRun =
    !isLoading && !loadError && pageCount > 0 && !!logoFile && !isProcessing;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-4 py-4 sm:px-5">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">Step 3</p>
          <h2 className="mt-0.5 truncate font-semibold text-slate-900" title={pdfFile.name}>
            {pdfFile.name}
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            {formatFileSize(pdfFile.size)}
            {isLoading
              ? ' · Reading…'
              : pageCount > 0
                ? ` · ${pageCount} page${pageCount === 1 ? '' : 's'}`
                : ''}
          </p>
        </div>
        <button
          type="button"
          onClick={onClearAll}
          disabled={isProcessing}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
        >
          Start over
        </button>
      </div>

      <div className="space-y-5 p-4 sm:p-5">
        {loadError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {loadError}
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50/60 p-4 sm:flex-row sm:items-center">
              <div className="flex h-24 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white sm:w-36">
                {logoPreviewUrl ? (
                  <img
                    src={logoPreviewUrl}
                    alt="Logo preview"
                    className="max-h-full max-w-full object-contain p-2"
                  />
                ) : (
                  <span className="text-xs text-slate-400">No logo</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900" title={logoFile?.name}>
                  {logoFile?.name || 'Logo'}
                </p>
                {logoFile ? (
                  <p className="mt-1 text-xs text-slate-500">{formatFileSize(logoFile.size)}</p>
                ) : null}
                <button
                  type="button"
                  onClick={onClearLogo}
                  disabled={isProcessing}
                  className="mt-3 text-sm font-semibold text-violet-700 underline-offset-2 hover:underline disabled:opacity-40"
                >
                  Change logo
                </button>
              </div>
            </div>

            <fieldset>
              <legend className="mb-3 text-sm font-semibold text-slate-900">Logo size</legend>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {Object.values(LOGO_SIZES).map((option) => {
                  const active = sizeId === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSizeId(option.id)}
                      disabled={isProcessing}
                      className={[
                        'rounded-xl border px-4 py-3 text-left transition-colors',
                        active
                          ? 'border-violet-500 bg-violet-50 ring-1 ring-violet-500'
                          : 'border-slate-200 bg-white hover:border-violet-300',
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

            <button
              type="button"
              onClick={onApply}
              disabled={!canRun}
              className="w-full rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-700 disabled:opacity-40 disabled:hover:bg-violet-600 sm:w-auto"
            >
              {isProcessing ? 'Adding logo…' : 'Add logo & Download'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
