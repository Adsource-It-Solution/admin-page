import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ Vercel-friendly config for React SPA
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',      
    assetsDir: 'assets',  
    sourcemap: false,     
  },
  server: {
    port: 5173,
    open: true,
  },
  preview: {
    port: 4173,
  },
  base: '/', 
})
