import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, ArrowRight, Command } from "lucide-react";
import { ALL_ITEMS } from "@/lib/nav";

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    const list = term
      ? ALL_ITEMS.filter(
          (i) => i.title.toLowerCase().includes(term) || i.clone.toLowerCase().includes(term)
        )
      : ALL_ITEMS;
    return list.slice(0, 12);
  }, [q]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") { e.preventDefault(); setIdx((i) => Math.min(i + 1, results.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setIdx((i) => Math.max(i - 1, 0)); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, results.length, onClose]);

  useEffect(() => { setIdx(0); }, [q]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-background/70 px-4 pt-[12vh] backdrop-blur-md" onClick={onClose}>
      <div
        className="panel panel-glow w-full max-w-[640px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-border px-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search 101 modules, commands, incidents…"
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="flex items-center gap-1 rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            <Command className="h-3 w-3" />K
          </kbd>
        </div>
        <ul className="max-h-[50vh] overflow-y-auto p-2">
          {results.map((item, i) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <Link
                  to={item.path}
                  onClick={onClose}
                  onMouseEnter={() => setIdx(i)}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-[13px] ${
                    i === idx ? "bg-primary/15 text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${i === idx ? "text-primary" : ""}`} />
                  <span className="font-medium text-foreground">{item.title}</span>
                  <span className="text-[11px] text-muted-foreground">{item.clone}</span>
                  <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                    #{String(item.id).padStart(3, "0")}
                  </span>
                  <ArrowRight className="h-3 w-3 opacity-60" />
                </Link>
              </li>
            );
          })}
          {results.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-muted-foreground">No matches</li>
          )}
        </ul>
        <div className="flex items-center justify-between border-t border-border px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          <span>↑↓ navigate · ↵ open · esc close</span>
          <span>aegis · raycast-class palette</span>
        </div>
      </div>
    </div>
  );
}
