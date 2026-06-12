// Build-time static pre-render.
// Runs after `vite build` (client -> dist/) and `vite build --ssr` (server ->
// dist-ssr/entry-server.js). For each route it renders the React tree to a
// string, splices it into the built dist/index.html template, rewrites the
// per-route <head> metadata, and writes dist/<route>/index.html.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const distDir = join(root, "dist");

const server = await import(new URL("../dist-ssr/entry-server.js", import.meta.url));
const { render, ROUTES, META, SITE, routeFromPath } = server;

const template = readFileSync(join(distDir, "index.html"), "utf8");

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const replaceContent = (html, matcher, value) =>
  html.replace(matcher, (m, p1, p2) => p1 + esc(value) + p2);

function applyMeta(html, { title, description, canonical, ogTitle }) {
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  html = replaceContent(html, /(<meta name="description" content=")[^"]*("\s*\/>)/, description);
  html = replaceContent(html, /(<meta name="twitter:title" content=")[^"]*("\s*\/>)/, ogTitle);
  html = replaceContent(html, /(<meta name="twitter:description" content=")[^"]*("\s*\/>)/, description);
  html = replaceContent(html, /(<meta property="og:title" content=")[^"]*("\s*\/>)/, ogTitle);
  html = replaceContent(html, /(<meta property="og:description" content=")[^"]*("\s*\/>)/, description);
  html = replaceContent(html, /(<meta property="og:url" content=")[^"]*("\s*\/>)/, canonical);
  html = replaceContent(html, /(<link rel="canonical" href=")[^"]*("\s*\/>)/, canonical);
  return html;
}

for (const path of ROUTES) {
  const id = routeFromPath(path);
  const meta = META[id];
  const canonical = SITE + path;

  let html = applyMeta(template, {
    title: meta.title,
    description: meta.description,
    canonical,
    ogTitle: meta.title,
  });

  // Inject the app HTML.
  const app = await render(path);
  html = html.replace('<div id="root"></div>', `<div id="root">${app}</div>`);

  const outDir = id === "home" ? distDir : join(distDir, id);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "index.html"), html, "utf8");
  console.log(`prerendered ${path} -> ${id === "home" ? "index.html" : id + "/index.html"}`);
}

console.log(`\nPre-rendered ${ROUTES.length} routes.`);
