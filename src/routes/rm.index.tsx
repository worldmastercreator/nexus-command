import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/rm/")({
  component: () => <Navigate to="/rm/command" />,
});
