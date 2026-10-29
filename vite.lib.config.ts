import { defineConfig } from "vite";

// The npm package, as ES modules: `petalfall` (the API) and `petalfall/element` (<petalfall>).
// Not minified on purpose: the module you import is meant to be minified by your own bundler.
export default defineConfig({
  publicDir: false,
  build: {
    outDir: "lib",
    emptyOutDir: true,
    target: "es2020",
    minify: false,
    lib: { entry: { index: "src/index.ts", element: "src/element.ts" }, formats: ["es"] },
    rollupOptions: { output: { entryFileNames: "[name].js", chunkFileNames: "chunks/[name]-[hash].js" } },
  },
});
