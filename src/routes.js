// Pathname router + per-route SEO metadata.
// Single source of truth for the path <-> route-id mapping, shared by the app,
// the prerender script, and the sitemap generator. Article routes are derived
// from the markdown content index at build time.

import { CONTENT_INDEX } from "virtual:content-index";

// Production origin. Override per-deploy with VITE_SITE_ORIGIN (e.g. set it to
// https://new.citizens.is on the staging deploy) so canonical, og:url, og:image
// and the sitemap all point at the domain actually serving the build.
export const SITE =
  (import.meta.env && import.meta.env.VITE_SITE_ORIGIN) || "https://citizens.is";

// "home" maps to "/"; everything else maps to "/<id>/".
export const PLATFORM_IDS = ["your-priorities", "policy-synth", "all-our-ideas", "open-source"];
export const COMPANY_IDS = ["about", "contact", "in-the-news", "work-with-us"];
export const ROUTE_IDS = [
  "home",
  "blog",
  "impact",
  ...PLATFORM_IDS,
  ...COMPANY_IDS,
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
  // Unknown paths render the 404 page (and Cloudflare serves /404.html), so a
  // direct hit to a stale URL hydrates as "not found" rather than the homepage.
  return ROUTE_IDS.includes(clean) ? clean : "not-found";
}

// Trim a description to a search-snippet-friendly length (~160 chars) at a
// word boundary. The full excerpt is still shown on listing cards.
function clampDesc(s) {
  s = (s || "").trim();
  if (s.length <= 160) return s;
  const cut = s.slice(0, 158);
  const i = cut.lastIndexOf(" ");
  return (i > 90 ? cut.slice(0, i) : cut).replace(/[\s.,;:—–-]+$/, "") + "…";
}

// Absolute paths to pre-render, in order.
export const ROUTES = ROUTE_IDS.map(pathFor);

// Per-route <head> metadata.
export const META = {
  home: {
    title: "Citizens Foundation — better public decisions with collective intelligence & AI",
    description:
      "Citizens Foundation builds open-source platforms for better public decisions — combining collective intelligence and AI to turn public input into action.",
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
      "An open-source idea generation, deliberation and decision-making platform connecting governments and citizens since 2008 — in thousands of projects across over 50 countries.",
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
  about: {
    title: "About — Citizens Foundation",
    description:
      "A non-profit in Reykjavík, Iceland, founded in 2008 — bringing people together to debate and prioritize ideas that improve their communities.",
  },
  contact: {
    title: "Contact — Citizens Foundation",
    description:
      "Get in touch with Citizens Foundation in Reykjavík — citizens@citizens.is — for projects, partnerships, press or open-source questions.",
  },
  "in-the-news": {
    title: "In the News — Citizens Foundation",
    description:
      "Coverage of Citizens Foundation and Better Reykjavík in the Financial Times, The Guardian, The Washington Post, Fast Company and more.",
  },
  "work-with-us": {
    title: "Work with us — Citizens Foundation",
    description:
      "Participation consultancy, hosted engagement platforms and custom AI agent development from the team behind Your Priorities and Policy Synth.",
  },
  ...Object.fromEntries(
    CONTENT_INDEX.map((e) => [
      e.route,
      { title: `${e.title} — Citizens Foundation`, description: clampDesc(e.excerpt) || e.title },
    ])
  ),
  "not-found": {
    title: "Page not found — Citizens Foundation",
    description: "The page you’re looking for doesn’t exist or has moved.",
  },
};
