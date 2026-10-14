import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import NotFound from "./components/pages/NotFound";
import "lenis/dist/lenis.css";
import "./globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* Vercel serves 404.html for unknown paths; this covers dev and any SPA fallback. */}
    {["/", "/index.html"].includes(window.location.pathname) ? <App /> : <NotFound />}
  </React.StrictMode>
);
