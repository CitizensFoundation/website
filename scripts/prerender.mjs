// Build-time static pre-render.
// Runs after `vite build` (client -> dist/) and `vite build --ssr` (server ->
// dist-ssr/entry-server.js). For each route it renders the React tree to a
// string, splices it into the built dist/index.html template, rewrites the
// per-route <head> metadata, and writes dist/<route>/index.html.

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const distDir = join(root, "dist");

const server = await import(new URL("../dist-ssr/entry-server.js", import.meta.url));
const { render, ROUTES, META, SITE, routeFromPath, CONTENT_INDEX } = server;

// Look up an article (blog/impact) by its route id, e.g. "blog/slug".
const byRoute = new Map(CONTENT_INDEX.map((e) => [e.route, e]));

const template = readFileSync(join(distDir, "index.html"), "utf8");

const SOCIALS = [
  "https://github.com/CitizensFoundation",
  "https://www.linkedin.com/company/citizens-foundation-global/",
  "https://www.facebook.com/Citizens.is/",
  "https://twitter.com/CitizensFNDN",
];
const LOGO = SITE + "/assets/citizens-logo.png";
const PUBLISHER = {
  "@type": "Organization",
  name: "Citizens Foundation",
  logo: { "@type": "ImageObject", url: LOGO },
};

function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Citizens Foundation",
    url: SITE + "/",
    logo: LOGO,
    description: META.home.description,
    foundingDate: "2008",
    email: "citizens@citizens.is",
    address: { "@type": "PostalAddress", addressLocality: "Reykjavík", addressCountry: "IS" },
    sameAs: SOCIALS,
  };
}

function articleLd(entry, canonical) {
  return {
    "@context": "https://schema.org",
    "@type": entry.type === "blog" ? "BlogPosting" : "Article",
    headline: entry.title,
    description: entry.excerpt || entry.title,
    datePublished: entry.date,
    image: entry.hero ? SITE + entry.hero : SITE + "/assets/og-image.png",
    author: PUBLISHER,
    publisher: PUBLISHER,
    mainEntityOfPage: canonical,
    url: canonical,
  };
}

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const replaceContent = (html, matcher, value) =>
  html.replace(matcher, (m, p1, p2) => p1 + esc(value) + p2);

const imageMetaCache = new Map();

async function imageMetadata(pathname) {
  if (!pathname) return null;
  const key = pathname.split("?")[0];
  if (imageMetaCache.has(key)) return imageMetaCache.get(key);

  const rel = decodeURIComponent(key).replace(/^\/+/, "");
  const file = join(distDir, rel);
  if (!existsSync(file)) {
    imageMetaCache.set(key, null);
    return null;
  }

  const meta = await sharp(file).metadata();
  if (!meta.width || !meta.height || !meta.format) {
    imageMetaCache.set(key, null);
    return null;
  }

  const contentType =
    meta.format === "jpg" || meta.format === "jpeg"
      ? "image/jpeg"
      : meta.format === "png"
        ? "image/png"
        : meta.format === "webp"
          ? "image/webp"
          : null;
  const result = { width: meta.width, height: meta.height, contentType };
  imageMetaCache.set(key, result);
  return result;
}

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

  const entry = byRoute.get(id);

  // Blog posts and impact stories are articles: give them their own share
  // image (the story hero), the "article" OG type, and a published date.
  if (entry) {
    html = html.replace(/(<meta property="og:type" content=")website("\s*\/>)/, "$1article$2");
    if (entry.hero) {
      const heroUrl = SITE + entry.hero;
      html = replaceContent(html, /(<meta property="og:image" content=")[^"]*("\s*\/>)/, heroUrl);
      html = replaceContent(html, /(<meta name="twitter:image" content=")[^"]*("\s*\/>)/, heroUrl);
      html = replaceContent(html, /(<meta property="og:image:alt" content=")[^"]*("\s*\/>)/, entry.title);
      html = replaceContent(html, /(<meta name="twitter:image:alt" content=")[^"]*("\s*\/>)/, entry.title);

      const imageMeta = await imageMetadata(entry.hero);
      if (imageMeta) {
        html = replaceContent(html, /(<meta property="og:image:width" content=")[^"]*("\s*\/>)/, imageMeta.width);
        html = replaceContent(html, /(<meta property="og:image:height" content=")[^"]*("\s*\/>)/, imageMeta.height);
        if (imageMeta.contentType) {
          html = replaceContent(html, /(<meta property="og:image:type" content=")[^"]*("\s*\/>)/, imageMeta.contentType);
        } else {
          html = html.replace(/\s*<meta property="og:image:type"[^>]*\/>/g, "");
        }
      } else {
        html = html.replace(/\s*<meta property="og:image:(?:width|height|type)"[^>]*\/>/g, "");
      }
    }
    html = html.replace(
      "</head>",
      `  <meta property="article:published_time" content="${entry.date}" />\n` +
        `  <meta property="article:publisher" content="Citizens Foundation" />\n</head>`
    );
  }

  // Structured data: Organization on the home page, Article on each story/post.
  const ld = id === "home" ? organizationLd() : entry ? articleLd(entry, canonical) : null;
  if (ld) {
    html = html.replace(
      "</head>",
      `  <script type="application/ld+json">${JSON.stringify(ld)}</script>\n</head>`
    );
  }

  // Inject the app HTML.
  const app = await render(path);
  html = html.replace('<div id="root"></div>', `<div id="root">${app}</div>`);

  const outDir = id === "home" ? distDir : join(distDir, id);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "index.html"), html, "utf8");
  console.log(`prerendered ${path} -> ${id === "home" ? "index.html" : id + "/index.html"}`);
}

// 404 page — Cloudflare Pages serves /404.html for any unmatched URL. Unknown
// paths resolve to the "not-found" route, so this hydrates without mismatch.
{
  const meta = META["not-found"];
  let html = applyMeta(template, {
    title: meta.title,
    description: meta.description,
    canonical: SITE + "/404",
    ogTitle: meta.title,
  });
  html = html.replace("</head>", `  <meta name="robots" content="noindex" />\n</head>`);
  const app = await render("/__not-found__");
  html = html.replace('<div id="root"></div>', `<div id="root">${app}</div>`);
  writeFileSync(join(distDir, "404.html"), html, "utf8");
  console.log("prerendered 404 -> 404.html");
}

console.log(`\nPre-rendered ${ROUTES.length} routes + 404.`);
