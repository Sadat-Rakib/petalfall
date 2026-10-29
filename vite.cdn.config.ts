import { defineConfig } from "vite";

// The <script> tag build: one minified file that registers <petalfall> and sets window.Petalfall.
export default defineConfig({
  publicDir: false,
  build: {
    outDir: "lib",
    emptyOutDir: false, // keep the ES build next to it
    target: "es2020",
    lib: { entry: "src/cdn.ts", name: "Petalfall", formats: ["iife"], fileName: () => "petalfall.iife.js" },
  },
});
