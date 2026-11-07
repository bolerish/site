export type Project = Readonly<{
  id: "ui" | "edge" | "min" | "veil";
  name: string;
  description: string;
  href: `https://${string}` | null;
}>;

export const projects: readonly Project[] = [
  {
    id: "ui",
    name: "ui",
    description: "A React design system for consistent interfaces.",
    href: "https://ui.bolerish.com",
  },
  {
    id: "edge",
    name: "edge",
    description: "UI, a little more alive.",
    href: "https://edge.bolerish.com",
  },
  // { id: "min", name: "Min", description: "A minimal new tab browser extension.", href: null },
  // {
  //   id: "veil",
  //   name: "Veil",
  //   description: "The web, a little quieter.",
  //   href: null,
  // },
];
