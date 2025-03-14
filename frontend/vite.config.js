import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';


export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // Change caching directory to avoid permission issues
  cacheDir: '/tmp/vite-cache',
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  // Update optimizeDeps configuration with more specific temp directory settings
  optimizeDeps: {
    // Use tmp directory for dependencies caching
    cacheDir: '/tmp/vite-deps-cache',
    // Set the temp directory for dependency optimization
    tempDir: '/tmp/vite-deps-temp'
  },
  // Add server configuration for temporary files
  server: {
    fs: {
      // Allow serving files from these directories
      allow: ['/tmp', path.resolve(__dirname)]
    },
    host: true,
    watch: {
      usePolling: true,
    },
    port: 4010,
  }
});
