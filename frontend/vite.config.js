import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Proxying /api keeps the browser same-origin in development, so CORS never
// enters the picture locally. In production set VITE_API_BASE_URL instead.
export default defineConfig({
  // '/' suits a user site (jpbaldorado.github.io). A project site is served
  // from a subpath, so its build needs VITE_BASE_PATH='/<repo-name>/' or every
  // asset URL resolves one level too high and the page loads blank.
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
});
