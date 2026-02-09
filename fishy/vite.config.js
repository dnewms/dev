import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'fish-192.png', 'fish-512.png'],
      manifest: {
        name: 'isFishy - Scam Detector',
        short_name: 'isFishy',
        description: 'Your friendly scam detection assistant. Paste suspicious messages and find out if something is fishy!',
        theme_color: '#1A5276',
        background_color: '#E3F2FD',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        categories: ['utilities', 'security'],
        icons: [
          {
            src: 'fish-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'fish-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
});
