import { ALL_ITEMS } from "@/lib/nav";
import { Panel } from "@/components/dash/primitives";
import { Link2 } from "lucide-react";

/**
 * Cross-module wiring strip. Pure presentation — uses existing nav.ts entries
 * to render deep-links to related modules inside the locked shell.
 * Uses native <a> for arbitrary string paths from nav.ts.
 */
export function ConnectedModules({ ids, title = "Connected modules" }: { ids: number[]; title?: string }) {
  const items = ids
    .map((id) => ALL_ITEMS.find((i) => i.id === id))
    .filter((x): x is NonNullable<typeof x> => Boolean(x));
  if (items.length === 0) return null;
  return (
    <Panel kicker="WIRED" title={title}>
      <div className="flex flex-wrap gap-2">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <a
              key={it.id}
              href={it.path}
              className="group inline-flex items-center gap-2 rounded-md border border-border bg-surface-2/60 px-3 py-1.5 text-[11.5px] text-foreground/90 transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
            >
              <Icon className="h-3.5 w-3.5 text-primary" />
              <span className="font-medium">{it.title}</span>
              <span className="font-mono text-[10px] text-muted-foreground group-hover:text-primary/70">
                #{String(it.id).padStart(3, "0")} · {it.clone}
              </span>
              <Link2 className="h-3 w-3 text-muted-foreground/60 group-hover:text-primary" />
            </a>
          );
        })}
      </div>
    </Panel>
  );
}
