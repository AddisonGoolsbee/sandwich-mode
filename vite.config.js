import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      // Define each of your "entry" files
      input: {
        // this is your popup
        popup: path.resolve(__dirname, 'index.html'),
        // service worker
        background: path.resolve(__dirname, 'src/background.js'),
        // content script
        content: path.resolve(__dirname, 'src/content.js'),
      },
      output: {
        // emit them as <name>.js in dist root
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      }
    }
  }
}); 