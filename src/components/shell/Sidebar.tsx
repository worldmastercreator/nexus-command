import { Link, useRouterState } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { ChevronDown, ChevronRight, Shield } from "lucide-react";
import { NAV_GROUPS } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(NAV_GROUPS.map((g) => [g.label, true]))
  );

  return (
    <aside
      className={cn(
        "relative shrink-0 border-r border-border bg-sidebar text-sidebar-foreground transition-[width] duration-300",
        collapsed ? "w-[68px]" : "w-[260px]"
      )}
    >
      {/* Brand */}
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-3">
        <button
          onClick={onToggle}
          className="grid h-9 w-9 place-items-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/30 hover:bg-primary/25"
          aria-label="Toggle sidebar"
        >
          <Shield className="h-4 w-4" />
        </button>
        {!collapsed && (
          <div className="flex flex-col leading-tight">
            <span className="text-[13px] font-semibold tracking-[0.18em]">AEGIS · OS</span>
            <span className="font-mono text-[10px] text-muted-foreground">v7.0 · ENTERPRISE</span>
          </div>
        )}
      </div>

      <nav className="scrollbar-thin h-[calc(100vh-3.5rem)] overflow-y-auto px-2 py-3">
        {NAV_GROUPS.map((group) => {
          const open = openGroups[group.label];
          return (
            <div key={group.label} className="mb-2">
              {!collapsed && (
                <button
                  className="flex w-full items-center justify-between px-2 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground"
                  onClick={() =>
                    setOpenGroups((p) => ({ ...p, [group.label]: !p[group.label] }))
                  }
                >
                  <span>{group.label}</span>
                  {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                </button>
              )}
              {(open || collapsed) && (
                <ul className="space-y-0.5">
                  {group.items.map((item) => {
                    const Active = pathname === item.path;
                    const Icon = item.icon;
                    return (
                      <li key={item.id}>
                        <Link
                          to={item.path}
                          className={cn(
                            "group relative flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] transition",
                            Active
                              ? "bg-primary/15 text-foreground"
                              : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-foreground"
                          )}
                          title={collapsed ? item.title : undefined}
                        >
                          {Active && (
                            <span className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-primary shadow-[0_0_12px_var(--primary)]" />
                          )}
                          <Icon className={cn("h-4 w-4 shrink-0", Active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                          {!collapsed && (
                            <>
                              <span className="truncate">{item.title}</span>
                              <span className="ml-auto font-mono text-[9px] text-muted-foreground/70">
                                {String(item.id).padStart(3, "0")}
                              </span>
                            </>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
        {!collapsed && (
          <div className="mt-3 rounded-lg border border-border bg-surface-2/60 p-3">
            <div className="flex items-center gap-2 text-[11px]">
              <span className="live-dot" />
              <span className="font-mono uppercase tracking-wider text-muted-foreground">All systems nominal</span>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-1 font-mono text-[10px] text-muted-foreground">
              <div>CPU 24%</div><div>MEM 41%</div><div>NET 1.2G</div>
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
}
