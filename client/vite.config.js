import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa' // 👈 Importar el plugin PWA

// Configuración de la PWA
const pwaConfig = {
    // 1. Service Worker: Registra y actualiza automáticamente el worker
    registerType: 'autoUpdate', 
    workbox: {
        // Archivos a cachear para el modo offline
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'], 
    },
    // 2. Definición del Manifiesto (lo que se generará en manifest.webmanifest)
    manifest: {
        name: 'MultirepuestosRG POS',
        short_name: 'RG POS',
        description: 'Sistema de Punto de Venta y Gestión de Inventario',
        theme_color: '#007bff', 
        background_color: '#f0f2f5',
        display: 'standalone', // Crucial para que se pueda instalar
        start_url: '/',
        icons: [
            // DEBES CREAR ESTOS ARCHIVOS EN public/icons/
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
    VitePWA(pwaConfig) // 👈 Añadir el plugin PWA configurado
  ],
  
  // 👇 CORRECCIÓN AÑADIDA PARA RESOLVER EL ERROR DE ROLLUP
  build: {
    rollupOptions: {
      external: [
        'react-toastify', // Forzamos a Rollup a ignorar la resolución de esta dependencia
      ],
    },
  },
  // 👆 FIN DE LA CORRECCIÓN
});