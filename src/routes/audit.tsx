import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { StackedArea, MiniArea, Bars } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";

export const Route = createFileRoute("/audit")({
  head: () => ({ meta: [{ title: "Audit Logs · AEGIS OS" }] }),
  component: AuditPage,
});

function AuditPage() {
  const live = useLiveSeries(60, 311, 100, 28);
  const rows = [
    ["18:04:21", "auth.session.start", "ops@aegis.io", "192.0.2.14 · DE", "ok"],
    ["18:04:09", "secrets.read", "svc/payments", "10.0.7.4", "ok"],
    ["18:03:55", "billing.invoice.void", "admin@aegis.io", "203.0.113.9 · US", "warn"],
    ["18:03:41", "rbac.role.attach", "admin@aegis.io", "203.0.113.9", "ok"],
    ["18:03:22", "marketplace.payout.release", "finance@aegis.io", "198.51.100.2 · NL", "ok"],
    ["18:03:01", "ai.model.publish", "ml@aegis.io", "10.0.4.18", "ok"],
    ["18:02:48", "auth.login.failed", "—", "45.10.22.7 · RU", "deny"],
    ["18:02:30", "fs.bucket.delete", "infra@aegis.io", "10.0.1.2", "warn"],
  ];
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 006 · SPLUNK"
          title="Immutable Audit Logs"
          subtitle="Append-only · cryptographically chained · queryable across all 101 modules."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <Metric label="Events/day" value="48.2M" tone="primary" spark={<MiniArea data={generateSeries(24, 11, 80, 14)} />} />
          <Metric label="Indexed (GB)" value="312" tone="info" spark={<MiniArea data={generateSeries(24, 12, 60, 10)} color="var(--info)" />} />
          <Metric label="Privileged ops" value="1,284" tone="warning" spark={<MiniArea data={generateSeries(24, 13, 30, 18)} color="var(--warning)" />} />
          <Metric label="Failed access" value="372" tone="danger" spark={<MiniArea data={generateSeries(24, 14, 30, 22)} color="var(--danger)" />} />
          <Metric label="Chain integrity" value="100%" tone="success" />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="EVENT VOLUME" title="Ingest · indexed · cold-stored">
            <StackedArea data={live} h={260} />
          </Panel>
          <Panel kicker="TOP ACTIONS" title="Last hour">
            <ul className="space-y-2 text-[12px]">
              {[
                ["auth.session.start", 38420],
                ["api.request", 28110],
                ["secrets.read", 9210],
                ["billing.invoice.create", 1240],
                ["rbac.role.attach", 184],
                ["ai.model.publish", 12],
              ].map(([k, v]) => (
                <li key={k as string} className="flex items-center gap-2">
                  <span className="font-mono text-[10.5px] text-muted-foreground">{k}</span>
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-surface"><div className="h-full bg-primary" style={{ width: `${Math.min(100, (v as number) / 400)}%` }} /></div>
                  <span className="w-16 text-right font-mono text-[11px]">{(v as number).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <Panel kicker="LIVE STREAM" title="Append-only · last 8 events" padded={false}>
          <table className="w-full text-[12px]">
            <thead className="border-b border-border bg-surface-2/40 text-[10.5px] uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-3 py-2 text-left">TIME</th><th className="px-3 py-2 text-left">ACTION</th><th className="px-3 py-2 text-left">ACTOR</th><th className="px-3 py-2 text-left">SOURCE</th><th className="px-3 py-2 text-left">RESULT</th></tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r[0]} className="border-b border-border/50 hover:bg-accent/40">
                  <td className="px-3 py-2 font-mono text-[11px] text-muted-foreground">{r[0]}</td>
                  <td className="px-3 py-2 font-mono text-[11px]">{r[1]}</td>
                  <td className="px-3 py-2">{r[2]}</td>
                  <td className="px-3 py-2 font-mono text-[11px] text-muted-foreground">{r[3]}</td>
                  <td className="px-3 py-2">
                    <span className={`rounded px-2 py-0.5 text-[10px] font-mono uppercase ${r[4]==="ok"?"bg-success/15 text-success":r[4]==="warn"?"bg-warning/15 text-warning":"bg-danger/15 text-danger"}`}>{r[4]}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel kicker="HOURLY VOLUME" title="Past 20 hours">
          <Bars data={generateSeries(20, 21, 100, 26)} h={180} />
        </Panel>
      </div>
    </div>
  );
}
