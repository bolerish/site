import * as stylex from "@stylexjs/stylex";
import { spacingVars, colorVars, typo } from "@bolerish/tokens/semantic.stylex";
import { Heading } from "@bolerish/ui/heading";
import { Paragraph } from "@bolerish/ui/paragraph";
import { TableOfContents } from "~/app/writing/$slug/_ui/TableOfContents";
import { MarkdownContent } from "~/app/writing/$slug/_ui/MarkdownContent";
import { Separator } from "@bolerish/ui/separator";
import { Avatar, AvatarImage } from "@bolerish/ui/avatar";
import profile from "~/assets/profile.webp";
import { WritingLayout } from "~/app/writing/layout";
import { pageLayout } from "~/shared/styles/page-layout.stylex";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { articles } from "~/app/writing/_model/articles";
import { NotFoundPage } from "~/app/not-found";

export const Route = createFileRoute("/writing/$slug/")({
  staticData: { lang: "ko" },
  loader: ({ params }) => {
    const article = articles.find((article) => article.slug === params.slug);
    if (!article) throw notFound();
    return article;
  },
  head: ({ loaderData: article }) =>
    article
      ? {
          meta: [
            { title: article.title + " · bolerish" },
            { name: "description", content: article.description },
            { property: "og:title", content: article.title + " · bolerish" },
            { property: "og:description", content: article.description },
            { property: "og:type", content: "article" },
            { property: "og:url", content: "https://bolerish.com" + article.href },
          ],
          links: [{ rel: "canonical", href: "https://bolerish.com" + article.href }],
        }
      : {},
  component: ArticlePage,
  notFoundComponent: NotFoundPage,
});
function ArticlePage() {
  const article = Route.useLoaderData();
  return (
    <WritingLayout articleTitle={article.title}>
      <article {...stylex.props(styles.article)}>
        <header {...stylex.props(pageLayout.intro, styles.header)}>
          <Heading level={1} size="page" style={{ fontSize: "3rem" }}>
            {article.title}
          </Heading>
          <div {...stylex.props(styles.author)}>
            <Avatar size="sm">
              <AvatarImage
                keepMounted
                src={profile}
                alt=""
                width={32}
                height={32}
                loading="eager"
              />
            </Avatar>
            <div {...stylex.props(styles.authorDetails)}>
              <strong {...stylex.props(styles.authorName)}>Minyeong</strong>
              <Paragraph variant="description" style={{ color: colorVars.fgTertiary }}>
                <span {...stylex.props(styles.metaDetails)}>
                  {article.date ? (
                    <>
                      <time dateTime={article.date}>
                        {new Intl.DateTimeFormat("ko-KR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          timeZone: "UTC",
                        }).format(new Date(article.date))}
                      </time>
                      <span aria-hidden="true">·</span>
                    </>
                  ) : null}
                  <span>{article.readingMinutes}분</span>
                </span>
              </Paragraph>
            </div>
          </div>
        </header>
        <Separator {...stylex.props(styles.divider)} />
        <div {...stylex.props(styles.content)}>
          <MarkdownContent article={article} />
          <TableOfContents headings={article.headings} />
        </div>
      </article>
    </WritingLayout>
  );
}
const styles = stylex.create({
  article: {
    display: "flex",
    flexDirection: "column",
    paddingBottom: {
      default: `calc(${spacingVars.space12} + ${spacingVars.space6})`,
      "@media (width < 768px)": `calc(${spacingVars.space10} + ${spacingVars.space4})`,
    },
  },
  header: {
    minHeight: 0,
    paddingBottom: spacingVars.space4,
    display: "flex",
    flexDirection: "column",
    gap: spacingVars.space4,
  },
  authorDetails: { display: "flex", flexDirection: "column" },
  author: {
    display: "flex",
    alignItems: "center",
    gap: spacingVars.space3,
  },
  content: { position: "relative" },
  divider: { marginBlock: spacingVars.space12 },
  metaDetails: { display: "inline-flex", alignItems: "center", gap: spacingVars.space2 },
  authorName: { fontSize: typo.fontSizeMd, fontWeight: typo.fontWeightSemibold },
});
