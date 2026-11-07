import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { surface } from "@bolerish/ui/surface";
import { useEffect, type ReactNode } from "react";
import css from "./site.css?url";

const title = "bolerish";
const description = "Software, interfaces, and experiments by Minyeong Jeong.";
const canonical = "https://bolerish.com/";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonical },
    ],
    links: [
      { rel: "stylesheet", href: css },
      ...(import.meta.env.DEV ? [{ rel: "stylesheet", href: "/virtual:stylex.css" }] : []),
      { rel: "canonical", href: canonical },
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
    ],
  }),
  shellComponent: Root,
});

function Root({ children }: { children: ReactNode }) {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-color-scheme: dark)");
    const updateTheme = () => {
      document.documentElement.dataset.bolerishTheme = preference.matches ? "dark" : "light";
    };
    updateTheme();

    preference.addEventListener("change", updateTheme);
    return () => preference.removeEventListener("change", updateTheme);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning {...surface.props({ mode: "solid" })}>
      <head>
        {/* Critical canvas colors mirror white and neutral900 before external CSS loads. */}
        <style>{`html{color-scheme:light;background:#fff}body{background:inherit}@media(prefers-color-scheme:dark){html{color-scheme:dark;background:#08090a}}`}</style>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.dataset.bolerishTheme=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";`,
          }}
        />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
