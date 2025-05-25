import { defineConfig } from 'vite'

export default defineConfig({
  // Ensure public directory files are copied to dist
  publicDir: 'public',
  
  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  
  // Development server configuration
  server: {
    port: 5173,
    host: true
  }
})
