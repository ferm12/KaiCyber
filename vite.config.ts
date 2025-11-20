import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    chunkSizeWarningLimit: 1000,
    outDir: 'dist',
    assetsDir: 'assets',
  },
  // Base path for deployment (empty for root, or '/repo-name/' for GitHub Pages)
  base: process.env.BASE_PATH || '/',
})

