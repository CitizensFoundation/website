import { hydrateRoot } from "react-dom/client";
import App from "./App.jsx";
import { routeFromPath } from "./routes.js";
import "./styles.css";

// Hydrate against the route that matches the served path, so the client's
// first render matches the pre-rendered HTML exactly (no hydration mismatch).
hydrateRoot(
  document.getElementById("root"),
  <App initialRoute={routeFromPath(location.pathname)} />
);
