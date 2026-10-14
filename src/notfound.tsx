import React from "react";
import ReactDOM from "react-dom/client";

import NotFound from "./components/pages/NotFound";
import "./globals.css";

// Entry for 404.html, which Vercel serves for any unknown path.
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <NotFound />
  </React.StrictMode>
);
