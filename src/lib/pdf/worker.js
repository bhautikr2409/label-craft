import { pdfjs } from 'react-pdf';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Must match the pdfjs version bundled with react-pdf (4.8.69).
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
