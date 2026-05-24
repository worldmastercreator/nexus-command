import { createFileRoute } from "@tanstack/react-router";
import { Route as EventBus } from "./event-bus";

export const Route = createFileRoute("/queue")({
  component: EventBus.options.component!,
});
