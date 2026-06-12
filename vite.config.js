import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import contentIndexPlugin from "./scripts/content-index-plugin.mjs";

// Static site. The client build uses index.html as the entry; a separate
// `--ssr src/entry-server.jsx` build feeds scripts/prerender.mjs, which
// writes one static HTML file per route into dist/<route>/index.html.
// Content lives in content/**/*.md (see scripts/content-index-plugin.mjs).
export default defineConfig({
  base: "/",
  plugins: [react(), contentIndexPlugin()],
  build: {
    outDir: "dist",
  },
});
