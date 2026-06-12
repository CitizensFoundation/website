// One-time: scraped Bridge-theme portfolio pages -> content/impact/<slug>.md
// Source: html/impact/portfolio_page/<slug>/index.html (no REST export exists
// for this WordPress custom post type).

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { load } from "cheerio";
import { ARCHIVE, CONTENT_DIR, readMeta } from "./lib/archive.mjs";
import { copyMedia } from "./lib/media.mjs";
import { createConverter } from "./lib/html-to-md.mjs";
import { parseLooseDate } from "./lib/dates.mjs";
import { serializeFrontmatter } from "../../src/content/frontmatter.js";

const PORTFOLIO = join(ARCHIVE, "html", "impact", "portfolio_page");

function sitemapDateFor(slug) {
  for (const rec of readMeta("sitemap-records.json")) {
    if (rec.kind === "attachment") continue;
    if ((rec.loc || "").includes(`/portfolio_page/${slug}/`) && rec.lastmod) {
      return rec.lastmod.slice(0, 10);
    }
  }
  return null;
}

function youtubeEmbed(src) {
  const m =
    src.match(/youtube(?:-nocookie)?\.com\/embed\/([\w-]+)/) ||
    src.match(/youtube\.com\/watch\?v=([\w-]+)/) ||
    src.match(/youtu\.be\/([\w-]+)/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

export async function migrateImpact({ blogSlugs, impactSlugs }) {
  const slugs = readdirSync(PORTFOLIO, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
  const convert = createConverter({ blogSlugs, impactSlugs });
  mkdirSync(join(CONTENT_DIR, "impact"), { recursive: true });

  for (const slug of slugs) {
    const $ = load(readFileSync(join(PORTFOLIO, slug, "index.html"), "utf8"));
    const og = (p) => $(`meta[property="${p}"]`).attr("content") || "";

    const title = og("og:title").replace(/\s*[-–]\s*Citizens Foundation\s*$/, "").trim() || slug;
    let excerpt = og("og:description").replace(/\s+/g, " ").trim().slice(0, 300);
    // A few old portfolio pages never got a real description and still carry
    // the theme's lorem-ipsum placeholder — derive one from the body instead.
    if (/lorem ipsum/i.test(excerpt)) excerpt = "";

    const dateText = $(".portfolio_detail p.entry_date").first().text().trim();
    const date = parseLooseDate(dateText) || sitemapDateFor(slug);
    if (!date) throw new Error(`impact ${slug}: no parseable date ("${dateText}")`);

    // Sidebar info blocks: <div class="info"><h6>Label</h6><p>value</p></div>
    let link = null;
    const categories = [];
    for (const el of $(".portfolio_detail .info").toArray()) {
      const $el = $(el);
      const label = $el.find("h6").first().text().trim().toLowerCase();
      if (label.startsWith("visit")) {
        link = $el.find("a").first().attr("href") || null;
        // One story "visits" a PDF hosted in WP uploads — localize it too.
        if (link && /wp-content\/uploads\//.test(link)) {
          link = await copyMedia(link.startsWith("/") ? `https://citizens.is${link}` : link);
        }
      }
      if ($el.find("span.category").length) {
        for (const c of $el.find("span.category").text().split(",")) {
          if (c.trim()) categories.push(c.trim());
        }
      }
    }

    // Gallery slider: real image URLs hide in data-lazy-src; video slides are iframes.
    const gallery = [];
    const videos = [];
    for (const el of $(".portfolio_single ul.slides li").toArray()) {
      const $li = $(el);
      const img = $li.find("img").first();
      const iframe = $li.find("iframe").first();
      if (img.length) {
        const local = await copyMedia(img.attr("data-lazy-src") || img.attr("src") || "");
        if (local && !gallery.includes(local)) gallery.push(local);
      }
      if (iframe.length) {
        const yt = youtubeEmbed(iframe.attr("data-lazy-src") || iframe.attr("src") || "");
        if (yt && !videos.includes(yt)) videos.push(yt);
      }
    }

    const hero = (og("og:image") ? await copyMedia(og("og:image")) : null) || gallery[0] || null;

    const $holder = $(".portfolio_single_text_holder").first();
    $holder.find("h1").first().remove();
    const body = await convert($holder.html() || "");

    if (!excerpt) {
      const para = body
        .split(/\n\n+/)
        .find((p) => !/^[#!\[*>-]/.test(p.trim()) && p.trim().length > 60);
      excerpt = (para || "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/\s+/g, " ").trim().slice(0, 280);
    }

    const meta = { title, slug, date, hero, excerpt, categories, link, gallery, videos };
    writeFileSync(join(CONTENT_DIR, "impact", `${slug}.md`), serializeFrontmatter(meta) + "\n" + body + "\n");
  }
  console.log(`Impact: ${slugs.length} stories -> content/impact/`);
  return slugs.length;
}
