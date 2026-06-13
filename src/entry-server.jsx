import { renderToString } from "react-dom/server";
import App from "./App.jsx";
import { routeFromPath } from "./routes.js";
import { loadDoc } from "./content/docs.js";

// Re-export the route table, metadata, and content index so the prerender +
// SEO scripts can drive the whole build from this single server bundle.
export { ROUTES, META, SITE, routeFromPath, pathFor } from "./routes.js";
export { CONTENT_INDEX } from "virtual:content-index";

export async function render(path) {
  const route = routeFromPath(path);
  const doc = await loadDoc(route);
  return renderToString(<App initialRoute={route} initialDoc={doc} />);
}
