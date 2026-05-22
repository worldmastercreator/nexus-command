import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Radial } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { FilterableTable, Sev, type Column } from "@/components/dash/FilterableTable";
import { Gated, useRbac } from "@/lib/rbac";
import { RotateCw, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/webhooks")({
  head: () => ({ meta: [{ title: "Webhooks · AEGIS OS" }] }),
  component: Page,
});

interface Hook { id: string; endpoint: string; event: string; status: string; severity: "info"|"success"|"warning"|"danger"; attempts: number; lastCode: number; region: string }

const SEED: Hook[] = [
  { id: "wh_001", endpoint: "https://api.acme.io/hooks/stripe", event: "charge.succeeded", status: "DELIVERED", severity: "success", attempts: 1, lastCode: 200, region: "us-east-1" },
  { id: "wh_002", endpoint: "https://hub.partner.co/in", event: "order.created", status: "FAILED", severity: "danger", attempts: 5, lastCode: 502, region: "eu-west-1" },
  { id: "wh_003", endpoint: "https://crm.client.com/webhook", event: "lead.qualified", status: "RETRYING", severity: "warning", attempts: 3, lastCode: 429, region: "us-east-1" },
  { id: "wh_004", endpoint: "https://logs.observ.dev/in", event: "audit.event", status: "DELIVERED", severity: "success", attempts: 1, lastCode: 200, region: "us-east-1" },
  { id: "wh_005", endpoint: "https://slack.com/api/x", event: "incident.created", status: "DELIVERED", severity: "success", attempts: 1, lastCode: 200, region: "us-east-1" },
  { id: "wh_006", endpoint: "https://api.broken.example", event: "user.signup", status: "FAILED", severity: "danger", attempts: 8, lastCode: 500, region: "ap-south-1" },
  { id: "wh_007", endpoint: "https://invoicing.svc/hook", event: "invoice.paid", status: "DELIVERED", severity: "success", attempts: 1, lastCode: 200, region: "eu-west-1" },
];

function Page() {
  const live = useLiveSeries(48, 551, 60, 16);
  const { can } = useRbac();

  const cols: Column<Hook>[] = [
    { key: "id", label: "ID", mono: true },
    { key: "endpoint", label: "Endpoint", mono: true, render: (r) => <span className="truncate text-muted-foreground">{r.endpoint}</span> },
    { key: "event", label: "Event", mono: true },
    { key: "status", label: "Status", render: (r) => <Sev s={r.severity} /> },
    { key: "attempts", label: "Attempts", align: "right", mono: true },
    { key: "lastCode", label: "Code", align: "right", mono: true },
    { key: "region", label: "Region", mono: true },
    {
      key: "id", label: "", align: "right",
      render: (r) => (
        <div className="flex justify-end gap-1">
          <Gated perm="webhook.retry" label="LOCK">
            <button disabled={!can("webhook.retry")} onClick={() => toast.success(`Retry queued for ${r.id}`)}
              className="inline-flex items-center gap-1 rounded border border-border bg-surface-2 px-2 py-0.5 font-mono text-[10px] uppercase hover:border-primary/50">
              <RotateCw className="h-3 w-3" />Retry
            </button>
          </Gated>
          <Gated perm="webhook.delete" label="LOCK">
            <button disabled={!can("webhook.delete")} onClick={() => toast.error(`Deleted ${r.id}`)}
              className="inline-flex items-center gap-1 rounded border border-border bg-surface-2 px-2 py-0.5 font-mono text-[10px] uppercase hover:border-danger/50">
              <Trash2 className="h-3 w-3" />Del
            </button>
          </Gated>
        </div>
      ),
    },
  ];

  const failed = SEED.filter((h) => h.severity === "danger").length;

  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="DRILL-DOWN · WEBHOOKS · DELIVERY" title="Webhook Delivery"
          subtitle="Inspect endpoint deliveries · retry & delete are gated by role." />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="Endpoints" value={String(SEED.length)} delta="active" tone="primary" spark={<MiniArea data={generateSeries(24, 571, 60, 14)} />} />
          <Metric label="Delivered · 24h" value="48,210" delta="99.7%" tone="success" spark={<MiniArea data={generateSeries(24, 572, 80, 18)} color="var(--success)" />} />
          <Metric label="Failed" value={String(failed)} delta="needs retry" tone="danger" spark={<MiniArea data={generateSeries(24, 573, 20, 14)} color="var(--danger)" />} />
          <Metric label="P95 latency" value="142ms" delta="—12ms" tone="ai" spark={<MiniArea data={generateSeries(24, 574, 50, 8)} color="var(--ai)" />} />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="DELIVERY" title="Throughput · errors · latency"><MultiLine data={live} h={240} /></Panel>
          <Panel kicker="RELIABILITY" title="Endpoint health">
            <div className="grid grid-cols-2 gap-2">
              <Radial value={99.7} color="var(--success)" label="DELIVERED" />
              <Radial value={84} color="var(--primary)" label="2XX RATIO" />
            </div>
          </Panel>
        </div>
        <FilterableTable<Hook>
          kicker="REGISTRY · FILTERABLE" title="Webhook endpoints"
          rows={SEED} columns={cols} exportName="webhooks"
          facets={[
            { key: "status", label: "STATUS", options: ["DELIVERED", "FAILED", "RETRYING"] },
            { key: "region", label: "REGION", options: ["us-east-1", "eu-west-1", "ap-south-1"] },
          ]}
        />
      </div>
    </div>
  );
}
