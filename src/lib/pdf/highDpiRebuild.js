import { PDFDocument } from 'pdf-lib';
import { pdfjs } from 'react-pdf';
import './worker';

/** Target print / zoom clarity for flattened label pages. */
export const LABEL_EXPORT_DPI = 300;

/** Soft cap per canvas edge (Safari / memory). */
const MAX_EDGE_PX = 3600;

function canvasToPngBytes(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Could not encode page image.'));
          return;
        }
        blob.arrayBuffer().then(resolve, reject);
      },
      'image/png'
    );
  });
}

/**
 * Rebuild every page of a PDF as a ~LABEL_EXPORT_DPI PNG embed.
 * Keeps page size in points; improves zoom/print clarity for image-heavy
 * marketplace labels (Amazon, etc.) in browser PDF viewers.
 *
 * @param {ArrayBuffer|Uint8Array} pdfBytes
 * @param {{ dpi?: number, onProgress?: (info: { current: number, total: number }) => void }} [options]
 * @returns {Promise<Uint8Array>}
 */
export async function rebuildPdfAtExportDpi(pdfBytes, options = {}) {
  const dpi = options.dpi || LABEL_EXPORT_DPI;
  const onProgress = options.onProgress;

  const data = pdfBytes instanceof Uint8Array ? pdfBytes.slice() : new Uint8Array(pdfBytes).slice();
  const pdfjsDoc = await pdfjs.getDocument({ data }).promise;
  const outDoc = await PDFDocument.create();
  const total = pdfjsDoc.numPages;

  try {
    for (let pageNumber = 1; pageNumber <= total; pageNumber++) {
      onProgress?.({ current: pageNumber, total });

      const page = await pdfjsDoc.getPage(pageNumber);
      const baseViewport = page.getViewport({ scale: 1 });
      const pageW = baseViewport.width;
      const pageH = baseViewport.height;

      let scale = dpi / 72;
      const longEdge = Math.max(pageW, pageH) * scale;
      if (longEdge > MAX_EDGE_PX) {
        scale = MAX_EDGE_PX / Math.max(pageW, pageH);
      }

      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.floor(viewport.width));
      canvas.height = Math.max(1, Math.floor(viewport.height));
      const ctx = canvas.getContext('2d', { alpha: false });
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvasContext: ctx, viewport }).promise;

      const pngBytes = await canvasToPngBytes(canvas);
      canvas.width = 0;
      canvas.height = 0;

      const png = await outDoc.embedPng(pngBytes);
      const outPage = outDoc.addPage([pageW, pageH]);
      outPage.drawImage(png, {
        x: 0,
        y: 0,
        width: pageW,
        height: pageH,
      });
    }
  } finally {
    await pdfjsDoc.destroy?.();
  }

  return outDoc.save({ useObjectStreams: false });
}
