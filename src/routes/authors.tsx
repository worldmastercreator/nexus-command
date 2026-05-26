import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { PenLine } from "lucide-react";
import { ConnectedModules } from "@/components/dash/ConnectedModules";

export const Route = createFileRoute("/authors")({
  head: () => ({ meta: [{ title: "Author System · AEGIS OS" }] }),
  component: AuthorsPage,
});

function AuthorsPage() {
  const live = useLiveSeries(48, 181, 60, 18);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 018 · GUMROAD CREATOR / VENDOR PANEL"
          title="Author / Vendor System"
          subtitle="Onboarding · royalties · payouts · KYC · reviews — creator economy control plane."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="Authors" value="14,208" delta="+82" tone="ai" spark={<MiniArea data={generateSeries(24,71,60,6)} color="var(--ai)" />} />
          <Metric label="Earnings · 30d" value="$2.84M" delta="+12%" tone="market" spark={<MiniArea data={generateSeries(24,72,60,14)} color="var(--market)" />} />
          <Metric label="Pending payouts" value="$182K" delta="48 authors" tone="warning" spark={<MiniArea data={generateSeries(24,73,40,10)} color="var(--warning)" />} />
          <Metric label="KYC pass" value="98.4%" delta="+0.4pp" tone="success" spark={<MiniArea data={generateSeries(24,74,80,3)} color="var(--success)" />} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="EARNINGS" title="Author revenue stream"><MultiLine data={live} h={260} /></Panel>
          <Panel kicker="ONBOARDING" title="Funnel · last 7d">
            <ul className="space-y-2 text-[12px]">
              {[["Signed up",1840,"primary"],["Profile complete",1420,"ai"],["KYC verified",1180,"info"],["First product",842,"success"],["First sale",488,"market"]].map(([n,c,t])=>(
                <li key={n as string} className="space-y-1">
                  <div className="flex justify-between"><span>{n}</span><span className="font-mono text-muted-foreground">{c}</span></div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-surface"><div className={`h-full bg-${t}`} style={{width:`${(c as number)/18.4}%`}} /></div>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <Panel kicker="LEADERBOARD" title="Top earners · 30d">
          <table className="w-full text-[12px]">
            <tbody>
              {[["nova_labs","Aurora Suite","$184,210","4.9★"],["axiom_ux","Axiom Patterns","$142,820","4.8★"],["pulse_co","Pulse Charts","$98,410","4.9★"],["helix_dev","Helix CRM","$84,128","4.7★"],["aurora_io","Aurora Forms","$71,420","4.9★"]].map(([n,p,v,r],i)=>(
                <tr key={n} className="border-b border-border/60 last:border-0">
                  <td className="py-2 font-mono text-[11px] text-muted-foreground">#{i+1}</td>
                  <td className="py-2 flex items-center gap-2"><PenLine className="h-3.5 w-3.5 text-ai" />{n}</td>
                  <td className="py-2 text-muted-foreground">{p}</td>
                  <td className="py-2 text-right font-mono text-success">{v}</td>
                  <td className="py-2 text-right font-mono text-warning">{r}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel kicker="CATEGORIES" title="Author distribution"><Bars data={generateSeries(12,78,60,22)} color="var(--ai)" h={200} /></Panel>

        <ConnectedModules ids={[11, 18, 15, 19, 23]} />
      </div>
    </div>
  );
}
