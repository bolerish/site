import { createFileRoute } from "@tanstack/react-router";
import { ProjectCatalog } from "./_ui/ProjectCatalog";
export const Route = createFileRoute("/")({ component: ProjectCatalog });
