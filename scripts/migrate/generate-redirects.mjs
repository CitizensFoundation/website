// One-time: build public/_redirects (Cloudflare Pages format).
// Specific rules first — first match wins — then catch-all splats.

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { readMeta, ROOT } from "./lib/archive.mjs";

// metadata/redirects.json entries, pre-resolved to final new-site targets.
const LEGACY = [
  ["/wp-sitemap.xml", "/sitemap.xml"],
  ["/sitemap_index.xml", "/sitemap.xml"],
  ["/blog/page/*", "/blog/"],
  ["/page/*", "/blog/"],
  ["/digital-democracy-home/page/*", "/blog/"],
  ["/digital-democracy-home/*", "/"],
  ["/digital-democracy-home/", "/"],
  ["/author/josh/*", "/blog/citizens-foundation-case-file-constitution-game/"],
  ["/author/josh/", "/blog/citizens-foundation-case-file-constitution-game/"],
  ["/author/robert/*", "/blog/interview-robert-bjarnason-co-founder-ceo/"],
  ["/author/robert/", "/blog/interview-robert-bjarnason-co-founder-ceo/"],
  ["/author/gudjonidir/*", "/about/"],
  ["/author/gudjonidir/", "/about/"],
  ["/author/user/*", "/blog/"],
  ["/author/user/", "/blog/"],
  ["/2014/12/30/seasons-greetings-2014/why_xmas/", "/blog/seasons-greetings-2014/"],
  ["/active/", "/blog/we-use-ai-to-empower-citizens/"],
  ["/empower-citizens-with-ai", "/blog/we-use-ai-to-empower-citizens/"],
  ["/better-neighborhoods-pb-for-the-4th-time/", "/blog/better-neighborhoods-pb-for-the-4th-time/"],
  ["/new-estonian-law-creates-a-new-law/", "/blog/new-estonian-law-creates-a-new-law-through-citizens-petitions/"],
  ["/idea-generation-policy-crowd-sourcing/", "/your-priorities/"],
  ["/budget-voting-civic-education/", "/impact/my-neighbourhood/"],
  ["/us/", "/about/"],
  ["/home/", "/"],
  ["/2020/", "/blog/"],
  ["/2021/09/18/", "/blog/"],
  ["/3/", "/"],
  ["/apps/", "/your-priorities/"],
  ["/products/", "/your-priorities/"],
  ["/security/", "/open-source/"],
  ["/trust/", "/open-source/"],
  ["/compliance/", "/open-source/"],
  ["/call-to-action/", "/work-with-us/"],
  ["/meet-the-team/", "/about/"],
  ["/gunnar/", "/about/"],
  ["/the-book/", "/blog/"],
  ["/typography/", "/"],
  ["/bin/*", "/"],
  ["/%20*", "/"],
  ["/%28Citizens%20Foundation/", "/"],
  ["/sdfsdfsdfwe/", "/"],
  ["/eW91ci1wcm/", "/your-priorities/"],
  ["/your-%E2%80%A6/", "/your-priorities/"],
  ["/YourPriorities/", "/your-priorities/"],
  ["/yourpriorities/", "/your-priorities/"],
  ["/betterreykjavik/", "/impact/better_reykjavik/"],
  ["/policysynth/", "/policy-synth/"],
  ["/group/*", "/your-priorities/"],
  ["/domain/*", "/your-priorities/"],
  ["/community/*", "/your-priorities/"],
  ["/portfolio-category/*", "/impact/"],
  ["/portfolio_/", "/impact/"],
  ["/portfolio_page/", "/impact/"],
  ["/portfolio_page/better-reykjavik/", "/impact/better_reykjavik/"],
  ["/portfolio_page/make-your-constitution-game/", "/impact/make-constitution-game/"],
  ["/portfolio_page/my-neighborhood/", "/impact/my-neighbourhood/"],
  ["/portfolio_page/junjes-wien/", "/impact/junges-wien/"],
  ["/portfolio_page/rahvakogu/", "/impact/rahvakogu/"],
  ["/your-priorities-features-overview/*", "/your-priorities/"],
  ["/your-priorities-features/*", "/your-priorities/"],
  ["/contact-us/*", "/contact/"],
  ["/portfolio/better-neighborhoods-helps-citizens-understand-the", "/impact/my-neighbourhood/"],
  ["/portfolio/better-reykjavik-connects-citizens-and-administration-all-year-", "/impact/better_reykjavik/"],
  ["/better-decisions-collective-intelligence/*", "/"],
  ["/portfolio/better-neighborhoods-helps-citizens-understand-the-realities-of-budgeting/", "/impact/my-neighbourhood/"],
  ["/portfolio/estonian-laws-changed/", "/impact/rahvakogu/"],
  ["/portfolio/true-stories-eve-online/", "/impact/true-stories-from-the-future-eve-online/"],
  ["/portfolio/national-health-service-nhs/", "/impact/nhs-citizen/"],
  ["/portfolio/better-reykjavik-connects-citizens-and-administration-all-year-round/", "/impact/better_reykjavik/"],
  ["/wp-content/uploads/2016/04/Better-Reykjavik-Case-Study.pdf", "/impact/better_reykjavik/"],
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
    addRedirect(`${oldPath}*`, `/blog/${post.slug}/`);
  }

  for (const slug of [...impactSlugs].sort()) {
    addRedirect(`/portfolio_page/${slug}/`, `/impact/${slug}/`);
    addRedirect(`/portfolio_page/${slug}/*`, `/impact/${slug}/`);
  }

  lines.push("/portfolio_page/* /impact/ 301");
  lines.push("/category/* /blog/ 301");

  writeFileSync(join(ROOT, "public", "_redirects"), lines.join("\n") + "\n");
  console.log(`Redirects: ${lines.length} rules -> public/_redirects`);
  return lines.length;
}
