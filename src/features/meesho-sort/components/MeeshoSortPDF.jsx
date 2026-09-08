import { Link } from 'react-router-dom';
import ToolSeoSection from '../../../components/seo/ToolSeoSection';
import { useMeeshoSort } from '../hooks/useMeeshoSort';
import MeeshoSortUpload from './MeeshoSortUpload';
import MeeshoSortWorkspace from './MeeshoSortWorkspace';

const STEPS = [
  { n: '1', title: 'Upload', text: 'Add one or more Meesho label PDFs' },
  { n: '2', title: 'Sort', text: 'Pages ordered by SKU, then courier' },
  { n: '3', title: 'Crop & download', text: 'Meesho crop to thermal size' },
];

export default function MeeshoSortPDF() {
  const {
    files,
    isProcessing,
    progress,
    lastSummary,
    totalPages,
    outputSizeId,
    setOutputSizeId,
    addFiles,
    removeFile,
    clearFiles,
    runSort,
  } = useMeeshoSort();

  return (
    <div className="bg-[var(--page-bg)] py-10 sm:py-14">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center sm:mb-10">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-orange-600">
              Meesho Label Sort
            </p>
            <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Sort & crop Meesho labels
            </h1>
            <p className="mx-auto max-w-xl text-base text-slate-600 sm:text-lg">
              Upload multiple Meesho label PDFs. We sort by SKU and shipping company, crop each
              label like Label Crop, then download one print-ready PDF.
            </p>
          </div>

          {files.length === 0 ? (
            <>
              <MeeshoSortUpload onAddFiles={addFiles} disabled={isProcessing} />

              <div className="mt-10 rounded-2xl border border-slate-200 bg-white px-6 py-6 sm:px-8">
                <h3 className="mb-5 text-center text-sm font-semibold text-slate-900 sm:text-left">
                  How it works
                </h3>
                <ol className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  {STEPS.map((step) => (
                    <li
                      key={step.n}
                      className="flex items-center gap-3 text-left sm:flex-col sm:items-start"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-600 text-sm font-bold text-white">
                        {step.n}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{step.title}</p>
                        <p className="mt-0.5 text-xs text-slate-500">{step.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </>
          ) : (
            <MeeshoSortWorkspace
              files={files}
              totalPages={totalPages}
              isProcessing={isProcessing}
              progress={progress}
              lastSummary={lastSummary}
              outputSizeId={outputSizeId}
              setOutputSizeId={setOutputSizeId}
              onAddFiles={addFiles}
              onRemove={removeFile}
              onClear={clearFiles}
              onSort={runSort}
            />
          )}

          <ToolSeoSection toolId="meesho-sort" accentClass="text-orange-600" />

          <p className="mt-6 text-center text-sm text-slate-500">
            Only need crop without sorting?{' '}
            <Link to="/label-crop" className="font-medium text-orange-600 hover:underline">
              Open Label Crop
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
