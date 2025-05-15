import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: 'src/content.ts',
      output: {
        format: 'iife', // ✅ Forces non-module output
        entryFileNames: 'content.js', // filename must match manifest
      }
    },
    outDir: 'dist',
    emptyOutDir: true,
  }
});
