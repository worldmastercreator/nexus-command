import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars, Radial } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { Package, Plus } from "lucide-react";

export const Route = createFileRoute("/products")({
  head: () => ({ meta: [{ title: "Product Manager · AEGIS OS" }] }),
  component: ProductsPage,
});

const ROWS = [
  ["AX-3201", "Aurora Dashboard Kit", "UI Kit", 4290, 184, "ACTIVE"],
  ["NV-1142", "NovaForms Pro", "Components", 2140, 92, "ACTIVE"],
  ["HX-7780", "Helix CRM Bundle", "SaaS", 1980, 71, "REVIEW"],
  ["QT-0048", "Quantum Charts", "Library", 1620, 58, "ACTIVE"],
  ["PL-9921", "Pulse Analytics Pro", "Plugin", 1410, 44, "ACTIVE"],
  ["VX-2204", "Vortex Auth Engine", "Service", 1180, 38, "DRAFT"],
] as const;

function ProductsPage() {
  const live = useLiveSeries(48, 121, 60, 18);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 012 · CODECANYON PRODUCT MGMT"
          title="Product Manager"
          subtitle="Catalog · versioning · approvals · pricing — single source of truth."
          actions={<button className="flex items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 text-[11px] font-medium text-primary"><Plus className="h-3 w-3" />New Product</button>}
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="Catalog size" value="12,840" delta="+128" tone="primary" spark={<MiniArea data={generateSeries(24, 11, 60, 8)} />} />
          <Metric label="Pending review" value="42" delta="-6" tone="warning" spark={<MiniArea data={generateSeries(24, 12, 40, 12)} color="var(--warning)" />} />
          <Metric label="Avg price" value="$48.20" delta="+$2.10" tone="success" spark={<MiniArea data={generateSeries(24, 13, 50, 8)} color="var(--success)" />} />
          <Metric label="SKU velocity" value="284/h" delta="+9%" tone="ai" spark={<MiniArea data={generateSeries(24, 14, 60, 16)} color="var(--ai)" />} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="LIFECYCLE" title="Publish · update · sunset flow">
            <MultiLine data={live} h={260} />
          </Panel>
          <Panel kicker="QUALITY" title="Catalog health">
            <Radial value={92} color="var(--success)" label="QA SCORE" h={180} />
            <div className="mt-3 grid grid-cols-2 gap-2 text-[11.5px]">
              <div className="rounded border border-border/60 bg-background/40 p-2"><div className="text-muted-foreground">SEO</div><div className="text-success">98%</div></div>
              <div className="rounded border border-border/60 bg-background/40 p-2"><div className="text-muted-foreground">Media</div><div className="text-primary">94%</div></div>
              <div className="rounded border border-border/60 bg-background/40 p-2"><div className="text-muted-foreground">Variants</div><div className="text-info">87%</div></div>
              <div className="rounded border border-border/60 bg-background/40 p-2"><div className="text-muted-foreground">Docs</div><div className="text-warning">71%</div></div>
            </div>
          </Panel>
        </div>

        <Panel kicker="CATALOG" title="Top SKUs · 7d">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-border/60 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                <th className="py-2">SKU</th><th>Name</th><th>Category</th><th className="text-right">Units</th><th className="text-right">Refs</th><th className="text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([sku, name, cat, units, refs, st]) => (
                <tr key={sku as string} className="border-b border-border/60 last:border-0">
                  <td className="py-2 font-mono text-[11px] text-muted-foreground">{sku}</td>
                  <td className="py-2 flex items-center gap-2"><Package className="h-3.5 w-3.5 text-primary" />{name}</td>
                  <td className="py-2 text-muted-foreground">{cat}</td>
                  <td className="py-2 text-right font-mono">{units}</td>
                  <td className="py-2 text-right font-mono text-info">{refs}</td>
                  <td className="py-2 text-right"><span className={`rounded border px-1.5 py-0.5 font-mono text-[10px] ${st==="ACTIVE"?"border-success/40 text-success":st==="REVIEW"?"border-warning/40 text-warning":"border-border text-muted-foreground"}`}>{st}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Panel kicker="CATEGORIES" title="Distribution"><Bars data={generateSeries(12, 18, 60, 22)} color="var(--primary)" h={200} /></Panel>
          <Panel kicker="PRICE BANDS" title="Spread"><Bars data={generateSeries(12, 19, 50, 18)} color="var(--ai)" h={200} /></Panel>
        </div>
      </div>
    </div>
  );
}
