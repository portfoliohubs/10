/**
 * Vite config for GitHub Pages static build.
 * Does NOT require PORT or BASE_PATH env vars.
 * Outputs to dist-github/ which you can upload directly to GitHub Pages.
 *
 * Usage:
 *   pnpm --filter @workspace/portfoliohubs run build:github
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import type { PluginOption } from "vite";
import { writeFileSync, readFileSync } from "fs";

// Adjust this to match your GitHub repo name (the slug after github.io)
const GH_BASE = "/MICKY/";

// Plugin that fixes manifest.json and writes .nojekyll after build
function githubPagesPlugin(): PluginOption {
  return {
    name: "github-pages-postbuild",
    closeBundle() {
      const outDir = path.resolve(import.meta.dirname, "dist-github");

      // Fix manifest.json start_url and scope for the sub-path
      const manifestPath = path.join(outDir, "manifest.json");
      try {
        const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
        manifest.start_url = GH_BASE;
        manifest.scope     = GH_BASE;
        writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      } catch {}

      // Write .nojekyll so GitHub Pages skips Jekyll processing
      writeFileSync(path.join(outDir, ".nojekyll"), "");

      // Write a 404.html identical to index.html for extra SPA safety
      try {
        const indexHtml = readFileSync(path.join(outDir, "index.html"), "utf-8");
        writeFileSync(path.join(outDir, "404.html"), indexHtml);
      } catch {}
    },
  };
}

export default defineConfig({
  base: GH_BASE,
  plugins: [
    react(),
    tailwindcss(),
    githubPagesPlugin(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
    // Chunk splitting for smaller initial load
    rollupOptions: {
      output: {
        manualChunks: {
          react:    ["react", "react-dom"],
          pdf:      ["jspdf"],
          ui:       ["lucide-react", "next-themes", "wouter"],
        },
      },
    },
  },
});
