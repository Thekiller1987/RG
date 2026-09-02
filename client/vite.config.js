// Archivo: vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react()
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