import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MiniArea, MultiLine } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";

export const Route = createFileRoute("/geo")({
  head: () => ({ meta: [{ title: "Geo Monitoring · AEGIS OS" }] }),
  component: GeoPage,
});

const NODES = [
  ["us-east-1", 28, 36, "success"], ["us-west-2", 22, 48, "success"],
  ["eu-west-1", 52, 28, "success"], ["eu-central-1", 56, 32, "warning"],
  ["ap-southeast-1", 78, 60, "success"], ["ap-northeast-1", 84, 56, "success"],
  ["ap-south-1", 70, 64, "success"], ["sa-east-1", 36, 72, "success"],
  ["af-south-1", 54, 78, "warning"], ["me-south-1", 60, 52, "success"],
  ["ca-central-1", 26, 30, "success"], ["au-southeast-2", 88, 76, "success"],
] as const;

function GeoPage() {
  const live = useLiveSeries(60, 901, 80, 18);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 069 · AZURE MAPS"
          title="Global Geo Monitoring"
          subtitle="Live PoP heartbeat · regional latency · attack heatmap."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <Metric label="Regions" value="12" tone="primary" />
          <Metric label="Online" value="11" tone="success" />
          <Metric label="Degraded" value="2" tone="warning" />
          <Metric label="P95 global" value="42ms" tone="info" spark={<MiniArea data={generateSeries(24, 91, 50, 8)} color="var(--info)" />} />
          <Metric label="Threat events" value="184" tone="danger" spark={<MiniArea data={generateSeries(24, 92, 30, 20)} color="var(--danger)" />} />
        </div>

        <Panel kicker="LIVE WORLD MAP" title="Heartbeat · 12 regions">
          <div className="relative h-[360px] w-full overflow-hidden rounded-lg border border-border bg-[radial-gradient(ellipse_at_center,_color-mix(in_oklab,_var(--primary)_8%,_transparent)_0%,_transparent_70%)]">
            <div className="absolute inset-0 grid-bg-fine opacity-40" />
            {/* simplified continents as soft polygons */}
            <svg viewBox="0 0 100 50" className="absolute inset-0 h-full w-full">
              <g fill="color-mix(in oklab, var(--primary) 12%, transparent)" stroke="color-mix(in oklab, var(--primary) 30%, transparent)" strokeWidth="0.15">
                <path d="M14,16 L28,12 L34,18 L30,26 L18,28 Z" />
                <path d="M28,30 L38,30 L36,42 L28,44 Z" />
                <path d="M44,12 L58,10 L60,20 L50,24 Z" />
                <path d="M50,24 L60,22 L58,40 L48,42 L46,32 Z" />
                <path d="M62,14 L82,10 L88,22 L74,30 L64,24 Z" />
                <path d="M78,32 L90,30 L88,42 L80,44 Z" />
              </g>
            </svg>
            {/* radar sweep */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: "conic-gradient(from 0deg, transparent 0deg, color-mix(in oklab, var(--primary) 20%, transparent) 30deg, transparent 60deg)" }}>
              <div className="h-full w-full animate-radar" />
            </div>
            {NODES.map(([id, x, y, t]) => (
              <div key={id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: `${y}%` }}>
                <span className={`live-dot ${t === "warning" ? "warn" : ""}`} />
                <span className="ml-2 font-mono text-[10px] text-muted-foreground">{id}</span>
              </div>
            ))}
          </div>
        </Panel>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Panel kicker="LATENCY · LIVE" title="P50 · P95 · P99 across regions">
            <MultiLine data={live} h={240} />
          </Panel>
          <Panel kicker="REGION TABLE" title="Sorted by load" padded={false}>
            <table className="w-full text-[12px]">
              <thead className="border-b border-border bg-surface-2/40 text-[10.5px] uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-3 py-2 text-left">REGION</th><th className="px-3 py-2 text-left">STATUS</th><th className="px-3 py-2 text-left">P95</th><th className="px-3 py-2 text-left">QPS</th></tr>
              </thead>
              <tbody>
                {NODES.slice(0, 8).map(([id, , , t], i) => (
                  <tr key={id} className="border-b border-border/50 hover:bg-accent/40">
                    <td className="px-3 py-2 font-mono">{id}</td>
                    <td className="px-3 py-2"><span className={`live-dot ${t==="warning"?"warn":""}`} /></td>
                    <td className="px-3 py-2 font-mono text-muted-foreground">{20 + i * 8}ms</td>
                    <td className="px-3 py-2 font-mono text-info">{(18 - i) * 1200}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
        </div>
      </div>
    </div>
  );
}
