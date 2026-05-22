import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Radial } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { FilterableTable, Sev, type Column } from "@/components/dash/FilterableTable";
import { useEvents } from "@/lib/eventBus";
import { Gated, useRbac } from "@/lib/rbac";
import { CheckCircle2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useMemo } from "react";

export const Route = createFileRoute("/crashes")({
  head: () => ({ meta: [{ title: "Crashes · AEGIS OS" }] }),
  component: Page,
});

interface CrashRow {
  id: string; ts: string; severity: "info" | "success" | "warning" | "danger";
  service: string; error: string; region: string; users: number; status: string;
}

function Page() {
  const live = useLiveSeries(48, 651, 30, 12);
  const events = useEvents((e) => e.channel === "crash", 80);
  const { can } = useRbac();

  const rows: CrashRow[] = useMemo(() => events.map((e, i) => ({
    id: e.id, ts: new Date(e.ts).toISOString().slice(11, 19),
    severity: e.severity, service: e.source, error: e.message,
    region: String(e.meta?.region ?? "—"),
    users: 1 + (i % 7) * 4,
    status: i % 5 === 0 ? "ACK" : "OPEN",
  })).reverse(), [events]);

  const cols: Column<CrashRow>[] = [
    { key: "ts", label: "Time", mono: true },
    { key: "severity", label: "Sev", render: (r) => <Sev s={r.severity} /> },
    { key: "service", label: "Service", mono: true },
    { key: "error", label: "Error" },
    { key: "region", label: "Region", mono: true },
    { key: "users", label: "Users", align: "right", mono: true },
    { key: "status", label: "Status", mono: true, render: (r) => <span className={r.status === "ACK" ? "text-success" : "text-danger"}>{r.status}</span> },
    {
      key: "id", label: "", align: "right",
      render: (r) => (
        <div className="flex justify-end gap-1">
          <Gated perm="incident.ack" label="LOCK">
            <button disabled={!can("incident.ack")} onClick={() => toast.success(`Acknowledged ${r.service}`)}
              className="inline-flex items-center gap-1 rounded border border-border bg-surface-2 px-2 py-0.5 font-mono text-[10px] uppercase hover:border-success/50">
              <CheckCircle2 className="h-3 w-3" />Ack
            </button>
          </Gated>
          <Gated perm="crashes.assign" label="LOCK">
            <button disabled={!can("crashes.assign")} onClick={() => toast(`Assigned ${r.id} to on-call`)}
              className="inline-flex items-center gap-1 rounded border border-border bg-surface-2 px-2 py-0.5 font-mono text-[10px] uppercase hover:border-primary/50">
              <UserPlus className="h-3 w-3" />Assign
            </button>
          </Gated>
        </div>
      ),
    },
  ];

  const open = rows.filter((r) => r.status === "OPEN").length;

  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="DRILL-DOWN · CRASH · MONITORING" title="Crash Monitoring"
          subtitle="Aggregated crash signals across services · acknowledge & assign gated by role." />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="Open" value={String(open)} delta="window" tone="danger" spark={<MiniArea data={generateSeries(24, 671, 20, 14)} color="var(--danger)" />} />
          <Metric label="Acknowledged" value={String(rows.length - open)} delta="window" tone="success" spark={<MiniArea data={generateSeries(24, 672, 40, 8)} color="var(--success)" />} />
          <Metric label="Affected services" value={String(new Set(rows.map((r) => r.service)).size)} delta="unique" tone="warning" spark={<MiniArea data={generateSeries(24, 673, 30, 10)} color="var(--warning)" />} />
          <Metric label="Crash rate" value="0.012%" delta="vs sessions" tone="ai" spark={<MiniArea data={generateSeries(24, 674, 25, 8)} color="var(--ai)" />} />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="TELEMETRY" title="Crashes · 48h"><MultiLine data={live} h={240} /></Panel>
          <Panel kicker="STABILITY" title="Session quality">
            <div className="grid grid-cols-2 gap-2">
              <Radial value={99.88} color="var(--success)" label="STABLE %" />
              <Radial value={84} color="var(--warning)" label="MTTA %" />
            </div>
          </Panel>
        </div>
        <FilterableTable<CrashRow>
          kicker="INCIDENTS · FILTERABLE" title="Recent crashes"
          rows={rows} columns={cols} exportName="crashes"
          facets={[
            { key: "severity", label: "SEV", options: ["warning", "danger"] },
            { key: "service", label: "SERVICE", options: ["web-app", "ios-app", "android-app", "worker-node", "graphql-gw"] },
            { key: "status", label: "STATUS", options: ["OPEN", "ACK"] },
          ]}
        />
      </div>
    </div>
  );
}
