import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { Bars, MiniArea, Radial } from "@/components/dash/charts";
import { generateSeries } from "@/lib/data";

export const Route = createFileRoute("/backup")({
  head: () => ({ meta: [{ title: "Backup & Recovery · AEGIS OS" }] }),
  component: BackupPage,
});

function BackupPage() {
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 067 · VEEAM"
          title="Backup & Disaster Recovery"
          subtitle="Snapshots · PITR · cross-region replicas · restore drills."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <Metric label="Protected (TB)" value="184.2" tone="primary" />
          <Metric label="Snapshots" value="48,210" tone="info" spark={<MiniArea data={generateSeries(24, 91, 80, 8)} color="var(--info)" />} />
          <Metric label="RPO" value="60s" tone="success" />
          <Metric label="RTO" value="4m 12s" delta="-22%" tone="ai" />
          <Metric label="Failed jobs" value="2" tone="warning" />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="JOB OUTCOMES · 30D" title="Success · warning · failure">
            <Bars data={generateSeries(30, 101, 80, 16)} h={240} />
          </Panel>
          <Panel kicker="RESTORE DRILL" title="Last quarterly run">
            <Radial value={99} color="var(--success)" label="PASS" h={200} />
          </Panel>
        </div>

        <Panel kicker="ACTIVE JOBS" title="Live · queue depth 12" padded={false}>
          <table className="w-full text-[12px]">
            <thead className="border-b border-border bg-surface-2/40 text-[10.5px] uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-3 py-2 text-left">JOB</th><th className="px-3 py-2 text-left">TARGET</th><th className="px-3 py-2 text-left">SIZE</th><th className="px-3 py-2 text-left">PROGRESS</th><th className="px-3 py-2 text-left">ETA</th></tr>
            </thead>
            <tbody>
              {[
                ["nightly-pg-prod", "rds/aegis-prod", "412 GB", 84, "00:08"],
                ["snap-s3-media", "s3://aegis-media", "1.2 TB", 41, "00:22"],
                ["replica-eu→us", "pg/aegis-eu-1", "184 GB", 96, "00:01"],
                ["cold-clickhouse", "ch/analytics-1", "2.4 TB", 18, "01:48"],
                ["dr-drill", "all/aegis-dr", "—", 62, "00:14"],
              ].map((r) => (
                <tr key={r[0] as string} className="border-b border-border/50 hover:bg-accent/40">
                  <td className="px-3 py-2 font-mono">{r[0]}</td>
                  <td className="px-3 py-2 font-mono text-[11px] text-muted-foreground">{r[1]}</td>
                  <td className="px-3 py-2 font-mono">{r[2]}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2"><div className="h-1 w-24 overflow-hidden rounded-full bg-surface"><div className="h-full bg-primary" style={{ width: `${r[3]}%` }} /></div><span className="font-mono text-[10px] text-muted-foreground">{r[3]}%</span></div>
                  </td>
                  <td className="px-3 py-2 font-mono text-[11px] text-muted-foreground">{r[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </div>
  );
}
