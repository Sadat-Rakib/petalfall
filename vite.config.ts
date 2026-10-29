import { defineConfig } from "vite";
import { resolve } from "node:path";

// Relative asset paths, so the built site works from any folder: Cloudflare Pages at the
// root, or GitHub Pages under /<repo>/. Two pages: the app itself, and the embed builder.
export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: { main: resolve(__dirname, "index.html"), embed: resolve(__dirname, "embed.html") },
    },
  },
});
