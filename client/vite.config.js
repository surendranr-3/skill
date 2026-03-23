import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // 🚨 This plugin handles everything (Buffer, process, global)
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
  ],
  // 🚨 REMOVED the 'define' block to prevent conflicts
  resolve: {
    alias: {
      // Force simple-peer to use the browser-compatible build
      'simple-peer': 'simple-peer/simplepeer.min.js',
    },
  },
})
