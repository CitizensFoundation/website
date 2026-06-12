// One-time: build public/_redirects (Cloudflare Pages format).
// Specific rules first — first match wins — then catch-all splats.

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { readMeta, ROOT } from "./lib/archive.mjs";

// metadata/redirects.json entries, pre-resolved to final new-site targets.
const LEGACY = [
  ["/wp-sitemap.xml", "/sitemap.xml"],
  ["/sitemap_index.xml", "/sitemap.xml"],
  ["/digital-democracy-home/", "/"],
  ["/2014/12/30/seasons-greetings-2014/why_xmas/", "/blog/seasons-greetings-2014/"],
  ["/active/", "/blog/we-use-ai-to-empower-citizens/"],
  ["/empower-citizens-with-ai", "/blog/we-use-ai-to-empower-citizens/"],
  ["/better-neighborhoods-pb-for-the-4th-time/", "/blog/better-neighborhoods-pb-for-the-4th-time/"],
  ["/new-estonian-law-creates-a-new-law/", "/blog/new-estonian-law-creates-a-new-law-through-citizens-petitions/"],
  ["/portfolio/better-neighborhoods-helps-citizens-understand-the-realities-of-budgeting/", "/impact/my-neighbourhood/"],
  ["/portfolio/estonian-laws-changed/", "/impact/rahvakogu/"],
  ["/portfolio/true-stories-eve-online/", "/impact/true-stories-from-the-future-eve-online/"],
  ["/portfolio/national-health-service-nhs/", "/impact/nhs-citizen/"],
  ["/portfolio/better-reykjavik-connects-citizens-and-administration-all-year-round/", "/impact/better_reykjavik/"],
];

export function generateRedirects({ blogSlugs, impactSlugs }) {
  const lines = [];

  const validate = (target) => {
    let m = target.match(/^\/blog\/([^/]+)\/$/);
    if (m && !blogSlugs.has(m[1])) throw new Error(`redirect target missing blog slug: ${m[1]}`);
    m = target.match(/^\/impact\/([^/]+)\/$/);
    if (m && !impactSlugs.has(m[1])) throw new Error(`redirect target missing impact slug: ${m[1]}`);
  };

  for (const [from, to] of LEGACY) {
    validate(to);
    lines.push(`${from} ${to} 301`);
  }

  for (const post of readMeta("rest-posts.json")) {
    if (post.status !== "publish") continue;
    const oldPath = new URL(post.link).pathname;
    lines.push(`${oldPath} /blog/${post.slug}/ 301`);
  }

  for (const slug of [...impactSlugs].sort()) {
    lines.push(`/portfolio_page/${slug}/ /impact/${slug}/ 301`);
  }

  lines.push("/portfolio_page/* /impact/ 301");
  lines.push("/category/* /blog/ 301");

  writeFileSync(join(ROOT, "public", "_redirects"), lines.join("\n") + "\n");
  console.log(`Redirects: ${lines.length} rules -> public/_redirects`);
  return lines.length;
}
