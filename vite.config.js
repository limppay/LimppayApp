import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  build: {
    minify: 'esbuild',
    target: 'es2015',
    sourcemap: false,
  },
  plugins: [
    react(),
    viteCompression({ algorithm: 'brotliCompress' }),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'https://api.iugu.com/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
