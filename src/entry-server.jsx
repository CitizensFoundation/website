import { renderToString } from "react-dom/server";
import App from "./App.jsx";
import { routeFromPath } from "./routes.js";

// Re-export the route table and metadata so the prerender + SEO scripts can
// drive the whole build from this single server bundle.
export { ROUTES, META, SITE, routeFromPath, pathFor } from "./routes.js";

export function render(path) {
  return renderToString(<App initialRoute={routeFromPath(path)} />);
}
