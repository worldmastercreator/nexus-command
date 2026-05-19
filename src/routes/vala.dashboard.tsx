import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars, Radial } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";

export const Route = createFileRoute("/vala/dashboard")({
  head: () => ({ meta: [{ title: "Vala Nexus · AEGIS OS" }] }),
  component: ValaDashboard,
});

const PILLARS = [
  { k: "Command",       n: 24, c: "var(--primary)" },
  { k: "Security",      n: 18, c: "var(--danger)" },
  { k: "Demos & Sales", n: 32, c: "var(--ai)" },
  { k: "Operators",     n: 22, c: "var(--info)" },
  { k: "Partners",      n: 14, c: "var(--success)" },
  { k: "Support",       n: 11, c: "var(--warning)" },
];

function ValaDashboard() {
  const live = useLiveSeries(48, 1101, 70, 16);
  const max = Math.max(...PILLARS.map((p) => p.n));

  const consoles = [
    { id: "VC-001", name: "Continent Super Admin", region: "GLOBAL · 7", state: "armed",   sla: 99.98 },
    { id: "VC-002", name: "Leader Security",       region: "AMER · 3",   state: "armed",   sla: 99.94 },
    { id: "VC-003", name: "Incident & Crisis",     region: "EMEA · 4",   state: "active",  sla: 99.71 },
    { id: "VC-004", name: "Master Control",        region: "APAC · 5",   state: "armed",   sla: 99.99 },
    { id: "VC-005", name: "AI Console",            region: "EDGE · 12",  state: "active",  sla: 99.42 },
    { id: "VC-006", name: "Dev Command Center",    region: "GLOBAL · 7", state: "drill",   sla: 99.88 },
  ];

  const demos = [
    { name: "Premium Showcase",   plays: 1842, conv: 31.4 },
    { name: "Product Demo · Pro", plays: 1124, conv: 24.1 },
    { name: "Sub-Category Tour",  plays: 884,  conv: 18.7 },
    { name: "Simple Demo View",   plays: 612,  conv: 11.2 },
    { name: "Demo Directory",     plays: 318,  conv: 7.4 },
  ];

  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader
          eyebrow="MODULE · 1000 · VALA NEXUS"
          title="Vala Nexus — Sovereign Command"
          subtitle="Continent-grade control spine · operators · demos · partners · incident posture."
          actions={
            <div className="flex gap-2">
              <button className="rounded-md border border-border bg-surface-2 px-3 py-1.5 text-[12px] hover:bg-accent">Drill</button>
              <button className="rounded-md bg-primary px-3 py-1.5 text-[12px] font-medium text-primary-foreground hover:opacity-90">Arm command</button>
            </div>
          }
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <Metric label="Consoles online" value="121" delta="+4" tone="primary" spark={<MiniArea data={generateSeries(30, 1, 60, 8)} />} />
          <Metric label="Operators" value="3,184" delta="+212" tone="ai" spark={<MiniArea data={generateSeries(30, 2, 80, 10)} color="var(--ai)" />} />
          <Metric label="Demos served" value="184.2k" delta="+18%" tone="success" spark={<MiniArea data={generateSeries(30, 3, 70, 12)} color="var(--success)" />} />
          <Metric label="Open incidents" value="07" delta="2 P1" tone="warning" spark={<MiniArea data={generateSeries(30, 4, 30, 14)} color="var(--warning)" />} />
          <Metric label="Sovereign SLA" value="99.97%" delta="+0.02pp" tone="info" spark={<MiniArea data={generateSeries(30, 5, 50, 6)} color="var(--info)" />} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="SPINE" title="Nexus command throughput · last 48h">
            <MultiLine data={live} h={240} />
          </Panel>
          <Panel kicker="PILLARS" title="Module coverage">
            <div className="space-y-2">
              {PILLARS.map((p) => (
                <div key={p.k}>
                  <div className="flex items-center justify-between font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground">
                    <span>{p.k}</span><span>{p.n} modules</span>
                  </div>
                  <div className="mt-1 h-3 overflow-hidden rounded bg-surface-2">
                    <div className="h-full" style={{ width: `${(p.n / max) * 100}%`, background: p.c, boxShadow: `0 0 14px ${p.c}` }} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="CONSOLES" title="Sovereign command stack">
            <table className="w-full border-collapse text-[12.5px]">
              <thead className="text-[10.5px] uppercase tracking-wider text-muted-foreground">
                <tr className="border-b border-border">
                  {["ID","Console","Region","State","SLA"].map((h) => <th key={h} className="px-3 py-2 text-left font-medium">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {consoles.map((c) => (
                  <tr key={c.id} className="border-b border-border/60 hover:bg-accent/40">
                    <td className="px-3 py-2 font-mono text-[11px]">{c.id}</td>
                    <td className="px-3 py-2 font-medium">{c.name}</td>
                    <td className="px-3 py-2 font-mono text-[11px] text-muted-foreground">{c.region}</td>
                    <td className="px-3 py-2">
                      <span className={`rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase ${
                        c.state === "armed" ? "border-success/40 bg-success/10 text-success" :
                        c.state === "drill" ? "border-warning/40 bg-warning/10 text-warning" :
                        "border-info/40 bg-info/10 text-info"
                      }`}>{c.state}</span>
                    </td>
                    <td className="px-3 py-2 font-mono text-[11px]">{c.sla}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>

          <Panel kicker="POSTURE" title="Sovereign posture">
            <div className="grid grid-cols-2 gap-3">
              <Radial value={97} color="var(--success)" label="UPTIME" />
              <Radial value={88} color="var(--ai)" label="AI READINESS" />
              <Radial value={74} color="var(--info)" label="COVERAGE" />
              <Radial value={62} color="var(--warning)" label="DRILL DUE" />
            </div>
          </Panel>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel kicker="DEMOS" title="Top demo funnels">
            <div className="space-y-1.5">
              {demos.map((d) => (
                <div key={d.name} className="rounded border border-border/60 bg-surface-2/40 p-2 text-[12px]">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{d.name}</span>
                    <span className="ml-auto font-mono text-[11px]">{d.plays.toLocaleString()} plays</span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 font-mono text-[10px] text-muted-foreground">
                    <span className="text-success">conv {d.conv}%</span>
                  </div>
                  <div className="mt-1 h-1 overflow-hidden rounded bg-surface">
                    <div className="h-full bg-ai" style={{ width: `${Math.min(100, d.conv * 3)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel kicker="OPERATORS" title="Operator load · last 7d">
            <Bars data={generateSeries(7, 73, 60, 18)} h={200} color="var(--primary)" />
          </Panel>

          <Panel kicker="WALLET" title="Sovereign treasury">
            <ul className="space-y-2 text-[12px]">
              <li className="flex items-center justify-between"><span>Operating</span><span className="font-mono text-success">$1,842,210</span></li>
              <li className="flex items-center justify-between"><span>Reserves</span><span className="font-mono text-info">$924,440</span></li>
              <li className="flex items-center justify-between"><span>Partner escrow</span><span className="font-mono text-ai">$184,720</span></li>
              <li className="flex items-center justify-between"><span>Incident fund</span><span className="font-mono text-warning">$48,180</span></li>
              <li className="flex items-center justify-between"><span>Sovereign net</span><span className="font-mono text-foreground">$2,999,550</span></li>
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
