import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // =========================================================================
  // CORRECCIÓN CRÍTICA: La propiedad 'base' resuelve problemas de carga de CSS/JS en Netlify.
  // Usar './' fuerza a Vite a generar rutas relativas.
  // =========================================================================
  base: './', 
  
  build: {
    // Aseguramos que la carpeta de salida coincida con netlify.toml (publish = "dist")
    outDir: 'dist',
  }
})