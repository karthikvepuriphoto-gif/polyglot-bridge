import { copyFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

const BASE = '/polyglot-bridge/';

export default defineConfig({
  base: BASE,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'pwa-192.png', 'pwa-512.png'],
      manifest: {
        name: 'Polyglot Bridge',
        short_name: 'Polyglot Bridge',
        description: 'Spanish and German through the English words you already know.',
        theme_color: '#0f766e',
        background_color: '#e7eef1',
        display: 'standalone',
        start_url: BASE,
        scope: BASE,
        lang: 'en',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2,woff,ico}'],
        navigateFallback: `${BASE}index.html`,
      },
    }),
    {
      name: 'github-pages-spa',
      apply: 'build',
      closeBundle() {
        const dist = resolve('dist');
        copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'));
        writeFileSync(resolve(dist, '.nojekyll'), '');
      },
    },
  ],
});
