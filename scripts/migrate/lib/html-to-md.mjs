// Shared WordPress-HTML → Markdown converter: a cheerio cleanup pass
// (localize media, rewrite internal links, drop WP runtime artifacts)
// followed by turndown.

import { load } from "cheerio";
import TurndownService from "turndown";
import { copyMedia } from "./media.mjs";

function makeTurndown() {
  const td = new TurndownService({
    headingStyle: "atx",
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
  });
  // <figure><img/><figcaption/></figure> -> image + italic caption line.
  td.addRule("figure", {
    filter: "figure",
    replacement: (content, node) => {
      const img = node.querySelector("img");
      if (!img) return content;
      const src = img.getAttribute("src") || "";
      if (!src) return "";
      const alt = (img.getAttribute("alt") || "").replace(/[[\]]/g, "");
      const cap = node.querySelector("figcaption");
      const caption = cap ? cap.textContent.trim().replace(/\s+/g, " ") : "";
      return `\n\n![${alt}](${src})\n\n` + (caption ? `*${caption}*\n\n` : "");
    },
  });
  return td;
}

export function createConverter({ blogSlugs, impactSlugs }) {
  const td = makeTurndown();

  // Old-site internal links -> new routes; leave external links alone.
  const rewriteInternal = (href) => {
    const norm = href
      .replace(/^http:\/\/(www\.)?citizens\.is/, "https://citizens.is")
      .replace(/^https:\/\/www\.citizens\.is/, "https://citizens.is");
    let m = norm.match(/^https:\/\/citizens\.is\/\d{4}\/\d{2}\/\d{2}\/([^/]+)\/?$/);
    if (m && blogSlugs.has(m[1])) return `/blog/${m[1]}/`;
    m = norm.match(/^(?:https:\/\/citizens\.is)?\/portfolio_page\/([^/]+)\/?$/);
    if (m && impactSlugs.has(m[1])) return `/impact/${m[1]}/`;
    return href;
  };

  return async function htmlToMarkdown(html) {
    const $ = load(html, null, false);

    // noscript holds duplicate lazy-load <img> fallbacks that cheerio keeps
    // as raw text but turndown would parse — drop them with the wrapper.
    $("script, style, noscript").remove();
    $("blockquote.wp-embedded-content").remove();

    // Any iframe in body content becomes a plain link (e.g. the WP embed of
    // an Apolitical article). Gallery/video iframes are handled separately
    // by the impact extractor before the body reaches this converter.
    for (const el of $("iframe").toArray()) {
      const $el = $(el);
      const raw = $el.attr("data-lazy-src") || $el.attr("src") || "";
      const src = raw === "about:blank" ? "" : raw.replace(/\/embed\/?(#.*)?$/, "/");
      const label = $el.attr("title") || src;
      if (src) $el.replaceWith(`<p><a href="${src}">${label}</a></p>`);
      else $el.remove();
    }

    for (const el of $("img").toArray()) {
      const $el = $(el);
      const src = $el.attr("data-lazy-src") || $el.attr("src") || "";
      if (/wp-content\/uploads\//.test(src)) {
        const local = await copyMedia(src);
        if (!local) { $el.remove(); continue; }
        $el.attr("src", local);
      } else if (!src || src.startsWith("data:")) {
        $el.remove();
        continue;
      }
      for (const attr of ["srcset", "sizes", "width", "height", "style", "class",
        "decoding", "loading", "data-lazy-src", "data-lazy-srcset", "data-lazy-sizes"]) {
        $el.removeAttr(attr);
      }
    }

    for (const el of $("a").toArray()) {
      const $el = $(el);
      const href = $el.attr("href");
      if (!href) continue;
      if (/wp-content\/uploads\//.test(href)) {
        const local = await copyMedia(href);
        if (local) $el.attr("href", local);
        else $el.removeAttr("href");
      } else {
        $el.attr("href", rewriteInternal(href));
      }
    }

    // Drop paragraphs that are only whitespace/&nbsp; and hold no media.
    for (const el of $("p").toArray()) {
      const $el = $(el);
      if ($el.find("img, iframe").length) continue;
      if (!$el.text().replace(/[\s ]/g, "")) $el.remove();
    }

    let md = td.turndown($.html());
    md = md.replace(/ /g, " ");
    md = md.replace(/\n{3,}/g, "\n\n").trim();
    return md;
  };
}
