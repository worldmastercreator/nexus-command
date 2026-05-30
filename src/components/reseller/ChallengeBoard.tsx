import { Panel } from "@/components/dash/primitives";
import { CHALLENGES } from "@/lib/gamification";

export function ChallengeBoard() {
  const periods = ["daily", "weekly", "monthly"] as const;
  return (
    <Panel kicker="CHALLENGES" title="Daily · weekly · monthly missions">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {periods.map((p) => {
          const items = CHALLENGES.filter((c) => c.period === p);
          const tone = p === "daily" ? "var(--info)" : p === "weekly" ? "var(--ai)" : "var(--market)";
          return (
            <div key={p} className="rounded-lg border border-border/70 bg-surface/40 p-2.5">
              <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider"
                style={{ color: tone }}>
                <span>{p}</span>
                <span className="text-muted-foreground">{items.length} active</span>
              </div>
              <ul className="space-y-2">
                {items.map((c) => {
                  const pct = Math.min(100, (c.progress / c.goal) * 100);
                  return (
                    <li key={c.id} className="rounded-md border border-border/60 bg-background/30 p-2">
                      <div className="flex items-center justify-between gap-2 text-[12px]">
                        <span className="truncate">{c.label}</span>
                        <span className="shrink-0 font-mono text-[10px]" style={{ color: tone }}>+{c.reward} XP</span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface">
                        <div className="h-full" style={{ width: `${pct}%`, background: tone }} />
                      </div>
                      <div className="mt-1 flex items-center justify-between font-mono text-[10px] text-muted-foreground">
                        <span>{c.progress.toLocaleString()} / {c.goal.toLocaleString()} {c.unit}</span>
                        <span>{Math.round(pct)}%</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
