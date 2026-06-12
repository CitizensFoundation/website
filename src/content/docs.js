import { CONTENT_INDEX } from "virtual:content-index";
import { parseFrontmatter } from "./frontmatter.js";

// Non-eager glob: every markdown document becomes its own lazy chunk, so the
// client downloads exactly the one doc it is hydrating (SSR awaits the same
// chunk at prerender time — identical input on both sides).
const modules = import.meta.glob("/content/**/*.md", { query: "?raw", import: "default" });

export async function loadDoc(routeId) {
  const entry = CONTENT_INDEX.find((e) => e.route === routeId);
  if (!entry) return null;
  const loader = modules[entry.file];
  if (!loader) return null;
  const { meta, body } = parseFrontmatter(await loader());
  return { ...entry, ...meta, body };
}
