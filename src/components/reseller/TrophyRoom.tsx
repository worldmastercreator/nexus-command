import { Lock } from "lucide-react";
import { TROPHIES } from "@/lib/gamification";
import { Panel } from "@/components/dash/primitives";

export function TrophyRoom({ totalEarned }: { totalEarned: number }) {
  const unlocked = TROPHIES.filter((t) => totalEarned >= t.req).length;
  return (
    <Panel kicker={`TROPHY ROOM · ${unlocked}/${TROPHIES.length} UNLOCKED`} title="Champion Legacy">
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
        {TROPHIES.map((t) => {
          const locked = totalEarned < t.req;
          const pct = Math.min(100, (totalEarned / t.req) * 100);
          return (
            <div
              key={t.id}
              className={`relative overflow-hidden rounded-lg border p-3 transition ${
                locked ? "border-border/40 bg-surface/40 opacity-70 grayscale" : "border-border bg-surface-2/60 hover:scale-[1.02]"
              }`}
              style={!locked ? { boxShadow: `0 0 20px ${t.tone}22` } : undefined}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl drop-shadow" style={{ filter: locked ? "saturate(0)" : "none" }}>{t.icon}</span>
                {locked ? <Lock className="h-3.5 w-3.5 text-muted-foreground" /> : (
                  <span className="rounded border border-success/40 bg-success/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-success">
                    Unlocked
                  </span>
                )}
              </div>
              <div className="mt-2 text-[12px] font-medium leading-tight">{t.label}</div>
              <div className="mt-1 font-mono text-[10px] text-muted-foreground">${t.req.toLocaleString()} earned</div>
              {locked && (
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-surface">
                  <div className="h-full" style={{ width: `${pct}%`, background: t.tone }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
