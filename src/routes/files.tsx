import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars, Radial } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { FolderTree, FileText, Image, Film, Archive } from "lucide-react";

export const Route = createFileRoute("/files")({
  head: () => ({ meta: [{ title: "File Storage · AEGIS OS" }] }),
  component: Page,
});

const BUCKETS = [
  ["user-uploads","1.8 TB",18420000,"success",FileText],
  ["product-media","612 GB",1248000,"success",Image],
  ["session-recordings","2.4 TB",84210,"warning",Film],
  ["invoices","240 GB",1820000,"success",FileText],
  ["backups","6.2 TB",4200,"success",Archive],
  ["logs-cold","12.4 TB",18000,"ai",Archive],
] as const;

function Page() {
  const live = useLiveSeries(48, 591, 60, 18);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 059 · GOOGLE DRIVE · OBJECT STORAGE" title="File Storage"
          subtitle="Buckets · uploads · CDN signed URLs · lifecycle · virus scan — encrypted at rest." />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="Files" value="42.8M" delta="+184k · 24h" tone="primary" spark={<MiniArea data={generateSeries(24,592,60,10)} />} />
          <Metric label="Storage" value="23.4 TB" delta="62% of 38 TB" tone="success" spark={<MiniArea data={generateSeries(24,593,80,8)} color="var(--success)" />} />
          <Metric label="Bandwidth · 24h" value="4.8 TB" delta="+18%" tone="ai" spark={<MiniArea data={generateSeries(24,594,80,18)} color="var(--ai)" />} />
          <Metric label="Signed URLs" value="248k" delta="hot" tone="success" spark={<MiniArea data={generateSeries(24,595,60,14)} color="var(--success)" />} />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="STORAGE TELEMETRY" title="Uploads · downloads · scans"><MultiLine data={live} h={260} /></Panel>
          <Panel kicker="GOVERNANCE" title="Compliance">
            <div className="grid grid-cols-2 gap-2">
              <Radial value={100} color="var(--success)" label="ENCRYPTED" />
              <Radial value={96} color="var(--primary)" label="SCAN PASS" />
            </div>
            <ul className="mt-3 space-y-1.5 text-[11.5px]">
              <li className="flex justify-between"><span>Quarantined</span><span className="font-mono text-warning">42</span></li>
              <li className="flex justify-between"><span>Lifecycle moved</span><span className="font-mono">2,840</span></li>
              <li className="flex justify-between"><span>Tiered to cold</span><span className="font-mono text-muted-foreground">1.2 TB</span></li>
            </ul>
          </Panel>
        </div>
        <Panel kicker="BUCKET REGISTRY" title="Top buckets">
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-border/60 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground"><th className="py-2">Bucket</th><th className="text-right">Size</th><th className="text-right">Objects</th><th className="text-right">Status</th></tr></thead>
            <tbody>{BUCKETS.map(([n,sz,o,tone,Ic]) => (
              <tr key={n as string} className="border-b border-border/60 last:border-0">
                <td className="py-2 flex items-center gap-2"><Ic className={`h-3.5 w-3.5 text-${tone}`} /><span className="font-mono">{n}</span></td>
                <td className="py-2 text-right font-mono">{sz}</td>
                <td className="py-2 text-right font-mono">{(o as number).toLocaleString()}</td>
                <td className="py-2 text-right"><span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[10px] border-${tone}/40 text-${tone}`}><FolderTree className="h-3 w-3" />{tone==="warning"?"LIFECYCLE":"HOT"}</span></td>
              </tr>))}</tbody>
          </table>
        </Panel>
        <Panel kicker="MIME MIX" title="Bytes by type · 24h"><Bars data={generateSeries(12,599,60,18)} color="var(--ai)" h={220} /></Panel>
      </div>
    </div>
  );
}
