# PortfolioHubs

Free professional dental portfolio builder and CV PDF maker.

## Local dev

```bash
npm install
npm run dev   # http://localhost:5173
```

## Deploy to GitHub Pages

### Step 1 — Push this repo to GitHub

### Step 2 — Enable Pages (do this ONCE)
1. Repo **Settings → Pages**
2. Source: **"Deploy from a branch"**
3. Branch: **`gh-pages`** / folder **`/ (root)`** → Save

### Step 3 — Every push to `main` auto-deploys
The workflow builds Vite and pushes `dist/` to the `gh-pages` branch.
Your site: `https://YOUR_USERNAME.github.io/MICKY/`

### Change the repo base path
Edit `vite.build.config.ts` line 8:
```ts
const GH_BASE = "/YOUR_REPO_NAME/";
```

## Key files

| File | Purpose |
|------|---------|
| `src/config.ts` | All editable data — labels, WhatsApp number, etc. |
| `src/pages/PortfolioWizard.tsx` | 7-step portfolio pathway |
| `src/pages/CVWizard.tsx` | 7-step CV PDF pathway |
| `vite.build.config.ts` | GitHub Pages build config |
