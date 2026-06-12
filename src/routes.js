// Pathname router + per-route SEO metadata.
// Single source of truth for the path <-> route-id mapping, shared by the app,
// the prerender script, and the sitemap generator. Article routes are derived
// from the markdown content index at build time.

import { CONTENT_INDEX } from "virtual:content-index";

export const SITE = "https://citizens.is";

// "home" maps to "/"; everything else maps to "/<id>/".
export const PLATFORM_IDS = ["your-priorities", "policy-synth", "all-our-ideas", "open-source"];
export const ROUTE_IDS = [
  "home",
  "blog",
  "impact",
  ...PLATFORM_IDS,
  ...CONTENT_INDEX.map((e) => e.route),
];

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
  "your-priorities": {
    title: "Your Priorities — Citizens Foundation",
    description:
      "An open-source idea generation, deliberation and decision-making platform connecting governments and citizens since 2008 — in thousands of projects across 45 countries.",
  },
  "policy-synth": {
    title: "Policy Synth — Citizens Foundation",
    description:
      "An open-source framework for orchestrating teams of AI agents that research problems, evolve solutions and answer with evidence — with human judgment always in the loop.",
  },
  "all-our-ideas": {
    title: "All Our Ideas — Citizens Foundation",
    description:
      "Wiki surveys: show people two ideas, let them pick one. Created at Princeton University, now maintained by Citizens Foundation and built into Your Priorities.",
  },
  "open-source": {
    title: "Open Source — Citizens Foundation",
    description:
      "All Citizens Foundation software is free, open source and MIT-licensed — the npm packages and GitHub repositories behind our democracy platforms.",
  },
  ...Object.fromEntries(
    CONTENT_INDEX.map((e) => [
      e.route,
      { title: `${e.title} — Citizens Foundation`, description: e.excerpt || e.title },
    ])
  ),
};
