// Archivo: vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Configuración de la PWA — corregida para instalación confiable
const pwaConfig = {
    registerType: 'autoUpdate',
    includeAssets: ['favicon.ico', 'icons/*.png'],
    workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/api/, /^\/socket\.io/, /^\/uploads/],
        runtimeCaching: [
            {
                urlPattern: /^https:\/\/multirepuestosrg\.com\/api\/.*/i,
                handler: 'NetworkFirst',
                options: {
                    cacheName: 'api-cache',
                    expiration: { maxEntries: 50, maxAgeSeconds: 300 },
                    networkTimeoutSeconds: 10,
                }
            },
            {
                urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
                handler: 'CacheFirst',
                options: {
                    cacheName: 'image-cache',
                    expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
                }
            }
        ]
    },
    manifest: {
        name: 'MultirepuestosRG POS',
        short_name: 'RG POS',
        description: 'Sistema de Punto de Venta y Gestión de Inventario',
        theme_color: '#007bff',
        background_color: '#f0f2f5',
        display: 'standalone',
        orientation: 'any',
        scope: '/',
        start_url: '/',
        id: '/',
        lang: 'es',
        categories: ['business', 'productivity'],
        icons: [
            {
                src: 'icons/192x192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any'
            },
            {
                src: 'icons/192x192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable'
            },
            {
                src: 'icons/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any'
            },
            {
                src: 'icons/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable'
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

    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('jspdf') || id.includes('html2canvas')) {
                            return 'pdf-vendor';
                        }
                        if (id.includes('html5-qrcode')) {
                            return 'scanner-vendor';
                        }
                        return 'vendor';
                    }
                }
            }
        },
        chunkSizeWarningLimit: 2000
    }
});