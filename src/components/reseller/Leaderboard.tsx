import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Panel } from "@/components/dash/primitives";
import { moduleQueryOptions } from "@/lib/modules.functions";

type Row = { id: string; name: string; tier: string; commission: number; sales: number; status: string };

export function Leaderboard() {
  const [scope, setScope] = useState<"global" | "country" | "state">("global");
  const { data } = useSuspenseQuery(moduleQueryOptions("mod_resellers"));
  const all = ((data as { rows?: unknown[] })?.rows ?? []) as unknown as Row[];
  const rows = all.slice().sort((a, b) => Number(b.sales) - Number(a.sales)).slice(0, 10);

  return (
    <Panel
      kicker="LEADERBOARD · LIVE"
      title="Top resellers · 30d"
      action={
        <div className="flex gap-1 rounded-md border border-border bg-surface-2 p-0.5 font-mono text-[10px] uppercase tracking-wider">
          {(["global", "country", "state"] as const).map((s) => (
            <button key={s} onClick={() => setScope(s)}
              className={`rounded px-2 py-0.5 ${scope === s ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              {s}
            </button>
          ))}
        </div>
      }
      padded={false}
    >
      <table className="w-full text-[12.5px]">
        <thead className="border-b border-border bg-surface-2/40 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="px-3 py-2 text-left">Rank</th>
            <th className="px-3 py-2 text-left">Reseller</th>
            <th className="px-3 py-2 text-left">Tier</th>
            <th className="px-3 py-2 text-right">Commission</th>
            <th className="px-3 py-2 text-right">Sales</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`;
            return (
              <tr key={r.id} className="border-b border-border/50 hover:bg-accent/30">
                <td className="px-3 py-2 font-mono">{medal}</td>
                <td className="px-3 py-2 font-medium">{r.name}</td>
                <td className="px-3 py-2 font-mono text-[10.5px] uppercase text-market">{r.tier}</td>
                <td className="px-3 py-2 text-right font-mono">{Number(r.commission).toFixed(0)}%</td>
                <td className="px-3 py-2 text-right font-mono text-success">${Number(r.sales).toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Panel>
  );
}
