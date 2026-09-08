import { Link } from 'react-router-dom';
import '../../../lib/pdf/worker';
import { useLabelCrop } from '../hooks/useLabelCrop';
import LabelCropPlatformPicker from './LabelCropPlatformPicker';
import LabelCropUpload from './LabelCropUpload';
import LabelCropWorkspace from './LabelCropWorkspace';
import ToolSeoSection from '../../../components/seo/ToolSeoSection';

const STEPS = [
  { n: '1', title: 'Choose type', text: 'Select Flipkart or Meesho' },
  { n: '2', title: 'Upload', text: 'Add your A4 label PDF' },
  { n: '3', title: 'Download', text: 'Get print-ready cropped labels' },
];

const PLATFORM_LABEL = {
  flipkart: 'Flipkart',
  meesho: 'Meesho',
};

export default function LabelCropPDF() {
  const {
    file,
    pageCount,
    isLoading,
    loadError,
    platformId,
    setPlatformId,
    changePlatform,
    outputSizeId,
    setOutputSizeId,
    isProcessing,
    progress,
    loadFile,
    acceptFile,
    clearFile,
    runCrop,
    formatFileSize,
  } = useLabelCrop();

  return (
    <div className="bg-[var(--page-bg)] py-10 sm:py-14">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center sm:mb-10">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-rose-600">
              Shipping Label Crop
            </p>
            <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Flipkart & Meesho label crop
            </h1>
            <p className="mx-auto max-w-xl text-base text-slate-600 sm:text-lg">
              Choose your marketplace, upload the A4 label PDF, and download a cropped file for
              thermal printing. Everything runs in your browser.
            </p>
          </div>

          {!platformId ? (
            <>
              <LabelCropPlatformPicker onSelect={setPlatformId} />

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
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-600 text-sm font-bold text-white">
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
          ) : !file ? (
            <>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                <p className="text-sm text-slate-700">
                  Selected:{' '}
                  <span className="font-bold text-rose-700">
                    {PLATFORM_LABEL[platformId] || platformId}
                  </span>
                </p>
                <button
                  type="button"
                  onClick={changePlatform}
                  className="text-sm font-semibold text-slate-600 underline-offset-2 hover:text-rose-700 hover:underline"
                >
                  Change marketplace
                </button>
              </div>

              <LabelCropUpload
                platformLabel={PLATFORM_LABEL[platformId]}
                onFileChange={loadFile}
                onFileDrop={acceptFile}
                disabled={isProcessing}
              />
            </>
          ) : (
            <LabelCropWorkspace
              file={file}
              pageCount={pageCount}
              isLoading={isLoading}
              loadError={loadError}
              platformId={platformId}
              onChangePlatform={changePlatform}
              outputSizeId={outputSizeId}
              setOutputSizeId={setOutputSizeId}
              isProcessing={isProcessing}
              progress={progress}
              onClear={clearFile}
              onCrop={runCrop}
              formatFileSize={formatFileSize}
            />
          )}

          <ToolSeoSection toolId="label-crop" accentClass="text-rose-600" />

          <p className="mt-6 text-center text-sm text-slate-500">
            Need a manual crop instead?{' '}
            <Link to="/crop" className="font-medium text-rose-600 hover:underline">
              Open Crop PDF
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
