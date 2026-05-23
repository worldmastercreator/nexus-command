import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { StackedArea, MiniArea, Radial } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";

export const Route = createFileRoute("/cdn")({
  head: () => ({ meta: [{ title: "CDN · Cache · AEGIS OS" }] }),
  component: CdnPage,
});

function CdnPage() {
  const live = useLiveSeries(60, 711, 120, 24);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 064 · CLOUDFLARE CDN"
          title="CDN & Edge Cache"
          subtitle="POPs · cache-hit · purge · WAF · image optim."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <Metric label="PoPs" value="312" tone="primary" />
          <Metric label="Edge req/s" value="148K" tone="info" spark={<MiniArea data={generateSeries(24, 81, 100, 14)} color="var(--info)" />} />
          <Metric label="Cache hit" value="94.8%" tone="success" />
          <Metric label="Bandwidth" value="2.41 Gbps" tone="ai" spark={<MiniArea data={generateSeries(24, 82, 80, 10)} color="var(--ai)" />} />
          <Metric label="Errors 5xx" value="0.02%" tone="warning" />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="EDGE TRAFFIC" title="Hit · miss · pass-through">
            <StackedArea data={live} h={260} />
          </Panel>
          <Panel kicker="CACHE EFFICIENCY" title="Global hit-rate">
            <Radial value={95} color="var(--success)" label="HIT" h={200} />
          </Panel>
        </div>

        <Panel kicker="TOP POPs" title="By RPS · live" padded={false}>
          <table className="w-full text-[12px]">
            <thead className="border-b border-border bg-surface-2/40 text-[10.5px] uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-3 py-2 text-left">POP</th><th className="px-3 py-2 text-left">REGION</th><th className="px-3 py-2 text-left">RPS</th><th className="px-3 py-2 text-left">CACHE HIT</th><th className="px-3 py-2 text-left">P95</th></tr>
            </thead>
            <tbody>
              {[
                ["FRA-3", "EU · Frankfurt", "18,210", "96.2%", "11ms"],
                ["IAD-1", "US · Ashburn", "14,820", "95.4%", "14ms"],
                ["SIN-2", "APAC · Singapore", "12,184", "94.1%", "22ms"],
                ["NRT-1", "APAC · Tokyo", "9,420", "93.8%", "19ms"],
                ["GRU-1", "SA · São Paulo", "6,420", "92.4%", "34ms"],
                ["CPT-1", "AF · Cape Town", "2,184", "91.2%", "48ms"],
              ].map((r) => (
                <tr key={r[0]} className="border-b border-border/50 hover:bg-accent/40">
                  <td className="px-3 py-2 font-mono">{r[0]}</td>
                  <td className="px-3 py-2 text-muted-foreground">{r[1]}</td>
                  <td className="px-3 py-2 font-mono text-info">{r[2]}</td>
                  <td className="px-3 py-2 font-mono text-success">{r[3]}</td>
                  <td className="px-3 py-2 font-mono text-muted-foreground">{r[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </div>
  );
}
