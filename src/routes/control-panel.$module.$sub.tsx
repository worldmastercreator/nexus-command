import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/control-panel/$module/$sub")({
  component: SubAlias,
});

function SubAlias() {
  const { module, sub } = Route.useParams();
  return <Navigate to={"/" + module + "/" + sub} replace />;
}
