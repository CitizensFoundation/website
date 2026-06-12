import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Static site. The client build uses index.html as the entry; a separate
// `--ssr src/entry-server.jsx` build feeds scripts/prerender.mjs, which
// writes one static HTML file per route into dist/<route>/index.html.
export default defineConfig({
  base: "/",
  plugins: [react()],
  build: {
    outDir: "dist",
  },
});
