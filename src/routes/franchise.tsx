import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Radial } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { Building2, MapPin } from "lucide-react";

export const Route = createFileRoute("/franchise")({
  head: () => ({ meta: [{ title: "Franchise · AEGIS OS" }] }),
  component: FranchisePage,
});

const BRANCHES = [
  ["BR-001","Mumbai HQ","India",184210,"GREEN"],
  ["BR-024","Dubai DXB","UAE",148210,"GREEN"],
  ["BR-048","Singapore","SG",98210,"AMBER"],
  ["BR-077","London","UK",84210,"GREEN"],
  ["BR-112","New York","US",148820,"GREEN"],
  ["BR-148","Sydney","AU",48210,"AMBER"],
];

function FranchisePage() {
  const live = useLiveSeries(48, 171, 60, 16);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 017 · MULTI-BRANCH FRANCHISE"
          title="Franchise System"
          subtitle="Territories · royalties · compliance · supply — global multi-branch control."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="Branches" value="148" delta="+4 this q" tone="primary" spark={<MiniArea data={generateSeries(24,61,60,4)} />} />
          <Metric label="Network revenue" value="$24.8M" delta="+11%" tone="market" spark={<MiniArea data={generateSeries(24,62,60,12)} color="var(--market)" />} />
          <Metric label="Royalty due" value="$1.84M" delta="this mo" tone="ai" spark={<MiniArea data={generateSeries(24,63,40,8)} color="var(--ai)" />} />
          <Metric label="SLA compliance" value="97.4%" delta="+1.2pp" tone="success" spark={<MiniArea data={generateSeries(24,64,80,4)} color="var(--success)" />} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="NETWORK PULSE" title="Revenue · footfall · stock turn">
            <MultiLine data={live} h={260} />
          </Panel>
          <Panel kicker="HEALTH SCORE" title="Operational index">
            <Radial value={94} color="var(--success)" label="OPS HEALTH" h={180} />
            <ul className="mt-3 space-y-2 text-[11.5px]">
              <li className="flex justify-between"><span className="text-muted-foreground">Compliance audits</span><span className="text-success">142/148</span></li>
              <li className="flex justify-between"><span className="text-muted-foreground">Brand standards</span><span className="text-success">98%</span></li>
              <li className="flex justify-between"><span className="text-muted-foreground">Supply on-time</span><span className="text-warning">91%</span></li>
            </ul>
          </Panel>
        </div>

        <Panel kicker="BRANCHES" title="Live network status">
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-border/60 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground"><th className="py-2">ID</th><th>Branch</th><th>Country</th><th className="text-right">Revenue 30d</th><th className="text-right">Status</th></tr></thead>
            <tbody>
              {BRANCHES.map(([id,n,c,r,s])=>(
                <tr key={id as string} className="border-b border-border/60 last:border-0">
                  <td className="py-2 font-mono text-[11px] text-muted-foreground">{id}</td>
                  <td className="py-2 flex items-center gap-2"><Building2 className="h-3.5 w-3.5 text-primary" />{n}</td>
                  <td className="py-2 text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{c}</td>
                  <td className="py-2 text-right font-mono text-success">${(r as number).toLocaleString()}</td>
                  <td className="py-2 text-right"><span className={`rounded border px-1.5 py-0.5 font-mono text-[10px] ${s==="GREEN"?"border-success/40 text-success":"border-warning/40 text-warning"}`}>{s}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </div>
  );
}
