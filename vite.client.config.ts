import { defineConfig } from "vite";

export default defineConfig({
  publicDir: false,
  build: {
    outDir: "dist/_elur",
    emptyOutDir: false,
    rollupOptions: {
      input: ".elur/entry-client.ts",
      output: {
        entryFileNames: "entry-client.js",
        chunkFileNames: "[name]-[hash].js",
        assetFileNames: "[name]-[hash][extname]",
      },
    },
  },
});
