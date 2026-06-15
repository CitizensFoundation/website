// One-time: build public/_redirects (Cloudflare Pages format).
// Specific rules first — first match wins — then catch-all splats.

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { readMeta, ROOT } from "./lib/archive.mjs";

// metadata/redirects.json entries, pre-resolved to final new-site targets.
// Keep this compact: the live Pages deployment behaved as if later exact
// redirects were ignored, even though Cloudflare documents a higher static cap.
const LEGACY_BEFORE_DATED_BLOGS = [
  ["/wp-sitemap.xml", "/sitemap.xml"],
  ["/sitemap_index.xml", "/sitemap.xml"],
  ["/blog/page/*", "/blog/"],
  ["/page/*", "/blog/"],
  ["/digital-democracy-home/page/*", "/blog/"],
  ["/digital-democracy-home*", "/"],
  ["/author/josh*", "/blog/citizens-foundation-case-file-constitution-game/"],
  ["/author/robert*", "/blog/interview-robert-bjarnason-co-founder-ceo/"],
  ["/author/gudjonidir*", "/about/"],
  ["/author/user*", "/blog/"],
  ["/2014/12/30/seasons-greetings-2014/why_xmas", "/blog/seasons-greetings-2014/"],
  ["/blog/we-use-ai-to-empower-citizens/", "/impact/active-citizen/"],
];

const LEGACY_AFTER_DATED_BLOGS = [
  ["/active/", "/impact/active-citizen/"],
  ["/empower-citizens-with-ai*", "/impact/active-citizen/"],
  ["/better-neighborhoods-pb-for-the-4th-time*", "/blog/better-neighborhoods-pb-for-the-4th-time/"],
  ["/new-estonian-law-creates-a-new-law*", "/blog/new-estonian-law-creates-a-new-law-through-citizens-petitions/"],
  ["/idea-generation-policy-crowd-sourcing*", "/your-priorities/"],
  ["/budget-voting-civic-education*", "/impact/my-neighbourhood/"],
  ["/us/", "/about/"],
  ["/home*", "/"],
  ["/2020*", "/blog/"],
  ["/2021/09/18*", "/blog/"],
  ["/3*", "/"],
  ["/apps*", "/your-priorities/"],
  ["/products*", "/your-priorities/"],
  ["/security*", "/open-source/"],
  ["/trust*", "/open-source/"],
  ["/compliance*", "/open-source/"],
  ["/call-to-action*", "/work-with-us/"],
  ["/meet-the-team*", "/about/"],
  ["/gunnar*", "/about/"],
  ["/the-book*", "/blog/"],
  ["/typography*", "/"],
  ["/bin/*", "/"],
  ["/%20*", "/"],
  ["/eW91ci1wcm*", "/your-priorities/"],
  ["/your-%E2%80%A6*", "/your-priorities/"],
  ["/YourPriorities*", "/your-priorities/"],
  ["/yourpriorities*", "/your-priorities/"],
  ["/betterreykjavik*", "/impact/better_reykjavik/"],
  ["/policysynth*", "/policy-synth/"],
  ["/group/*", "/your-priorities/"],
  ["/domain/*", "/your-priorities/"],
  ["/community/*", "/your-priorities/"],
  ["/portfolio_page/better-reykjavik*", "/impact/better_reykjavik/"],
  ["/portfolio_page/make-your-constitution-game*", "/impact/make-constitution-game/"],
  ["/portfolio_page/my-neighborhood*", "/impact/my-neighbourhood/"],
  ["/portfolio_page/junjes-wien*", "/impact/junges-wien/"],
  ["/portfolio_page/:slug", "/impact/:slug/"],
  ["/portfolio_page/:slug/*", "/impact/:slug/"],
  ["/portfolio/better-neighborhoods-helps-citizens-understand-the*", "/impact/my-neighbourhood/"],
  ["/portfolio/better-reykjavik-connects-citizens-and-administration-all-year-*", "/impact/better_reykjavik/"],
  ["/portfolio/estonian-laws-changed*", "/impact/rahvakogu/"],
  ["/portfolio/true-stories-eve-online*", "/impact/true-stories-from-the-future-eve-online/"],
  ["/portfolio/national-health-service-nhs*", "/impact/nhs-citizen/"],
  ["/portfolio*", "/impact/"],
  ["/wp-content/uploads/2016/04/Better-Reykjavik-Case-Study.pdf", "/impact/better_reykjavik/"],
  ["/donate*", "/"],
  ["/support-cf*", "/"],
  ["/about-cf*", "/about/"],
  ["/contact-us*", "/contact/"],
  ["/press*", "/in-the-news/"],
  ["/our-services*", "/work-with-us/"],
  ["/pricing-tables*", "/work-with-us/"],
  ["/connecting-governments-and-citizens*", "/about/"],
  ["/getting-started*", "/your-priorities/"],
  ["/your-priorities-features*", "/your-priorities/"],
  ["/better-decisions-collective-intelligence/*", "/"],
  ["/category/*", "/blog/"],
];

export function generateRedirects({ blogSlugs, impactSlugs }) {
  const lines = [];
  const seen = new Set();

  const validate = (target) => {
    if (target.includes(":")) return;
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

  for (const [from, to] of LEGACY_BEFORE_DATED_BLOGS) addRedirect(from, to);

  const exactPostRedirects = [];
  const datedBlogYears = new Set();
  for (const post of readMeta("rest-posts.json")) {
    if (post.status !== "publish") continue;
    const oldPath = new URL(post.link).pathname;
    const m = oldPath.match(/^\/(\d{4})\/\d{2}\/\d{2}\/([^/]+)\/?$/);
    if (m && m[2] === post.slug) datedBlogYears.add(m[1]);
    else exactPostRedirects.push([oldPath, `/blog/${post.slug}/`]);
  }

  for (const [from, to] of exactPostRedirects) addRedirect(from, to);
  for (const year of [...datedBlogYears].sort()) {
    addRedirect(`/${year}/:month/:day/:slug`, "/blog/:slug/");
  }
  for (const [from, to] of LEGACY_AFTER_DATED_BLOGS) addRedirect(from, to);

  const dynamicCount = lines.filter((line) => {
    const source = line.split(/\s+/)[0];
    return source.includes("*") || /:[A-Za-z]\w*/.test(source);
  }).length;
  if (lines.length > 100) throw new Error(`_redirects generated ${lines.length} rules; keep at or below 100`);
  if (dynamicCount > 100) throw new Error(`_redirects generated ${dynamicCount} dynamic rules; Cloudflare allows 100`);

  writeFileSync(join(ROOT, "public", "_redirects"), lines.join("\n") + "\n");
  console.log(`Redirects: ${lines.length} rules (${dynamicCount} dynamic) -> public/_redirects`);
  return lines.length;
}
