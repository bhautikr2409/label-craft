import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Expose GA_MEASUREMENT_ID (and VITE_*) to the client bundle.
  envPrefix: ['VITE_', 'GA_'],
  server: {
    port: 5174,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          pdf: ['react-pdf', 'pdfjs-dist'],
          pdflib: ['pdf-lib'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['pdfjs-dist'],
  },
});
