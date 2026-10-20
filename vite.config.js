import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// `vite dev` doesn't run Vercel Functions. This serves api/tiktok.ts (which
// needs no secrets) so the live TikTok numbers work locally too.
const devApi = () => ({
  name: "dev-api",
  apply: "serve",
  configureServer(server) {
    server.middlewares.use("/api/tiktok", async (req, res) => {
      const { default: handler } = await server.ssrLoadModule("/api/tiktok.ts");
      await handler(req, res);
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), devApi()],
  build: {
    rollupOptions: {
      // 404.html is a page of its own: Vercel serves it for unknown paths.
      input: {
        main: fileURLToPath(new URL("./index.html", import.meta.url)),
        notFound: fileURLToPath(new URL("./404.html", import.meta.url)),
      },
    },
  },
});
