import type { ArticleContent, Article } from "~/app/writing/_model/article";

const modules = import.meta.glob<ArticleContent>("../_content/*.md", {
  eager: true,
  query: "?article",
  import: "default",
});
export const articles: Article[] = Object.entries(modules)
  .map(([file, article]) => {
    const slug = file.slice(file.lastIndexOf("/") + 1, -3);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`Invalid writing slug: ${file}`);
    return { ...article, slug, href: `/writing/${slug}` };
  })
  .sort(
    (a, b) =>
      b.year - a.year || (b.date ?? "").localeCompare(a.date ?? "") || a.slug.localeCompare(b.slug),
  );
export const articleYears = [...new Set(articles.map((article) => article.year))];
