import { SITE_NAME } from './site';

/**
 * Long-form packing guides for AdSense / SEO depth.
 * Paths must stay in sync with App routes and sitemap generator (path: '...' in STATIC_SEO + here).
 */
export const GUIDES = [
  {
    slug: 'crop-flipkart-meesho-labels-4x6',
    path: '/guides/crop-flipkart-meesho-labels-4x6',
    title: `How to Crop Flipkart & Meesho Labels for 4×6 Thermal Printers | ${SITE_NAME}`,
    description:
      'Step-by-step guide to turn A4 Flipkart and Meesho shipping label PDFs into clean 4×6 thermal stickers without uploading files.',
    keywords:
      'flipkart label crop, meesho 4x6 label, thermal printer shipping label, crop a4 label pdf',
    h1: 'How to crop Flipkart & Meesho labels for 4×6 thermal printers',
    updated: 'September 12, 2026',
    toolTo: '/label-crop',
    toolLabel: 'Open Label Crop',
    intro:
      'Most Flipkart and Meesho label downloads are A4 pages that mix the shipping sticker with a tax invoice. Thermal printers need a smaller 4×6 (100×150 mm) page. This guide explains a private, browser-only workflow on EcomCrop.',
    sections: [
      {
        heading: 'Why A4 marketplace labels need cropping',
        paragraphs: [
          'Seller portals often export one PDF page per order. The top half is the courier shipping label (address, barcode, AWB). The lower half is usually the tax invoice or product table. A 4×6 thermal roll cannot print that full A4 layout cleanly.',
          'If you send the raw A4 file to a thermal driver, barcodes may shrink, waste sticker length, or cut off. Cropping keeps only the shipping band and sizes it for common 4×6 printers used in Indian packing desks.',
        ],
      },
      {
        heading: 'Before you start',
        paragraphs: [
          'Download the official label PDF from Flipkart or Meesho for the orders you are packing today. Prefer the supplier / Sub Order Labels export for Meesho when available.',
          'Use a modern desktop Chrome or Edge browser if possible. Mobile browsers work for small files, but large multi-page PDFs are easier on a laptop. Keep the PDF under 25 MB for smooth in-browser processing.',
        ],
      },
      {
        heading: 'Step-by-step on EcomCrop Label Crop',
        paragraphs: [
          'Open Label Crop on EcomCrop. Choose Flipkart or Meesho first so the crop rules match that layout. Then upload your A4 PDF — processing stays on your device.',
          'Pick 4×6 inch (thermal) as the output size unless your rolls are 4×5. Click Crop & Download. Review the first few pages: the barcode and address should be fully visible, and the invoice body should be gone.',
          'Send the downloaded PDF to your thermal printer driver. If a barcode fails to scan, reprint at 100% scale (no “fit to page”) and check that the sticker stock matches 4×6.',
        ],
      },
      {
        heading: 'Flipkart vs Meesho differences',
        paragraphs: [
          'Flipkart labels are often a centered box with a dark border on the upper part of the page. EcomCrop trims to that border and removes the tax invoice below.',
          'Meesho labels usually span most of the page width and include Product Details above the invoice. After cropping, Meesho pages are rotated so they print correctly on portrait 4×6 stock.',
        ],
      },
      {
        heading: 'Privacy tip for packing teams',
        paragraphs: [
          'Customer addresses never need to leave the packing laptop. Because EcomCrop runs in the browser, you can process labels offline after the page loads, then close the tab when the shift ends. Do not email raw A4 label packs to shared inboxes if you can avoid it.',
        ],
      },
    ],
  },
  {
    slug: 'sort-meesho-labels-by-sku',
    path: '/guides/sort-meesho-labels-by-sku',
    title: `How to Sort Meesho Shipping Labels by SKU for Faster Packing | ${SITE_NAME}`,
    description:
      'Learn how to combine Meesho label PDFs, sort pages by SKU and courier, crop for thermal print, and pack faster — privately in your browser.',
    keywords:
      'sort meesho labels, meesho sku packing, meesho delhivery sort, arrange meesho labels',
    h1: 'How to sort Meesho shipping labels by SKU',
    updated: 'September 12, 2026',
    toolTo: '/meesho-sort',
    toolLabel: 'Open Sort Meesho Labels',
    intro:
      'When you pick orders by product, printing Meesho labels in portal download order wastes time. Sorting by SKU (then courier) lets packers pull one SKU at a time. EcomCrop can sort and crop in one pass without uploading files.',
    sections: [
      {
        heading: 'The packing problem',
        paragraphs: [
          'Meesho often gives you one or more PDFs with mixed SKUs across pages. If you print in that order, workers jump between bins. A SKU-first sequence matches how many small warehouses actually pick inventory.',
          'Sorting by hand in Acrobat is slow. Cloud “PDF organizers” ask you to upload buyer addresses. A local sort + crop tool keeps the workflow on the packing PC.',
        ],
      },
      {
        heading: 'What EcomCrop reads from each page',
        paragraphs: [
          'For each Meesho page, the tool looks for Product Details SKU text and common courier names (Delhivery, Shadowfax, Xpressbees, Ecom Express, Blue Dart, DTDC, Ekart, and others). Pages are ordered A–Z by SKU, then by courier within the same SKU.',
          'If a page has no readable SKU, it is grouped as Unknown SKU so you can still print and fix that order manually. Always skim the on-screen summary after a run.',
        ],
      },
      {
        heading: 'How to run Sort Meesho Labels',
        paragraphs: [
          'Open Sort Meesho Labels. Upload one or more Meesho label PDFs (multi-select is supported). Choose 4×6 if you print thermal stickers.',
          'Click Sort, Crop & Download. EcomCrop reads every page, sorts, applies the same Meesho crop used in Label Crop (including rotation for thermal), and downloads one combined PDF.',
          'Print the file and pack in order: finish all pages for SKU A before SKU B. Within a SKU, same-courier pages stay together for bagging.',
        ],
      },
      {
        heading: 'Tips for accurate SKU text',
        paragraphs: [
          'Use official Meesho label exports rather than scanned printouts. Scanned images have little selectable text, so SKU detection will fail.',
          'If many pages show Unknown SKU, try Label Crop alone on a sample page first to confirm the PDF is a normal Meesho layout. You can also split a huge export into smaller batches under 25 MB each.',
        ],
      },
    ],
  },
  {
    slug: 'amazon-shipping-label-sku',
    path: '/guides/amazon-shipping-label-sku',
    title: `How to Put Product SKUs on Amazon Shipping Labels | ${SITE_NAME}`,
    description:
      'Amazon batch PDFs pair a shipping label with an invoice. Learn how to extract the SKU from the invoice and stamp it on the label for faster packing — in your browser.',
    keywords:
      'amazon shipping label sku, amazon invoice sku, inject sku on amazon label, amazon seller packing',
    h1: 'How to put product SKUs on Amazon shipping labels',
    updated: 'September 12, 2026',
    toolTo: '/amazon-sku',
    toolLabel: 'Open Amazon SKU Injector',
    intro:
      'Amazon seller batch PDFs usually alternate: odd pages are shipping labels, even pages are invoices. Packers need the SKU on the label face so they do not flip every page. EcomCrop’s Amazon SKU Injector automates that stamp locally.',
    sections: [
      {
        heading: 'Understand the page pairs',
        paragraphs: [
          'A valid Amazon order batch for this tool has an even page count: page 1 label + page 2 invoice, page 3 label + page 4 invoice, and so on. Odd page counts usually mean a missing invoice or an incomplete download — fix the export before processing.',
          'The invoice page typically includes the product title and a seller SKU in parentheses inside the description. That is the text packers want on the label.',
        ],
      },
      {
        heading: 'Using Amazon SKU Injector',
        paragraphs: [
          'Open Amazon SKU Injector and upload the multi-order PDF. EcomCrop validates even page count, then previews each pair with the extracted SKU tag.',
          'Choose where the SKU box should sit (above the station/routing area is a common default). Optionally include item quantity in the stamp. Download the processed PDF and check that barcodes are still clear.',
          'If a pair shows “SKU: Not Found”, open that invoice page and confirm the SKU is in parentheses or clearly labeled. You can still print; missing tags are marked so you can write them by hand.',
        ],
      },
      {
        heading: 'Privacy and packing desk hygiene',
        paragraphs: [
          'Amazon label packs include buyer PII. Prefer a dedicated packing laptop and clear the browser tab after the run. EcomCrop does not upload the PDF for SKU injection — the work stays in memory on your device.',
          'Do not share the stamped PDF on public chat channels. Treat it like the original Amazon export.',
        ],
      },
      {
        heading: 'After SKU stamping',
        paragraphs: [
          'Some teams print labels only; others keep the invoice page for returns. Follow your marketplace compliance needs. If you also brand packing slips, run Add Logo on a cropped or invoice PDF after you finish SKU injection.',
        ],
      },
    ],
  },
];

export function getGuideBySlug(slug) {
  return GUIDES.find((g) => g.slug === slug) || null;
}
