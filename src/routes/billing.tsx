import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, StackedArea, Radial } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { ConnectedModules } from "@/components/dash/ConnectedModules";

export const Route = createFileRoute("/billing")({
  head: () => ({ meta: [{ title: "Subscriptions · AEGIS OS" }] }),
  component: BillingPage,
});

function BillingPage() {
  const live = useLiveSeries(50, 131, 60, 16);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 013 · STRIPE BILLING + CODECANYON SAAS"
          title="Subscription & Billing Engine"
          subtitle="MRR · ARR · churn · dunning · proration — pricing engine, live."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <Metric label="MRR" value="$842.1K" delta="+4.2%" tone="success" spark={<MiniArea data={generateSeries(24, 21, 80, 6)} color="var(--success)" />} />
          <Metric label="ARR" value="$10.1M" delta="+18%" tone="primary" spark={<MiniArea data={generateSeries(24, 22, 80, 8)} />} />
          <Metric label="Net new" value="+1,284" delta="this mo" tone="ai" spark={<MiniArea data={generateSeries(24, 23, 60, 18)} color="var(--ai)" />} />
          <Metric label="Churn" value="1.84%" delta="-0.3pp" tone="warning" spark={<MiniArea data={generateSeries(24, 24, 30, 14)} color="var(--warning)" />} />
          <Metric label="LTV" value="$2,148" delta="+$84" tone="market" spark={<MiniArea data={generateSeries(24, 25, 60, 10)} color="var(--market)" />} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="REVENUE WATERFALL" title="New · expansion · contraction · churn">
            <StackedArea data={live} h={260} />
          </Panel>
          <Panel kicker="DUNNING" title="Recovery funnel">
            <Radial value={78} color="var(--info)" label="RECOVERED" h={180} />
            <ul className="mt-3 space-y-2 text-[12px]">
              <li className="flex justify-between"><span className="text-muted-foreground">Past due</span><span className="font-mono text-warning">$48,210</span></li>
              <li className="flex justify-between"><span className="text-muted-foreground">Recovered 7d</span><span className="font-mono text-success">$37,580</span></li>
              <li className="flex justify-between"><span className="text-muted-foreground">Written off</span><span className="font-mono text-danger">$2,940</span></li>
            </ul>
          </Panel>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Panel kicker="PLAN MIX" title="Active subscriptions">
            <ul className="space-y-3 text-[12.5px]">
              {[["Starter · $19/mo", 3120, "primary"],["Pro · $49/mo", 5840, "ai"],["Business · $149/mo", 2410, "market"],["Enterprise · custom", 184, "success"]].map(([n,c,t])=>(
                <li key={n as string} className="flex items-center gap-3">
                  <span className="w-44 truncate">{n}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface"><div className={`h-full bg-${t}`} style={{width:`${Math.min(100,(c as number)/60)}%`}} /></div>
                  <span className="w-16 text-right font-mono text-[11px] text-muted-foreground">{c}</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel kicker="UPCOMING INVOICES" title="Next 24h · $148.2K">
            <MultiLine data={generateSeries(24, 28, 60, 14)} h={200} />
          </Panel>
        </div>

        <ConnectedModules ids={[14, 23, 22, 13, 15]} />
      </div>
    </div>
  );
}
