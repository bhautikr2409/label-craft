import { SITE_NAME, SITE_URL, absoluteUrl } from "./site";

export { absoluteUrl };

export const TOOL_SEO = {
  "label-crop": {
    path: "/label-crop",
    title: `Label Crop PDF — Flipkart & Meesho Shipping Labels | ${SITE_NAME}`,
    description:
      "Auto-crop Flipkart or Meesho A4 shipping labels into 4×6 thermal printer PDFs. Free, private, browser-based label cropper.",
    keywords:
      "label crop, flipkart label crop, meesho label pdf, 4x6 shipping label, thermal printer pdf",
    h1: "Label Crop for shipping PDFs",
    eyebrow: "Label Crop Tool",
    intro:
      "Turn A4 marketplace shipping labels into clean 4×6 thermal-ready PDFs. Choose Flipkart or Meesho, upload your label PDF, and download printer-friendly pages.",
    related: ["meesho-sort", "add-logo", "amazon-sku"],
    sections: [
      {
        heading: "Built for Indian marketplace labels",
        paragraphs: [
          "Sellers often receive A4 PDFs that mix the shipping label with invoices. Label Crop detects the label region and exports pages sized for common 4×6 thermal printers — without uploading order data to a server.",
          "Choose Flipkart or Meesho before uploading so the crop preset matches that marketplace layout. Keep barcodes and addresses readable; invoice body content that thermal printers do not need can be removed.",
        ],
      },
      {
        heading: "Private packing workflow",
        paragraphs: [
          "Customer names and delivery addresses stay in your browser session. After download, send the PDF to your printer driver and close the tab when finished. Pair with Sort Meesho Labels when you need SKU order, or Add Logo to brand the bottom white space.",
        ],
      },
    ],
    faqs: [
      {
        q: "Which platforms are supported?",
        a: "Choose Flipkart or Meesho first, then upload your A4 label PDF. Each preset uses the crop rules for that marketplace.",
      },
      {
        q: "Is order data sent online?",
        a: "No. Label detection and cropping run in your browser only.",
      },
      {
        q: "What output size should I pick?",
        a: "Use 4×6 inch for most Indian thermal printers (100×150 mm). Choose 4×5 only if your sticker stock is that size, or “Cropped only” to keep the label aspect without resizing.",
      },
    ],
  },

  "meesho-sort": {
    path: "/meesho-sort",
    title: `Sort & Crop Meesho Labels by SKU | ${SITE_NAME}`,
    description:
      "Upload multiple Meesho shipping label PDFs. Sort pages by SKU then courier, crop like Label Crop, and download one thermal-ready PDF. Free and private in your browser.",
    keywords:
      "sort meesho labels, meesho sku sort, meesho label crop sort, arrange shipping labels by sku, meesho delhivery sort",
    h1: "Sort & crop Meesho labels",
    eyebrow: "Meesho Label Sort",
    intro:
      "Combine several Meesho label PDFs into one file: pages are ordered by SKU and shipping company, then cropped with the same Meesho rules as Label Crop (including 90° rotate for thermal print).",
    related: ["label-crop", "add-logo", "amazon-sku"],
    sections: [
      {
        heading: "Sort first, then crop",
        paragraphs: [
          `${SITE_NAME} reads the Product Details SKU and courier name from each page, sorts SKU → shipping company, then applies the Meesho label crop so invoice body and blank space are removed before download.`,
        ],
      },
      {
        heading: "Multiple files, one print-ready PDF",
        paragraphs: [
          "Upload as many Meesho label PDFs as you need. Every page is included, sorted, cropped, and saved locally in your browser.",
        ],
      },
    ],
    faqs: [
      {
        q: "How are pages ordered?",
        a: "First by SKU (A–Z), then by shipping company within each SKU. Same SKU + same courier pages stay together.",
      },
      {
        q: "Does this crop the labels?",
        a: "Yes. After sorting, each page is cropped with the same Meesho Label Crop path (top label only, then rotated for 4×6 when you choose that size).",
      },
      {
        q: "Which couriers are detected?",
        a: "Common Meesho partners such as Delhivery, Shadowfax, Xpressbees, Ecom Express, Blue Dart, DTDC, Ekart, and others. Unrecognized names are labeled Unknown.",
      },
    ],
  },

  "add-logo": {
    path: "/add-logo",
    title: `Add Logo to Meesho Label | ${SITE_NAME}`,
    description:
      "Add your shop logo to Meesho shipping label PDFs in the bottom white space. Meesho labels only — free and private in your browser.",
    keywords:
      "add logo to meesho label, meesho logo pdf, stamp logo on meesho shipping label, brand meesho label",
    h1: "Add Logo to Meesho Label",
    eyebrow: "Meesho Logo Tool",
    intro:
      "Upload a Meesho label PDF, then your logo. EcomCrop places the mark in the bottom white space on every page. Flipkart and Amazon files are rejected with an error.",
    related: ["label-crop", "meesho-sort", "amazon-sku"],
    sections: [
      {
        heading: "Built for Meesho labels",
        paragraphs: [
          "Meesho shipping and packing PDFs often leave a large white band at the bottom of the page. Use this tool to drop your shop brand into that space without covering addresses, barcodes, or invoice tables.",
          "Upload a PNG or JPEG with a transparent or solid background. Keep the logo modest in height so thermal print density stays sharp. The same placement is applied on every page for a consistent pack-out.",
        ],
      },
      {
        heading: "Works with cropped Meesho PDFs",
        paragraphs: [
          "Many sellers run Label Crop or Sort Meesho Labels first, then Add Logo on the Meesho result. Because every step is client-side, order data never leaves the device between tools.",
        ],
      },
    ],
    faqs: [
      {
        q: "Does this work with Flipkart or Amazon labels?",
        a: "No. This tool accepts Meesho labels only. Non-Meesho PDFs show an error. Use Label Crop for Flipkart/Meesho cropping, or Amazon SKU Injector for Amazon.",
      },
      {
        q: "Does the logo appear on every page?",
        a: "Yes. The same logo is placed in the same relative bottom position on all pages of the PDF.",
      },
      {
        q: "What image formats are supported?",
        a: "JPG, PNG, and WEBP. Processing stays in your browser — files are not uploaded to a server.",
      },
      {
        q: "Will the logo cover barcodes?",
        a: "EcomCrop places the logo in the detected bottom white band and keeps aspect ratio. Always preview a printed sample before a full run.",
      },
    ],
  },

  "amazon-sku": {
    path: "/amazon-sku",
    title: `Amazon Shipping Label SKU Injector — Free Online Tool | ${SITE_NAME}`,
    description:
      "Upload Amazon order PDFs (Label + Invoice pairs). Automatically extract product SKUs from invoices and inject SKU tags onto shipping labels in your browser.",
    keywords:
      "amazon sku injector, amazon shipping label sku, amazon order batch pdf, amazon seller pdf tools, inject sku on amazon label",
    h1: "Amazon Shipping Label SKU Injector",
    eyebrow: "Amazon Seller Tool",
    intro:
      "Extract product SKUs from Amazon invoice pages and automatically print SKU tags onto the blank space of corresponding shipping labels.",
    related: ["meesho-sort", "label-crop", "add-logo"],
    sections: [
      {
        heading: "Automate Amazon Shipping Label SKU Tagging",
        paragraphs: [
          "Amazon seller batch exports often combine a Shipping Label page and an Invoice page for every order. Packing orders efficiently requires workers to identify the product SKU directly on the shipping label without turning the page.",
          `${SITE_NAME} automatically parses every 2-page Amazon order pair, extracts the SKU enclosed in parentheses inside the invoice product description, and injects "<your_sku> = <qty> Qty" onto the shipping label.`,
        ],
      },
      {
        heading: "How it works",
        paragraphs: [
          "Upload your Amazon multi-order PDF. The tool validates page pairing (Page 1 = Label, Page 2 = Invoice, Page 3 = Label, Page 4 = Invoice). It extracts the SKU from the invoice and stamps the label page without altering invoice data or covering barcodes.",
          "The entire process runs 100% locally in your web browser. No document data is uploaded or stored on external servers.",
        ],
      },
    ],
    faqs: [
      {
        q: "How does SKU extraction work?",
        a: 'The tool extracts text from the invoice page and looks for the product SKU enclosed inside parentheses (e.g., "( floral perfume )").',
      },
      {
        q: "Does it change the invoice page?",
        a: "No. Invoice pages are preserved in their exact original form.",
      },
      {
        q: "Is my seller PDF private?",
        a: "Yes. All parsing and PDF generation happen locally in your browser memory.",
      },
    ],
  },
};

export const STATIC_SEO = {
  home: {
    path: "/",
    title: `${SITE_NAME} — Marketplace Shipping Label Tools (No Upload)`,
    description: `${SITE_NAME}: crop Flipkart & Meesho labels, sort Meesho by SKU, inject Amazon SKUs, and add logos — privately in your browser.`,
    keywords:
      "shipping label crop, meesho label, flipkart label, amazon sku, thermal printer pdf",
  },
  tools: {
    path: "/tools",
    title: `All Seller Label Tools | ${SITE_NAME}`,
    description:
      "Browse every EcomCrop tool: Label Crop, Sort Meesho Labels, Amazon SKU Injector, and Add Logo. Free and private in your browser.",
    keywords: "seller label tools, meesho flipkart amazon labels",
  },
  about: {
    path: "/about",
    title: `About ${SITE_NAME} — Privacy-First Label Toolkit`,
    description:
      "Learn why EcomCrop processes shipping labels in your browser, never on a server.",
    keywords: "about ecomcrop, private shipping label tools",
  },
  contact: {
    path: "/contact",
    title: `Contact ${SITE_NAME} — Support & Feedback`,
    description: `Contact the EcomCrop team for support or feedback. We reply by email.`,
    keywords: "contact ecomcrop, seller label tools support",
  },
  privacy: {
    path: "/privacy",
    title: `Privacy Policy | ${SITE_NAME}`,
    description:
      "EcomCrop privacy policy: shipping label PDFs are processed locally. Learn how cookies work on our site.",
    keywords: "ecomcrop privacy policy",
  },
  terms: {
    path: "/terms",
    title: `Terms of Service | ${SITE_NAME}`,
    description: `Terms of use for ${SITE_NAME} free browser-based shipping label tools.`,
    keywords: "ecomcrop terms of service",
  },
  guide: {
    path: "/guide",
    title: `Seller Label Help Guide — How to Use ${SITE_NAME}`,
    description:
      "Step-by-step guides for Flipkart/Meesho label crop, Meesho SKU sort, Amazon SKU injection, shop logos, and thermal packing tips.",
    keywords:
      "meesho label guide, flipkart label crop, amazon sku injector help, ecomcrop guides",
  },
  blog: {
    path: "/blog",
    title: `Seller Blog - Packing & Label Tips | ${SITE_NAME}`,
    description:
      "EcomCrop blog for marketplace sellers: 4x6 thermal print settings, private label workflows, and Flipkart / Meesho / Amazon packing tips.",
    keywords:
      "seller packing blog, thermal label tips, flipkart meesho amazon shipping labels, ecomcrop blog",
  },
  notFound: {
    path: "/404",
    title: `Page Not Found | ${SITE_NAME}`,
    description:
      "The page you requested does not exist. Browse seller label tools on EcomCrop.",
    keywords: "404",
    noIndex: true,
  },
};

export function getToolSeo(toolId) {
  return TOOL_SEO[toolId] || null;
}
