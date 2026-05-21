import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars, Radial } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { PlayCircle, Star } from "lucide-react";

export const Route = createFileRoute("/play")({
  head: () => ({ meta: [{ title: "Play Console · AEGIS OS" }] }),
  component: Page,
});

const LISTINGS = [
  ["Aurora Rider","com.aurora.rider","PRODUCTION",4.8,184000,"success"],
  ["Aurora Driver","com.aurora.driver","PRODUCTION",4.6,42000,"success"],
  ["AEGIS POS","com.aegis.pos","PRODUCTION",4.7,12400,"success"],
  ["Vala AI","com.vala.ai","BETA",4.4,640,"warning"],
  ["Payroll Self","com.aegis.payroll","PRODUCTION",4.5,28400,"success"],
  ["Franchise Hub","com.aegis.franchise","CLOSED TEST",4.2,184,"info"],
] as const;

function Page() {
  const live = useLiveSeries(48, 531, 60, 16);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 053 · GOOGLE PLAY · STORE OPS" title="Play Console"
          subtitle="Listings · installs · ratings · ANRs · revenue — fleet-wide control." />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="Listings" value="42" delta="6 staging" tone="primary" spark={<MiniArea data={generateSeries(24,532,60,4)} />} />
          <Metric label="Installs · 24h" value="184,210" delta="+18%" tone="success" spark={<MiniArea data={generateSeries(24,533,80,22)} color="var(--success)" />} />
          <Metric label="Avg rating" value="4.7" delta="+0.1" tone="success" spark={<MiniArea data={generateSeries(24,534,90,2)} color="var(--success)" />} />
          <Metric label="ANR rate" value="0.12%" delta="SLO 0.47%" tone="success" spark={<MiniArea data={generateSeries(24,535,40,4)} color="var(--success)" />} />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="STORE TELEMETRY" title="Installs · uninstalls · revenue"><MultiLine data={live} h={260} /></Panel>
          <Panel kicker="QUALITY" title="Vitals">
            <div className="grid grid-cols-2 gap-2">
              <Radial value={99} color="var(--success)" label="CRASH-FREE" />
              <Radial value={92} color="var(--primary)" label="RATING" />
            </div>
            <ul className="mt-3 space-y-1.5 text-[11.5px]">
              <li className="flex justify-between"><span>Reviews · 24h</span><span className="font-mono">2,840</span></li>
              <li className="flex justify-between"><span>Avg session</span><span className="font-mono text-muted-foreground">14m</span></li>
              <li className="flex justify-between"><span>Excessive wakeups</span><span className="font-mono">0.04%</span></li>
            </ul>
          </Panel>
        </div>
        <Panel kicker="LISTING REGISTRY" title="Apps on Play">
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-border/60 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground"><th className="py-2">App</th><th>Package</th><th>Track</th><th className="text-right">Rating</th><th className="text-right">Installs</th></tr></thead>
            <tbody>{LISTINGS.map(([n,p,t,r,i,tone]) => (
              <tr key={n} className="border-b border-border/60 last:border-0">
                <td className="py-2 flex items-center gap-2"><PlayCircle className={`h-3.5 w-3.5 text-${tone}`} /><span className="font-mono">{n}</span></td>
                <td className="py-2 font-mono text-muted-foreground">{p}</td>
                <td className="py-2"><span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[10px] border-${tone}/40 text-${tone}`}>{t}</span></td>
                <td className="py-2 text-right font-mono"><span className="inline-flex items-center gap-1"><Star className="h-3 w-3 text-warning" />{r}</span></td>
                <td className="py-2 text-right font-mono">{(i as number).toLocaleString()}</td>
              </tr>))}</tbody>
          </table>
        </Panel>
        <Panel kicker="COUNTRY MIX" title="Installs by country · 24h"><Bars data={generateSeries(14,539,80,22)} color="var(--success)" h={220} /></Panel>
      </div>
    </div>
  );
}
