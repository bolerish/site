import { createFileRoute } from "@tanstack/react-router";
import * as stylex from "@stylexjs/stylex";
import { spacingVars, colorVars } from "@bolerish/tokens/semantic.stylex";
import { Item, ItemGroup, ItemContent, ItemTitle, ItemDescription } from "@bolerish/ui/item";
import { Heading } from "@bolerish/ui/heading";
import { Paragraph } from "@bolerish/ui/paragraph";
import { Link } from "@bolerish/ui/link";
import { projects } from "./_model/projects";

export const Route = createFileRoute("/")({ component: Page });

export function Page() {
  return (
    <main {...stylex.props(styles.page)}>
      <div {...stylex.props(styles.main)}>
        <header {...stylex.props(styles.intro)}>
          <Heading level={1} size="page">
            bolerish
          </Heading>
          <Paragraph variant="description">
            A little more my own. <br />
            Software, interfaces, and experiments by{" "}
            <Link variant="current" href="https://minyeong.xyz/">
              Minyeong
            </Link>
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
  main: {
    maxWidth: 736,
    marginInline: "auto",
    paddingLeft: { default: 0, "@media (width < 768px)": spacingVars.space4 },
    paddingRight: { default: 0, "@media (width < 768px)": spacingVars.space4 },
    paddingBottom: spacingVars.space12,
  },
  intro: {
    height: {
      default: 320,
      "@media (width < 768px)": stylex.firstThatWorks<string>(
        `clamp(calc(${spacingVars.space12} * 2), calc(100dvh - 480px), 256px)`,
        "256px",
      ),
    },
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: spacingVars.space2,
  },
  sectionHeading: {
    display: "grid",
    gap: spacingVars.space1,
    marginBottom: spacingVars.space4,
    paddingTop: spacingVars.space8,
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
