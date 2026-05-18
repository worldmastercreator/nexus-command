import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { Banknote, Calculator, Landmark, Sparkles, TrendingDown, PiggyBank } from "lucide-react";

export const Route = createFileRoute("/payroll/dashboard")({ component: PayrollDashboard });

function PayrollDashboard() {
  const live = useLiveSeries(48, 500, 180, 22);
  const cycle = [
    { step: "Inputs locked", t: "T-72h", done: true },
    { step: "Attendance reconciled", t: "T-48h", done: true },
    { step: "Statutory computed", t: "T-24h", done: true },
    { step: "Approvals", t: "T-6h", done: false, active: true },
    { step: "Bank file generated", t: "T-2h", done: false },
    { step: "Disbursement", t: "T-0", done: false },
  ];
  const ledger = [
    { dept: "Engineering", heads: 184, gross: 2_412_800, deduct: 612_400, net: 1_800_400 },
    { dept: "Product", heads: 42, gross: 612_000, deduct: 148_900, net: 463_100 },
    { dept: "GTM", heads: 96, gross: 1_104_000, deduct: 264_300, net: 839_700 },
    { dept: "Operations", heads: 58, gross: 489_200, deduct: 118_700, net: 370_500 },
    { dept: "Finance", heads: 19, gross: 284_400, deduct: 69_100, net: 215_300 },
  ];

  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader
          eyebrow="MODULE · 500 · PAYROLL PILOT"
          title="Payroll Operations · Cycle 2026.05"
          subtitle="Cycle progression, statutory compliance, disbursement & exception management."
          actions={
            <div className="flex items-center gap-2 rounded-md border border-border bg-surface-2/60 px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground">
              <Sparkles className="h-3 w-3 text-ai" /> 399 heads · 6 entities
            </div>
          }
        />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Metric label="Gross payroll" value="$4.90M" delta="+1.8%" tone="primary"
            spark={<MiniArea data={generateSeries(28, 21, 90, 12)} />} />
          <Metric label="Net disbursed" value="$3.69M" delta="ready" tone="success"
            spark={<MiniArea data={generateSeries(28, 22, 80, 10)} color="var(--success)" />} />
          <Metric label="Deductions" value="$1.21M" delta="stat + tax" tone="warning"
            spark={<MiniArea data={generateSeries(28, 23, 60, 16)} color="var(--warning)" />} />
          <Metric label="Exceptions" value="07" delta="awaiting" tone="danger"
            spark={<MiniArea data={generateSeries(28, 24, 30, 26)} color="var(--danger)" />} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="CYCLE TELEMETRY" title="Processing throughput · last 4h">
            <MultiLine data={live} />
          </Panel>
          <Panel kicker="CYCLE" title="2026.05 progression">
            <ol className="space-y-2 text-[12.5px]">
              {cycle.map((s, i) => (
                <li key={s.step} className="flex items-center gap-3 rounded-md border border-border bg-surface-2/40 px-3 py-2">
                  <span className={`grid h-6 w-6 place-items-center rounded-full border font-mono text-[10px] ${s.done ? "border-success/40 bg-success/10 text-success" : s.active ? "border-ai/40 bg-ai/10 text-ai" : "border-border text-muted-foreground"}`}>
                    {i + 1}
                  </span>
                  <span className={s.done ? "text-muted-foreground line-through" : ""}>{s.step}</span>
                  <span className="ml-auto font-mono text-[10.5px] text-muted-foreground">{s.t}</span>
                </li>
              ))}
            </ol>
          </Panel>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel kicker="LEDGER" title="Department breakdown" className="lg:col-span-2">
            <table className="w-full text-[12.5px]">
              <thead className="text-left font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="py-2">Department</th>
                  <th>Heads</th>
                  <th>Gross</th>
                  <th>Deduct</th>
                  <th>Net</th>
                </tr>
              </thead>
              <tbody>
                {ledger.map((r) => (
                  <tr key={r.dept} className="border-b border-border/50">
                    <td className="py-2">{r.dept}</td>
                    <td className="font-mono">{r.heads}</td>
                    <td className="font-mono text-foreground">${(r.gross / 1000).toFixed(1)}k</td>
                    <td className="font-mono text-warning">−${(r.deduct / 1000).toFixed(1)}k</td>
                    <td className="font-mono text-success">${(r.net / 1000).toFixed(1)}k</td>
                  </tr>
                ))}
                <tr className="border-t border-border/60 font-mono text-[11px]">
                  <td className="py-2 text-muted-foreground">TOTAL</td>
                  <td>399</td>
                  <td>$4.90M</td>
                  <td className="text-warning">−$1.21M</td>
                  <td className="text-success">$3.69M</td>
                </tr>
              </tbody>
            </table>
          </Panel>
          <Panel kicker="STATUTORY" title="Compliance posture">
            <ul className="space-y-2 text-[12.5px]">
              <Comp icon={Landmark} label="PF / EPF" v="✓ filed" tone="success" />
              <Comp icon={Calculator} label="TDS · sec 192" v="✓ computed" tone="success" />
              <Comp icon={Banknote} label="Professional tax" v="✓ paid" tone="success" />
              <Comp icon={PiggyBank} label="Gratuity provision" v="accruing" tone="info" />
              <Comp icon={TrendingDown} label="ESI" v="2 mismatch" tone="warning" />
            </ul>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Bars data={generateSeries(10, 88, 40, 22)} color="var(--success)" />
              <Bars data={generateSeries(10, 89, 30, 22)} color="var(--warning)" />
            </div>
          </Panel>
        </div>

        <Panel kicker="EXCEPTIONS" title="Approval queue">
          <ul className="divide-y divide-border text-[12.5px]">
            {["Off-cycle bonus · K. Mehta · $4,800","Loan repayment skip · A. Nair","FX reval · UK entity · −£312","Sign-on advance · J. Park · $12,000","Manual override · S. Iyer · gross +2.4%","Bank reject · IFSC mismatch · 1 head","Statutory cap exceeded · NPS · 1 head"].map((t, i) => (
              <li key={t} className="flex items-center gap-3 py-2">
                <span className={`live-dot ${i % 3 === 0 ? "warn" : ""}`} />
                <span className="font-mono text-[10.5px] text-muted-foreground">EXC-{(900 + i).toString().padStart(4, "0")}</span>
                <span>{t}</span>
                <span className="ml-auto flex items-center gap-1.5">
                  <button className="rounded border border-border px-2 py-0.5 font-mono text-[10px] hover:border-success/40 hover:text-success">approve</button>
                  <button className="rounded border border-border px-2 py-0.5 font-mono text-[10px] hover:border-danger/40 hover:text-danger">hold</button>
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

function Comp({ icon: Icon, label, v, tone }: { icon: any; label: string; v: string; tone: "success" | "info" | "warning" }) {
  const t = { success: "text-success", info: "text-info", warning: "text-warning" }[tone];
  return (
    <li className="flex items-center gap-2 rounded-md border border-border bg-surface-2/40 px-3 py-2">
      <Icon className={`h-3.5 w-3.5 ${t}`} />
      <span>{label}</span>
      <span className={`ml-auto font-mono text-[10.5px] ${t}`}>{v}</span>
    </li>
  );
}
