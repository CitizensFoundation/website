// Post-build SEO scaffolding.
// Generates dist/sitemap.xml from the same route table used by the app, then
// removes the temporary dist-ssr bundle.

import { writeFileSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const distDir = join(root, "dist");

const server = await import(new URL("../dist-ssr/entry-server.js", import.meta.url));
const { ROUTES, SITE, routeFromPath, CONTENT_INDEX } = server;

// Article publish dates → <lastmod> so crawlers can prioritise fresh content.
const dateByRoute = new Map(CONTENT_INDEX.map((e) => [e.route, e.date]));

// ---- sitemap.xml ----
const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  ROUTES.map((p) => {
    const lastmod = dateByRoute.get(routeFromPath(p));
    return `  <url><loc>${SITE}${p}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`;
  }).join("\n") +
  `\n</urlset>\n`;
writeFileSync(join(distDir, "sitemap.xml"), sitemap, "utf8");

// ---- cleanup ----
rmSync(join(root, "dist-ssr"), { recursive: true, force: true });

console.log(`Generated sitemap.xml (${ROUTES.length} urls); removed dist-ssr.`);
