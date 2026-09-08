import { meeshoTextLines } from '../../label-crop/utils/detectLabel';

/** Common Meesho / Indian marketplace couriers (longer names first). */
export const MEESHO_COURIERS = [
  'Ecom Express',
  'Blue Dart',
  'Xpress Bees',
  'Xpressbees',
  'Shadowfax',
  'Delhivery',
  'Bluedart',
  'India Post',
  'Loadshare',
  'Shiprocket',
  'Shadow Fax',
  'DTDC',
  'Ekart',
  'Valmo',
  'ATS',
];

const COURIER_ALIASES = {
  bluedart: 'Blue Dart',
  'blue dart': 'Blue Dart',
  xpressbees: 'Xpressbees',
  'xpress bees': 'Xpressbees',
  'shadow fax': 'Shadowfax',
  'ecom express': 'Ecom Express',
  'india post': 'India Post',
};

/**
 * Normalize courier display name.
 */
export function normalizeCourier(name) {
  if (!name) return 'Unknown';
  const key = String(name).trim().toLowerCase().replace(/\s+/g, ' ');
  if (COURIER_ALIASES[key]) return COURIER_ALIASES[key];
  const hit = MEESHO_COURIERS.find((c) => c.toLowerCase() === key);
  return hit || String(name).trim();
}

/**
 * Extract SKU from Meesho Product Details text lines.
 */
export function extractSkuFromLines(lines) {
  if (!lines?.length) return null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].line || '';

    // "SKU: Versage Forever" or "SKU Versage Forever"
    const inline = line.match(/\bSKU\b\s*[:\-–]?\s*(.+)$/i);
    if (inline) {
      let value = inline[1].trim();
      // Strip trailing column headers if glued on same line
      value = value
        .replace(/\bSize\b.*$/i, '')
        .replace(/\bQty\b.*$/i, '')
        .replace(/\bColor\b.*$/i, '')
        .replace(/\bOrder\s*No\.?\b.*$/i, '')
        .trim();
      if (value && !/^size$/i.test(value) && !/^qty$/i.test(value)) {
        return value;
      }
    }

    // Header row "SKU Size Qty Color Order No." → value on next line(s)
    if (/\bSKU\b/i.test(line) && /\bSize\b/i.test(line)) {
      for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
        const next = (lines[j].line || '').trim();
        if (!next) continue;
        if (/product\s*details|tax\s*invoice|bill\s*to|sold\s*by/i.test(next)) break;
        if (/^\bSKU\b/i.test(next)) continue;

        // First cell of the data row (SKU column)
        const parts = next.split(/\s{2,}|\t+/).map((p) => p.trim()).filter(Boolean);
        if (parts.length >= 1) {
          // If single spaced line: "Versage Forever Free Size 1 NA 3173..."
          // Take tokens until Size / Free Size / Qty-like number pattern
          const tokens = next.split(/\s+/);
          const skuTokens = [];
          for (let t = 0; t < tokens.length; t++) {
            const tok = tokens[t];
            if (/^(free\s*)?size$/i.test(tok) || /^size$/i.test(tok)) break;
            if (/^(qty|quantity|color|na)$/i.test(tok)) break;
            if (/^\d+$/.test(tok) && skuTokens.length > 0) break;
            if (/^\d{10,}/.test(tok)) break; // order no.
            skuTokens.push(tok);
          }
          const sku = (parts.length >= 3 ? parts[0] : skuTokens.join(' ')).trim();
          if (sku) return sku;
        }
      }
    }
  }

  // Fallback: line after "Product Details"
  const pdIdx = lines.findIndex((r) => /product\s*details/i.test(r.line || ''));
  if (pdIdx >= 0) {
    for (let j = pdIdx + 1; j < Math.min(pdIdx + 6, lines.length); j++) {
      const next = (lines[j].line || '').trim();
      if (!next || /\bSKU\b|\bSize\b|tax\s*invoice/i.test(next)) continue;
      const tokens = next.split(/\s+/);
      const skuTokens = [];
      for (const tok of tokens) {
        if (/^(free)?size$/i.test(tok) || /^(qty|color|na)$/i.test(tok)) break;
        if (/^\d+$/.test(tok) && skuTokens.length) break;
        skuTokens.push(tok);
      }
      if (skuTokens.length) return skuTokens.join(' ');
    }
  }

  return null;
}

/**
 * Extract shipping / courier company from Meesho label lines.
 * Prefers matches in the upper shipping-label band.
 */
export function extractCourierFromLines(lines, pageH) {
  if (!lines?.length) return null;

  const upperLimit = pageH * 0.55;
  let best = null;
  let bestScore = -Infinity;

  for (const row of lines) {
    const line = row.line || '';
    if (!line) continue;
    const inUpper = row.top <= upperLimit;

    for (const courier of MEESHO_COURIERS) {
      const re = new RegExp(`\\b${courier.replace(/\s+/g, '\\s+')}\\b`, 'i');
      if (!re.test(line)) continue;
      // Prefer upper-band + longer courier name
      const score = (inUpper ? 1000 : 0) + courier.length;
      if (score > bestScore) {
        bestScore = score;
        best = courier;
      }
    }
  }

  return best ? normalizeCourier(best) : null;
}

/**
 * Read SKU + shipping company from one pdf.js page (Meesho label).
 */
export async function extractMeeshoPageMeta(pdfPage) {
  const viewport = pdfPage.getViewport({ scale: 1 });
  const pageH = viewport.height;
  const content = await pdfPage.getTextContent({ disableCombineTextItems: false });
  const lines = meeshoTextLines(content.items, pageH);

  const sku = extractSkuFromLines(lines);
  const courier = extractCourierFromLines(lines, pageH);

  return {
    sku: sku || 'Unknown SKU',
    courier: courier || 'Unknown',
    lines,
  };
}
