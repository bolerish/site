import type { ReactNode } from "react";
import * as stylex from "@stylexjs/stylex";
import { RouterBreadcrumbLink } from "~/shared/ui/RouterLink";
import { pageLayout } from "~/shared/styles/page-layout.stylex";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@bolerish/ui/breadcrumb";

export function WritingLayout({
  children,
  articleTitle,
}: {
  children: ReactNode;
  articleTitle?: string;
}) {
  return (
    <main {...stylex.props(pageLayout.page, styles.page)}>
      <div {...stylex.props(pageLayout.content)}>
        <Breadcrumb aria-label="현재 위치" {...stylex.props(pageLayout.navigationSlot)}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <RouterBreadcrumbLink to="/">bolerish</RouterBreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {articleTitle ? (
                <RouterBreadcrumbLink to="/writing">writing</RouterBreadcrumbLink>
              ) : (
                <BreadcrumbPage>writing</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {articleTitle ? (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{articleTitle}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            ) : null}
          </BreadcrumbList>
        </Breadcrumb>
        {children}
      </div>
    </main>
  );
}

const styles = stylex.create({
  page: {
    minHeight: stylex.firstThatWorks("100dvh", "100vh"),
  },
});
