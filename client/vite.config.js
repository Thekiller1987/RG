import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // CRÍTICO: Usa rutas relativas (./) para que el CSS/JS cargue bien en Netlify.
  base: './', 
  
  build: {
    // Coincide con 'publish = "dist"' en netlify.toml
    outDir: 'dist', 
  }
})