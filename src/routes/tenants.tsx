import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { StackedArea, MiniArea, Bars } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";

export const Route = createFileRoute("/tenants")({
  head: () => ({ meta: [{ title: "Multi-Tenant Engine · AEGIS OS" }] }),
  component: TenantsPage,
});

function TenantsPage() {
  const live = useLiveSeries(60, 1101, 60, 14);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 083 · CLERK ORGANIZATIONS"
          title="Multi-Tenant Engine"
          subtitle="Orgs · workspaces · isolation · per-tenant quotas · entitlements."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <Metric label="Tenants" value="2,184" tone="primary" spark={<MiniArea data={generateSeries(24, 11, 60, 8)} />} />
          <Metric label="Active /24h" value="1,820" tone="success" />
          <Metric label="Workspaces" value="12,481" tone="info" />
          <Metric label="Quota breaches" value="38" tone="warning" />
          <Metric label="Enterprise plan" value="284" tone="ai" />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="TENANT ACTIVITY" title="Traffic · seat usage">
            <StackedArea data={live} h={260} />
          </Panel>
          <Panel kicker="TIER MIX" title="By plan">
            <Bars data={generateSeries(8, 21, 80, 14)} h={220} />
            <ul className="mt-3 grid grid-cols-2 gap-1 text-[11px] font-mono text-muted-foreground">
              <li>free · 1,184</li><li>starter · 612</li><li>pro · 184</li><li>enterprise · 284</li>
            </ul>
          </Panel>
        </div>

        <Panel kicker="TOP TENANTS" title="By spend / seats" padded={false}>
          <table className="w-full text-[12px]">
            <thead className="border-b border-border bg-surface-2/40 text-[10.5px] uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-3 py-2 text-left">TENANT</th><th className="px-3 py-2 text-left">PLAN</th><th className="px-3 py-2 text-left">SEATS</th><th className="px-3 py-2 text-left">MRR</th><th className="px-3 py-2 text-left">QUOTA</th></tr>
            </thead>
            <tbody>
              {[
                ["acme-corp", "enterprise", 412, "$28,400", 78],
                ["valacore", "enterprise", 184, "$18,200", 64],
                ["nimbus-labs", "pro", 84, "$4,910", 42],
                ["delta-systems", "enterprise", 312, "$22,180", 88],
                ["lattice-fi", "pro", 38, "$2,184", 24],
                ["northwind", "starter", 12, "$184", 92],
              ].map((r) => (
                <tr key={r[0] as string} className="border-b border-border/50 hover:bg-accent/40">
                  <td className="px-3 py-2 font-mono">{r[0]}</td>
                  <td className="px-3 py-2"><span className="rounded bg-ai/15 px-2 py-0.5 font-mono text-[10px] uppercase text-ai">{r[1]}</span></td>
                  <td className="px-3 py-2 font-mono">{r[2]}</td>
                  <td className="px-3 py-2 font-mono text-success">{r[3]}</td>
                  <td className="px-3 py-2"><div className="flex items-center gap-2"><div className="h-1 w-20 overflow-hidden rounded-full bg-surface"><div className={`h-full ${(r[4] as number) > 80 ? "bg-warning" : "bg-primary"}`} style={{ width: `${r[4]}%` }} /></div><span className="font-mono text-[10px] text-muted-foreground">{r[4]}%</span></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </div>
  );
}
