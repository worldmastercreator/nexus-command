import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Radial } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";

export const Route = createFileRoute("/monitoring")({
  head: () => ({ meta: [{ title: "Monitoring · AEGIS OS" }] }),
  component: MonitoringPage,
});

function MonitoringPage() {
  const live = useLiveSeries(60, 41, 50, 18);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 010 · DATADOG"
          title="Monitoring System"
          subtitle="Hosts, containers, services, traces, logs — one unified observability plane."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <Metric label="Hosts" value="1,284" delta="+6" tone="primary" spark={<MiniArea data={generateSeries(30, 1, 60, 6)} />} />
          <Metric label="Containers" value="48,210" delta="real-time" tone="ai" spark={<MiniArea data={generateSeries(30, 2, 60, 18)} color="var(--ai)" />} />
          <Metric label="Spans / s" value="1.42M" delta="+12%" tone="info" spark={<MiniArea data={generateSeries(30, 3, 60, 22)} color="var(--info)" />} />
          <Metric label="Alerts" value="14" delta="2 critical" tone="warning" spark={<MiniArea data={generateSeries(30, 4, 30, 22)} color="var(--warning)" />} />
          <Metric label="MTTR" value="4m 12s" delta="-32s" tone="success" spark={<MiniArea data={generateSeries(30, 5, 30, 8)} color="var(--success)" />} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="GOLDEN SIGNALS" title="Latency · errors · saturation · traffic">
            <MultiLine data={live} h={260} />
          </Panel>
          <Panel kicker="SLO" title="Service objectives">
            <div className="grid grid-cols-2 gap-3">
              <Radial value={99} color="var(--success)" label="api" />
              <Radial value={97} label="web" />
              <Radial value={88} color="var(--ai)" label="ai" />
              <Radial value={72} color="var(--warning)" label="queue" />
            </div>
          </Panel>
        </div>

        <Panel kicker="HOSTS" title="Host map (live)" padded={false}>
          <div className="grid grid-cols-12 gap-1 p-4 sm:grid-cols-16 md:grid-cols-24">
            {Array.from({ length: 24 * 8 }).map((_, i) => {
              const r = (Math.sin(i * 0.7) + 1) / 2;
              const tone = r > 0.8 ? "var(--danger)" : r > 0.6 ? "var(--warning)" : r > 0.3 ? "var(--success)" : "var(--info)";
              return (
                <div key={i} className="group relative aspect-square rounded-[3px]"
                  style={{ background: `color-mix(in oklab, ${tone} ${Math.round(40 + r * 50)}%, var(--surface))` }}
                  title={`host-${i.toString().padStart(3, "0")} · ${Math.round(r * 100)}%`}
                />
              );
            })}
          </div>
        </Panel>

        <Panel kicker="TRACES" title="Slow endpoints · p95">
          <table className="w-full border-collapse text-[12.5px]">
            <thead className="text-[10.5px] uppercase tracking-wider text-muted-foreground">
              <tr className="border-b border-border">
                {["Endpoint", "Service", "p50", "p95", "p99", "Errors", "Throughput"].map((h) => (
                  <th key={h} className="px-3 py-2 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["POST /v1/checkout", "payments", "84ms", "412ms", "1.21s", "0.04%"],
                ["GET /v1/products", "catalog", "12ms", "38ms", "98ms", "0.00%"],
                ["POST /v1/ai/chat", "ai-gw", "180ms", "812ms", "2.42s", "0.32%"],
                ["GET /v1/orders/:id", "orders", "8ms", "22ms", "61ms", "0.01%"],
                ["POST /v1/webhooks", "ingress", "22ms", "84ms", "210ms", "0.02%"],
              ].map((r, i) => (
                <tr key={i} className="border-b border-border/60 hover:bg-accent/40">
                  {r.map((c, j) => <td key={j} className="px-3 py-2 font-mono">{c}</td>)}
                  <td className="px-3 py-2 w-40"><MiniArea data={generateSeries(20, i + 7, 60, 16)} h={28} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </div>
  );
}
