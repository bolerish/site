import { createFileRoute } from "@tanstack/react-router";
import * as stylex from "@stylexjs/stylex";
import { spacingVars } from "@bolerish/tokens/semantic.stylex";
import { useLocation } from "@tanstack/react-router";
import { Empty, EmptyHeader, EmptyDescription, EmptyContent, EmptyMedia } from "@bolerish/ui/empty";
import { Heading } from "@bolerish/ui/heading";

import { pageLayout } from "~/shared/styles/page-layout.stylex";
import { RouterLink } from "~/shared/ui/RouterLink";
import { GhostIcon } from "@phosphor-icons/react/dist/ssr";

export const Route = createFileRoute("/not-found")({
  staticData: { lang: "ko" },
  head: () => ({
    meta: [
      { title: "페이지를 찾을 수 없습니다 · bolerish" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: NotFoundPage,
});

export function NotFoundPage() {
  const pathname = useLocation({ select: (location) => location.pathname });
  const writing = pathname === "/writing" || pathname.startsWith("/writing/");

  return (
    <main lang="ko" {...stylex.props(pageLayout.page)}>
      <div {...stylex.props(pageLayout.content)}>
        <div {...stylex.props(pageLayout.intro)}>
          <Empty>
            <EmptyHeader>
              <EmptyMedia>
                <GhostIcon aria-hidden="true" {...stylex.props(styles.ghost)} />
              </EmptyMedia>
              <Heading level={1} size="page">
                페이지를 찾을 수 없습니다.
              </Heading>
              <EmptyDescription>주소가 변경되었거나 삭제된 페이지입니다.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <RouterLink to={writing ? "/writing" : "/"}>
                {writing ? "글 목록으로 돌아가기" : "홈으로 돌아가기"}
              </RouterLink>
            </EmptyContent>
          </Empty>
        </div>
      </div>
    </main>
  );
}

const float = stylex.keyframes({
  "0%, 100%": { transform: "translateY(0)" },
  "50%": { transform: `translateY(calc(${spacingVars.space1} * -1))` },
});

const styles = stylex.create({
  ghost: {
    animationName: float,
    // Ambient floating needs a longer cycle than the DS interaction durations.
    animationDuration: "4s",
    animationTimingFunction: "ease-in-out",
    animationIterationCount: "infinite",
    animationPlayState: { default: "running", "@media (prefers-reduced-motion: reduce)": "paused" },
  },
});
