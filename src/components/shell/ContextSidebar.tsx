import { Link, useRouterState } from "@tanstack/react-router";
import { useMemo } from "react";
import { NAV_GROUPS, type NavGroup } from "@/lib/nav";
import { Sparkles } from "lucide-react";

/**
 * Contextual sub-nav for the current module area.
 * Picks the NAV_GROUPS group whose item path best matches the current URL
 * and renders ALL items in that group as related features / sub-categories.
 * Hidden when no group matches or when an explicit module layout is active.
 */
const EXPLICIT_LAYOUT_PREFIXES = ["/rm"]; // these prefixes ship their own sidebar layout

export function ContextSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const { group, activePath } = useMemo(() => {
    if (EXPLICIT_LAYOUT_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
      return { group: null as NavGroup | null, activePath: "" };
    }
    let best: { g: NavGroup; path: string; len: number } | null = null;
    for (const g of NAV_GROUPS) {
      for (const it of g.items) {
        if (it.path === pathname || pathname.startsWith(it.path + "/") || pathname === it.path) {
          if (!best || it.path.length > best.len) best = { g, path: it.path, len: it.path.length };
        }
      }
    }
    return { group: best?.g ?? null, activePath: best?.path ?? "" };
  }, [pathname]);

  if (!group) return null;

  return (
    <aside className="sticky top-0 hidden h-screen w-52 shrink-0 border-r border-border bg-surface/30 lg:block 2xl:w-56">
      <div className="flex h-12 items-center gap-2 border-b border-border px-3">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        <div className="truncate font-mono text-[10.5px] uppercase tracking-[0.18em] text-foreground">
          {group.label}
        </div>
        <span className="ml-auto rounded border border-border/60 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
          {group.items.length}
        </span>
      </div>
      <nav className="scrollbar-thin h-[calc(100vh-3rem)] overflow-y-auto px-2 py-2">
        <ul className="space-y-0.5">
          {group.items.map((it) => {
            const active = it.path === activePath;
            const Icon = it.icon;
            return (
              <li key={it.id}>
                <Link
                  to={it.path}
                  className={`group flex items-center gap-2 rounded-md px-2 py-1.5 text-[12px] transition-colors ${
                    active
                      ? "bg-primary/10 text-foreground"
                      : "text-muted-foreground hover:bg-surface-2/60 hover:text-foreground"
                  }`}
                >
                  <Icon
                    className={`h-3.5 w-3.5 shrink-0 ${
                      active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  />
                  <span className="truncate">{it.title}</span>
                  {it.built && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-success" title="Built" />
                  )}
                </Link>
                {active && (
                  <div className="ml-7 mt-0.5 mb-1 truncate font-mono text-[9.5px] text-muted-foreground/70">
                    ↳ {it.clone}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
