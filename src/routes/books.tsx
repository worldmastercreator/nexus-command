import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, StackedArea } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { FileText } from "lucide-react";

export const Route = createFileRoute("/books")({
  head: () => ({ meta: [{ title: "Invoice / Books · AEGIS OS" }] }),
  component: BooksPage,
});

function BooksPage() {
  const live = useLiveSeries(48, 231, 60, 14);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 023 · ZOHO BOOKS / QUICKBOOKS"
          title="Invoice & Accounting"
          subtitle="AR · AP · ledger · tax · reconciliation · close — double-entry truth engine."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <Metric label="Receivable" value="$1.84M" delta="42 invoices" tone="success" spark={<MiniArea data={generateSeries(24,121,60,8)} color="var(--success)" />} />
          <Metric label="Payable" value="$482K" delta="18 due" tone="warning" spark={<MiniArea data={generateSeries(24,122,40,10)} color="var(--warning)" />} />
          <Metric label="Cash" value="$8.42M" delta="+$184K" tone="primary" spark={<MiniArea data={generateSeries(24,123,60,6)} />} />
          <Metric label="Tax liability" value="$248K" delta="next Q" tone="info" spark={<MiniArea data={generateSeries(24,124,40,4)} color="var(--info)" />} />
          <Metric label="Burn / month" value="$184K" delta="runway 46mo" tone="ai" spark={<MiniArea data={generateSeries(24,125,40,10)} color="var(--ai)" />} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="P&L WATERFALL" title="Revenue · COGS · OpEx · net"><StackedArea data={live} h={260} /></Panel>
          <Panel kicker="AGING" title="AR aging buckets">
            <ul className="space-y-3 text-[12.5px]">
              {[["0–30 days","$1,184,210","success"],["31–60 days","$420,128","info"],["61–90 days","$148,820","warning"],["90+ days","$84,128","danger"]].map(([n,v,t])=>(
                <li key={n as string} className="flex items-center justify-between rounded border border-border/60 bg-background/40 p-2">
                  <span>{n}</span>
                  <span className={`font-mono text-${t}`}>{v}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <Panel kicker="RECENT INVOICES" title="Live AR ledger">
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-border/60 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground"><th className="py-2">Invoice</th><th>Customer</th><th>Issued</th><th className="text-right">Amount</th><th className="text-right">Status</th></tr></thead>
            <tbody>
              {[["INV-8421","Aurora Labs","2026-05-14","$48,210","PAID"],["INV-8420","Pulse Co","2026-05-14","$22,128","SENT"],["INV-8419","Helix CRM","2026-05-13","$84,128","OVERDUE"],["INV-8418","Nova","2026-05-12","$12,840","SENT"],["INV-8417","Axiom","2026-05-12","$18,420","PAID"]].map(([id,c,d,a,s])=>(
                <tr key={id} className="border-b border-border/60 last:border-0">
                  <td className="py-2 font-mono text-[11px] text-info flex items-center gap-2"><FileText className="h-3.5 w-3.5" />{id}</td>
                  <td className="py-2">{c}</td>
                  <td className="py-2 font-mono text-[11px] text-muted-foreground">{d}</td>
                  <td className="py-2 text-right font-mono">{a}</td>
                  <td className="py-2 text-right"><span className={`rounded border px-1.5 py-0.5 font-mono text-[10px] ${s==="PAID"?"border-success/40 text-success":s==="OVERDUE"?"border-danger/40 text-danger":"border-border text-muted-foreground"}`}>{s}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </div>
  );
}
