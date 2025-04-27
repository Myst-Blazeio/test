import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        content: 'src/content/contentScript.jsx',  // Your content script
        background: 'src/background/background.jsx', // Background
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'background') return 'background.js';
          if (chunkInfo.name === 'content') return 'content/contentScript.js';
          if (chunkInfo.name === 'popup') return 'popup.js';
          return '[name].js';
        }
      }
    },
    outDir: 'dist',
    emptyOutDir: true,
  }
});
