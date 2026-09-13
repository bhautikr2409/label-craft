import { Link } from 'react-router-dom';
import DocumentPreviewModal from '../../../components/preview/DocumentPreviewModal';
import ToolSeoSection from '../../../components/seo/ToolSeoSection';
import { useAddLogo } from '../hooks/useAddLogo';
import AddLogoImageUpload from './AddLogoImageUpload';
import AddLogoPdfUpload from './AddLogoPdfUpload';
import AddLogoWorkspace from './AddLogoWorkspace';

const STEPS = [
  { n: '1', title: 'Upload Meesho label', text: 'Meesho shipping label PDF only' },
  { n: '2', title: 'Upload logo', text: 'JPG, PNG, or WEBP image' },
  { n: '3', title: 'Preview', text: 'Check, then print or download' },
];

export default function AddLogoPDF() {
  const {
    pdfFile,
    pageCount,
    isLoading,
    isDetecting,
    loadError,
    logoFile,
    logoPreviewUrl,
    sizeId,
    setSizeId,
    isProcessing,
    loadPdf,
    acceptPdf,
    loadLogo,
    acceptLogo,
    clearLogo,
    clearAll,
    clearPdfKeepLogo,
    runAddLogo,
    preview,
    isPreviewOpen,
    closePreview,
    handlePreviewDownload,
  } = useAddLogo();

  return (
    <div className="bg-[var(--page-bg)] py-10 sm:py-14">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center sm:mb-10">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-violet-600">
              Add Logo to Meesho Label
            </p>
            <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Place your logo on Meesho labels
            </h1>
            <p className="mx-auto max-w-xl text-base text-slate-600 sm:text-lg">
              Upload a Meesho label PDF, then your logo. We put it in the bottom white space on
              every page. Other marketplaces are blocked with an error.
            </p>
          </div>

          {!pdfFile ? (
            <>
              <AddLogoPdfUpload
                onFileChange={loadPdf}
                onFileDrop={acceptPdf}
                disabled={isProcessing || isDetecting}
              />
              {isDetecting ? (
                <p className="mt-4 text-center text-sm font-medium text-violet-700">
                  Checking for Meesho label…
                </p>
              ) : null}

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
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white">
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
          ) : !logoFile ? (
            <AddLogoImageUpload
              pdfName={pdfFile.name}
              pageCount={pageCount}
              isLoading={isLoading}
              onLogoChange={loadLogo}
              onLogoDrop={acceptLogo}
              onBack={clearPdfKeepLogo}
              disabled={isProcessing}
            />
          ) : (
            <AddLogoWorkspace
              pdfFile={pdfFile}
              pageCount={pageCount}
              isLoading={isLoading}
              loadError={loadError}
              logoFile={logoFile}
              logoPreviewUrl={logoPreviewUrl}
              sizeId={sizeId}
              setSizeId={setSizeId}
              isProcessing={isProcessing}
              onClearLogo={clearLogo}
              onClearAll={clearAll}
              onApply={runAddLogo}
            />
          )}

          <ToolSeoSection toolId="add-logo" accentClass="text-violet-600" />

          <p className="mt-6 text-center text-sm text-slate-500">
            Cropping Flipkart or Meesho labels?{' '}
            <Link to="/label-crop" className="font-medium text-violet-600 hover:underline">
              Open Label Crop
            </Link>
          </p>
        </div>
      </div>

      <DocumentPreviewModal
        open={isPreviewOpen}
        url={preview?.url}
        blob={preview?.blob}
        filename={preview?.filename}
        platformLabel={preview?.platformLabel}
        onClose={closePreview}
        onDownload={handlePreviewDownload}
      />
    </div>
  );
}
