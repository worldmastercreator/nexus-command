import { createFileRoute } from "@tanstack/react-router";
import { ResellerCommandCenter } from "@/components/reseller-manager/CommandCenter";

export const Route = createFileRoute("/rm/command")({ component: ResellerCommandCenter });
