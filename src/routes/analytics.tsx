import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, StackedArea, Bars, MiniArea, Radial } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics · AEGIS OS" }] }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const live = useLiveSeries(50, 31, 90, 14);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 004 · POWER BI + TABLEAU"
          title="Analytics Manager"
          subtitle="Cross-product OLAP cube · 184 measures · 32 cohorts · sub-second slice/dice."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="Sessions" value="2.41M" delta="+8.4%" tone="primary" spark={<MiniArea data={generateSeries(30, 1, 60, 14)} />} />
          <Metric label="Conversion" value="3.82%" delta="+0.4pp" tone="success" spark={<MiniArea data={generateSeries(30, 2, 60, 8)} color="var(--success)" />} />
          <Metric label="ARPU" value="$184.20" delta="+$6.10" tone="market" spark={<MiniArea data={generateSeries(30, 3, 60, 12)} color="var(--market)" />} />
          <Metric label="Churn" value="1.21%" delta="-0.18pp" tone="info" spark={<MiniArea data={generateSeries(30, 4, 60, 10)} color="var(--info)" />} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="TIME SERIES" title="Revenue · channels overlay">
            <MultiLine data={live} h={280} />
          </Panel>
          <Panel kicker="MIX" title="Channel attribution">
            <StackedArea data={generateSeries(24, 9, 50, 18)} h={280} />
          </Panel>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel kicker="COHORTS" title="Retention heatmap">
            <Heatmap />
          </Panel>
          <Panel kicker="FUNNEL" title="Activation funnel">
            <div className="space-y-2">
              {[
                ["Visited", 100, "var(--primary)"],
                ["Signup", 62, "var(--ai)"],
                ["Activated", 41, "var(--analytics)"],
                ["Paid", 19, "var(--market)"],
                ["Retained 30d", 14, "var(--success)"],
              ].map(([n, p, c]) => (
                <div key={n as string}>
                  <div className="flex items-center justify-between font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground">
                    <span className="text-foreground">{n}</span><span>{p}%</span>
                  </div>
                  <div className="mt-1 h-3 overflow-hidden rounded bg-surface">
                    <div className="h-full" style={{ width: `${p}%`, background: c as string }} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
          <Panel kicker="QUALITY" title="Data freshness">
            <div className="grid grid-cols-2 gap-3">
              <Radial value={97} label="EVENTS" />
              <Radial value={88} color="var(--ai)" label="MODELS" />
              <Radial value={92} color="var(--analytics)" label="ETL" />
              <Radial value={71} color="var(--warning)" label="LATE" />
            </div>
          </Panel>
        </div>

        <Panel kicker="DRILL DOWN" title="Top segments · last 7d">
          <table className="w-full border-collapse text-[12.5px]">
            <thead className="text-[10.5px] uppercase tracking-wider text-muted-foreground">
              <tr className="border-b border-border">
                {["Segment", "Sessions", "Conv.", "ARPU", "Δ vs prev", "Trend"].map((h) => (
                  <th key={h} className="px-3 py-2 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["US · Enterprise · Web",   "428,201", "5.21%", "$412", "+12.4%"],
                ["EU · SMB · Mobile",        "284,909", "3.04%", "$182", "+4.2%"],
                ["APAC · Self-serve",        "192,118", "2.71%", "$94",  "-1.1%"],
                ["LATAM · Partners",         "108,402", "3.92%", "$148", "+8.0%"],
                ["MEA · Agencies",            "64,221", "4.10%", "$224", "+2.8%"],
                ["Global · AI plan",         "212,800", "6.84%", "$612", "+22.1%"],
              ].map((row, i) => (
                <tr key={i} className="border-b border-border/60 hover:bg-accent/40">
                  {row.map((c, j) => (
                    <td key={j} className={`px-3 py-2 ${j === 4 ? (c.startsWith("+") ? "text-success" : "text-danger") : ""}`}>{c}</td>
                  ))}
                  <td className="px-3 py-2 w-32"><MiniArea h={28} data={generateSeries(20, i + 11, 60, 14)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </div>
  );
}

function Heatmap() {
  const cells = Array.from({ length: 7 * 12 }, (_, i) => (Math.sin(i * 1.3) + 1) / 2);
  return (
    <div className="grid grid-cols-12 gap-1">
      {cells.map((v, i) => {
        const a = 0.15 + v * 0.85;
        return (
          <div key={i} className="aspect-square rounded-sm"
            style={{ background: `color-mix(in oklab, var(--primary) ${Math.round(a * 100)}%, transparent)` }} />
        );
      })}
    </div>
  );
}
