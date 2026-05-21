import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from '@unocss/vite'
import webExtension from 'vite-plugin-web-extension'

export default defineConfig({
  plugins: [
    UnoCSS({ presets: [] }),
    vue(),
    webExtension({
      manifest: './src/manifest.json',
      browser: process.env['BROWSER'] ?? 'chrome',
    }),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
