// GitHub Pages build config.
// GH_BASE is set automatically by the GitHub Actions workflow.
// For a manual local build, set it to your repo name: VITE_BASE="/my-repo/" npm run build
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { writeFileSync, readFileSync } from "fs";

// Auto-read from env (set by GitHub Actions). Falls back to /MICKY/ for local builds.
const GH_BASE = process.env.VITE_BASE || "/MICKY/";

console.log("Building with base path:", GH_BASE);

function githubPagesPlugin() {
  return {
    name: "github-pages-postbuild",
    closeBundle() {
      const outDir = path.resolve(import.meta.dirname, "dist");
      try {
        const mp = path.join(outDir, "manifest.json");
        const m = JSON.parse(readFileSync(mp, "utf-8"));
        m.start_url = GH_BASE; m.scope = GH_BASE;
        writeFileSync(mp, JSON.stringify(m, null, 2));
      } catch {}
      writeFileSync(path.join(outDir, ".nojekyll"), "");
      try {
        const html = readFileSync(path.join(outDir, "index.html"), "utf-8");
        writeFileSync(path.join(outDir, "404.html"), html);
      } catch {}
    },
  };
}

export default defineConfig({
  base: GH_BASE,
  plugins: [react(), tailwindcss(), githubPagesPlugin()],
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "src") },
    dedupe: ["react", "react-dom"],
  },
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          pdf: ["jspdf"],
          ui: ["lucide-react", "next-themes", "wouter"],
        },
      },
    },
  },
});
