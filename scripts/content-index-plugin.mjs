// Vite plugin: virtual:content-index — frontmatter-only index of content/*.md.
// This is the only content shipped to every page; full bodies load as
// per-document lazy chunks via src/content/docs.js. content/*.md stays the
// single editable source of truth (the index is regenerated on every build
// and invalidated on change in dev).

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parseFrontmatter } from "../src/content/frontmatter.js";

const VIRTUAL = "virtual:content-index";
const RESOLVED = "\0" + VIRTUAL;

function truncate(text, max) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(" ")) + "…";
}

export default function contentIndexPlugin() {
  let root = process.cwd();

  const scan = () => {
    const entries = [];
    for (const type of ["blog", "impact"]) {
      let files = [];
      try {
        files = readdirSync(join(root, "content", type)).filter((f) => f.endsWith(".md"));
      } catch {
        continue; // collection not migrated yet
      }
      for (const name of files) {
        const { meta } = parseFrontmatter(readFileSync(join(root, "content", type, name), "utf8"));
        entries.push({
          type,
          slug: meta.slug,
          route: `${type}/${meta.slug}`,
          title: meta.title || meta.slug,
          date: meta.date || "1970-01-01",
          hero: meta.hero || null,
          excerpt: truncate(meta.excerpt || "", 240),
          categories: meta.categories || [],
          link: meta.link || null,
          file: `/content/${type}/${name}`,
        });
      }
    }
    entries.sort((a, b) => (a.date < b.date ? 1 : -1));
    return entries;
  };

  return {
    name: "content-index",
    configResolved(config) {
      root = config.root;
    },
    resolveId(id) {
      if (id === VIRTUAL) return RESOLVED;
    },
    load(id) {
      if (id !== RESOLVED) return;
      return `export const CONTENT_INDEX = ${JSON.stringify(scan())};`;
    },
    configureServer(server) {
      server.watcher.add(join(root, "content"));
      server.watcher.on("all", (event, path) => {
        if (path.includes(join(root, "content")) && path.endsWith(".md")) {
          const mod = server.moduleGraph.getModuleById(RESOLVED);
          if (mod) {
            server.moduleGraph.invalidateModule(mod);
            server.ws.send({ type: "full-reload" });
          }
        }
      });
    },
  };
}
