# PortfolioHubs

## Local dev
```bash
npm install
npm run dev   # http://localhost:5173
```

## Deploy to GitHub Pages

### One-time repo setup
1. Push this repo to GitHub
2. Go to repo **Settings → Pages**
3. Source → **"Deploy from a branch"**
4. Branch → **`gh-pages`** · Folder → **`/ (root)`** → Save

### Auto-deploy on every push
The `.github/workflows/deploy.yml` workflow:
- Detects your repo name automatically (no config needed)
- Builds Vite with the correct base path
- Pushes `dist/` to the `gh-pages` branch

Your live site: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

## Key files
| File | Purpose |
|------|---------|
| `src/config.ts` | All editable data — labels, WhatsApp, etc. |
| `src/pages/PortfolioWizard.tsx` | 7-step portfolio pathway |
| `src/pages/CVWizard.tsx` | 7-step CV PDF pathway |
| `vite.build.config.ts` | GitHub Pages build (base path auto from env) |
