import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import toast from 'react-hot-toast';
import '../../../lib/pdf/worker';
import { pdfjs } from 'react-pdf';
import { extractSKUFromDescription, extractTextFromInvoicePage, extractQtyFromInvoiceText } from './extractSkuFromInvoice';

/**
 * Trigger file download in browser.
 */
function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Presets for positioning the SKU box in clean white areas of Amazon shipping labels.
 */
export const SKU_POSITIONS = {
  aboveStationBox: {
    id: 'aboveStationBox',
    label: 'Above Station Box (Recommended)',
    hint: 'Places SKU higher in clean space well above STVT/MHYD/HYBO routing box',
    getCoords: (width, height) => ({
      x: 60,
      y: Math.round(Math.max(155, height * 0.18)),
    }),
  },
  topRight: {
    id: 'topRight',
    label: 'Top Right Margin',
    hint: 'Places SKU in clean top-right corner margin',
    getCoords: (width, height) => ({
      x: Math.round(width * 0.55),
      y: Math.round(height - 45),
    }),
  },
  custom: {
    id: 'custom',
    label: 'Custom Position',
    hint: 'Manually specify X and Y offset in points',
    getCoords: (width, height, customX, customY) => ({
      x: customX !== undefined ? Number(customX) : 60,
      y: customY !== undefined ? Number(customY) : 155,
    }),
  },
};

/**
 * Add extracted SKU text to the blank white area of a shipping label page.
 *
 * @param {import('pdf-lib').PDFPage} page - Shipping label page (PDFPage)
 * @param {string} skuText - Text string to draw (e.g., "SKU: floral perfume")
 * @param {import('pdf-lib').PDFFont} font - Loaded PDF font
 * @param {Object} [options]
 * @param {string} [options.positionId] - Preset ID ('aboveStationBox', 'centerWhite', 'rightAboveCarrier', 'topRight', 'custom')
 * @param {number} [options.customX] - Custom X coordinate in points
 * @param {number} [options.customY] - Custom Y coordinate in points
 * @param {number} [options.fontSize] - Font size in points
 */
export function addSKUToShippingLabel(page, skuText, font, options = {}) {
  if (!page || !skuText) return;

  const { width, height } = page.getSize();
  const fontSize = options.fontSize || 11;

  const positionId = options.positionId || 'aboveStationBox';
  const positionConfig = SKU_POSITIONS[positionId] || SKU_POSITIONS.aboveStationBox;

  let { x, y } = positionConfig.getCoords(width, height, options.customX, options.customY);

  if (options.x !== undefined) x = Number(options.x);
  if (options.y !== undefined) y = Number(options.y);

  const textWidth = font ? font.widthOfTextAtSize(skuText, fontSize) : skuText.length * fontSize * 0.55;
  const textHeight = fontSize + 4;

  // Draw solid white backing box to cover background lines and ensure maximum readability
  page.drawRectangle({
    x: x - 4,
    y: y - 2,
    width: textWidth + 8,
    height: textHeight,
    color: rgb(1, 1, 1),
    opacity: 1.0,
  });

  // Draw clean border outline around SKU box
  page.drawRectangle({
    x: x - 4,
    y: y - 2,
    width: textWidth + 8,
    height: textHeight,
    borderColor: rgb(0.15, 0.15, 0.15),
    borderWidth: 0.9,
    opacity: 0.9,
  });

  // Draw SKU text in bold dark color
  page.drawText(skuText, {
    x,
    y: y + 2,
    size: fontSize,
    font,
    color: rgb(0.05, 0.05, 0.05),
  });
}

/**
 * Read text from all even invoice pages and generate page pair summary data.
 *
 * @param {File} file
 * @returns {Promise<Array<{ orderIndex: number, labelPageNum: number, invoicePageNum: number, sku: string|null, fullText: string }>>}
 */
export async function parseAmazonOrderPairs(file) {
  if (!file) return [];

  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfjsDoc = await pdfjs.getDocument({ data: arrayBuffer.slice(0) }).promise;
    const totalPages = pdfjsDoc.numPages;

    const rawPairs = [];
    const orderCount = Math.floor(totalPages / 2);

    for (let orderIdx = 0; orderIdx < orderCount; orderIdx++) {
      const labelPageNum = orderIdx * 2 + 1; // 1-based index (Odd: 1, 3, 5...)
      const invoicePageNum = orderIdx * 2 + 2; // 1-based index (Even: 2, 4, 6...)

      let sku = null;
      let qty = 1;
      let fullText = '';

      try {
        const invoicePage = await pdfjsDoc.getPage(invoicePageNum);
        fullText = await extractTextFromInvoicePage(invoicePage);
        sku = extractSKUFromDescription(fullText);
        qty = extractQtyFromInvoiceText(fullText);
      } catch (err) {
        console.warn(`Order #${orderIdx + 1}: Failed to extract invoice text from page ${invoicePageNum}`, err);
      }

      rawPairs.push({
        orderIndex: orderIdx + 1,
        labelPageNum,
        invoicePageNum,
        sku,
        qty,
        fullText,
      });
    }

    await pdfjsDoc.destroy?.();

    // Map each pair with exact item Qty
    return rawPairs.map((pair) => {
      return {
        ...pair,
        skuCount: pair.qty,
        displaySku: pair.sku ? `SKU: ${pair.sku} = ${pair.qty} Qty` : 'SKU: Not Found',
      };
    });
  } catch (error) {
    console.error('Error parsing Amazon order pairs:', error);
    toast.error('Failed to parse PDF pages.');
    return [];
  }
}

/**
 * Process Amazon Order PDF:
 * Pairs every Odd page (Shipping Label) with Even page (Invoice),
 * extracts SKU from invoice page, adds `SKU: <extractedSKU> = <count> order` to shipping label,
 * keeps invoice unchanged, and downloads processed PDF.
 *
 * @param {File} pdfFile
 * @param {Object} [options]
 * @param {boolean} [options.includeOrderCount=true]
 * @returns {Promise<boolean>}
 */
export async function processAmazonOrderPDF(pdfFile, options = {}) {
  if (!pdfFile) {
    toast.error('Please upload an Amazon order PDF file.');
    return false;
  }

  try {
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const totalPages = pdfDoc.getPageCount();

    if (totalPages < 2 || totalPages % 2 !== 0) {
      toast.error(`PDF must have an even number of pages (Label + Invoice pairs). Found ${totalPages} pages.`);
      return false;
    }

    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const pdfjsDoc = await pdfjs.getDocument({ data: arrayBuffer.slice(0) }).promise;

    let missingSkuCount = 0;
    const totalOrders = totalPages / 2;
    const extractedOrders = [];

    // First pass: extract all SKUs and Quantities from invoices
    for (let i = 0; i < totalPages; i += 2) {
      const invoicePageNum = i + 2;
      let sku = null;
      let qty = 1;
      try {
        const invoicePageProxy = await pdfjsDoc.getPage(invoicePageNum);
        const invoiceText = await extractTextFromInvoicePage(invoicePageProxy);
        sku = extractSKUFromDescription(invoiceText);
        qty = extractQtyFromInvoiceText(invoiceText);
      } catch (extractErr) {
        console.warn(`Page ${invoicePageNum}: Could not read invoice page`, extractErr);
      }

      extractedOrders.push({ sku, qty });
    }

    // Second pass: stamp shipping labels with SKU + Item Quantity
    for (let i = 0; i < totalPages; i += 2) {
      const orderIdx = i / 2;
      const shippingLabelPage = pdfDoc.getPage(i);
      const { sku, qty } = extractedOrders[orderIdx];

      let skuText = 'SKU: Not Found';
      if (sku) {
        const includeCount = options.includeOrderCount !== false;
        skuText = includeCount ? `SKU: ${sku} = ${qty} Qty` : `SKU: ${sku}`;
      } else {
        missingSkuCount++;
        console.warn(`Order #${orderIdx + 1} (Pages ${i + 1}-${i + 2}): SKU not found in invoice text.`);
      }

      addSKUToShippingLabel(shippingLabelPage, skuText, font, options);
    }

    await pdfjsDoc.destroy?.();

    // Group and sort the label pages by SKU
    const labelData = [];
    for (let orderIdx = 0; orderIdx < totalOrders; orderIdx++) {
      const sku = extractedOrders[orderIdx].sku;
      labelData.push({
        pageIndex: orderIdx * 2,
        skuStr: sku ? sku.trim().toLowerCase() : '\uFFFF', // missing SKUs at the end
      });
    }

    labelData.sort((a, b) => a.skuStr.localeCompare(b.skuStr));
    const sortedPageIndices = labelData.map((l) => l.pageIndex);

    // Create a new PDF with only the shipping labels, sorted by SKU
    const finalPdf = await PDFDocument.create();
    const copiedPages = await finalPdf.copyPages(pdfDoc, sortedPageIndices);
    for (const page of copiedPages) {
      finalPdf.addPage(page);
    }

    const outputBytes = await finalPdf.save();
    const blob = new Blob([outputBytes], { type: 'application/pdf' });
    const baseName = pdfFile.name.replace(/\.pdf$/i, '') || 'amazon-orders';
    triggerDownload(blob, `${baseName}-sku-injected.pdf`);

    if (missingSkuCount > 0) {
      toast.success(
        `PDF processed! ${totalOrders - missingSkuCount}/${totalOrders} SKUs injected (${missingSkuCount} marked Not Found).`,
        { duration: 5000 }
      );
    } else {
      toast.success(`Successfully injected SKUs into ${totalOrders} shipping label${totalOrders === 1 ? '' : 's'}!`);
    }

    return true;
  } catch (error) {
    console.error('Error processing Amazon PDF:', error);
    const msg = String(error?.message || '');
    if (/password|encrypt/i.test(msg)) {
      toast.error('This PDF is password protected. Unlock it first.');
    } else {
      toast.error('Failed to process Amazon order PDF.');
    }
    return false;
  }
}
