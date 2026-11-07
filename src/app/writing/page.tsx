import profile from "~/assets/profile.webp";
import { createFileRoute } from "@tanstack/react-router";
import * as stylex from "@stylexjs/stylex";
import { spacingVars } from "@bolerish/tokens/semantic.stylex";
import { Heading } from "@bolerish/ui/heading";
import { Paragraph } from "@bolerish/ui/paragraph";
import { Link } from "@bolerish/ui/link";
import { Item, ItemContent, ItemTitle, ItemDescription } from "@bolerish/ui/item";
import { RouterLink } from "~/shared/ui/RouterLink";
import { pageLayout } from "~/shared/styles/page-layout.stylex";
import { WritingLayout } from "~/app/writing/layout";
import { articles, articleYears } from "~/app/writing/_model/articles";

const description =
  "웹에서 무언가를 만들고 있습니다. 일상에서 발견한 것들을 직접 만들어보고, 더 나은 방법을 고민하는 걸 좋아합니다.";
const title = "Minyeong · bolerish";
const canonical = "https://bolerish.com/writing";
const image = new URL(profile, "https://bolerish.com").href;
export const Route = createFileRoute("/writing/")({
  staticData: { lang: "ko" },
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonical },
      { property: "og:site_name", content: "bolerish" },
      { property: "og:image", content: image },
      { property: "og:image:width", content: "1254" },
      { property: "og:image:height", content: "1254" },
      { property: "og:image:alt", content: "Minyeong 프로필" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
      { name: "twitter:image:alt", content: "Minyeong 프로필" },
    ],
    links: [{ rel: "canonical", href: canonical }],
  }),
  component: Writing,
});

function Writing() {
  return (
    <WritingLayout>
      <header {...stylex.props(pageLayout.intro)}>
        <Heading level={1} size="page">
          Minyeong
        </Heading>
        <Paragraph variant="description">{description}</Paragraph>
        <Paragraph variant="description">
          <RouterLink variant="plain" to="/writing/$slug" params={{ slug: "so-far" }}>
            나의 이야기
            <Link.ExternalIcon />
          </RouterLink>
        </Paragraph>
      </header>
      <section aria-labelledby="writing-heading" {...stylex.props(styles.section)}>
        <Heading id="writing-heading" level={2} size="section">
          Writing.
        </Heading>
        {articleYears.map((year) => (
          <div key={year} {...stylex.props(styles.yearGroup)}>
            <div {...stylex.props(styles.year)}>
              <Paragraph variant="description">{year}</Paragraph>
            </div>
            <ul {...stylex.props(styles.list)}>
              {articles
                .filter((article) => article.year === year)
                .map((article) => (
                  <li key={article.slug}>
                    <Item size="sm">
                      <ItemContent {...stylex.props(styles.row)}>
                        <ItemTitle>
                          <RouterLink
                            variant="current"
                            to="/writing/$slug"
                            params={{ slug: article.slug }}
                          >
                            {article.title}
                          </RouterLink>
                        </ItemTitle>
                        <ItemDescription>{article.description}</ItemDescription>
                      </ItemContent>
                    </Item>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </section>
    </WritingLayout>
  );
}

const styles = stylex.create({
  section: { display: "flex", flexDirection: "column", gap: spacingVars.space6 },
  // The year column and breakpoint belong to this editorial composition.
  yearGroup: {
    display: "grid",
    gridTemplateColumns: {
      default: "56px minmax(0, 1fr)",
      "@media (width < 768px)": "40px minmax(0, 1fr)",
    },
    columnGap: { default: spacingVars.space6, "@media (width < 768px)": spacingVars.space4 },
    rowGap: spacingVars.space4,
  },
  list: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  },
  year: { paddingTop: spacingVars.space3 },
  row: {
    display: "grid",
    gridTemplateColumns: {
      default: "80px minmax(0, 1fr)",
      "@media (width < 768px)": "minmax(0, 1fr)",
    },
    columnGap: spacingVars.space4,
  },
});
