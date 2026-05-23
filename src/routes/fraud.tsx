import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Radial } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";

export const Route = createFileRoute("/fraud")({
  head: () => ({ meta: [{ title: "Fraud & Risk · AEGIS OS" }] }),
  component: FraudPage,
});

function FraudPage() {
  const live = useLiveSeries(60, 821, 80, 24);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 068 · DARKTRACE"
          title="Fraud & Risk Engine"
          subtitle="Behavioral models · device fingerprint · velocity · graph anomaly."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <Metric label="Scored /h" value="184K" tone="primary" spark={<MiniArea data={generateSeries(24, 81, 80, 14)} />} />
          <Metric label="High risk" value="2.8%" tone="warning" spark={<MiniArea data={generateSeries(24, 82, 30, 18)} color="var(--warning)" />} />
          <Metric label="Blocked /24h" value="4,210" tone="danger" />
          <Metric label="False positive" value="0.42%" tone="success" />
          <Metric label="Saved $" value="$184K" delta="this wk" tone="market" spark={<MiniArea data={generateSeries(24, 83, 60, 10)} color="var(--market)" />} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="RISK SIGNAL" title="Velocity · graph · device · geo">
            <MultiLine data={live} h={260} />
          </Panel>
          <Panel kicker="MODEL CONFIDENCE" title="Behavioural ensemble">
            <Radial value={92} color="var(--ai)" label="CONF" h={200} />
          </Panel>
        </div>

        <Panel kicker="FLAGGED EVENTS" title="Last 10 · high risk" padded={false}>
          <table className="w-full text-[12px]">
            <thead className="border-b border-border bg-surface-2/40 text-[10.5px] uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-3 py-2 text-left">EVENT</th><th className="px-3 py-2 text-left">ACTOR</th><th className="px-3 py-2 text-left">REASON</th><th className="px-3 py-2 text-left">SCORE</th><th className="px-3 py-2 text-left">ACTION</th></tr>
            </thead>
            <tbody>
              {[
                ["txn_84210", "cust_3812", "velocity · 8 cards/2m", 0.94, "block"],
                ["txn_84207", "cust_1284", "geo jump · IN → BR", 0.88, "review"],
                ["txn_84201", "cust_4920", "device fingerprint shift", 0.86, "review"],
                ["sub_2184", "cust_7711", "trial-loop pattern", 0.81, "block"],
                ["txn_84190", "cust_2103", "graph: linked to ring R-441", 0.96, "block"],
                ["refund_8411", "cust_5520", "refund abuse", 0.78, "review"],
                ["login_x4", "user_xn21", "credential stuffing", 0.92, "block"],
              ].map((r) => (
                <tr key={r[0] as string} className="border-b border-border/50 hover:bg-accent/40">
                  <td className="px-3 py-2 font-mono">{r[0]}</td>
                  <td className="px-3 py-2 font-mono text-[11px] text-muted-foreground">{r[1]}</td>
                  <td className="px-3 py-2">{r[2]}</td>
                  <td className="px-3 py-2"><span className={`font-mono ${(r[3] as number) > 0.9 ? "text-danger" : "text-warning"}`}>{(r[3] as number).toFixed(2)}</span></td>
                  <td className="px-3 py-2"><span className={`rounded px-2 py-0.5 text-[10px] font-mono uppercase ${r[4]==="block"?"bg-danger/15 text-danger":"bg-warning/15 text-warning"}`}>{r[4]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </div>
  );
}
