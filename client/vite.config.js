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
            external: ['react-toastify/dist/ReactToastify.css'],
            output: {
                entryFileNames: 'assets/[name].[hash].js',
                chunkFileNames: 'assets/[name].[hash].js',
                assetFileNames: 'assets/[name].[hash].[ext]',
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        // Separar React y React DOM para caché eficiente
                        if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
                            return 'react-vendor';
                        }
                        // Separar librerías de gráficos si son pesadas
                        if (id.includes('recharts') || id.includes('chart.js')) {
                            return 'charts-vendor';
                        }
                        // Separar iconos si son muchos
                        if (id.includes('react-icons')) {
                            return 'icons-vendor';
                        }
                        // Separar librerías pesadas específicas
                        if (id.includes('jspdf') || id.includes('html2canvas')) {
                            return 'pdf-vendor';
                        }
                        if (id.includes('html5-qrcode')) {
                            return 'scanner-vendor';
                        }
                        // Resto de node_modules en un chunk separado
                        return 'vendor';
                    }
                }
            }
        },
        chunkSizeWarningLimit: 1000 // Aumentar límite de advertencia a 1MB
    }
});