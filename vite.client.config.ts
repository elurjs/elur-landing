import { defineConfig } from "vite";

export default defineConfig({
  publicDir: false,
  build: {
    outDir: "dist/_elur",
    emptyOutDir: false,
    rollupOptions: {
      input: {
        "entry-client": ".elur/entry-client.ts",
        router: ".elur/router.ts",
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name]-[hash].js",
        assetFileNames: "[name]-[hash][extname]",
      },
    },
  },
});
