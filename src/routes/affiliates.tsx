import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { ConnectedModules } from "@/components/dash/ConnectedModules";

export const Route = createFileRoute("/affiliates")({
  head: () => ({ meta: [{ title: "Affiliate System · AEGIS OS" }] }),
  component: AffiliatesPage,
});

function AffiliatesPage() {
  const live = useLiveSeries(48, 191, 60, 20);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 019 · IMPACT.COM AFFILIATE NETWORK"
          title="Affiliate System"
          subtitle="Links · clicks · conversions · commission · fraud — multi-tier attribution engine."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <Metric label="Affiliates" value="48,210" delta="+184" tone="primary" spark={<MiniArea data={generateSeries(24,81,60,6)} />} />
          <Metric label="Clicks · 24h" value="1.84M" delta="+9%" tone="info" spark={<MiniArea data={generateSeries(24,82,60,18)} color="var(--info)" />} />
          <Metric label="Conversions" value="18,420" delta="1.00% CR" tone="success" spark={<MiniArea data={generateSeries(24,83,60,12)} color="var(--success)" />} />
          <Metric label="Commission owed" value="$184K" delta="next cycle" tone="market" spark={<MiniArea data={generateSeries(24,84,40,10)} color="var(--market)" />} />
          <Metric label="Fraud blocks" value="2.1%" delta="bot traffic" tone="danger" spark={<MiniArea data={generateSeries(24,85,20,16)} color="var(--danger)" />} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="ATTRIBUTION" title="Clicks · conversions · payout"><MultiLine data={live} h={260} /></Panel>
          <Panel kicker="TIERS" title="Tier 1 → Tier 3 mix">
            <ul className="space-y-3 text-[12.5px]">
              {[["Tier 1 · direct",62,"primary"],["Tier 2 · sub-affiliate",26,"ai"],["Tier 3 · network",12,"market"]].map(([n,p,t])=>(
                <li key={n as string} className="space-y-1">
                  <div className="flex justify-between"><span>{n}</span><span className="font-mono text-muted-foreground">{p}%</span></div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-surface"><div className={`h-full bg-${t}`} style={{width:`${p}%`}} /></div>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Panel kicker="TOP AFFILIATES" title="Earnings · 30d">
            <table className="w-full text-[12px]"><tbody>
              {[["@growthwire","$48,210"],["@deal_hunter","$32,128"],["@saaspulse","$28,410"],["@codecast","$22,128"],["@nordstack","$18,210"]].map(([n,v],i)=>(
                <tr key={n} className="border-b border-border/60 last:border-0">
                  <td className="py-2 font-mono text-[11px] text-muted-foreground">#{i+1}</td>
                  <td className="py-2">{n}</td>
                  <td className="py-2 text-right font-mono text-success">{v}</td>
                </tr>
              ))}
            </tbody></table>
          </Panel>
          <Panel kicker="SOURCE MIX" title="Traffic origin"><Bars data={generateSeries(12,88,60,22)} color="var(--info)" h={220} /></Panel>
        </div>

        <ConnectedModules ids={[16, 20, 11, 24, 14]} />
      </div>
    </div>
  );
}
