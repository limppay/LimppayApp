import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: 'terser',
    sourcemap: false,
  },
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'https://api.iugu.com/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Reescreve a URL
      },
    },
  },
})
