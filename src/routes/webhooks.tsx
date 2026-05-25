import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Radial } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { FilterableTable, Sev, type Column } from "@/components/dash/FilterableTable";
import { Gated, useRbac } from "@/lib/rbac";
import { RotateCw, Trash2, ShieldCheck, ShieldAlert, Copy, Play, CheckCircle2, XCircle, Clock, Webhook as WebhookIcon } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/webhooks")({
  head: () => ({ meta: [{ title: "Webhook Inspector · AEGIS OS" }] }),
  component: Page,
});

interface Hook {
  id: string; endpoint: string; event: string; status: string;
  severity: "info" | "success" | "warning" | "danger";
  attempts: number; lastCode: number; region: string;
  signature: "verified" | "invalid" | "missing";
  latencyMs: number; ts: string;
}

const SEED: Hook[] = [
  { id: "wh_001", endpoint: "https://api.acme.io/hooks/stripe", event: "charge.succeeded", status: "DELIVERED", severity: "success", attempts: 1, lastCode: 200, region: "us-east-1", signature: "verified", latencyMs: 142, ts: "12:08:41" },
  { id: "wh_002", endpoint: "https://hub.partner.co/in", event: "order.created", status: "FAILED", severity: "danger", attempts: 5, lastCode: 502, region: "eu-west-1", signature: "verified", latencyMs: 2840, ts: "12:08:36" },
  { id: "wh_003", endpoint: "https://crm.client.com/webhook", event: "lead.qualified", status: "RETRYING", severity: "warning", attempts: 3, lastCode: 429, region: "us-east-1", signature: "verified", latencyMs: 510, ts: "12:08:31" },
  { id: "wh_004", endpoint: "https://logs.observ.dev/in", event: "audit.event", status: "DELIVERED", severity: "success", attempts: 1, lastCode: 200, region: "us-east-1", signature: "verified", latencyMs: 88, ts: "12:08:24" },
  { id: "wh_005", endpoint: "https://slack.com/api/x", event: "incident.created", status: "DELIVERED", severity: "success", attempts: 1, lastCode: 200, region: "us-east-1", signature: "verified", latencyMs: 174, ts: "12:08:19" },
  { id: "wh_006", endpoint: "https://api.broken.example", event: "user.signup", status: "FAILED", severity: "danger", attempts: 8, lastCode: 500, region: "ap-south-1", signature: "invalid", latencyMs: 5120, ts: "12:08:11" },
  { id: "wh_007", endpoint: "https://invoicing.svc/hook", event: "invoice.paid", status: "DELIVERED", severity: "success", attempts: 1, lastCode: 200, region: "eu-west-1", signature: "verified", latencyMs: 96, ts: "12:08:02" },
  { id: "wh_008", endpoint: "https://legacy.intra.net/in", event: "ticket.updated", status: "FAILED", severity: "danger", attempts: 2, lastCode: 401, region: "us-east-1", signature: "missing", latencyMs: 312, ts: "12:07:55" },
  { id: "wh_009", endpoint: "https://api.acme.io/hooks/stripe", event: "refund.created", status: "DELIVERED", severity: "success", attempts: 1, lastCode: 200, region: "us-east-1", signature: "verified", latencyMs: 121, ts: "12:07:48" },
  { id: "wh_010", endpoint: "https://hub.partner.co/in", event: "order.cancelled", status: "RETRYING", severity: "warning", attempts: 2, lastCode: 503, region: "eu-west-1", signature: "verified", latencyMs: 1840, ts: "12:07:40" },
];

const PAYLOAD = `{
  "id": "evt_1Q8aZk2eZvKYlo2C",
  "type": "charge.succeeded",
  "created": 1748441321,
  "data": {
    "object": {
      "id": "ch_3Q8aZk2eZvKYlo2C",
      "amount": 4900,
      "currency": "usd",
      "customer": "cus_QmZ8a2eZv"
    }
  },
  "livemode": true
}`;

function SigBadge({ sig }: { sig: Hook["signature"] }) {
  if (sig === "verified") return <span className="inline-flex items-center gap-1 rounded border border-success/40 px-1.5 py-0.5 font-mono text-[10px] uppercase text-success"><ShieldCheck className="h-3 w-3" />Verified</span>;
  if (sig === "invalid") return <span className="inline-flex items-center gap-1 rounded border border-danger/40 px-1.5 py-0.5 font-mono text-[10px] uppercase text-danger"><ShieldAlert className="h-3 w-3" />Invalid</span>;
  return <span className="inline-flex items-center gap-1 rounded border border-warning/40 px-1.5 py-0.5 font-mono text-[10px] uppercase text-warning"><ShieldAlert className="h-3 w-3" />Missing</span>;
}

function Timeline({ rows, onSelect, selected }: { rows: Hook[]; onSelect: (h: Hook) => void; selected: string }) {
  return (
    <div className="relative">
      <div className="absolute left-0 right-0 top-5 h-px bg-border" />
      <div className="relative flex gap-3 overflow-x-auto pb-2">
        {rows.map((h) => {
          const tone = h.severity === "success" ? "text-success border-success/60 bg-success/10"
            : h.severity === "danger" ? "text-danger border-danger/60 bg-danger/10"
            : "text-warning border-warning/60 bg-warning/10";
          const Icon = h.severity === "success" ? CheckCircle2 : h.severity === "danger" ? XCircle : Clock;
          const active = selected === h.id;
          return (
            <button key={h.id} onClick={() => onSelect(h)}
              className={`group relative shrink-0 rounded-md border bg-surface-2 p-2 text-left transition-all ${active ? "border-primary shadow-[0_0_0_1px_var(--primary)]" : "border-border hover:border-primary/40"}`}
              style={{ width: 168 }}>
              <div className={`mb-1 inline-flex h-7 w-7 items-center justify-center rounded-full border ${tone}`}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{h.ts} · {h.id}</div>
              <div className="truncate text-[12px] text-foreground">{h.event}</div>
              <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
                <span className="font-mono">{h.lastCode}</span>
                <span className="font-mono">{h.latencyMs}ms</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Page() {
  const live = useLiveSeries(48, 551, 60, 16);
  const { can } = useRbac();
  const [selected, setSelected] = useState<Hook>(SEED[1]);

  const sigStats = useMemo(() => {
    const v = SEED.filter((h) => h.signature === "verified").length;
    const i = SEED.filter((h) => h.signature === "invalid").length;
    const m = SEED.filter((h) => h.signature === "missing").length;
    return { v, i, m, pct: Math.round((v / SEED.length) * 100) };
  }, []);

  const cols: Column<Hook>[] = [
    { key: "ts", label: "Time", mono: true },
    { key: "id", label: "ID", mono: true },
    { key: "endpoint", label: "Endpoint", mono: true, render: (r) => <span className="truncate text-muted-foreground">{r.endpoint}</span> },
    { key: "event", label: "Event", mono: true },
    { key: "status", label: "Status", render: (r) => <Sev s={r.severity} /> },
    { key: "signature", label: "Sig", render: (r) => <SigBadge sig={r.signature} /> },
    { key: "attempts", label: "Try", align: "right", mono: true },
    { key: "lastCode", label: "Code", align: "right", mono: true },
    { key: "latencyMs", label: "ms", align: "right", mono: true },
    {
      key: "id", label: "", align: "right",
      render: (r) => (
        <div className="flex justify-end gap-1">
          <button onClick={() => setSelected(r)} className="inline-flex items-center gap-1 rounded border border-border bg-surface-2 px-2 py-0.5 font-mono text-[10px] uppercase hover:border-primary/50">
            <Play className="h-3 w-3" />Inspect
          </button>
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
  const computed = "sha256=8c7f3a91d2e0b54a1f9c6e8a7b4d2f1e9c3b8a7d6e5f4c3b2a1908f7e6d5c4b3";
  const provided = selected.signature === "invalid"
    ? "sha256=11119999aaaa2222bbbb3333cccc4444dddd5555eeee6666ffff7777aaaa8888"
    : selected.signature === "missing" ? "" : computed;

  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 066 · WEBHOOK INSPECTOR" title="Webhook Inspector"
          subtitle="Replay timeline · HMAC signature verification · filterable delivery ledger."
          actions={
            <Gated perm="webhook.retry" label="LOCK">
              <button onClick={() => toast.success("Replay batch queued")} className="inline-flex items-center gap-2 rounded border border-primary/40 bg-primary/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-primary hover:bg-primary/20">
                <RotateCw className="h-3.5 w-3.5" />Replay failed
              </button>
            </Gated>
          } />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="Endpoints" value={String(SEED.length)} delta="active" tone="primary" spark={<MiniArea data={generateSeries(24, 571, 60, 14)} />} />
          <Metric label="Delivered · 24h" value="48,210" delta="99.7%" tone="success" spark={<MiniArea data={generateSeries(24, 572, 80, 18)} color="var(--success)" />} />
          <Metric label="Failed" value={String(failed)} delta="needs retry" tone="danger" spark={<MiniArea data={generateSeries(24, 573, 20, 14)} color="var(--danger)" />} />
          <Metric label="Sig verified" value={`${sigStats.pct}%`} delta={`${sigStats.i + sigStats.m} flagged`} tone="ai" spark={<MiniArea data={generateSeries(24, 574, 50, 8)} color="var(--ai)" />} />
        </div>

        <Panel kicker="REPLAY · LAST 10 EVENTS" title="Event timeline · click to inspect">
          <Timeline rows={SEED} onSelect={setSelected} selected={selected.id} />
        </Panel>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="THROUGHPUT" title="Delivery · errors · latency"><MultiLine data={live} h={240} /></Panel>
          <Panel kicker="RELIABILITY" title="Endpoint health">
            <div className="grid grid-cols-2 gap-2">
              <Radial value={99.7} color="var(--success)" label="DELIVERED" />
              <Radial value={sigStats.pct} color="var(--ai)" label="SIG VERIFIED" />
            </div>
          </Panel>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Panel kicker={`INSPECTOR · ${selected.id}`} title={selected.event}
            action={<SigBadge sig={selected.signature} />}>
            <dl className="mb-3 grid grid-cols-2 gap-x-4 gap-y-1.5 font-mono text-[11px]">
              <dt className="text-muted-foreground">Endpoint</dt><dd className="truncate text-foreground">{selected.endpoint}</dd>
              <dt className="text-muted-foreground">Status</dt><dd><Sev s={selected.severity} /></dd>
              <dt className="text-muted-foreground">HTTP code</dt><dd className="text-foreground">{selected.lastCode}</dd>
              <dt className="text-muted-foreground">Attempts</dt><dd className="text-foreground">{selected.attempts}</dd>
              <dt className="text-muted-foreground">Latency</dt><dd className="text-foreground">{selected.latencyMs}ms</dd>
              <dt className="text-muted-foreground">Region</dt><dd className="text-foreground">{selected.region}</dd>
            </dl>
            <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              <span>Payload · application/json</span>
              <button onClick={() => { navigator.clipboard?.writeText(PAYLOAD); toast.success("Payload copied"); }}
                className="inline-flex items-center gap-1 hover:text-foreground"><Copy className="h-3 w-3" />Copy</button>
            </div>
            <pre className="max-h-64 overflow-auto rounded border border-border bg-surface-2 p-3 font-mono text-[11px] leading-relaxed text-foreground/90">{PAYLOAD}</pre>
          </Panel>

          <Panel kicker="HMAC SIGNATURE CHECK" title="X-Signature · sha256"
            action={<WebhookIcon className="h-4 w-4 text-ai" />}>
            <div className="space-y-3">
              <div>
                <div className="mb-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Computed (server)</div>
                <div className="break-all rounded border border-border bg-surface-2 p-2 font-mono text-[11px] text-success">{computed}</div>
              </div>
              <div>
                <div className="mb-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Provided (header)</div>
                <div className={`break-all rounded border bg-surface-2 p-2 font-mono text-[11px] ${selected.signature === "verified" ? "border-success/40 text-success" : selected.signature === "invalid" ? "border-danger/40 text-danger" : "border-warning/40 text-warning"}`}>
                  {provided || "— header missing —"}
                </div>
              </div>
              <div className={`flex items-center justify-between rounded border p-3 ${selected.signature === "verified" ? "border-success/40 bg-success/5" : "border-danger/40 bg-danger/5"}`}>
                <div className="flex items-center gap-2">
                  {selected.signature === "verified"
                    ? <ShieldCheck className="h-5 w-5 text-success" />
                    : <ShieldAlert className="h-5 w-5 text-danger" />}
                  <div>
                    <div className="text-[12px] font-semibold text-foreground">
                      {selected.signature === "verified" ? "Signature matches" : selected.signature === "invalid" ? "Signature mismatch" : "Signature header missing"}
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      timing-safe-equal · sha256 · v1
                    </div>
                  </div>
                </div>
                <span className={`rounded px-2 py-1 font-mono text-[10px] uppercase ${selected.signature === "verified" ? "bg-success/20 text-success" : "bg-danger/20 text-danger"}`}>
                  {selected.signature === "verified" ? "PASS" : "FAIL"}
                </span>
              </div>
              <ul className="space-y-1 font-mono text-[11px] text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-success" />Timestamp within 5 min skew</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-success" />Replay nonce unique</li>
                <li className="flex items-center gap-2">{selected.signature === "verified" ? <CheckCircle2 className="h-3 w-3 text-success" /> : <XCircle className="h-3 w-3 text-danger" />}HMAC digest verified</li>
              </ul>
            </div>
          </Panel>
        </div>

        <FilterableTable<Hook>
          kicker="LEDGER · FILTERABLE" title="Webhook deliveries"
          rows={SEED} columns={cols} exportName="webhooks"
          facets={[
            { key: "status", label: "STATUS", options: ["DELIVERED", "FAILED", "RETRYING"] },
            { key: "signature", label: "SIG", options: ["verified", "invalid", "missing"] },
            { key: "region", label: "REGION", options: ["us-east-1", "eu-west-1", "ap-south-1"] },
          ]}
        />
      </div>
    </div>
  );
}
