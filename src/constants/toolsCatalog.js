export const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'crop', label: 'Crop & print' },
  { id: 'organize', label: 'Sort & pack' },
  { id: 'brand', label: 'Brand' },
];

export const ACCENT = {
  blue: { box: 'bg-blue-50', icon: 'text-blue-600', hover: 'group-hover:border-blue-200' },
  fuchsia: { box: 'bg-fuchsia-50', icon: 'text-fuchsia-600', hover: 'group-hover:border-fuchsia-200' },
  rose: { box: 'bg-rose-50', icon: 'text-rose-500', hover: 'group-hover:border-rose-200' },
  orange: { box: 'bg-orange-50', icon: 'text-orange-500', hover: 'group-hover:border-orange-200' },
  emerald: { box: 'bg-emerald-50', icon: 'text-emerald-600', hover: 'group-hover:border-emerald-200' },
  teal: { box: 'bg-teal-50', icon: 'text-teal-600', hover: 'group-hover:border-teal-200' },
  sky: { box: 'bg-sky-50', icon: 'text-sky-600', hover: 'group-hover:border-sky-200' },
  indigo: { box: 'bg-indigo-50', icon: 'text-indigo-600', hover: 'group-hover:border-indigo-200' },
  amber: { box: 'bg-amber-50', icon: 'text-amber-600', hover: 'group-hover:border-amber-200' },
};

export const TOOLS = [
  {
    id: 'label-crop',
    title: 'Label Crop',
    description:
      'Choose Flipkart or Meesho, then crop A4 shipping labels into 4×6 thermal printer PDFs.',
    to: '/label-crop',
    category: 'crop',
    available: true,
    accent: 'rose',
    icon: 'labelCrop',
  },
  {
    id: 'meesho-sort',
    title: 'Sort Meesho Labels',
    description:
      'Upload Meesho label PDFs, sort by SKU then courier, crop, and download one print-ready PDF.',
    to: '/meesho-sort',
    category: 'organize',
    available: true,
    accent: 'orange',
    icon: 'meeshoSort',
  },
  {
    id: 'amazon-sku',
    title: 'Amazon SKU Injector',
    description:
      'Extract SKUs from Amazon order invoices and inject SKU tags onto corresponding shipping labels.',
    to: '/amazon-sku',
    category: 'organize',
    available: true,
    accent: 'amber',
    icon: 'amazonSku',
  },
  {
    id: 'add-logo',
    title: 'Add Logo to PDF',
    description:
      'Upload a PDF and a logo — place it in the bottom white space on every page.',
    to: '/add-logo',
    category: 'brand',
    available: true,
    accent: 'indigo',
    icon: 'addLogo',
  },
];
