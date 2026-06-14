// One-time: build public/_redirects (Cloudflare Pages format).
// Specific rules first — first match wins — then catch-all splats.

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { readMeta, ROOT } from "./lib/archive.mjs";

// metadata/redirects.json entries, pre-resolved to final new-site targets.
const LEGACY = [
  ["/wp-sitemap.xml", "/sitemap.xml"],
  ["/sitemap_index.xml", "/sitemap.xml"],
  ["/digital-democracy-home/page/*", "/blog/"],
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
  ["/donate/", "/"],
  ["/donate-43/", "/"],
  ["/donate-democracy/", "/"],
  ["/donate-eastern-europe/", "/"],
  ["/donate-open-source/", "/"],
  ["/donate-thank-you/", "/"],
  ["/support-cf/", "/"],
  ["/about-cf/", "/about/"],
  ["/contact-us/", "/contact/"],
  ["/press/", "/in-the-news/"],
  ["/portfolio/", "/impact/"],
  ["/our-services/", "/work-with-us/"],
  ["/pricing-tables/", "/work-with-us/"],
  ["/connecting-governments-and-citizens/", "/about/"],
  ["/getting-started/", "/your-priorities/"],
  ["/getting-started-cfa-offer/", "/your-priorities/"],
  ["/getting-started-with-your-priorities-world-bank-project-2020/", "/your-priorities/"],
  ["/your-priorities-features/", "/your-priorities/"],
  ["/your-priorities-features-overview/", "/your-priorities/"],
];

export function generateRedirects({ blogSlugs, impactSlugs }) {
  const lines = [];
  const seen = new Set();

  const validate = (target) => {
    let m = target.match(/^\/blog\/([^/]+)\/$/);
    if (m && !blogSlugs.has(m[1])) throw new Error(`redirect target missing blog slug: ${m[1]}`);
    m = target.match(/^\/impact\/([^/]+)\/$/);
    if (m && !impactSlugs.has(m[1])) throw new Error(`redirect target missing impact slug: ${m[1]}`);
  };

  const sourceVariants = (from) => {
    if (from.includes("*") || /\.[^/]+$/.test(from)) return [from];
    const bare = from.endsWith("/") ? from.slice(0, -1) : from;
    return [bare, `${bare}/`].filter(Boolean);
  };

  const addRedirect = (from, to) => {
    validate(to);
    for (const source of sourceVariants(from)) {
      if (seen.has(source)) continue;
      seen.add(source);
      lines.push(`${source} ${to} 301`);
    }
  };

  for (const [from, to] of LEGACY) addRedirect(from, to);

  for (const post of readMeta("rest-posts.json")) {
    if (post.status !== "publish") continue;
    const oldPath = new URL(post.link).pathname;
    addRedirect(oldPath, `/blog/${post.slug}/`);
  }

  for (const slug of [...impactSlugs].sort()) {
    addRedirect(`/portfolio_page/${slug}/`, `/impact/${slug}/`);
  }

  lines.push("/portfolio_page/* /impact/ 301");
  lines.push("/category/* /blog/ 301");

  writeFileSync(join(ROOT, "public", "_redirects"), lines.join("\n") + "\n");
  console.log(`Redirects: ${lines.length} rules -> public/_redirects`);
  return lines.length;
}
