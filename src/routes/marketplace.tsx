import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { ConnectedModules } from "@/components/dash/ConnectedModules";

export const Route = createFileRoute("/marketplace")({
  head: () => ({ meta: [{ title: "Marketplace · AEGIS OS" }] }),
  component: MarketplacePage,
});

function MarketplacePage() {
  const live = useLiveSeries(50, 61, 60, 22);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 011 · CODECANYON + ENVATO"
          title="Marketplace Manager"
          subtitle="Authors · listings · revenue · royalties — realtime sales pulse."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="GMV · 24h" value="$1.82M" delta="+12.4%" tone="market" spark={<MiniArea data={generateSeries(30, 1, 60, 18)} color="var(--market)" />} />
          <Metric label="Authors" value="14,208" delta="+82" tone="ai" spark={<MiniArea data={generateSeries(30, 2, 60, 6)} color="var(--ai)" />} />
          <Metric label="Listings" value="284,910" delta="+1.4k" tone="primary" spark={<MiniArea data={generateSeries(30, 3, 60, 8)} />} />
          <Metric label="Refund rate" value="0.94%" delta="-0.12pp" tone="success" spark={<MiniArea data={generateSeries(30, 4, 60, 4)} color="var(--success)" />} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="REVENUE" title="GMV stream · realtime">
            <MultiLine data={live} h={260} />
          </Panel>
          <Panel kicker="LIVE FEED" title="Sales pulse">
            <ul className="scrollbar-thin max-h-[260px] space-y-2 overflow-y-auto">
              {Array.from({ length: 16 }).map((_, i) => (
                <li key={i} className="flex items-center gap-3 rounded-md border border-border/60 bg-background/40 p-2 text-[12px]">
                  <span className="live-dot" />
                  <span className="font-mono text-[10.5px] text-muted-foreground">{new Date(Date.now() - i * 4200).toISOString().slice(11, 19)}</span>
                  <span className="truncate">{["Aurora UI Kit", "Quantum Dashboard", "NovaForms Pro", "Helix CRM", "Pulse Analytics"][i % 5]}</span>
                  <span className="ml-auto font-mono text-success">+${(48 + (i * 7) % 280).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel kicker="TOP CATEGORIES" title="Volume mix">
            <Bars data={generateSeries(10, 8, 60, 22)} color="var(--market)" h={220} />
          </Panel>
          <Panel kicker="GEOGRAPHY" title="Top regions · 24h">
            <ul className="space-y-2 text-[12.5px]">
              {[
                ["United States", 42], ["Germany", 18], ["India", 12], ["United Kingdom", 9], ["Brazil", 7], ["Japan", 6], ["Other", 6],
              ].map(([n, p]) => (
                <li key={n as string} className="flex items-center gap-3">
                  <span className="w-32 truncate">{n}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface">
                    <div className="h-full bg-market" style={{ width: `${p}%` }} />
                  </div>
                  <span className="w-10 text-right font-mono text-[11px] text-muted-foreground">{p}%</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel kicker="TOP AUTHORS" title="Leaderboard · 7d">
            <table className="w-full text-[12px]">
              <tbody>
                {[
                  ["nova_labs", "$184,210"],
                  ["axiom_ux", "$142,820"],
                  ["pulse_co", "$98,410"],
                  ["helix_dev", "$84,128"],
                  ["aurora_io", "$71,420"],
                ].map(([n, v], i) => (
                  <tr key={n} className="border-b border-border/60 last:border-0">
                    <td className="py-2 font-mono text-[11px] text-muted-foreground">#{i + 1}</td>
                    <td className="py-2">{n}</td>
                    <td className="py-2 text-right font-mono text-success">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
        </div>

        <ConnectedModules ids={[12, 18, 14, 15, 19, 25]} />
      </div>
    </div>
  );
}
