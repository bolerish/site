import * as stylex from "@stylexjs/stylex";
import { Children, isValidElement, type ReactNode } from "react";
import {
  spacingVars,
  colorVars,
  sizeVars,
  typo,
  radiusVars,
} from "@bolerish/tokens/semantic.stylex";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import type { Root as HtmlRoot } from "hast";
import { Checkbox } from "@bolerish/ui/checkbox";
import {
  Table,
  TableContainer,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@bolerish/ui/table";
import { Separator } from "@bolerish/ui/separator";
import { Paragraph } from "@bolerish/ui/paragraph";
import { Link } from "@bolerish/ui/link";
import { RouterLink } from "~/shared/ui/RouterLink";
import { visit } from "unist-util-visit";
import type { Root } from "mdast";
import type { Article } from "~/app/writing/_model/article";

const imageAssets = import.meta.glob<string>(
  "../../_content/images/**/*.{png,jpg,jpeg,webp,avif,gif,svg}",
  { eager: true, query: "?url", import: "default" },
);

const htmlSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), "figure", "figcaption"],
  attributes: {
    ...defaultSchema.attributes,
    img: [...(defaultSchema.attributes?.img ?? []), "width", "height"],
    p: [...(defaultSchema.attributes?.p ?? []), "data-compact-spacing"],
  },
};

export function MarkdownContent({ article }: { article: Article }) {
  return (
    <div {...stylex.props(styles.body)}>
      <Markdown
        remarkPlugins={[
          remarkGfm,
          () => (tree: Root) => {
            visit(tree, "paragraph", (node, index, parent) => {
              const followsHeading =
                typeof index === "number" && parent?.children[index - 1]?.type === "heading";
              node.data = {
                ...node.data,
                hProperties: {
                  ...node.data?.hProperties,
                  "data-compact-spacing": followsHeading || parent?.type === "listItem",
                },
              };
            });
            visit(tree, "heading", (node) => {
              const heading = article.headings.find(
                (heading) => heading.offset === node.position?.start.offset,
              );
              if (heading)
                node.data = {
                  ...node.data,
                  hProperties: { ...node.data?.hProperties, id: heading.id },
                };
            });
          },
        ]}
        rehypePlugins={[
          rehypeRaw,
          [rehypeSanitize, htmlSchema],
          () => (tree: HtmlRoot) => {
            // Preserve our generated TOC and footnote targets after sanitization prefixes IDs.
            visit(tree, "element", (node) => {
              const id = node.properties.id;
              if (typeof id !== "string") return;
              const heading = article.headings.find(
                (heading) => id === `user-content-${heading.id}`,
              );
              if (/^h[1-6]$/.test(node.tagName) && heading) node.properties.id = heading.id;
              if (
                id.startsWith("user-content-user-content-fn") ||
                id === "user-content-footnote-label"
              )
                node.properties.id = id.slice("user-content-".length);
            });
          },
        ]}
        components={{
          figure: ({ children }) => <figure {...stylex.props(styles.figure)}>{children}</figure>,
          figcaption: ({ children }) => (
            <figcaption>
              <Paragraph variant="caption">{children}</Paragraph>
            </figcaption>
          ),
          section: ({ node: _node, children, ...props }) => (
            <section {...props} {...stylex.props(styles.footnotes)}>
              {children}
            </section>
          ),
          p: ({ children, node }) => (
            <p
              {...stylex.props(
                styles.paragraph,
                node?.properties["data-compact-spacing"] === true && styles.compactParagraph,
              )}
            >
              {children}
            </p>
          ),
          h1: ({ children, id }) => (
            <h2 id={id} tabIndex={-1} {...stylex.props(styles.proseHeading, styles.headingLarge)}>
              {children}
            </h2>
          ),
          h2: ({ children, id, className }) => (
            <h2
              id={id}
              tabIndex={-1}
              {...stylex.props(
                styles.proseHeading,
                styles.headingLarge,
                className === "sr-only" && styles.screenReaderOnly,
              )}
            >
              {children}
            </h2>
          ),
          h3: ({ children, id }) => (
            <h3 id={id} tabIndex={-1} {...stylex.props(styles.proseHeading, styles.headingMedium)}>
              {children}
            </h3>
          ),
          h4: ({ children, id }) => (
            <h4 id={id} tabIndex={-1} {...stylex.props(styles.proseHeading, styles.headingSmall)}>
              {children}
            </h4>
          ),
          h5: ({ children, id }) => (
            <h5 id={id} tabIndex={-1} {...stylex.props(styles.proseHeading, styles.headingSmall)}>
              {children}
            </h5>
          ),
          h6: ({ children, id }) => (
            <h6 id={id} tabIndex={-1} {...stylex.props(styles.proseHeading, styles.headingSmall)}>
              {children}
            </h6>
          ),
          strong: ({ children }) => <strong {...stylex.props(styles.strong)}>{children}</strong>,
          ul: ({ children, className }) => (
            <ul
              {...stylex.props(
                styles.unorderedList,
                className?.includes("contains-task-list") && styles.taskList,
              )}
            >
              {children}
            </ul>
          ),
          li: ({ children, className, id }) => (
            <li
              id={id}
              {...stylex.props(
                styles.listItem,
                className?.includes("task-list-item") && styles.taskItem,
              )}
            >
              {children}
            </li>
          ),
          input: ({ checked }) => (
            <Checkbox
              checked={checked ?? false}
              disabled
              aria-label={checked ? "완료" : "미완료"}
            />
          ),
          table: ({ children }) => (
            <TableContainer {...stylex.props(styles.table)}>
              <Table>{children}</Table>
            </TableContainer>
          ),
          thead: ({ children }) => <TableHeader>{children}</TableHeader>,
          tbody: ({ children }) => <TableBody>{children}</TableBody>,
          tr: ({ children }) => <TableRow>{children}</TableRow>,
          th: ({ children, style }) => <TableHead style={style}>{children}</TableHead>,
          td: ({ children, style }) => <TableCell style={style}>{children}</TableCell>,
          ol: ({ children, start }) => (
            <ol start={start} {...stylex.props(styles.orderedList)}>
              {children}
            </ol>
          ),
          pre: ({ children }) => (
            <pre {...stylex.props(styles.codeBlock)}>
              {Children.map(children, (child) =>
                isValidElement<{ children: ReactNode; className?: string }>(child) ? (
                  <code className={child.props.className}>{child.props.children}</code>
                ) : (
                  child
                ),
              )}
            </pre>
          ),
          code: ({ children, className }) => (
            <code
              {...stylex.props(styles.code)}
              className={[stylex.props(styles.code).className, className].filter(Boolean).join(" ")}
            >
              {children}
            </code>
          ),
          img: ({ node: _node, src, ...props }) => {
            let image = src;
            if (src?.startsWith("./images/") || src?.startsWith("images/")) {
              const key = `../../_content/${src.replace(/^\.\//, "")}`;
              image = imageAssets[key];
              if (!image) throw new Error(`Writing image not found: ${src}`);
            }
            return (
              <img
                {...props}
                src={image}
                loading="lazy"
                decoding="async"
                {...stylex.props(styles.image)}
              />
            );
          },
          hr: () => <Separator {...stylex.props(styles.proseDivider)} />,
          a: ({ node: _node, children, href, ...props }) =>
            href?.startsWith("/") && !href.startsWith("//") ? (
              <RouterLink {...props} to={href}>
                {children}
              </RouterLink>
            ) : (
              <Link {...props} href={href} style={{ ...props.style, transition: "none" }}>
                {children}
              </Link>
            ),
          blockquote: ({ children }) => (
            <blockquote {...stylex.props(styles.quote)}>{children}</blockquote>
          ),
        }}
      >
        {article.body}
      </Markdown>
    </div>
  );
}

const styles = stylex.create({
  // Reading-specific size and leading have no corresponding package tokens.
  body: {
    display: "flow-root",
    fontSize: "1.0625rem",
    lineHeight: 1.75,
    color: colorVars.fgPrimary,
    overflowWrap: "anywhere",
  },
  paragraph: {
    marginBlockStart: { default: spacingVars.space6, ":first-child": 0 },
    marginBlockEnd: { default: spacingVars.space2, ":last-child": 0 },
  },
  compactParagraph: { marginBlockStart: { default: spacingVars.space3, ":first-child": 0 } },
  proseHeading: {
    marginBlockStart: spacingVars.space10,
    marginBlockEnd: spacingVars.space1,
    scrollMarginBlockStart: spacingVars.space8,
    letterSpacing: "-0.025em",
    lineHeight: 1.4,
    fontWeight: typo.fontWeightSemibold,
    color: colorVars.fgPrimary,
  },
  headingLarge: { fontSize: "1.5em" },
  headingMedium: { fontSize: "1.125em" },
  headingSmall: { fontSize: "1em" },
  strong: { color: colorVars.fgPrimary, fontWeight: typo.fontWeightSemibold },
  unorderedList: {
    display: "grid",
    gap: spacingVars.space2,
    paddingInlineStart: spacingVars.space6,
    marginBlockStart: spacingVars.space6,
    marginBlockEnd: spacingVars.space2,
    listStyleType: "disc",
  },
  orderedList: {
    display: "grid",
    gap: spacingVars.space2,
    paddingInlineStart: spacingVars.space6,
    marginBlockStart: spacingVars.space6,
    marginBlockEnd: spacingVars.space2,
    listStyleType: "decimal",
  },
  screenReaderOnly: {
    position: "absolute",
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    clipPath: "inset(50%)",
    whiteSpace: "nowrap",
    borderWidth: 0,
  },
  footnotes: { fontSize: typo.fontSizeSm, marginBlockStart: spacingVars.space12 },
  table: {
    marginBlockStart: spacingVars.space6,
    marginBlockEnd: spacingVars.space2,
    maxWidth: "100%",
  },
  taskList: { paddingInlineStart: 0 },
  taskItem: { listStyleType: "none" },
  listItem: { minWidth: 0, scrollMarginBlockStart: spacingVars.space8 },
  codeBlock: {
    marginBlockStart: spacingVars.space6,
    marginBlockEnd: spacingVars.space2,
    padding: spacingVars.space4,
    overflowX: "auto",
    overflowWrap: "normal",
    borderWidth: sizeVars.stroke,
    borderStyle: "solid",
    borderColor: colorVars.strokeDefault,
    borderRadius: radiusVars.md,
    backgroundColor: colorVars.bgSubtle,
    fontFamily: "ui-monospace, monospace",
    fontSize: typo.fontSizeSm,
    color: colorVars.fgPrimary,
    lineHeight: typo.lineHeightNormal,
  },
  code: {
    fontFamily: "ui-monospace, monospace",
    fontSize: typo.fontSizeSm,
    marginInline: spacingVars.space0_5,
    paddingBlock: spacingVars.space1,
    paddingInline: spacingVars.space2,
    borderRadius: radiusVars.sm,
    color: colorVars.fgPrimary,
    backgroundColor: colorVars.bgSubtle,
    verticalAlign: "middle",
  },
  figure: {
    display: "grid",
    gap: spacingVars.space2,
    width: "fit-content",
    maxWidth: "100%",
    marginInline: 0,
    marginBlockStart: spacingVars.space6,
    marginBlockEnd: spacingVars.space2,
  },
  image: { maxWidth: "100%", height: "auto", borderRadius: radiusVars.md },
  proseDivider: { marginBlockStart: spacingVars.space6, marginBlockEnd: spacingVars.space2 },
  quote: {
    marginInline: 0,
    marginBlockStart: spacingVars.space6,
    marginBlockEnd: spacingVars.space2,
    paddingInlineStart: spacingVars.space4,
    borderInlineStartWidth: `calc(${sizeVars.stroke} * 3)`,
    borderInlineStartStyle: "solid",
    borderInlineStartColor: colorVars.strokeStrong,
  },
});
