import { createFileRoute } from "@tanstack/react-router";
import * as stylex from "@stylexjs/stylex";
import { spacingVars, colorVars } from "@bolerish/tokens/semantic.stylex";
import { Item, ItemGroup, ItemContent, ItemTitle, ItemDescription } from "@bolerish/ui/item";
import { Heading } from "@bolerish/ui/heading";
import { Paragraph } from "@bolerish/ui/paragraph";
import { Link } from "@bolerish/ui/link";
import { pageLayout } from "~/shared/styles/page-layout.stylex";
import { RouterLink } from "~/shared/ui/RouterLink";
import { projects } from "~/app/_model/projects";

const title = "bolerish";
const description = "Software, interfaces, and experiments by Minyeong Jeong.";
const canonical = "https://bolerish.com/";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonical },
    ],
    links: [{ rel: "canonical", href: canonical }],
  }),
  component: Page,
});

function Page() {
  return (
    <main {...stylex.props(pageLayout.page, styles.page)}>
      <div {...stylex.props(pageLayout.content)}>
        <div aria-hidden="true" {...stylex.props(pageLayout.navigationSlot)} />
        <header {...stylex.props(pageLayout.intro)}>
          <Heading level={1} size="page">
            bolerish
          </Heading>
          <Paragraph variant="description">
            A little more my own. <br />
            Software, interfaces, and experiments by{" "}
            <RouterLink variant="current" to="/writing">
              Minyeong
            </RouterLink>
            .
          </Paragraph>
        </header>
        <section>
          <div {...stylex.props(styles.sectionHeading)}>
            <Heading level={2} size="section">
              Stuff.
            </Heading>
          </div>
          <ItemGroup>
            {projects.map((project) => (
              <Item key={project.id} size="sm">
                <ItemContent {...stylex.props(styles.row)}>
                  <ItemTitle>
                    {project.href ? (
                      <Link variant="current" href={project.href}>
                        {project.name}
                      </Link>
                    ) : (
                      project.name
                    )}
                  </ItemTitle>
                  <ItemDescription>{project.description}</ItemDescription>
                </ItemContent>
              </Item>
            ))}
          </ItemGroup>
        </section>
      </div>
    </main>
  );
}

const styles = stylex.create({
  page: {
    backgroundColor: {
      default: "#ffffff",
      "@media (prefers-color-scheme: dark)": colorVars.bgCanvas,
    },
    minHeight: stylex.firstThatWorks("100dvh", "100vh"),
  },
  sectionHeading: {
    display: "grid",
    gap: spacingVars.space1,
    marginBottom: spacingVars.space4,
  },
  row: {
    display: "grid",
    gridTemplateColumns: {
      default: "80px minmax(0, 1fr)",
      "@media (width < 768px)": "minmax(0, 1fr)",
    },
    columnGap: spacingVars.space4,
  },
});
