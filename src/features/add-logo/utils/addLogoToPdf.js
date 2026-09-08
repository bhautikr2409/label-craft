import { PDFDocument } from 'pdf-lib';
import toast from 'react-hot-toast';
import '../../../lib/pdf/worker';
import { pdfjs } from 'react-pdf';

/** Near-white threshold for blank-space detection. */
const WHITE_THRESHOLD = 248;
const ROW_INK_MIN = 0.008;

export const LOGO_SIZES = {
  small: {
    id: 'small',
    label: 'Small',
    hint: 'Subtle brand mark',
    maxWidthFrac: 0.32,
    maxHeightFrac: 0.1,
  },
  medium: {
    id: 'medium',
    label: 'Medium',
    hint: 'Balanced for most labels',
    maxWidthFrac: 0.42,
    maxHeightFrac: 0.14,
  },
  large: {
    id: 'large',
    label: 'Large',
    hint: 'Fill more of the blank area',
    maxWidthFrac: 0.52,
    maxHeightFrac: 0.18,
  },
};

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function isJpeg(file) {
  return file.type === 'image/jpeg' || file.type === 'image/jpg' || /\.jpe?g$/i.test(file.name);
}

function isPng(file) {
  return file.type === 'image/png' || /\.png$/i.test(file.name);
}

async function fileToPngBytes(file) {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is not available.');
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close?.();

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Failed to convert image.'))), 'image/png');
  });
  canvas.width = 0;
  canvas.height = 0;
  return new Uint8Array(await blob.arrayBuffer());
}

async function embedLogoImage(pdfDoc, file) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (isJpeg(file)) return pdfDoc.embedJpg(bytes);
  if (isPng(file)) return pdfDoc.embedPng(bytes);
  const pngBytes = await fileToPngBytes(file);
  return pdfDoc.embedPng(pngBytes);
}

/**
 * Find the last content row on a rendered page (fraction from top, 0–1).
 * Returns null if the page looks empty / full.
 */
async function detectContentBottomFrac(pdfFile) {
  try {
    const data = await pdfFile.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: data.slice(0) }).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1.25 });
    const canvas = document.createElement('canvas');
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    await page.render({ canvasContext: ctx, viewport }).promise;

    const { width, height } = canvas;
    const { data: pixels } = ctx.getImageData(0, 0, width, height);
    const x0 = Math.floor(width * 0.04);
    const x1 = Math.floor(width * 0.96);
    const span = Math.max(1, x1 - x0 + 1);

    let lastSolid = -1;
    for (let y = height - 1; y >= Math.floor(height * 0.15); y--) {
      let ink = 0;
      const row = y * width * 4;
      for (let x = x0; x <= x1; x++) {
        const i = row + x * 4;
        if (pixels[i + 3] < 20) continue;
        if (
          pixels[i] < WHITE_THRESHOLD ||
          pixels[i + 1] < WHITE_THRESHOLD ||
          pixels[i + 2] < WHITE_THRESHOLD
        ) {
          ink += 1;
        }
      }
      if (ink / span >= ROW_INK_MIN) {
        lastSolid = y;
        break;
      }
    }

    canvas.width = 0;
    canvas.height = 0;
    await pdf.destroy?.();

    if (lastSolid < 0) return null;
    return (lastSolid + 1) / height;
  } catch (error) {
    console.warn('White-space detect failed', error);
    return null;
  }
}

/**
 * Compute logo draw box in PDF points (bottom-left origin).
 * Guarantees the FULL logo stays visible:
 * - never overlaps page content (stays in bottom white band)
 * - never clips against page edges
 * - keeps aspect ratio (no stretch)
 */
function computeLogoBox(pageWidth, pageHeight, imgWidth, imgHeight, sizeId, contentBottomFrac) {
  const size = LOGO_SIZES[sizeId] || LOGO_SIZES.medium;
  if (!imgWidth || !imgHeight || pageWidth <= 0 || pageHeight <= 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  // Safe insets so logo edges are never cut by printers / page bounds
  const padX = Math.max(8, pageWidth * 0.06);
  const padBottom = Math.max(8, pageHeight * 0.03);
  const padUnderContent = Math.max(10, pageHeight * 0.018);

  // Content ends at contentBottomFrac from top → white band below it.
  const contentEndFromTop = Math.min(
    0.92,
    Math.max(0.45, contentBottomFrac ?? 0.78)
  );
  // Top of white band in PDF coords (from page bottom)
  const whiteTopY = pageHeight * (1 - contentEndFromTop) - padUnderContent;

  let bandBottom = padBottom;
  let bandTop = whiteTopY;

  if (bandTop <= bandBottom + pageHeight * 0.05) {
    // Little / no detected blank space — use a safe bottom strip
    bandBottom = padBottom;
    bandTop = Math.min(pageHeight * 0.16, pageHeight - padUnderContent);
  }

  // Usable box inside the white band (extra inner padding so nothing is clipped)
  const innerPadX = Math.max(4, pageWidth * 0.015);
  const innerPadY = Math.max(4, pageHeight * 0.01);
  const usableLeft = padX + innerPadX;
  const usableRight = pageWidth - padX - innerPadX;
  const usableBottom = bandBottom + innerPadY;
  const usableTop = bandTop - innerPadY;
  const usableW = Math.max(1, usableRight - usableLeft);
  const usableH = Math.max(1, usableTop - usableBottom);

  // Size preset is a preference; never exceed the safe usable box
  const maxW = Math.min(usableW, pageWidth * size.maxWidthFrac);
  const maxH = Math.min(usableH, pageHeight * size.maxHeightFrac);

  let scale = Math.min(maxW / imgWidth, maxH / imgHeight);
  // If still somehow larger than usable area, shrink again
  scale = Math.min(scale, usableW / imgWidth, usableH / imgHeight);
  // Never upscale tiny logos past their native px in a way that overflows;
  // scale can be > 1 for small logos — that's fine if they fit.

  let drawW = imgWidth * scale;
  let drawH = imgHeight * scale;

  // Final clamp — full logo must fit inside usable rect
  if (drawW > usableW || drawH > usableH) {
    const fit = Math.min(usableW / drawW, usableH / drawH, 1);
    drawW *= fit;
    drawH *= fit;
  }

  let x = usableLeft + (usableW - drawW) / 2;
  let y = usableBottom + (usableH - drawH) / 2;

  // Absolute page bounds check (belt and suspenders)
  const minX = padX;
  const maxX = pageWidth - padX - drawW;
  const minY = padBottom;
  const maxY = Math.min(pageHeight - padUnderContent, bandTop) - drawH;
  x = Math.min(Math.max(x, minX), Math.max(minX, maxX));
  y = Math.min(Math.max(y, minY), Math.max(minY, maxY));

  // If maxY < minY the band is tiny — pin to bottom padding and shrink
  if (maxY < minY) {
    const forceH = Math.max(1, bandTop - padBottom - innerPadY * 2);
    const forceW = usableW;
    const fit = Math.min(forceW / imgWidth, forceH / imgHeight);
    drawW = imgWidth * fit;
    drawH = imgHeight * fit;
    x = (pageWidth - drawW) / 2;
    y = padBottom + innerPadY;
  }

  return { x, y, width: drawW, height: drawH };
}

export async function getPdfPageCount(file) {
  try {
    const bytes = await file.arrayBuffer();
    const doc = await PDFDocument.load(bytes);
    return doc.getPageCount();
  } catch (error) {
    console.error('PDF page count error:', error);
    return null;
  }
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Stamp a logo into the bottom white space of every page, then download.
 * @param {File} pdfFile
 * @param {File} logoFile
 * @param {{ sizeId?: string }} [options]
 */
export async function addLogoAndDownload(pdfFile, logoFile, options = {}) {
  const { sizeId = 'medium' } = options;

  if (!pdfFile || !logoFile) {
    toast.error('Upload a PDF and a logo image first.');
    return false;
  }

  try {
    const contentBottomFrac = await detectContentBottomFrac(pdfFile);
    const bytes = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(bytes);
    const pages = pdfDoc.getPages();
    if (!pages.length) {
      toast.error('This PDF has no pages.');
      return false;
    }

    const logoImage = await embedLogoImage(pdfDoc, logoFile);
    const imgW = logoImage.width;
    const imgH = logoImage.height;

    for (const page of pages) {
      const { width, height } = page.getSize();
      // Per-page box so aspect ratio stays correct and nothing is clipped
      const box = computeLogoBox(
        width,
        height,
        imgW,
        imgH,
        sizeId,
        contentBottomFrac
      );
      if (box.width < 1 || box.height < 1) continue;

      page.drawImage(logoImage, {
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height,
      });
    }

    const outBytes = await pdfDoc.save();
    const blob = new Blob([outBytes], { type: 'application/pdf' });
    const name = pdfFile.name.replace(/\.pdf$/i, '') || 'document';
    triggerDownload(blob, `${name}-with-logo.pdf`);

    toast.success(
      `Logo added to ${pages.length} page${pages.length === 1 ? '' : 's'} · ready to download`
    );
    return true;
  } catch (error) {
    console.error('Add logo error:', error);
    const msg = String(error?.message || '');
    if (/password|encrypt/i.test(msg)) {
      toast.error('This PDF is password-protected. Unlock it first.');
    } else {
      toast.error('Could not add the logo to this PDF.');
    }
    return false;
  }
}
