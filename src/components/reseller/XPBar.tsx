import { ACTIONS, type ActionKey, type Rank } from "@/lib/gamification";

export function XPBar({
  level, xpInLevel, xpForNext, rank, next, progressPct, onAward,
}: {
  level: number;
  xpInLevel: number;
  xpForNext: number;
  rank: Rank;
  next: Rank | null;
  progressPct: number;
  onAward: (k: ActionKey) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface-2/60 p-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Level Progression
          </div>
          <div className="mt-0.5 flex items-baseline gap-2">
            <span className="text-2xl font-semibold tabular-nums">L{level}</span>
            <span className="text-[12px]" style={{ color: rank.color }}>{rank.label}</span>
            {next && <span className="text-[11px] text-muted-foreground">→ {next.label} at L{next.minLevel}</span>}
          </div>
        </div>
        <div className="font-mono text-[11px] tabular-nums text-muted-foreground">
          <span className="text-foreground">{xpInLevel.toLocaleString()}</span> / {xpForNext.toLocaleString()} XP
        </div>
      </div>

      {/* Bar */}
      <div className="relative mt-3 h-3 overflow-hidden rounded-full bg-surface ring-1 ring-border">
        <div
          className="h-full transition-all duration-700"
          style={{ width: `${progressPct}%`, background: `linear-gradient(90deg, ${rank.color}, var(--ai))`, boxShadow: `0 0 16px ${rank.color}` }}
        />
        {/* tick marks */}
        <div className="pointer-events-none absolute inset-0 grid grid-cols-10">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="border-r border-background/30 last:border-r-0" />
          ))}
        </div>
      </div>

      {/* Point actions */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {(Object.keys(ACTIONS) as ActionKey[]).map((k) => {
          const a = ACTIONS[k];
          return (
            <button
              key={k}
              onClick={() => onAward(k)}
              className="group inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-background/40 px-2 py-1 text-[11px] hover:border-primary/50 hover:bg-primary/10"
              title={`+${a.xp} XP`}
            >
              <span>{a.icon}</span>
              <span className="text-muted-foreground group-hover:text-foreground">{a.label}</span>
              <span className="font-mono text-[10px]" style={{ color: a.tone }}>+{a.xp}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
