import { formatFileSize } from '../utils/sortMeeshoLabels';
import { OUTPUT_SIZES } from '../../label-crop/utils/detectLabel';

export default function MeeshoSortWorkspace({
  files,
  totalPages,
  isProcessing,
  progress,
  lastSummary,
  outputSizeId,
  setOutputSizeId,
  onAddFiles,
  onRemove,
  onClear,
  onSort,
}) {
  const readyCount = files.filter((f) => f.status === 'ready').length;
  const canRun = readyCount >= 1 && !isProcessing;
  const progressPercent =
    progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;

  const progressLabel = (() => {
    if (progress.phase === 'cropping') {
      return `Cropping label ${progress.current} of ${progress.total}…`;
    }
    if (progress.phase === 'saving') {
      return 'Preparing download…';
    }
    if (progress.phase === 'reading' && progress.total > 0) {
      return `Reading page ${progress.current} of ${progress.total}…`;
    }
    if (progress.phase === 'reading') {
      return 'Reading labels…';
    }
    return 'Working…';
  })();

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-4 py-4 sm:px-5">
        <div>
          <h2 className="font-semibold text-slate-900">
            {files.length} PDF{files.length === 1 ? '' : 's'}
            {totalPages > 0 ? ` · ${totalPages} page${totalPages === 1 ? '' : 's'}` : ''}
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Sort by SKU → courier, then Meesho crop
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <label className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
            Add more
            <input
              type="file"
              accept="application/pdf,.pdf"
              multiple
              className="sr-only"
              disabled={isProcessing}
              onChange={(e) => {
                if (e.target.files?.length) onAddFiles(e.target.files);
                e.target.value = '';
              }}
            />
          </label>
          <button
            type="button"
            onClick={onClear}
            disabled={isProcessing}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="space-y-5 p-4 sm:p-5">
        <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200">
          {files.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-2 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900" title={item.file.name}>
                  {item.file.name}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {formatFileSize(item.file.size)}
                  {item.status === 'loading'
                    ? ' · Reading…'
                    : item.status === 'error'
                      ? ' · Could not read'
                      : item.pageCount != null
                        ? ` · ${item.pageCount} page${item.pageCount === 1 ? '' : 's'}`
                        : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                disabled={isProcessing}
                className="text-sm font-semibold text-slate-500 hover:text-red-600 disabled:opacity-40"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

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
                      ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-500'
                      : 'border-slate-200 bg-white hover:border-orange-300',
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
          <div className="rounded-xl border border-orange-100 bg-orange-50/60 px-4 py-3">
            <div className="mb-2 flex items-center justify-between text-xs font-medium text-orange-800">
              <span>{progressLabel}</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-orange-100">
              <div
                className="h-full rounded-full bg-orange-600 transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        ) : null}

        {lastSummary?.length ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3">
            <p className="mb-2 text-sm font-semibold text-slate-900">Last run summary</p>
            <ul className="max-h-48 space-y-2 overflow-y-auto text-xs text-slate-600">
              {lastSummary.map((group) => (
                <li key={group.sku}>
                  <span className="font-semibold text-slate-800">{group.sku}</span>
                  <span className="text-slate-400">
                    {' '}
                    · {group.total} page{group.total === 1 ? '' : 's'}
                  </span>
                  <ul className="mt-1 ml-3 list-disc space-y-0.5">
                    {group.couriers.map((c) => (
                      <li key={`${group.sku}-${c.courier}`}>
                        {c.courier} ({c.count})
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <button
          type="button"
          onClick={onSort}
          disabled={!canRun}
          className="w-full rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-700 disabled:opacity-40 disabled:hover:bg-orange-600 sm:w-auto"
        >
          {isProcessing ? 'Working…' : 'Sort, Crop & Download'}
        </button>
      </div>
    </div>
  );
}
