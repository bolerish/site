import { readdir, readFile } from "node:fs/promises";
import { basename } from "node:path";
import { visit } from "unist-util-visit";
import type { ArticleHeading } from "~/app/writing/_model/article.ts";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import { toString } from "mdast-util-to-string";
import GithubSlugger from "github-slugger";
import { parse } from "yaml";
import type { Article, ArticleContent } from "~/app/writing/_model/article.ts";

export function parseArticle(source: string, file: string): ArticleContent {
  const slug = basename(file, ".md");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`Invalid writing slug: ${file}`);
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(source);
  if (!match) throw new Error(`Missing YAML frontmatter: ${file}`);
  const metadata: unknown = parse(match[1]);
  if (
    !metadata ||
    typeof metadata !== "object" ||
    !("title" in metadata) ||
    typeof metadata.title !== "string" ||
    !metadata.title.trim() ||
    !("description" in metadata) ||
    typeof metadata.description !== "string" ||
    !metadata.description.trim() ||
    !("year" in metadata) ||
    typeof metadata.year !== "number" ||
    !Number.isInteger(metadata.year) ||
    metadata.year < 1 ||
    metadata.year > 9999
  ) {
    throw new Error(`Invalid writing metadata: ${file}`);
  }
  const date = "date" in metadata ? metadata.date : undefined;
  if (
    date !== undefined &&
    (typeof date !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      Number.isNaN(Date.parse(date)) ||
      new Date(date).toISOString().slice(0, 10) !== date ||
      Number(date.slice(0, 4)) !== metadata.year)
  )
    throw new Error(`Invalid writing date: ${file}`);
  const body = match[2].trim();
  const tree = unified().use(remarkParse).use(remarkGfm).parse(body);
  const slugger = new GithubSlugger();
  const headings: ArticleHeading[] = [];
  visit(tree, "heading", (node) => {
    const text = toString(node);
    headings.push({
      id: slugger.slug(text),
      text,
      depth: node.depth,
      offset: node.position!.start.offset!,
    });
  });
  const readingText = tree.children
    .map((node) => toString(node, { includeHtml: false, includeImageAlt: false }))
    .join("\n");
  // A rough estimate in whitespace-separated units, not a measured Korean reading speed.
  const wordsPerMinute = 200;
  return {
    headings,
    title: metadata.title,
    description: metadata.description,
    year: metadata.year,
    ...(date ? { date: date as string } : {}),
    body,
    readingMinutes: Math.max(
      1,
      Math.ceil(readingText.split(/\s+/u).filter(Boolean).length / wordsPerMinute),
    ),
  };
}

export async function discoverArticles(): Promise<Article[]> {
  const directory = new URL("../_content/", import.meta.url);
  const names = (await readdir(directory)).filter((name) => name.endsWith(".md")).sort();
  const slugs = new Set<string>();
  return Promise.all(
    names.map(async (name) => {
      const slug = basename(name, ".md");
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slugs.has(slug))
        throw new Error(`Invalid or duplicate writing slug: ${name}`);
      slugs.add(slug);
      return {
        ...parseArticle(await readFile(new URL(name, directory), "utf8"), name),
        slug,
        href: `/writing/${slug}`,
      };
    }),
  );
}

export function articleSitemap(articles: readonly Article[]) {
  const paths = ["/", "/writing", ...articles.map((article) => article.href)];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path) => `<url><loc>https://bolerish.com${path}</loc></url>`).join("")}</urlset>`;
}
