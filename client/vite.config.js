// Archivo: vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Configuración de la PWA (sin cambios)
const pwaConfig = {
    registerType: 'autoUpdate', 
    workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'], 
    },
    manifest: {
        name: 'MultirepuestosRG POS',
        short_name: 'RG POS',
        description: 'Sistema de Punto de Venta y Gestión de Inventario',
        theme_color: '#007bff', 
        background_color: '#f0f2f5',
        display: 'standalone', 
        start_url: '/',
        icons: [
            {
                src: 'icons/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: 'icons/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            }
        ]
    }
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA(pwaConfig)
  ],
  
  // 🛑 SOLUCIÓN CLAVE para 'react-toastify'
  optimizeDeps: {
    // Asegura que Vite pre-optimice y resuelva react-toastify
    include: ['react-toastify'], 
  },
  build: {
    commonjsOptions: {
      // Indica a Rollup cómo interpretar los módulos CommonJS dentro de la dependencia
      include: [/node_modules/],
    },
    // Opcional: Puede ayudar a resolver el problema del chunk
    rollupOptions: {
      external: ['react-toastify/dist/ReactToastify.css'] // Solo el CSS, si el problema era el CSS
    }
  }
});