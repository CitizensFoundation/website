# citizens.is

Static website for citizens.is. Vite + React, pre-rendered to plain HTML at
build time (same setup as eidosoma-website).

## Develop

```
npm install
npm run dev
```

## Build

```
npm run build
```

This runs the client build, an SSR build, then `scripts/prerender.mjs` (one
static `index.html` per route in `src/routes.js`) and `scripts/generate-seo.mjs`
(sitemap.xml). Output lands in `dist/`.

## Deploy — Cloudflare Pages

- Build command: `npm run build`
- Build output directory: `dist`
- Node version: 20 (picked up from `.nvmrc`)

`public/_headers` sets Cloudflare cache headers: hashed `/assets/*` are
immutable, HTML always revalidates.

## Content from the old WordPress site

`allContentFromOldWebsite/` holds scraped content (impact stories, blogs,
media) from the old WordPress installation, to be migrated into this site.
