# EcomCrop

Separate React app for **e-commerce / marketplace shipping-label tools** (domain: [ecomcrop.in](https://ecomcrop.in)). Originally forked from PDFCraft (`cropPDF`) with the same processing stack.

PDFCraft is unchanged. Seller tools were **not** removed from that project.

## Tools

| Tool | Route |
|------|--------|
| Label Crop (Flipkart & Meesho) | `/label-crop` |
| Sort Meesho Labels | `/meesho-sort` |
| Amazon SKU Injector | `/amazon-sku` |
| Add Logo to PDF | `/add-logo` |

All processing is client-side (`pdf-lib` + `pdfjs-dist` / `react-pdf`).

## Run locally

```bash
cd /Users/admin7/Documents/bhautik/labelcraft
npm install
npm run dev
```

Dev server: **http://localhost:5174** (PDFCraft can keep 5173).

## Stack

Vite + React 18 + Tailwind + React Router.
