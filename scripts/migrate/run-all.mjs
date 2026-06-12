// One-time migration entry point. Reads ONLY from allContentFromOldWebsite/
// (the immutable archive of the old WordPress site) and writes:
//   content/blog/*.md, content/impact/*.md   — new editable source of truth
//   public/uploads/**                        — referenced media, downscaled
//   public/_redirects                        — old URL -> new URL mapping
// Idempotent: clears its own outputs first. Run: node scripts/migrate/run-all.mjs
// After the migration is accepted, content/*.md is edited directly; these
// scripts stay for reference and are not part of the build.

import { rmSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { ARCHIVE, CONTENT_DIR, UPLOADS_DIR, readMeta } from "./lib/archive.mjs";
import { migrateBlog } from "./migrate-blog.mjs";
import { migrateImpact } from "./migrate-impact.mjs";
import { generateRedirects } from "./generate-redirects.mjs";
import { report } from "./lib/media.mjs";

rmSync(CONTENT_DIR, { recursive: true, force: true });
rmSync(UPLOADS_DIR, { recursive: true, force: true });
mkdirSync(CONTENT_DIR, { recursive: true });
mkdirSync(UPLOADS_DIR, { recursive: true });

// Slug sets up front so both converters can rewrite internal cross-links.
const blogSlugs = new Set(
  readMeta("rest-posts.json").filter((p) => p.status === "publish").map((p) => p.slug)
);
const impactSlugs = new Set(
  readdirSync(join(ARCHIVE, "html", "impact", "portfolio_page"), { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
);

await migrateBlog({ blogSlugs, impactSlugs });
await migrateImpact({ blogSlugs, impactSlugs });
generateRedirects({ blogSlugs, impactSlugs });
report();
