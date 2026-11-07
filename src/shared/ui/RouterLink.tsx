import { createLink } from "@tanstack/react-router";
import type { ComponentProps } from "react";
import { Link, type LinkProps } from "@bolerish/ui/link";
import { BreadcrumbLink } from "@bolerish/ui/breadcrumb";

export const RouterLink = createLink(NavigationLink);
export const RouterBreadcrumbLink = createLink(NavigationBreadcrumbLink);

function NavigationLink(props: LinkProps) {
  return <Link {...props} style={{ ...props.style, transition: "none" }} />;
}

function NavigationBreadcrumbLink(props: ComponentProps<typeof BreadcrumbLink>) {
  return <BreadcrumbLink {...props} style={{ ...props.style, transition: "none" }} />;
}
