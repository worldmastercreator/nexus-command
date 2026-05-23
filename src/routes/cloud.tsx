import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, StackedArea, Radial } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";

export const Route = createFileRoute("/cloud")({
  head: () => ({ meta: [{ title: "Cloud Infra · AEGIS OS" }] }),
  component: CloudPage,
});

function CloudPage() {
  const live = useLiveSeries(60, 511, 80, 16);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 062 · AWS CONSOLE"
          title="Cloud Infrastructure"
          subtitle="Multi-cloud · multi-region · cost · capacity · reservations."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <Metric label="Regions" value="12 / 18" tone="primary" />
          <Metric label="vCPU" value="48,210" delta="74% util" tone="info" spark={<MiniArea data={generateSeries(24, 51, 70, 8)} color="var(--info)" />} />
          <Metric label="RAM (TB)" value="184" delta="68% util" tone="ai" spark={<MiniArea data={generateSeries(24, 52, 60, 10)} color="var(--ai)" />} />
          <Metric label="Monthly spend" value="$182.4K" delta="+2.1%" tone="warning" spark={<MiniArea data={generateSeries(24, 53, 60, 8)} color="var(--warning)" />} />
          <Metric label="Reserved" value="68%" tone="success" />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="COMPUTE / STORAGE / NETWORK" title="Spend by service">
            <StackedArea data={live} h={260} />
          </Panel>
          <Panel kicker="CAPACITY · GLOBAL" title="Headroom available">
            <Radial value={26} color="var(--info)" label="USED" h={200} />
          </Panel>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Panel kicker="REGION HEALTH" title="Live posture">
            <ul className="space-y-2 text-[12px]">
              {[
                ["us-east-1", "operational", "success", "42ms"],
                ["us-west-2", "operational", "success", "38ms"],
                ["eu-west-1", "operational", "success", "12ms"],
                ["eu-central-1", "degraded", "warning", "68ms"],
                ["ap-southeast-1", "operational", "success", "84ms"],
                ["ap-south-1", "operational", "success", "108ms"],
                ["sa-east-1", "operational", "success", "142ms"],
                ["af-south-1", "maintenance", "warning", "—"],
              ].map(([r, s, t, l]) => (
                <li key={r} className="flex items-center gap-3 rounded-md border border-border bg-surface-2/40 px-3 py-2">
                  <span className={`live-dot ${t === "warning" ? "warn" : ""}`} />
                  <span className="font-mono text-[11px]">{r}</span>
                  <span className={`text-[11px] text-${t}`}>{s}</span>
                  <span className="ml-auto font-mono text-[11px] text-muted-foreground">{l}</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel kicker="TOP RESOURCES" title="Hourly throughput">
            <MultiLine data={generateSeries(24, 61, 80, 14)} h={240} />
          </Panel>
        </div>
      </div>
    </div>
  );
}
