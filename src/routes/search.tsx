import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel } from "@/components/dash/primitives";
import { ALL_ITEMS } from "@/lib/nav";
import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";

export const Route = createFileRoute("/search")({
  head: () => ({ meta: [{ title: "Global Search · AEGIS OS" }] }),
  component: SearchPage,
});

function SearchPage() {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return ALL_ITEMS;
    return ALL_ITEMS.filter((i) =>
      i.title.toLowerCase().includes(term) || i.clone.toLowerCase().includes(term)
    );
  }, [q]);

  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 003 · RAYCAST"
          title="Global Search / Command"
          subtitle="Single keystroke surface across 101 modules, 38k assets, and your entire operational graph."
        />

        <Panel kicker="QUERY" title="Search the operating system">
          <div className="flex items-center gap-3 rounded-lg border border-border bg-background/50 px-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              autoFocus value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Try: payments, ai agents, dns, lawyer, war room…"
              className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">⌘K</kbd>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
            {results.slice(0, 60).map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.id} to={item.path}
                  className="group flex items-center gap-3 rounded-md border border-border bg-surface-2/50 px-3 py-2 text-[12.5px] hover:border-primary/50 hover:bg-surface-2">
                  <Icon className="h-4 w-4 text-primary" />
                  <div className="min-w-0">
                    <div className="truncate font-medium text-foreground">{item.title}</div>
                    <div className="truncate font-mono text-[10.5px] text-muted-foreground">{item.clone}</div>
                  </div>
                  <span className="ml-auto font-mono text-[10px] text-muted-foreground">#{String(item.id).padStart(3, "0")}</span>
                  <ArrowRight className="h-3 w-3 opacity-60 transition group-hover:translate-x-0.5" />
                </Link>
              );
            })}
          </div>
        </Panel>
      </div>
    </div>
  );
}
