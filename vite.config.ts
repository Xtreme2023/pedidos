import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [react(), cloudflare()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@app': path.resolve(__dirname, './src/app'),
      '@entities': path.resolve(__dirname, './src/entities'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@portals': path.resolve(__dirname, './src/portals'),
      '@admin': path.resolve(__dirname, './src/portals/admin'),
      '@client': path.resolve(__dirname, './src/portals/client'),
      '@restaurant': path.resolve(__dirname, './src/portals/restaurant'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})