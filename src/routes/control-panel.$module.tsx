import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/control-panel/$module")({
  component: ModuleAlias,
});

function ModuleAlias() {
  const { module } = Route.useParams();
  return <Navigate to={"/" + module} replace />;
}
