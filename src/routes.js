// Pathname router + per-route SEO metadata.
// Single source of truth for the path <-> route-id mapping, shared by the app,
// the prerender script, and the sitemap generator. Article routes are derived
// from the markdown content index at build time.

import { CONTENT_INDEX } from "virtual:content-index";

export const SITE = "https://citizens.is";

// "home" maps to "/"; everything else maps to "/<id>/".
export const ROUTE_IDS = ["home", "blog", "impact", ...CONTENT_INDEX.map((e) => e.route)];

export function pathFor(id) {
  // Trailing slash matches how Cloudflare Pages serves directory index files
  // (/blog issues a 308 to /blog/), so canonical tags, the sitemap, and nav
  // links all point at the final URL with no redirect hop.
  return id === "home" ? "/" : `/${id}/`;
}

export function routeFromPath(pathname) {
  const clean = (pathname || "/").replace(/^\/+|\/+$/g, "");
  if (!clean) return "home";
  return ROUTE_IDS.includes(clean) ? clean : "home";
}

// Absolute paths to pre-render, in order.
export const ROUTES = ROUTE_IDS.map(pathFor);

// Per-route <head> metadata.
export const META = {
  home: {
    title: "Citizens Foundation",
    description:
      "Citizens Foundation builds open-source platforms for democratic innovation — connecting citizens and governments in 45 countries since 2008.",
  },
  blog: {
    title: "Blog — Citizens Foundation",
    description:
      "News and writing from Citizens Foundation on digital democracy, participatory budgeting, and open-source civic technology.",
  },
  impact: {
    title: "Impact — Citizens Foundation",
    description:
      "Citizen engagement projects powered by Citizens Foundation platforms — from Better Reykjavík to the Scottish Parliament and beyond.",
  },
  ...Object.fromEntries(
    CONTENT_INDEX.map((e) => [
      e.route,
      { title: `${e.title} — Citizens Foundation`, description: e.excerpt || e.title },
    ])
  ),
};
