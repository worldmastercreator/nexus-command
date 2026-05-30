import { Panel } from "@/components/dash/primitives";
import { BADGES, AWARDS, UNLOCK_TIERS } from "@/lib/gamification";
import { Lock } from "lucide-react";

export function AchievementWall({ level, xp }: { level: number; xp: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Panel kicker="BADGES" title="Premium identity">
        <div className="grid grid-cols-4 gap-2">
          {BADGES.map((b) => {
            const locked = level < b.minLevel;
            return (
              <div key={b.id}
                className={`flex flex-col items-center gap-1 rounded-md border p-2 ${locked ? "border-border/40 bg-surface/30 opacity-50" : "border-border bg-surface-2/60"}`}
                title={`${b.label} · L${b.minLevel}`}
              >
                <span className="grid h-9 w-9 place-items-center rounded-full border text-base"
                  style={{ color: b.tone, borderColor: `${b.tone}66`, background: `${b.tone}14` }}>
                  {b.icon}
                </span>
                <span className="text-[10.5px] font-medium leading-none">{b.label}</span>
                <span className="font-mono text-[9px] text-muted-foreground">L{b.minLevel}</span>
              </div>
            );
          })}
        </div>
      </Panel>

      <Panel kicker="AWARD SHOWCASE" title="Top performers · live">
        <ul className="space-y-1.5 text-[12px]">
          {AWARDS.slice(0, 6).map((a) => (
            <li key={a.id} className="flex items-center gap-2 rounded-md border border-border/60 bg-surface-2/40 px-2 py-1.5">
              <span className="grid h-7 w-7 place-items-center rounded-full text-base"
                style={{ background: `${a.tone}18`, color: a.tone }}>🏆</span>
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">{a.label}</div>
                <div className="truncate font-mono text-[10px] text-muted-foreground">@{a.holder}</div>
              </div>
              <span className="font-mono text-[11px]" style={{ color: a.tone }}>{a.value}</span>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel kicker="LOCKED CONTENT" title="Unlock tiers">
        <ul className="space-y-1.5 text-[12px]">
          {UNLOCK_TIERS.map((u) => {
            const ok = xp >= u.xp;
            return (
              <li key={u.label} className="flex items-center gap-2 rounded-md border border-border/60 bg-surface-2/40 px-2 py-1.5">
                <span className={`grid h-7 w-7 place-items-center rounded-full ${ok ? "bg-success/15 text-success" : "bg-surface text-muted-foreground"}`}>
                  {ok ? "✓" : <Lock className="h-3 w-3" />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{u.label}</div>
                  <div className="font-mono text-[10px] text-muted-foreground">{u.xp.toLocaleString()} XP</div>
                </div>
                <span className={`font-mono text-[10px] ${ok ? "text-success" : "text-muted-foreground"}`}>
                  {ok ? "UNLOCKED" : `${Math.min(100, Math.round((xp / u.xp) * 100))}%`}
                </span>
              </li>
            );
          })}
        </ul>
      </Panel>
    </div>
  );
}
