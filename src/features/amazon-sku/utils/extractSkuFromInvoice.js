import '../../../lib/pdf/worker.js';

/**
 * Reusable function to extract SKU text from product description.
 *
 * Looks for content enclosed in parentheses: e.g. "( floral perfume )" -> "floral perfume".
 * Preserves SKU characters and handles multiline / extra whitespace cleanly.
 *
 * @param {string} text - Product description or full invoice text
 * @returns {string|null} - Extracted SKU or null if not found
 */
export function extractSKUFromDescription(text) {
  if (!text || typeof text !== 'string') return null;

  // Find matches inside parentheses (...)
  // Handles multiline inside parentheses across line breaks
  const matches = text.match(/\(([^()]+)\)/g);
  if (!matches || matches.length === 0) {
    return null;
  }

  // Iterate over matches to find the candidate SKU
  // Filter out common non-SKU parentheses like (1), (qty: 1), (tax) if multiple exist
  for (let i = matches.length - 1; i >= 0; i--) {
    const raw = matches[i];
    const inner = raw.slice(1, -1).trim();
    if (!inner) continue;

    // Skip purely numeric quantity markers like "(1)" or "(2)" if there are other candidates
    if (/^\d+$/.test(inner) && matches.length > 1) continue;
    if (/^qty\b/i.test(inner) && matches.length > 1) continue;

    // Return the cleaned SKU string with normalized internal spaces
    return inner.replace(/\s+/g, ' ');
  }

  // Fallback: return the first non-empty inner match
  const firstInner = matches[0].slice(1, -1).trim();
  return firstInner ? firstInner.replace(/\s+/g, ' ') : null;
}

/**
 * Extract text from a specific PDF page using pdfjs-dist.
 *
 * @param {import('pdfjs-dist').PDFPageProxy} pdfPage
 * @returns {Promise<string>} - Extracted text string from page
 */
export async function extractTextFromInvoicePage(pdfPage) {
  if (!pdfPage) return '';

  try {
    const content = await pdfPage.getTextContent({ disableCombineTextItems: false });
    if (!content?.items?.length) return '';

    // Sort and join items by vertical baseline then horizontal position
    const lines = [];
    let currentY = null;
    let currentLine = [];

    for (const item of content.items) {
      const str = String(item.str || '');
      if (!str) continue;

      const y = Math.round(item.transform?.[5] ?? 0);
      if (currentY === null || Math.abs(currentY - y) > 3) {
        if (currentLine.length > 0) {
          lines.push(currentLine.join(' '));
        }
        currentY = y;
        currentLine = [str];
      } else {
        currentLine.push(str);
      }
    }

    if (currentLine.length > 0) {
      lines.push(currentLine.join(' '));
    }

    return lines.join('\n');
  } catch (error) {
    console.error('Failed to extract text from invoice page:', error);
    return '';
  }
}

/**
 * Extract item quantity from invoice text.
 *
 * @param {string} text - Full invoice text
 * @returns {number} - Extracted quantity (defaults to 1 if not found)
 */
export function extractQtyFromInvoiceText(text) {
  if (!text) return 1;

  // Pattern 1: Look for table row format: [Currency] [Price] [Qty] [Currency] [Net Amount]
  // e.g. ₹270.48 1 ₹270.48
  const rowMatch = text.match(/(?:₹|Rs\.?|INR|\$|£|€)\s*[\d,.]+\s+(\d+)\s+(?:₹|Rs\.?|INR|\$|£|€)\s*[\d,.]+/i);
  if (rowMatch && rowMatch[1]) {
    const qty = parseInt(rowMatch[1], 10);
    if (!isNaN(qty) && qty > 0 && qty < 1000) {
      return qty;
    }
  }

  // Pattern 2: Look for "(Qty: 2)" or "(2)" if explicitly provided in description
  const qtyMatch = text.match(/\(Qty:\s*(\d+)\)/i);
  if (qtyMatch && qtyMatch[1]) {
    const qty = parseInt(qtyMatch[1], 10);
    if (!isNaN(qty) && qty > 0) return qty;
  }

  // Pattern 3: Look for "Qty : 2" or "Quantity : 2"
  const qtyWordMatch = text.match(/Qty\s*:\s*(\d+)|Quantity\s*:\s*(\d+)/i);
  if (qtyWordMatch) {
    const q = qtyWordMatch[1] || qtyWordMatch[2];
    const qty = parseInt(q, 10);
    if (!isNaN(qty) && qty > 0) return qty;
  }

  return 1; // Default to 1 if not found
}
