import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Radio, Zap, AlertTriangle, Activity, GitBranch, Pause, Play, RotateCw } from "lucide-react";
import { PageHeader, Panel, Metric, StatusDot } from "@/components/dash/primitives";
import { MiniArea, StackedArea, Bars } from "@/components/dash/charts";
import { useLiveSeries } from "@/lib/data";
import { Gated } from "@/lib/rbac";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/event-bus")({
  component: EventBusDashboard,
});

type Topic = {
  name: string;
  partitions: number;
  rate: number;       // msgs/s
  lag: number;        // messages behind
  consumers: number;
  retention: string;
  status: "healthy" | "warn" | "danger";
};

const TOPICS: Topic[] = [
  { name: "orders.created",          partitions: 24, rate: 18420, lag:    142, consumers: 12, retention: "7d",  status: "healthy" },
  { name: "orders.paid",             partitions: 24, rate: 16980, lag:     38, consumers: 12, retention: "7d",  status: "healthy" },
  { name: "users.signup",            partitions: 12, rate:  4210, lag:      0, consumers:  6, retention: "30d", status: "healthy" },
  { name: "billing.invoice.emitted", partitions: 12, rate:  9120, lag:   1840, consumers:  4, retention: "30d", status: "warn"    },
  { name: "ai.inference.completed",  partitions: 48, rate: 42600, lag:    220, consumers: 24, retention: "3d",  status: "healthy" },
  { name: "logs.app.error",          partitions:  6, rate:   820, lag:  14200, consumers:  2, retention: "14d", status: "danger"  },
  { name: "iot.telemetry.v3",        partitions: 64, rate: 86120, lag:    980, consumers: 32, retention: "1d",  status: "warn"    },
  { name: "marketplace.gmv.tick",    partitions:  8, rate:  3210, lag:      0, consumers:  4, retention: "30d", status: "healthy" },
  { name: "fraud.signal.high",       partitions: 12, rate:   142, lag:      4, consumers:  8, retention: "90d", status: "healthy" },
  { name: "comms.notification.sent", partitions: 16, rate: 11240, lag:    310, consumers:  8, retention: "7d",  status: "healthy" },
];

const BROKERS = [
  { id: "kafka-01", region: "us-east-1", role: "leader",   cpu: 42, disk: 61, throughput: "1.4 GB/s" },
  { id: "kafka-02", region: "us-east-1", role: "follower", cpu: 38, disk: 58, throughput: "1.2 GB/s" },
  { id: "kafka-03", region: "eu-west-1", role: "leader",   cpu: 51, disk: 64, throughput: "1.6 GB/s" },
  { id: "kafka-04", region: "eu-west-1", role: "follower", cpu: 47, disk: 60, throughput: "1.3 GB/s" },
  { id: "kafka-05", region: "ap-south-1", role: "leader",  cpu: 68, disk: 72, throughput: "1.8 GB/s" },
  { id: "kafka-06", region: "ap-south-1", role: "follower",cpu: 55, disk: 67, throughput: "1.5 GB/s" },
];

function fmt(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

function EventBusDashboard() {
  const throughput = useLiveSeries(60, 7, 320, 80);
  const lagSeries = useLiveSeries(40, 11, 60, 30);
  const partitionFlow = useLiveSeries(24, 23, 180, 60);

  const totals = useMemo(() => {
    const rate = TOPICS.reduce((s, t) => s + t.rate, 0);
    const lag = TOPICS.reduce((s, t) => s + t.lag, 0);
    const consumers = TOPICS.reduce((s, t) => s + t.consumers, 0);
    return { rate, lag, consumers };
  }, []);

  return (
    <div className="grid-bg min-h-[calc(100vh-3.5rem-1.75rem)]">
      <div className="mx-auto max-w-[1600px] space-y-5 px-4 py-5 lg:px-6">
        <PageHeader
          eyebrow="MODULE · 085 · EVENT BUS"
          title="Queue / Event Bus"
          subtitle="Kafka-class streaming fabric · topic health · consumer lag · partition flow"
          actions={
            <div className="flex items-center gap-2">
              <button className="flex h-9 items-center gap-1.5 rounded-lg border border-border bg-surface-2/60 px-3 text-[12px] hover:bg-surface-2">
                <Pause className="h-3.5 w-3.5" /> Pause stream
              </button>
              <Gated perm="ai.publish">
                <button className="flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-[12px] font-medium text-primary-foreground hover:opacity-90">
                  <Play className="h-3.5 w-3.5" /> Produce
                </button>
              </Gated>
            </div>
          }
        />

        {/* KPI strip */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Metric label="Msgs / sec" value={fmt(totals.rate)} delta="+8.2% · 1h" tone="primary"
            spark={<MiniArea data={throughput.slice(-30).map((d, i) => ({ i, v: d.v }))} />} />
          <Metric label="Consumer lag" value={fmt(totals.lag)} delta="2 topics behind SLO" tone="warning"
            spark={<MiniArea data={lagSeries.slice(-30).map((d, i) => ({ i, v: d.v }))} color="var(--warning)" />} />
          <Metric label="Consumers online" value={String(totals.consumers)} delta="0 rebalances · 5m" tone="success" />
          <Metric label="Brokers" value={`${BROKERS.length}/6`} delta="3 regions · RF=3" tone="info" />
        </div>

        {/* Throughput + Partition flow */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <Panel
            className="xl:col-span-2"
            kicker="STREAM · LIVE"
            title="Cluster throughput — producers vs consumers"
            action={<span className="font-mono text-[10px] text-muted-foreground">window · 60s</span>}
          >
            <StackedArea data={throughput} h={260} />
            <div className="mt-3 flex flex-wrap items-center gap-4 font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground">
              <Legend swatch="var(--primary)" label="produced" />
              <Legend swatch="var(--ai)" label="consumed" />
              <Legend swatch="var(--warning)" label="retried" />
            </div>
          </Panel>

          <Panel kicker="PARTITIONS" title="Per-partition msg/s">
            <Bars data={partitionFlow} h={260} color="var(--info)" />
          </Panel>
        </div>

        {/* Topic registry */}
        <Panel
          kicker="TOPICS · 10 ACTIVE"
          title="Topic health & lag"
          padded={false}
          action={
            <button className="flex items-center gap-1.5 rounded-md border border-border bg-surface-2/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground">
              <RotateCw className="h-3 w-3" /> rebalance
            </button>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead className="border-b border-border/70 bg-surface/40 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 text-left">Topic</th>
                  <th className="px-4 py-2.5 text-right">Part.</th>
                  <th className="px-4 py-2.5 text-right">Rate</th>
                  <th className="px-4 py-2.5 text-right">Lag</th>
                  <th className="px-4 py-2.5 text-right">Consumers</th>
                  <th className="px-4 py-2.5 text-left">Retention</th>
                  <th className="px-4 py-2.5 text-left">Health</th>
                  <th className="px-4 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {TOPICS.map((t) => (
                  <tr key={t.name} className="border-b border-border/40 transition hover:bg-surface-2/40">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <Radio className="h-3.5 w-3.5 text-primary" />
                        <span className="font-mono text-[12px]">{t.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-muted-foreground">{t.partitions}</td>
                    <td className="px-4 py-2.5 text-right font-mono">{fmt(t.rate)}/s</td>
                    <td className={cn(
                      "px-4 py-2.5 text-right font-mono",
                      t.lag === 0 && "text-success",
                      t.lag > 0 && t.lag < 1000 && "text-foreground",
                      t.lag >= 1000 && t.lag < 5000 && "text-warning",
                      t.lag >= 5000 && "text-danger",
                    )}>
                      {fmt(t.lag)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-muted-foreground">{t.consumers}</td>
                    <td className="px-4 py-2.5 font-mono text-muted-foreground">{t.retention}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <StatusDot tone={t.status === "healthy" ? "success" : t.status === "warn" ? "warning" : "danger"} />
                        <LagBar lag={t.lag} />
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <Gated perm="webhook.retry">
                        <button className="rounded border border-border bg-surface-2/60 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground">
                          replay
                        </button>
                      </Gated>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        {/* Brokers + Consumer groups */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <Panel kicker="BROKERS" title="Cluster nodes · 6 active">
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {BROKERS.map((b) => (
                <div key={b.id} className="holo-card relative overflow-hidden rounded-xl p-3">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-3.5 w-3.5 text-primary" />
                      <span className="font-mono text-[12px]">{b.id}</span>
                      <span className={cn(
                        "rounded border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider",
                        b.role === "leader" ? "border-primary/40 text-primary" : "border-border text-muted-foreground"
                      )}>{b.role}</span>
                    </div>
                    <StatusDot tone={b.cpu > 65 ? "warning" : "success"} />
                  </div>
                  <div className="mt-2 font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground">
                    {b.region} · {b.throughput}
                  </div>
                  <div className="mt-2.5 space-y-1.5">
                    <Meter label="CPU"  value={b.cpu}  tone={b.cpu > 65 ? "warning" : "primary"} />
                    <Meter label="DISK" value={b.disk} tone={b.disk > 70 ? "warning" : "info"} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel kicker="CONSUMER GROUPS" title="Lag distribution · top 8">
            <ul className="divide-y divide-border/40">
              {[
                { g: "orders-fulfillment",   members: 12, lag:   142, sla: "ok" },
                { g: "billing-pipeline",     members:  4, lag:  1840, sla: "warn" },
                { g: "ai-inference-router",  members: 24, lag:   220, sla: "ok" },
                { g: "fraud-rt-scorer",      members:  8, lag:     4, sla: "ok" },
                { g: "error-aggregator",     members:  2, lag: 14200, sla: "breach" },
                { g: "iot-ingestor",         members: 32, lag:   980, sla: "warn" },
                { g: "gmv-rollup",           members:  4, lag:     0, sla: "ok" },
                { g: "notif-fanout",         members:  8, lag:   310, sla: "ok" },
              ].map((c) => (
                <li key={c.g} className="flex items-center gap-3 py-2.5">
                  <Activity className={cn("h-3.5 w-3.5",
                    c.sla === "ok" ? "text-success" : c.sla === "warn" ? "text-warning" : "text-danger"
                  )} />
                  <div className="min-w-0 flex-1">
                    <div className="font-mono text-[12px]">{c.g}</div>
                    <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      {c.members} members · {fmt(c.lag)} behind
                    </div>
                  </div>
                  <LagBar lag={c.lag} wide />
                  <span className={cn(
                    "rounded border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider",
                    c.sla === "ok" && "border-success/40 text-success",
                    c.sla === "warn" && "border-warning/40 text-warning",
                    c.sla === "breach" && "border-danger/40 text-danger",
                  )}>{c.sla}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        {/* Live event tape */}
        <Panel kicker="LIVE TAPE" title="Recent envelopes (last 12)" padded={false}>
          <div className="scanline relative max-h-72 overflow-y-auto">
            <ul className="divide-y divide-border/40 font-mono text-[11px]">
              {EVENTS.map((e, i) => (
                <li key={i} className="flex items-center gap-3 px-4 py-2 transition hover:bg-surface-2/40">
                  <span className="text-muted-foreground">{e.t}</span>
                  <Zap className="h-3 w-3 text-primary" />
                  <span className="text-foreground">{e.topic}</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground">part={e.p}</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground">offset={e.o}</span>
                  <span className="ml-auto truncate text-muted-foreground/80">{e.k}</span>
                  {e.alert && <AlertTriangle className="h-3 w-3 text-warning" />}
                </li>
              ))}
            </ul>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-sm" style={{ background: swatch }} />
      {label}
    </span>
  );
}

function Meter({ label, value, tone }: { label: string; value: number; tone: "primary" | "warning" | "info" }) {
  const color = tone === "warning" ? "var(--warning)" : tone === "info" ? "var(--info)" : "var(--primary)";
  return (
    <div>
      <div className="flex items-center justify-between font-mono text-[9.5px] uppercase tracking-wider text-muted-foreground">
        <span>{label}</span><span>{value}%</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface">
        <div
          className="h-full rounded-full transition-[width] duration-700"
          style={{ width: `${value}%`, background: `linear-gradient(90deg, ${color}, color-mix(in oklab, ${color} 30%, transparent))` }}
        />
      </div>
    </div>
  );
}

function LagBar({ lag, wide }: { lag: number; wide?: boolean }) {
  const pct = Math.min(100, Math.round((lag / 15000) * 100));
  const color = lag === 0 ? "var(--success)" : lag < 1000 ? "var(--primary)" : lag < 5000 ? "var(--warning)" : "var(--danger)";
  return (
    <div className={cn("relative h-1 overflow-hidden rounded-full bg-surface", wide ? "w-32" : "w-16")}>
      <div className="h-full" style={{ width: `${Math.max(4, pct)}%`, background: color, boxShadow: `0 0 8px ${color}` }} />
    </div>
  );
}

const EVENTS = [
  { t: "12:04:08.214", topic: "orders.created",          p: 7,  o: "84,210,994", k: "key=ord_7H2K…", alert: false },
  { t: "12:04:08.207", topic: "ai.inference.completed",  p: 22, o: "1,204,887,2", k: "key=req_a91…",  alert: false },
  { t: "12:04:08.198", topic: "iot.telemetry.v3",        p: 41, o: "9,920,114,7", k: "key=dev_b8…",   alert: false },
  { t: "12:04:08.184", topic: "logs.app.error",          p: 2,  o: "14,221,008",  k: "code=DB-7 lag", alert: true  },
  { t: "12:04:08.171", topic: "orders.paid",             p: 11, o: "82,114,772",  k: "key=ord_7H2J…", alert: false },
  { t: "12:04:08.160", topic: "billing.invoice.emitted", p: 4,  o: "21,008,114",  k: "key=inv_9KQ…",  alert: true  },
  { t: "12:04:08.148", topic: "fraud.signal.high",       p: 1,  o: "412,008",     k: "score=0.94",    alert: false },
  { t: "12:04:08.131", topic: "comms.notification.sent", p: 9,  o: "44,210,884",  k: "ch=email",      alert: false },
  { t: "12:04:08.117", topic: "users.signup",            p: 3,  o: "8,221,004",   k: "geo=DE",        alert: false },
  { t: "12:04:08.102", topic: "marketplace.gmv.tick",    p: 0,  o: "1,002,114",   k: "usd=1.82M",     alert: false },
  { t: "12:04:08.091", topic: "ai.inference.completed",  p: 31, o: "1,204,887,1", k: "key=req_a90…",  alert: false },
  { t: "12:04:08.084", topic: "orders.created",          p: 14, o: "84,210,993",  k: "key=ord_7H2I…", alert: false },
];
