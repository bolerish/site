import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import stylex from "@stylexjs/unplugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  resolve: {
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
    stylex.vite({ useCSSLayers: true }),
    tanstackStart({
      srcDirectory: "src",
      router: {
        entry: "./index.tsx",
        routesDirectory: ".",
        indexToken: "page",
        routeFileIgnorePattern:
          "^_(ui|api|model|lib|config|shared)$|^(index|routeTree\\.gen)\\.[cm]?[jt]sx?$|^(shared|styles)$",
      },
      prerender: { enabled: true },
    }),
    react(),
  ],
});
