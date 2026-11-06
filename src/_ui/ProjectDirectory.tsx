import * as stylex from "@stylexjs/stylex";
import { spacingVars } from "@bolerish/tokens/semantic.stylex";
import { Card, CardHeader, CardTitle, CardDescription } from "@bolerish/ui/card";
import { Item, ItemGroup, ItemContent, ItemTitle, ItemDescription } from "@bolerish/ui/item";
import { Heading } from "@bolerish/ui/heading";
import { Paragraph } from "@bolerish/ui/paragraph";
import { Link } from "@bolerish/ui/link";
import { projects } from "../_model/projects";

export function ProjectDirectory() {
  return (
    <main {...stylex.props(styles.main)}>
      <header {...stylex.props(styles.section)}>
        <Heading level={1}>bolerish</Heading>
        <Paragraph>
          Software, interfaces, and experiments by{" "}
          <Link href="https://minyeong.xyz/">Minyeong Jeong</Link>.
        </Paragraph>
      </header>
      <section {...stylex.props(styles.section)}>
        <Heading level={2}>Libraries</Heading>
        <ItemGroup>
          {projects.slice(0, 2).map((project) => (
            <Item key={project.id}>
              <ItemContent>
                <ItemTitle>
                  <Link href={project.href ?? undefined}>{project.name}</Link>
                </ItemTitle>
                <ItemDescription>{project.description}</ItemDescription>
              </ItemContent>
            </Item>
          ))}
        </ItemGroup>
      </section>
      <section {...stylex.props(styles.section)}>
        <Heading level={2}>Extensions</Heading>
        <div {...stylex.props(styles.cards)}>
          {projects.slice(2).map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}

const styles = stylex.create({
  main: {
    maxWidth: 736,
    marginInline: "auto",
    padding: spacingVars.space6,
    display: "grid",
    gap: spacingVars.space12,
  },
  section: { display: "grid", gap: spacingVars.space4 },
  cards: {
    display: "grid",
    gridTemplateColumns: {
      default: "repeat(2, minmax(0, 1fr))",
      "@media (width < 768px)": "minmax(0, 1fr)",
    },
    gap: spacingVars.space4,
  },
});
