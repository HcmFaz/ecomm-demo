# E-commerce X-Ray 🛒

> Anatomie interactive d'une plateforme e-commerce réelle  
> Cours Dr. H. Faouzi · ENCG Kénitra 2025/2026

## 🚀 Deploy to Vercel (recommended)

### Option A — GitHub + Vercel (best)
1. Create a new repo on [github.com](https://github.com/new)
2. Upload all these files (or `git push`)
3. Go to [vercel.com](https://vercel.com) → **Add New Project**
4. Import your GitHub repo
5. Click **Deploy** — done! You get a live URL instantly.

### Option B — Vercel CLI
```bash
npm install -g vercel
npm install
vercel
```

## 💻 Run locally

```bash
npm install
npm run dev
```
Then open → http://localhost:5173

## 📦 Build for production

```bash
npm run build
# Output is in the /dist folder
```

## 🗂 Project structure

```
ecommerce-xray/
├── index.html          # HTML entry point
├── vite.config.js      # Vite config
├── vercel.json         # Vercel routing
├── package.json
└── src/
    ├── main.jsx        # React root
    └── EcomXRay.jsx    # Main component (all 5 views)
```
