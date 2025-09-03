import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import removeConsole from 'vite-plugin-remove-console'

export default defineConfig({
  plugins: [
    tailwindcss(),
    // Remove console logs in production build
    removeConsole({
      includes: ['log', 'warn', 'debug', 'info'],
    }),
  ],
  build: {
    outDir: 'dist',
    sourcemap: false, // Set to true if you want source maps in production
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          router: ['@tanstack/react-router'],
          motion: ['framer-motion']
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true
  },
  preview: {
    port: 4173,
    host: true
  }
})