import { createFileRoute } from "@tanstack/react-router";
import { ModuleStub } from "@/components/dash/ModuleStub";

export const Route = createFileRoute("/hr/employees")({ component: ModuleStub });
