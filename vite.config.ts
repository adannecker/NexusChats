/**
 * Builds the Manifest V3 content script and lets Vite copy public assets into
 * the extension-ready dist directory.
 */
import { resolve } from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  build: {
    emptyOutDir: true,
    sourcemap: true,
    target: "chrome114",
    rollupOptions: {
      input: {
        background: resolve(__dirname, "src/background/index.ts"),
        content: resolve(__dirname, "src/content/index.ts"),
        options: resolve(__dirname, "src/options/index.ts")
      },
      output: {
        assetFileNames: "assets/[name][extname]",
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name].js"
      }
    }
  },
  test: {
    include: ["tests/**/*.test.ts"]
  }
});
