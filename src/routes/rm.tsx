import { createFileRoute, Outlet } from "@tanstack/react-router";
import { RMSidebar } from "@/components/reseller-manager/RMSidebar";

export const Route = createFileRoute("/rm")({
  head: () => ({ meta: [{ title: "Reseller Manager · AEGIS OS" }] }),
  component: RMLayout,
});

function RMLayout() {
  return (
    <div className="flex min-h-[calc(100vh-3rem)] w-full">
      <RMSidebar />
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  );
}
