import { createFileRoute } from "@tanstack/react-router";
import { ApprovalCenter } from "@/components/reseller-manager/ApprovalCenter";

export const Route = createFileRoute("/rm/approvals")({ component: ApprovalCenter });
