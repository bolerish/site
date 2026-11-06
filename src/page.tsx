import { createFileRoute } from "@tanstack/react-router";
import { ProjectDirectory } from "./_ui/ProjectDirectory";
export const Route = createFileRoute("/")({ component: ProjectDirectory });
