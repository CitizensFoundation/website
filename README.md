# citizens.is

Static website for citizens.is. Vite + React, pre-rendered to plain HTML at
build time.

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

## Plausible Analytics

The site uses Plausible for privacy-friendly analytics. The script in
`index.html` tracks `citizens.is` and enables pageviews, outbound links, file
downloads and tagged custom events.

Custom events emitted by the site:

- `Work With Us Click`
- `Contact Email Click`
- `Your Priorities Click`
- `Policy Synth Click`
- `GitHub Click`
- `404`

After deployment, finish these Plausible dashboard steps:

- Create custom event goals for the six events above.
- Create a launch funnel, for example `/` -> `/your-priorities/` or
  `/policy-synth/` -> `Work With Us Click` or `Contact Email Click`.
- Enable the Google Search Console integration in Plausible site settings.
- Keep `citizens.is` as the root Plausible site and use hostname filtering for
  `new.citizens.is`, `www.citizens.is` and `citizens.is` during rollout.

## Content from the old WordPress site

`allContentFromOldWebsite/` holds scraped content (impact stories, blogs,
media) from the old WordPress installation, to be migrated into this site.
