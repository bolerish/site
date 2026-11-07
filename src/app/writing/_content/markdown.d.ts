declare module "*.md?article" {
  const article: import("../_model/article").ArticleContent;
  export default article;
}
