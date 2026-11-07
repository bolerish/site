export type ArticleHeading = { id: string; text: string; depth: number; offset: number };
export type ArticleContent = {
  headings: ArticleHeading[];
  title: string;
  description: string;
  year: number;
  date?: string;
  body: string;
  readingMinutes: number;
};
export type Article = ArticleContent & { slug: string; href: string };
