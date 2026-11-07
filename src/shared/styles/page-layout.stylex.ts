import * as stylex from "@stylexjs/stylex";
import { spacingRoleVars, spacingVars, typo } from "@bolerish/tokens/semantic.stylex";

export const pageLayout = stylex.create({
  page: { paddingInline: spacingRoleVars.pageGutter },
  content: {
    maxWidth: 736,
    marginInline: "auto",
    paddingTop: spacingVars.space6,
    paddingBottom: spacingVars.space12,
    display: "flex",
    flexDirection: "column",
    gap: spacingRoleVars.sectionGap,
    minWidth: 0,
  },
  // Reserve the same single breadcrumb line on routes without visible navigation.
  navigationSlot: { minHeight: `calc(${typo.fontSizeSm} * ${typo.lineHeightNormal})` },
  // Approved optical geometry; minimum heights allow enlarged text to grow.
  intro: {
    minHeight: { default: 320, "@media (width < 768px)": 256 },
    paddingTop: {
      default: `calc(${spacingVars.space12} * 2 + ${spacingVars.space5})`,
      "@media (width < 768px)": `calc(${spacingVars.space12} + ${spacingVars.space5})`,
    },
    paddingBottom: spacingVars.space4,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "start",
    gap: spacingRoleVars.inlineGap,
  },
});
