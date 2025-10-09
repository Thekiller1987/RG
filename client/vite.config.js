import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // CORRECCIÓN CRÍTICA: Usa rutas relativas para el CSS/JS
  base: './', 
  
  build: {
    // Coincide con publish = "dist" en netlify.toml
    outDir: 'dist', 
  }
})