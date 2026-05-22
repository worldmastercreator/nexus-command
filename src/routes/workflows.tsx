import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Radial } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { FilterableTable, Sev, type Column } from "@/components/dash/FilterableTable";
import { useEvents } from "@/lib/eventBus";
import { Gated, useRbac } from "@/lib/rbac";
import { Workflow, Play, RotateCw, Pause } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/workflows")({
  head: () => ({ meta: [{ title: "Workflows · AEGIS OS" }] }),
  component: Page,
});

interface Row { id: string; name: string; status: string; severity: "info" | "success" | "warning" | "danger"; runs24h: number; lastRun: string; region: string }

const SEED: Row[] = [
  { id: "wf_001", name: "lead.crm.sync", status: "RUNNING", severity: "success", runs24h: 18420, lastRun: "2s ago", region: "us-east-1" },
  { id: "wf_002", name: "order.shopify.slack", status: "RUNNING", severity: "success", runs24h: 2840, lastRun: "8s ago", region: "us-east-1" },
  { id: "wf_003", name: "invoice.email", status: "RUNNING", severity: "info", runs24h: 1248, lastRun: "12s ago", region: "eu-west-1" },
  { id: "wf_004", name: "ticket.escalate", status: "WARN", severity: "warning", runs24h: 96, lastRun: "1m ago", region: "ap-south-1" },
  { id: "wf_005", name: "bi.snapshot", status: "RUNNING", severity: "success", runs24h: 42, lastRun: "3m ago", region: "us-east-1" },
  { id: "wf_006", name: "bug.report", status: "FAILED", severity: "danger", runs24h: 4, lastRun: "11m ago", region: "eu-west-1" },
  { id: "wf_007", name: "user.welcome.flow", status: "RUNNING", severity: "success", runs24h: 5320, lastRun: "1s ago", region: "us-east-1" },
  { id: "wf_008", name: "payment.refund.audit", status: "PAUSED", severity: "warning", runs24h: 0, lastRun: "2h ago", region: "eu-west-1" },
];

function Page() {
  const live = useLiveSeries(48, 851, 65, 18);
  const recent = useEvents((e) => e.channel === "workflow", 40);
  const { can } = useRbac();

  const cols: Column<Row>[] = [
    { key: "id", label: "ID", mono: true },
    { key: "name", label: "Workflow", mono: true },
    { key: "status", label: "Status", render: (r) => <Sev s={r.severity} /> },
    { key: "region", label: "Region", mono: true },
    { key: "runs24h", label: "Runs · 24h", align: "right", mono: true, render: (r) => r.runs24h.toLocaleString() },
    { key: "lastRun", label: "Last run", mono: true },
    {
      key: "id", label: "", align: "right",
      render: (r) => (
        <Gated perm="workflow.replay" label="LOCK">
          <button onClick={() => { toast.success(`Replay queued for ${r.name}`); }}
            disabled={!can("workflow.replay")}
            className="inline-flex items-center gap-1 rounded border border-border bg-surface-2 px-2 py-0.5 font-mono text-[10px] uppercase text-foreground hover:border-primary/40">
            <RotateCw className="h-3 w-3" />Replay
          </button>
        </Gated>
      ),
    },
  ];

  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="DRILL-DOWN · WORKFLOW · AUTOMATION" title="Workflow Automation"
          subtitle="Filterable workflow registry · replay-gated by role · CSV export." />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="Active flows" value={String(SEED.filter((s) => s.status === "RUNNING").length)} delta="of 8" tone="primary" spark={<MiniArea data={generateSeries(24, 871, 70, 14)} />} />
          <Metric label="Runs · 24h" value={SEED.reduce((a, s) => a + s.runs24h, 0).toLocaleString()} delta="+22%" tone="success" spark={<MiniArea data={generateSeries(24, 872, 80, 22)} color="var(--success)" />} />
          <Metric label="Failed" value={String(SEED.filter((s) => s.severity === "danger").length)} delta="0.04%" tone="danger" spark={<MiniArea data={generateSeries(24, 873, 20, 14)} color="var(--danger)" />} />
          <Metric label="Live events" value={String(recent.length)} delta="bus stream" tone="ai" spark={<MiniArea data={generateSeries(24, 874, 50, 18)} color="var(--ai)" />} />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="TELEMETRY" title="Tasks · success · errors"><MultiLine data={live} h={260} /></Panel>
          <Panel kicker="HEALTH" title="Run reliability">
            <div className="grid grid-cols-2 gap-2">
              <Radial value={99} color="var(--success)" label="SUCCESS" />
              <Radial value={92} color="var(--primary)" label="QUEUE" />
            </div>
            <ul className="mt-3 space-y-1.5 text-[11.5px]">
              <li className="flex justify-between"><span>Avg run</span><span className="font-mono">240ms</span></li>
              <li className="flex justify-between"><span>Replays · 24h</span><span className="font-mono text-warning">412</span></li>
            </ul>
          </Panel>
        </div>
        <FilterableTable<Row>
          kicker="REGISTRY · FILTERABLE" title="Workflows"
          rows={SEED} columns={cols} exportName="workflows"
          facets={[
            { key: "status", label: "STATUS", options: ["RUNNING", "WARN", "FAILED", "PAUSED"] },
            { key: "region", label: "REGION", options: ["us-east-1", "eu-west-1", "ap-south-1"] },
          ]}
        />
        <Panel kicker="LIVE · BUS" title="Recent workflow events">
          <ul className="max-h-72 overflow-auto divide-y divide-border/40 font-mono text-[11px]">
            {[...recent].reverse().map((e) => (
              <li key={e.id} className="flex items-center gap-3 py-1.5">
                <span className="w-20 text-muted-foreground">{new Date(e.ts).toISOString().slice(11, 19)}</span>
                <Sev s={e.severity} />
                <span className="w-44 truncate">{e.source}</span>
                <span className="flex-1 truncate text-muted-foreground">{e.message}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

void Workflow; void Play; void Pause;
