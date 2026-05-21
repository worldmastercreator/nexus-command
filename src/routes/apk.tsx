import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars, Radial } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { Smartphone, Download } from "lucide-react";

export const Route = createFileRoute("/apk")({
  head: () => ({ meta: [{ title: "APK Distribution · AEGIS OS" }] }),
  component: Page,
});

const BUILDS = [
  ["aurora-driver","v4.18.2","RELEASE","success","42 MB",2840],
  ["aurora-rider","v3.96.1","RELEASE","success","38 MB",18420],
  ["pos-kiosk","v1.12.0","BETA","warning","64 MB",184],
  ["field-ops","v2.4.0","INTERNAL","ai","52 MB",42],
  ["payroll-mobile","v1.0.4","RELEASE","success","28 MB",1248],
  ["franchise-app","v0.9.2","STAGING","warning","48 MB",18],
] as const;

function Page() {
  const live = useLiveSeries(48, 521, 60, 18);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 052 · FIREBASE DIST · APK PIPELINE" title="APK Distribution"
          subtitle="Signed builds · channels · OTA rollback · tester groups · install telemetry." />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="Builds" value="412" delta="+18 wk" tone="primary" spark={<MiniArea data={generateSeries(24,522,60,10)} />} />
          <Metric label="Installs · 24h" value="48,210" delta="+24%" tone="success" spark={<MiniArea data={generateSeries(24,523,80,20)} color="var(--success)" />} />
          <Metric label="Crash-free" value="99.86%" delta="SLO 99.5%" tone="success" spark={<MiniArea data={generateSeries(24,524,90,3)} color="var(--success)" />} />
          <Metric label="Testers" value="1,248" delta="42 groups" tone="ai" spark={<MiniArea data={generateSeries(24,525,60,8)} color="var(--ai)" />} />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="DISTRIBUTION TELEMETRY" title="Installs · uninstalls · crashes"><MultiLine data={live} h={260} /></Panel>
          <Panel kicker="CHANNEL HEALTH" title="Release tracks">
            <div className="grid grid-cols-2 gap-2">
              <Radial value={99} color="var(--success)" label="STABLE" />
              <Radial value={84} color="var(--warning)" label="BETA" />
            </div>
            <ul className="mt-3 space-y-1.5 text-[11.5px]">
              <li className="flex justify-between"><span>Avg size</span><span className="font-mono">42 MB</span></li>
              <li className="flex justify-between"><span>OTA rolls</span><span className="font-mono">18</span></li>
              <li className="flex justify-between"><span>Rollback time</span><span className="font-mono text-muted-foreground">48s</span></li>
            </ul>
          </Panel>
        </div>
        <Panel kicker="BUILD REGISTRY" title="Released APKs">
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-border/60 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground"><th className="py-2">App</th><th>Ver</th><th>Size</th><th className="text-right">Installs · 24h</th><th className="text-right">Channel</th></tr></thead>
            <tbody>{BUILDS.map(([n,v,s,tone,sz,c]) => (
              <tr key={n} className="border-b border-border/60 last:border-0">
                <td className="py-2 flex items-center gap-2"><Smartphone className={`h-3.5 w-3.5 text-${tone}`} /><span className="font-mono">{n}</span></td>
                <td className="py-2 font-mono text-muted-foreground">{v}</td>
                <td className="py-2 font-mono text-muted-foreground">{sz}</td>
                <td className="py-2 text-right font-mono">{c}</td>
                <td className="py-2 text-right"><span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[10px] border-${tone}/40 text-${tone}`}><Download className="h-3 w-3" />{s}</span></td>
              </tr>))}</tbody>
          </table>
        </Panel>
        <Panel kicker="DEVICE MIX" title="Installs by OS · 24h"><Bars data={generateSeries(12,529,60,16)} color="var(--primary)" h={220} /></Panel>
      </div>
    </div>
  );
}
