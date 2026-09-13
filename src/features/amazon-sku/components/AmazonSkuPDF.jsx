import { Link } from 'react-router-dom';
import DocumentPreviewModal from '../../../components/preview/DocumentPreviewModal';
import ToolSeoSection from '../../../components/seo/ToolSeoSection';
import { useAmazonSku } from '../hooks/useAmazonSku';
import AmazonSkuUpload from './AmazonSkuUpload';
import AmazonSkuWorkspace from './AmazonSkuWorkspace';

export default function AmazonSkuPDF() {
  const {
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
    isLoading,
    isProcessing,
    handleFileSelect,
    handleClearFile,
    handleProcessAndDownload,
    preview,
    isPreviewOpen,
    closePreview,
    handlePreviewDownload,
  } = useAmazonSku();

  return (
    <div className="bg-[var(--page-bg)] py-10 sm:py-14">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 text-center sm:mb-10">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-amber-600">
              Amazon Seller Tool
            </p>
            <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Amazon Shipping Label SKU Injector
            </h1>
            <p className="mx-auto max-w-2xl text-base text-slate-600 sm:text-lg">
              Upload Amazon batch PDFs containing pairs of 2 pages (Label + Invoice). Automatically
              extracts product SKUs from invoices and injects{' '}
              <code className="font-mono font-semibold text-slate-800">product name = Qty</code> onto
              the shipping label&apos;s blank space.
            </p>
          </div>

          {!file ? (
            <AmazonSkuUpload onFileSelect={handleFileSelect} isLoading={isLoading} />
          ) : (
            <AmazonSkuWorkspace
              file={file}
              pageCount={pageCount}
              orderCount={orderCount}
              orderPairs={orderPairs}
              positionId={positionId}
              setPositionId={setPositionId}
              customX={customX}
              setCustomX={setCustomX}
              customY={customY}
              setCustomY={setCustomY}
              includeOrderCount={includeOrderCount}
              setIncludeOrderCount={setIncludeOrderCount}
              isProcessing={isProcessing}
              onClearFile={handleClearFile}
              onProcessAndDownload={handleProcessAndDownload}
            />
          )}

          <ToolSeoSection toolId="amazon-sku" accentClass="text-amber-600" />

          <p className="mt-8 text-center text-sm text-slate-500">
            Sorting Meesho shipping labels?{' '}
            <Link to="/meesho-sort" className="font-medium text-amber-600 hover:underline">
              Open Meesho Label Sort
            </Link>{' '}
            • Cropping e-commerce labels?{' '}
            <Link to="/label-crop" className="font-medium text-amber-600 hover:underline">
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
