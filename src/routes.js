// Tiny pathname router + per-route SEO metadata.
// Single source of truth for the path <-> route-id mapping, shared by the app,
// the prerender script, and the sitemap generator. No browser or React
// dependencies, so it is safe to import from both client and SSR builds.

export const SITE = "https://citizens.is";

// Ordered list of route ids. "home" maps to "/". Add new pages here.
export const ROUTE_IDS = ["home"];

export function pathFor(id) {
  // Trailing slash on subpages matches how Cloudflare Pages serves directory
  // index files (/about issues a 308 to /about/), so canonical tags, the
  // sitemap, and nav links all point at the final URL with no redirect hop.
  return id === "home" ? "/" : `/${id}/`;
}

export function routeFromPath(pathname) {
  const seg = (pathname || "/").replace(/^\/+|\/+$/g, "").split("/")[0];
  if (!seg) return "home";
  return ROUTE_IDS.includes(seg) ? seg : "home";
}

// Absolute paths to pre-render, in order.
export const ROUTES = ROUTE_IDS.map(pathFor);

// Per-route <head> metadata.
export const META = {
  home: {
    title: "Citizens Foundation",
    description: "",
  },
};
