import { useSuspenseQuery } from "@tanstack/react-query";
import { kpisQueryOptions, rmQueryOptions, seedRmDemo } from "@/lib/reseller-manager.functions";
import { useServerFn } from "@tanstack/react-start";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Globe2, Shield, Users2, TrendingUp, KeyRound, Sparkles, AlertTriangle } from "lucide-react";

const fmt = (n: number) => Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);
const money = (n: number) => "$" + fmt(n);

export function ResellerCommandCenter() {
  const { data: k } = useSuspenseQuery(kpisQueryOptions);
  const { data: apps } = useSuspenseQuery(rmQueryOptions("reseller_applications", 8));
  const { data: terr } = useSuspenseQuery(rmQueryOptions("reseller_territories", 200));
  const { data: leads } = useSuspenseQuery(rmQueryOptions("reseller_leads", 5));
  const live = useLiveSeries(40, 96, 80, 18);
  const seed = useServerFn(seedRmDemo);

  // Top territories aggregated
  const topTerritories = Object.entries(
    terr.rows.reduce((acc: Record<string, number>, t: any) => {
      acc[t.country] = (acc[t.country] || 0) + (t.assigned || 0); return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 6);

  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader
          eyebrow="MODULE · 001 · RESELLER COMMAND CENTER"
          title="Global Reseller Command"
          subtitle="Boss-level live view across all resellers, territories, licenses, customers, renewals and approvals."
          actions={
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-md border border-border bg-surface-2/60 px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground">
                <Sparkles className="h-3 w-3 text-ai" /> Live global ops
              </div>
              <Button size="sm" variant="outline" onClick={() => seed().then(() => location.reload())}>
                Seed demo data
              </Button>
            </div>
          }
        />

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-5">
          <Metric label="Total Resellers" value={fmt(k.resellers + k.active + k.suspended)} delta="+12%" tone="primary"
            spark={<MiniArea data={generateSeries(24, 1, 40, 10)} />} />
          <Metric label="Active" value={fmt(k.active)} delta="live" tone="success"
            spark={<MiniArea data={generateSeries(24, 2, 50, 8)} color="var(--success)" />} />
          <Metric label="Suspended" value={fmt(k.suspended)} delta="watch" tone="warning"
            spark={<MiniArea data={generateSeries(24, 3, 20, 12)} color="var(--warning)" />} />
          <Metric label="Pending Approvals" value={fmt(k.pending)} delta="queue" tone="info"
            spark={<MiniArea data={generateSeries(24, 4, 30, 14)} color="var(--info)" />} />
          <Metric label="Revenue Generated" value={money(k.revenue)} delta="+24%" tone="primary"
            spark={<MiniArea data={generateSeries(24, 5, 60, 20)} />} />
          <Metric label="Licenses Sold" value={fmt(k.licenses)} delta="keys" tone="info"
            spark={<MiniArea data={generateSeries(24, 6, 40, 14)} color="var(--info)" />} />
          <Metric label="Customers Added" value={fmt(k.customers)} delta="+8%" tone="success"
            spark={<MiniArea data={generateSeries(24, 7, 35, 10)} color="var(--success)" />} />
          <Metric label="Renewal Revenue" value={money(k.renewalRev)} delta="forecast" tone="primary"
            spark={<MiniArea data={generateSeries(24, 8, 45, 12)} />} />
          <Metric label="Leads in Pipeline" value={fmt(k.leads)} delta="warm" tone="info"
            spark={<MiniArea data={generateSeries(24, 9, 30, 18)} color="var(--info)" />} />
          <Metric label="Orders" value={fmt(k.orders)} delta="today" tone="success"
            spark={<MiniArea data={generateSeries(24, 10, 38, 12)} color="var(--success)" />} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="LIVE TELEMETRY" title="Global reseller activity">
            <MultiLine data={live} />
          </Panel>
          <Panel kicker="GEO" title="Top territories by assignment">
            <ul className="space-y-2 text-[12.5px]">
              {topTerritories.length === 0 && (
                <li className="rounded border border-dashed border-border p-3 text-center text-muted-foreground">
                  No territories yet — click "Seed demo data".
                </li>
              )}
              {topTerritories.map(([c, v]) => (
                <li key={c} className="flex items-center gap-2">
                  <Globe2 className="h-3.5 w-3.5 text-primary" />
                  <span className="text-foreground/90">{c}</span>
                  <div className="ml-auto flex items-center gap-2">
                    <div className="h-1.5 w-24 overflow-hidden rounded bg-surface-2">
                      <div className="h-full bg-primary" style={{ width: `${Math.min(100, (v / (topTerritories[0]?.[1] || 1)) * 100)}%` }} />
                    </div>
                    <span className="w-10 text-right font-mono text-[11px] text-muted-foreground">{v}</span>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel kicker="APPROVAL QUEUE" title="Newest applications" className="lg:col-span-2">
            <table className="w-full text-[12.5px]">
              <thead className="border-b border-border text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr><th className="py-2">Applicant</th><th>Country</th><th>KYC</th><th>Status</th></tr>
              </thead>
              <tbody>
                {apps.rows.length === 0 && (
                  <tr><td colSpan={4} className="py-6 text-center text-muted-foreground">No applications yet.</td></tr>
                )}
                {apps.rows.map((a: any) => (
                  <tr key={a.id} className="border-b border-border/40">
                    <td className="py-2">{a.applicant_name} <span className="text-muted-foreground">· {a.company}</span></td>
                    <td>{a.country ?? "—"}</td>
                    <td><Pill v={a.kyc_status} /></td>
                    <td><Pill v={a.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
          <Panel kicker="DISTRIBUTION" title="Workload across centers">
            <Bars data={generateSeries(14, 21, 40, 22)} color="var(--ai)" />
          </Panel>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Panel kicker="RISK" title="At-risk resellers">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-warning" />
              <div>
                <div className="text-[22px] font-semibold">{Math.max(0, k.suspended + Math.floor(k.pending / 3))}</div>
                <div className="text-[11px] text-muted-foreground">Flagged by fraud / SLA / inactivity</div>
              </div>
            </div>
          </Panel>
          <Panel kicker="LEADS" title="Latest registered deals">
            <ul className="space-y-1.5 text-[12px]">
              {leads.rows.length === 0 && <li className="text-muted-foreground">No leads yet.</li>}
              {leads.rows.map((l: any) => (
                <li key={l.id} className="flex items-center gap-2">
                  <TrendingUp className="h-3.5 w-3.5 text-success" />
                  <span>{l.name}</span>
                  <span className="ml-auto text-muted-foreground">{l.territory ?? l.source ?? "—"}</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel kicker="LICENSE GATE" title="Master flow">
            <ol className="space-y-1.5 text-[12px] text-muted-foreground">
              <li><Users2 className="mr-2 inline h-3 w-3" />Customer order</li>
              <li><Shield className="mr-2 inline h-3 w-3" />Reseller request</li>
              <li><Sparkles className="mr-2 inline h-3 w-3" />Manager review</li>
              <li><KeyRound className="mr-2 inline h-3 w-3" />Key generation & assignment</li>
            </ol>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Pill({ v }: { v: string }) {
  const tone = /APPROV|ACTIVE|VERIFI|PAID|RENEW/.test(v) ? "text-success border-success/30 bg-success/10"
    : /REJECT|FAIL|BLOCK|SUSPEND|MISS/.test(v) ? "text-destructive border-destructive/30 bg-destructive/10"
    : /HOLD|PENDING|WAIT|KYC|REVIEW|INTERVIEW/.test(v) ? "text-warning border-warning/30 bg-warning/10"
    : "text-muted-foreground border-border bg-surface-2";
  return <span className={`rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase ${tone}`}>{v}</span>;
}
