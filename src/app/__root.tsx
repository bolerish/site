import { createRootRoute, HeadContent, Scripts, useMatches } from "@tanstack/react-router";
import * as stylex from "@stylexjs/stylex";
import { lightColorTheme, darkColorTheme } from "@bolerish/tokens/themes.stylex";
import { surface } from "@bolerish/ui/surface";
import { useEffect, type ReactNode } from "react";
import { NotFoundPage } from "~/app/not-found";
import css from "~/site.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
    ],
    links: [
      {
        rel: "preload",
        href: "/fonts/LINESeedKR-Rg.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        href: "/fonts/LINESeedKR-Bd.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      { rel: "stylesheet", href: css },
      ...(import.meta.env.DEV ? [{ rel: "stylesheet", href: "/virtual:stylex.css" }] : []),
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
    ],
  }),
  notFoundComponent: NotFoundPage,
  shellComponent: Root,
});

const themeClasses = {
  light: stylex.props(lightColorTheme).className ?? "",
  dark: stylex.props(darkColorTheme).className ?? "",
};

function Root({ children }: { children: ReactNode }) {
  const lang = useMatches({
    select: (matches) =>
      [...matches].reverse().find((match) => match.staticData.lang)?.staticData.lang ?? "en",
  });
  useEffect(() => {
    const preference = window.matchMedia("(prefers-color-scheme: dark)");
    const updateTheme = () => {
      const mode = preference.matches ? "dark" : "light";
      document.documentElement.dataset.bolerishTheme = mode;
      document.documentElement.className = themeClasses[mode];
    };
    updateTheme();

    preference.addEventListener("change", updateTheme);
    return () => preference.removeEventListener("change", updateTheme);
  }, []);

  return (
    <html
      lang={lang}
      className={themeClasses.light}
      suppressHydrationWarning
      {...surface.props({ mode: "solid" })}
    >
      <head>
        {/* Critical canvas colors mirror white and neutral900 before external CSS loads. */}
        <style>{`html{color-scheme:light;background:#fff}body{background:inherit}@media(prefers-color-scheme:dark){html{color-scheme:dark;background:#08090a}}`}</style>
        <script
          dangerouslySetInnerHTML={{
            __html: `(()=>{const mode=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.bolerishTheme=mode;document.documentElement.className=(${JSON.stringify(themeClasses)})[mode]})()`,
          }}
        />
        <HeadContent />
        {import.meta.env.DEV ? <script type="module" src="/@id/virtual:stylex:runtime" /> : null}
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
