import { hydrateRoot } from "react-dom/client";
import App from "./App.jsx";
import { routeFromPath } from "./routes.js";
import { loadDoc } from "./content/docs.js";
import "./styles.css";

// Hydrate against the route that matches the served path; article routes
// first await their (single, lazy-chunked) markdown document so the client's
// first render matches the pre-rendered HTML exactly. Async IIFE rather than
// top-level await — the default build target predates TLA.
(async () => {
  const route = routeFromPath(location.pathname);
  const doc = await loadDoc(route);
  hydrateRoot(
    document.getElementById("root"),
    <App initialRoute={route} initialDoc={doc} />
  );
})();
