import { createFileRoute } from "@tanstack/react-router";
import { EventBusDashboard } from "./event-bus";

export const Route = createFileRoute("/queue")({
  component: EventBusDashboard,
});
