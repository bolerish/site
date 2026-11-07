import { readFile } from "node:fs/promises";
import {
  discoverArticles,
  parseArticle,
  articleSitemap,
} from "./src/app/writing/_lib/content-build.ts";
import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";
import stylex from "@stylexjs/unplugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";

export default defineConfig(async () => {
  const articles = await discoverArticles();
  return {
    resolve: {
      tsconfigPaths: true,
      alias: [
        {
          find: /^@bolerish\/ui$/,
          replacement: fileURLToPath(
            new URL("./node_modules/@bolerish/ui/dist/global.css", import.meta.url),
          ),
        },
      ],
    },
    server: { port: 3000, strictPort: true },
    optimizeDeps: { exclude: ["@bolerish/tokens"] },
    ssr: { noExternal: ["@bolerish/tokens"] },
    plugins: [
      {
        name: "writing-markdown",
        enforce: "pre",
        configureServer(server) {
          server.middlewares.use("/sitemap.xml", async (_req, res) => {
            res.setHeader("Content-Type", "application/xml");
            res.end(articleSitemap(await discoverArticles()));
          });
        },
        generateBundle() {
          this.emitFile({
            type: "asset",
            fileName: "sitemap.xml",
            source: articleSitemap(articles),
          });
        },
        async load(id) {
          if (!id.endsWith(".md?article")) return;
          const file = id.slice(0, -"?article".length);
          this.addWatchFile(file);
          return `export default ${JSON.stringify(parseArticle(await readFile(file, "utf8"), file))}`;
        },
      } satisfies Plugin,
      stylex.vite({ useCSSLayers: true }),
      tanstackStart({
        srcDirectory: "src",
        router: {
          entry: "./index.tsx",
          routesDirectory: "./app",
          indexToken: "page",
          routeFileIgnorePattern:
            "^_(ui|api|model|lib|config|shared|content)$|^(index|layout|routeTree\\.gen)\\.[cm]?[jt]sx?$|^shared$",
        },
        pages: [
          { path: "/" },
          { path: "/writing" },
          { path: "/not-found", prerender: { outputPath: "/404.html", autoSubfolderIndex: false } },
          ...articles.map((article) => ({ path: article.href })),
        ],
        prerender: { enabled: true, autoStaticPathsDiscovery: false, crawlLinks: false },
      }),
      react(),
    ],
  };
});
