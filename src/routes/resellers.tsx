import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { ConnectedModules } from "@/components/dash/ConnectedModules";

export const Route = createFileRoute("/resellers")({
  head: () => ({ meta: [{ title: "Reseller System · AEGIS OS" }] }),
  component: ResellersPage,
});

function ResellersPage() {
  const live = useLiveSeries(48, 161, 60, 18);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 016 · PARTNERSTACK / CODECANYON RESELLER"
          title="Reseller System"
          subtitle="Tier · commission · territory · co-sell pipeline — full partner network ops."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="Active resellers" value="1,284" delta="+24" tone="primary" spark={<MiniArea data={generateSeries(24,51,60,8)} />} />
          <Metric label="Channel GMV" value="$8.42M" delta="+18%" tone="market" spark={<MiniArea data={generateSeries(24,52,60,14)} color="var(--market)" />} />
          <Metric label="Avg commission" value="22.4%" delta="tiered" tone="ai" spark={<MiniArea data={generateSeries(24,53,40,6)} color="var(--ai)" />} />
          <Metric label="Payout queue" value="$184.2K" delta="next Fri" tone="warning" spark={<MiniArea data={generateSeries(24,54,40,8)} color="var(--warning)" />} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="PIPELINE" title="Deals · stages · velocity">
            <MultiLine data={live} h={260} />
          </Panel>
          <Panel kicker="TIER BREAKDOWN" title="Bronze → Diamond">
            <ul className="space-y-3 text-[12.5px]">
              {[["Diamond",24,"market"],["Platinum",118,"ai"],["Gold",284,"primary"],["Silver",420,"info"],["Bronze",438,"success"]].map(([n,c,t])=>(
                <li key={n as string} className="flex items-center gap-3">
                  <span className="w-20">{n}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface"><div className={`h-full bg-${t}`} style={{width:`${Math.min(100,(c as number)/5)}%`}} /></div>
                  <span className="w-12 text-right font-mono text-[11px] text-muted-foreground">{c}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <Panel kicker="TOP RESELLERS" title="Leaderboard · 30d">
          <table className="w-full text-[12px]">
            <tbody>
              {[["nordic_partners","Sweden","$418,210","Diamond"],["apex_channel","USA","$284,128","Platinum"],["aurora_apac","Singapore","$184,210","Platinum"],["helios_eu","Germany","$148,210","Gold"],["kite_latam","Brazil","$118,210","Gold"]].map(([n,r,v,t],i)=>(
                <tr key={n} className="border-b border-border/60 last:border-0">
                  <td className="py-2 font-mono text-[11px] text-muted-foreground">#{i+1}</td>
                  <td className="py-2">{n}</td>
                  <td className="py-2 text-muted-foreground">{r}</td>
                  <td className="py-2 text-right font-mono text-success">{v}</td>
                  <td className="py-2 text-right"><span className="rounded border border-market/40 px-1.5 py-0.5 font-mono text-[10px] text-market">{t}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel kicker="REGIONS" title="GMV by territory · 7d"><Bars data={generateSeries(12,58,60,22)} color="var(--market)" h={200} /></Panel>

        <ConnectedModules ids={[18, 19, 20, 11, 17]} />
      </div>
    </div>
  );
}
