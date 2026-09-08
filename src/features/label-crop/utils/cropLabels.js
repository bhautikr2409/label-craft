import { PDFDocument } from "pdf-lib";
import toast from "react-hot-toast";
import {
  OUTPUT_SIZES,
  detectMarketplaceFromPdf,
  findLabelBorderBox,
  loadPdfDocument,
  renderPageImageData,
  resolveMeeshoLabelRatios,
} from "./detectLabel";

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function baseName(fileName) {
  return fileName.replace(/\.pdf$/i, "") || "labels";
}

/**
 * Top shipping label defaults.
 * Flipkart labels are centered on A4 (~50% width) — not full page width.
 */
const TOP_LABEL = {
  flipkart: { x: 0.22, y: 0, w: 0.56, h: 0.48 },
  meesho: { x: 0.02, y: 0.01, w: 0.96, h: 0.5 },
  auto: { x: 0.22, y: 0, w: 0.56, h: 0.48 },
};

/** Find first empty band after content, scanning from TOP of the bitmap. */
function detectTopLabelHeightFromPixels(imageData, width, height) {
  const { data } = imageData;
  const inkRow = new Float32Array(height);

  for (let y = 0; y < height; y++) {
    let ink = 0;
    const row = y * width * 4;
    for (let x = 0; x < width; x++) {
      const i = row + x * 4;
      if (data[i + 3] < 20) continue;
      if (data[i] < 245 || data[i + 1] < 245 || data[i + 2] < 245) ink++;
    }
    inkRow[y] = ink / width;
  }

  const startY = Math.floor(height * 0.01);
  let contentStarted = false;
  let emptyRun = 0;
  const emptyNeed = Math.max(6, Math.floor(height * 0.012));

  for (let y = startY; y < Math.floor(height * 0.65); y++) {
    const ink = inkRow[y];
    if (!contentStarted) {
      if (ink > 0.02) contentStarted = true;
      continue;
    }
    if (ink < 0.012) {
      emptyRun++;
      if (emptyRun >= emptyNeed) {
        const endY = y - emptyRun + Math.floor(height * 0.01);
        const h = endY / height;
        if (h >= 0.28 && h <= 0.58) return h;
      }
    } else {
      emptyRun = 0;
    }
  }
  return null;
}

async function findTaxInvoiceFromTop(pdfPage) {
  try {
    const viewport = pdfPage.getViewport({ scale: 1 });
    const pageH = viewport.height;
    const content = await pdfPage.getTextContent({
      disableCombineTextItems: false,
    });
    let best = null;
    for (const item of content.items || []) {
      const str = String(item.str || "").trim();
      if (!/tax\s*invoice/i.test(str)) continue;
      const y = item.transform?.[5] ?? 0;
      const fromTop = (pageH - y) / pageH;
      if (fromTop > 0.22 && fromTop < 0.68) {
        if (best == null || fromTop < best) best = fromTop;
      }
    }
    return best;
  } catch {
    return null;
  }
}

async function resolveTopHeight(pdfPage, imageData, width, height, platformId) {
  const fallback = TOP_LABEL[platformId] || TOP_LABEL.auto;
  if (platformId === "flipkart" || platformId === "auto") {
    const taxFromTop = await findTaxInvoiceFromTop(pdfPage);
    if (taxFromTop != null) {
      return Math.min(0.56, Math.max(0.3, taxFromTop - 0.015));
    }
    const pixelH = detectTopLabelHeightFromPixels(imageData, width, height);
    if (pixelH != null) return pixelH;
  }
  return fallback.h;
}

/**
 * Find left/right edges of the label inside the top band (trim side whitespace).
 * Prefers solid black vertical borders; falls back to ink bounds.
 */
function findTightHorizontalBounds(imageData, width, height, y0, y1) {
  const { data } = imageData;
  const darkCol = new Float32Array(width);
  const inkCol = new Float32Array(width);
  const span = Math.max(1, y1 - y0);

  for (let x = 0; x < width; x++) {
    let dark = 0;
    let ink = 0;
    for (let y = y0; y < y1; y++) {
      const i = (y * width + x) * 4;
      const a = data[i + 3];
      if (a < 20) continue;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (r < 90 && g < 90 && b < 90) dark += 1;
      if (r < 245 || g < 245 || b < 245) ink += 1;
    }
    darkCol[x] = dark / span;
    inkCol[x] = ink / span;
  }

  // Solid vertical border columns (Flipkart black frame)
  const borderThresh = 0.28;
  let leftBorder = null;
  let rightBorder = null;
  for (let x = Math.floor(width * 0.04); x < width * 0.55; x++) {
    if (darkCol[x] >= borderThresh) {
      leftBorder = x;
      break;
    }
  }
  for (let x = Math.floor(width * 0.96); x > width * 0.45; x--) {
    if (darkCol[x] >= borderThresh) {
      rightBorder = x;
      break;
    }
  }

  if (
    leftBorder != null &&
    rightBorder != null &&
    rightBorder - leftBorder > width * 0.28 &&
    rightBorder - leftBorder < width * 0.75
  ) {
    const pad = Math.max(2, Math.round(width * 0.004));
    return {
      minX: Math.max(0, leftBorder - pad),
      maxX: Math.min(width - 1, rightBorder + pad),
    };
  }

  // Fallback: first/last columns with meaningful ink in the top band
  const inkThresh = 0.04;
  let minX = null;
  let maxX = null;
  for (let x = 0; x < width; x++) {
    if (inkCol[x] >= inkThresh) {
      minX = x;
      break;
    }
  }
  for (let x = width - 1; x >= 0; x--) {
    if (inkCol[x] >= inkThresh) {
      maxX = x;
      break;
    }
  }

  if (minX == null || maxX == null || maxX - minX < width * 0.25) return null;

  const pad = Math.max(2, Math.round(width * 0.006));
  return {
    minX: Math.max(0, minX - pad),
    maxX: Math.min(width - 1, maxX + pad),
  };
}

/**
 * Build tight top-label ratios: top band + black border left/right (no side whitespace).
 */
async function resolveTightTopLabelRatios(
  pdfPage,
  imageData,
  width,
  height,
  platformId,
) {
  const fallback = TOP_LABEL[platformId] || TOP_LABEL.auto;
  const h = await resolveTopHeight(
    pdfPage,
    imageData,
    width,
    height,
    platformId,
  );
  const labelH = Math.max(0.3, Math.min(0.56, h));

  // 1) Full black rectangle border (best for Flipkart)
  const border = findLabelBorderBox(imageData, width, height);
  if (border) {
    const bx = border.minX / width;
    const by = Math.max(0, border.minY / height);
    const bw = (border.maxX - border.minX) / width;
    const bh = Math.min(labelH, (border.maxY - border.minY) / height + 0.004);
    if (bw >= 0.28 && bw <= 0.72 && by <= 0.08) {
      return {
        x: Math.max(0, bx - 0.002),
        y: by,
        w: Math.min(1 - bx, bw + 0.004),
        h: Math.max(0.3, bh),
      };
    }
  }

  // 2) Horizontal tight bounds inside the top band
  const y1 = Math.floor(labelH * height);
  const sides = findTightHorizontalBounds(
    imageData,
    width,
    height,
    Math.floor(height * 0.005),
    y1,
  );
  if (sides) {
    return {
      x: sides.minX / width,
      y: 0,
      w: (sides.maxX - sides.minX) / width,
      h: labelH,
    };
  }

  // 3) Centered Flipkart-style preset (not full page width)
  return { ...fallback, y: 0, h: labelH };
}

/**
 * Shrinkwrap a canvas to non-white content / black border (removes side & top padding).
 * Returns a new tighter canvas, or the original if trim would be too aggressive.
 */
function shrinkwrapCanvas(sourceCanvas) {
  const width = sourceCanvas.width;
  const height = sourceCanvas.height;
  const ctx = sourceCanvas.getContext("2d", { willReadFrequently: true });
  const { data } = ctx.getImageData(0, 0, width, height);

  const isContent = (i) => {
    if (data[i + 3] < 20) return false;
    // near-white
    return data[i] < 248 || data[i + 1] < 248 || data[i + 2] < 248;
  };

  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  let found = false;

  // Prefer solid black border edges (more accurate than any ink)
  const darkCol = new Float32Array(width);
  const darkRow = new Float32Array(height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      if (data[i + 3] < 20) continue;
      if (data[i] < 100 && data[i + 1] < 100 && data[i + 2] < 100) {
        darkCol[x] += 1;
        darkRow[y] += 1;
      }
    }
  }
  for (let x = 0; x < width; x++) darkCol[x] /= height;
  for (let y = 0; y < height; y++) darkRow[y] /= width;

  const vThresh = 0.18;
  const solidH = 0.32; // solid black horizontal rule (not dashed cut line)
  let left = null;
  let right = null;
  let top = null;
  let bottom = null;

  for (let x = 0; x < width; x++) {
    if (darkCol[x] >= vThresh) {
      left = x;
      break;
    }
  }
  for (let x = width - 1; x >= 0; x--) {
    if (darkCol[x] >= vThresh) {
      right = x;
      break;
    }
  }
  for (let y = 0; y < height; y++) {
    if (darkRow[y] >= solidH * 0.7) {
      top = y;
      break;
    }
  }
  // Bottom = last SOLID border (ignore sparse dashed cut line below label)
  for (let y = height - 1; y >= Math.floor(height * 0.35); y--) {
    if (darkRow[y] >= solidH) {
      bottom = y;
      break;
    }
  }

  if (
    left != null &&
    right != null &&
    top != null &&
    bottom != null &&
    right - left > width * 0.35 &&
    bottom - top > height * 0.35
  ) {
    minX = left;
    maxX = right;
    minY = top;
    maxY = bottom;
    found = true;
  } else {
    // Fallback: any non-white ink
    const step = 1;
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        if (isContent((y * width + x) * 4)) {
          found = true;
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }
    }
  }

  if (!found) return sourceCanvas;

  // Tiny pad so the black stroke isn't clipped
  const pad = Math.max(1, Math.round(Math.min(width, height) * 0.003));
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(width - 1, maxX + pad);
  maxY = Math.min(height - 1, maxY + pad);

  const tw = maxX - minX + 1;
  const th = maxY - minY + 1;

  // Don't trim if almost nothing would change
  if (tw > width * 0.97 && th > height * 0.97) return sourceCanvas;
  // Don't trim if result would be tiny / broken
  if (tw < width * 0.35 || th < height * 0.4) return sourceCanvas;

  const out = document.createElement("canvas");
  out.width = tw;
  out.height = th;
  out
    .getContext("2d")
    .drawImage(sourceCanvas, minX, minY, tw, th, 0, 0, tw, th);
  return out;
}

/**
 * Rotate a canvas 90° clockwise (width/height swap).
 * Used for Meesho labels so landscape crop fits 4×6 thermal portrait.
 */
function rotateCanvas90Clockwise(sourceCanvas) {
  const rotated = document.createElement("canvas");
  rotated.width = sourceCanvas.height;
  rotated.height = sourceCanvas.width;
  const ctx = rotated.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, rotated.width, rotated.height);
  ctx.translate(rotated.width, 0);
  ctx.rotate(Math.PI / 2);
  ctx.drawImage(sourceCanvas, 0, 0);
  return rotated;
}

/**
 * Add white padding around a cropped label canvas (bitmap px).
 * @param {HTMLCanvasElement} sourceCanvas
 * @param {{ left?: number, right?: number, top?: number, bottom?: number }} pad
 */
function padCanvas(sourceCanvas, pad = {}) {
  const left = Math.max(0, Math.round(pad.left ?? 0));
  const right = Math.max(0, Math.round(pad.right ?? 0));
  const top = Math.max(0, Math.round(pad.top ?? 0));
  const bottom = Math.max(0, Math.round(pad.bottom ?? 0));
  if (left + right + top + bottom <= 0) return sourceCanvas;

  const out = document.createElement("canvas");
  out.width = sourceCanvas.width + left + right;
  out.height = sourceCanvas.height + top + bottom;
  const ctx = out.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, out.width, out.height);
  ctx.drawImage(sourceCanvas, left, top);
  return out;
}

/**
 * Slice the shipping label region into a PNG (tight to black border when detected).
 * Fixed sizes (4×5 / 4×6) stretch edge-to-edge — no letterbox whitespace.
 * @param {{ shrinkwrap?: boolean, rotate90?: boolean, padPx?: { left?: number, right?: number, top?: number, bottom?: number } }} [options]
 */
async function embedTopLabelImage(
  outDoc,
  sourceCanvas,
  width,
  height,
  ratios,
  output,
  options = {},
) {
  const { shrinkwrap = true, rotate90 = false, padPx = null } = options;
  const sx = Math.max(0, Math.floor(ratios.x * width));
  const sy = Math.max(0, Math.floor(ratios.y * height));
  const sw = Math.min(width - sx, Math.max(1, Math.floor(ratios.w * width)));
  const sh = Math.min(height - sy, Math.max(1, Math.floor(ratios.h * height)));

  let cropCanvas = document.createElement("canvas");
  cropCanvas.width = sw;
  cropCanvas.height = sh;
  const ctx = cropCanvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, sw, sh);
  ctx.drawImage(sourceCanvas, sx, sy, sw, sh, 0, 0, sw, sh);

  // Flipkart / Meesho: trim to black border when requested.
  if (shrinkwrap) {
    const tight = shrinkwrapCanvas(cropCanvas);
    if (tight !== cropCanvas) {
      cropCanvas.width = 0;
      cropCanvas.height = 0;
      cropCanvas = tight;
    }
  }

  // Flipkart: keep a small white margin after tight crop.
  if (padPx) {
    const padded = padCanvas(cropCanvas, padPx);
    if (padded !== cropCanvas) {
      cropCanvas.width = 0;
      cropCanvas.height = 0;
      cropCanvas = padded;
    }
  }

  // Meesho: rotate 90° CW after crop so label prints correctly on 4×6.
  if (rotate90) {
    const rotated = rotateCanvas90Clockwise(cropCanvas);
    cropCanvas.width = 0;
    cropCanvas.height = 0;
    cropCanvas = rotated;
  }

  const dataUrl = cropCanvas.toDataURL("image/png");
  cropCanvas.width = 0;
  cropCanvas.height = 0;
  const pngBytes = await fetch(dataUrl).then((r) => r.arrayBuffer());
  const png = await outDoc.embedPng(pngBytes);

  if (output.id === "original") {
    const page = outDoc.addPage([png.width, png.height]);
    page.drawImage(png, { x: 0, y: 0, width: png.width, height: png.height });
    return;
  }

  // Fill entire sticker size — no side/top letterboxing
  const targetW = output.widthPt;
  const targetH = output.heightPt;
  const page = outDoc.addPage([targetW, targetH]);
  page.drawImage(png, {
    x: 0,
    y: 0,
    width: targetW,
    height: targetH,
  });
}

/**
 * Meesho path: image slice from page TOP → stop before invoice body.
 * Same embed path as Flipkart so the detected region is exactly what downloads.
 */
async function cropMeeshoPage(
  outDoc,
  pdfPage,
  imageData,
  width,
  height,
  canvas,
  output,
) {
  let ratios;
  try {
    ratios = await resolveMeeshoLabelRatios(pdfPage, imageData, width, height);
  } catch (error) {
    console.warn("Meesho detect failed, using safe fallback", error);
    ratios = { x: 0.015, y: 0, w: 0.97, h: 0.48 };
  }

  // Force top-down crop; hard-cap height so invoice table/footer cannot appear.
  const safeRatios = {
    x: Math.max(0, Math.min(0.06, ratios.x ?? 0.015)),
    y: 0,
    w: Math.max(0.88, Math.min(1, ratios.w ?? 0.97)),
    h: Math.max(0.3, Math.min(0.52, ratios.h ?? 0.48)),
  };
  if (safeRatios.x + safeRatios.w > 1) {
    safeRatios.w = 1 - safeRatios.x;
  }

  await embedTopLabelImage(outDoc, canvas, width, height, safeRatios, output, {
    shrinkwrap: true,
    rotate90: true,
  });
}

/**
 * Crop one Meesho label page into an output PDF (reuse from Sort Meesho Labels).
 * Uses the same detect → crop → rotate 90° path as Label Crop (Meesho).
 */
export async function cropMeeshoPageIntoDoc(
  outDoc,
  pdfjsDoc,
  pageNumber,
  outputSizeId = "4x6",
) {
  const output = OUTPUT_SIZES[outputSizeId] || OUTPUT_SIZES["4x6"];
  const renderScale = 2.4;
  const pdfPage = await pdfjsDoc.getPage(pageNumber);
  const { imageData, width, height, canvas } = await renderPageImageData(
    pdfjsDoc,
    pageNumber,
    renderScale,
    true,
  );
  try {
    await cropMeeshoPage(
      outDoc,
      pdfPage,
      imageData,
      width,
      height,
      canvas,
      output,
    );
  } finally {
    canvas.width = 0;
    canvas.height = 0;
  }
}

/**
 * Flipkart / auto path (unchanged behavior): top-of-page image slice so the
 * invoice below the shipping label is not included.
 */
async function cropFlipkartPage(
  outDoc,
  pdfPage,
  imageData,
  width,
  height,
  canvas,
  platformId,
  output,
) {
  const ratios = await resolveTightTopLabelRatios(
    pdfPage,
    imageData,
    width,
    height,
    platformId,
  );

  // Keep upper-page crop; clamp width to Flipkart label box (never full A4 width)
  const safeRatios = {
    x: Math.max(0, Math.min(0.4, ratios.x)),
    y: Math.max(0, Math.min(0.06, ratios.y)),
    w: Math.max(0.28, Math.min(0.72, ratios.w)),
    h: Math.max(0.28, Math.min(0.58, ratios.h)),
  };

  await embedTopLabelImage(outDoc, canvas, width, height, safeRatios, output, {
    padPx: { left: 15, right: 15, top: 5, bottom: 5 },
  });
}

/**
 * Crop shipping labels from each page and download.
 * - Flipkart: top shipping-label image slice (existing working path)
 * - Meesho: shipping label + Product Details + TAX INVOICE header only
 */
export async function cropLabelsAndDownload(file, options = {}) {
  const { platformId = "auto", outputSizeId = "4x6", onProgress } = options;
  const output = OUTPUT_SIZES[outputSizeId] || OUTPUT_SIZES["4x6"];

  try {
    const pdfjsDoc = await loadPdfDocument(file);
    const pageCount = pdfjsDoc.numPages;
    if (pageCount < 1) {
      toast.error("This PDF has no pages.");
      return false;
    }

    // Resolve Auto → meesho | flipkart from filename + page text
    let resolvedPlatform = platformId;
    if (platformId === "auto") {
      resolvedPlatform = await detectMarketplaceFromPdf(pdfjsDoc, file.name);
      if (resolvedPlatform === "auto") resolvedPlatform = "flipkart";
    }
    const isMeesho = resolvedPlatform === "meesho";

    const outDoc = await PDFDocument.create();

    // High scale for barcodes (Meesho + Flipkart both use image embed now)
    const renderScale = isMeesho ? 2.4 : 2.5;

    for (let pageNumber = 1; pageNumber <= pageCount; pageNumber++) {
      onProgress?.({ current: pageNumber, total: pageCount });

      const pdfPage = await pdfjsDoc.getPage(pageNumber);
      const { imageData, width, height, canvas } = await renderPageImageData(
        pdfjsDoc,
        pageNumber,
        renderScale,
        true,
      );

      if (isMeesho) {
        await cropMeeshoPage(
          outDoc,
          pdfPage,
          imageData,
          width,
          height,
          canvas,
          output,
        );
      } else {
        await cropFlipkartPage(
          outDoc,
          pdfPage,
          imageData,
          width,
          height,
          canvas,
          resolvedPlatform,
          output,
        );
      }
      canvas.width = 0;
      canvas.height = 0;
    }

    const outBytes = await outDoc.save();
    const blob = new Blob([outBytes], { type: "application/pdf" });
    const suffix =
      output.id === "original" ? "cropped-labels" : `labels-${output.id}`;
    triggerDownload(blob, `${baseName(file.name)}-${suffix}.pdf`);
    toast.success(
      `Cropped ${pageCount} label${pageCount === 1 ? "" : "s"} · ${output.label}`,
    );
    return true;
  } catch (error) {
    console.error("Label crop error:", error);
    const msg = String(error?.message || "");
    if (/password|encrypted/i.test(msg)) {
      toast.error("This PDF is password-protected. Unlock it first.");
    } else {
      toast.error("Could not crop labels from this PDF.");
    }
    return false;
  }
}
