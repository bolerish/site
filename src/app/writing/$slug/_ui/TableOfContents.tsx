import { colorVars, sizeVars, spacingVars } from "@bolerish/tokens/semantic.stylex";
import { Link } from "@bolerish/ui/link";
import { Separator } from "@bolerish/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@bolerish/ui/tooltip";
import * as stylex from "@stylexjs/stylex";
import { useEffect, useState } from "react";
import type { ArticleHeading } from "~/app/writing/_model/article";

export function TableOfContents({ headings }: { headings: readonly ArticleHeading[] }) {
  const [activeId, setActiveId] = useState(headings[0]?.id);

  useEffect(() => {
    function updateActiveHeading() {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        setActiveId(headings.at(-1)?.id ?? headings[0]?.id);
        return;
      }

      let nextId = headings[0]?.id;

      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (element && element.getBoundingClientRect().top <= window.innerHeight * 0.3) {
          nextId = heading.id;
        }
      }

      setActiveId(nextId);
    }

    function updateHashHeading() {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (headings.some((heading) => heading.id === id)) setActiveId(id);
    }
    updateActiveHeading();
    window.addEventListener("hashchange", updateHashHeading);
    window.addEventListener("scroll", updateActiveHeading, { passive: true });
    window.addEventListener("resize", updateActiveHeading);

    return () => {
      window.removeEventListener("hashchange", updateHashHeading);
      window.removeEventListener("scroll", updateActiveHeading);
      window.removeEventListener("resize", updateActiveHeading);
    };
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <div {...stylex.props(styles.rail)}>
      <TooltipProvider delay={0}>
        <nav aria-label="목차" {...stylex.props(styles.root)}>
          <div {...stylex.props(styles.items)}>
            {headings.map((heading) => (
              <Tooltip key={heading.id}>
                <TooltipTrigger
                  render={
                    <Link
                      href={`#${heading.id}`}
                      variant="plain"
                      style={{ transition: "none" }}
                      {...stylex.props(styles.item)}
                      aria-label={heading.text}
                      aria-current={activeId === heading.id ? "location" : undefined}
                    >
                      <Separator
                        decorative
                        {...stylex.props(
                          styles.line,
                          activeId === heading.id && styles.currentLine,
                        )}
                      />
                    </Link>
                  }
                />
                <TooltipContent side="right">{heading.text}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </nav>
      </TooltipProvider>
    </div>
  );
}

const styles = stylex.create({
  rail: {
    display: { default: "none", "@media (min-width: 1200px)": "block" },
    position: "absolute",
    insetBlock: 0,
    left: "calc(100% + (100vw - 100%) * 0.1875)",
    transform: "translateX(-50%)",
    width: sizeVars.controlXs,
  },
  root: {
    alignSelf: "start",
    display: "grid",
    maxHeight: `calc(100dvh - ${spacingVars.space12})`,
    overflowY: "auto",
    position: "sticky",
    scrollbarWidth: "none",
    top: spacingVars.space6,
  },
  items: { display: "grid", justifyItems: "start" },
  item: {
    minHeight: sizeVars.controlXs,
    width: sizeVars.controlXs,
  },
  line: {
    backgroundColor: colorVars.fgTertiary,
    width: spacingVars.space4,
  },
  currentLine: {
    backgroundColor: colorVars.fgPrimary,
    width: spacingVars.space6,
  },
});
