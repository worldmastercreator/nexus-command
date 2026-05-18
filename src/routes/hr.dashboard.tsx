import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars, Radial } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";

export const Route = createFileRoute("/hr/dashboard")({
  head: () => ({ meta: [{ title: "People Hub · AEGIS OS" }] }),
  component: HRDashboard,
});

function HRDashboard() {
  const live = useLiveSeries(48, 401, 60, 14);
  const team = [
    { n: "Aarav Mehta", r: "Engineering", a: 98, s: "active" },
    { n: "Sofia Lin", r: "Design", a: 92, s: "active" },
    { n: "Mateo García", r: "Sales", a: 71, s: "leave" },
    { n: "Priya Shah", r: "People Ops", a: 95, s: "active" },
    { n: "Daichi Sato", r: "Data", a: 88, s: "remote" },
    { n: "Noor Hassan", r: "Marketing", a: 82, s: "active" },
  ];
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 200 · PEOPLE HUB"
          title="HR Dashboard — People Hub"
          subtitle="Workforce telemetry · attendance · leave · performance · documents."
          actions={<button className="rounded-md bg-primary px-3 py-1.5 text-[12px] font-medium text-primary-foreground hover:opacity-90">Run payroll</button>}
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <Metric label="Headcount" value="1,284" delta="+12 mo" tone="primary" spark={<MiniArea data={generateSeries(30, 1, 60, 6)} />} />
          <Metric label="Present" value="1,108" delta="86.3%" tone="success" spark={<MiniArea data={generateSeries(30, 2, 80, 6)} color="var(--success)" />} />
          <Metric label="On leave" value="48" delta="3.7%" tone="warning" spark={<MiniArea data={generateSeries(30, 3, 30, 10)} color="var(--warning)" />} />
          <Metric label="Open roles" value="32" delta="+4" tone="info" spark={<MiniArea data={generateSeries(30, 4, 50, 12)} color="var(--info)" />} />
          <Metric label="Eng score" value="4.42/5" delta="+0.12" tone="ai" spark={<MiniArea data={generateSeries(30, 5, 60, 8)} color="var(--ai)" />} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="ATTENDANCE" title="Daily clock-ins · last 48h">
            <MultiLine data={live} h={240} />
          </Panel>
          <Panel kicker="WELLNESS" title="Org pulse">
            <div className="grid grid-cols-2 gap-3">
              <Radial value={88} label="ENG" />
              <Radial value={74} color="var(--ai)" label="DEI" />
              <Radial value={92} color="var(--success)" label="SAFETY" />
              <Radial value={61} color="var(--warning)" label="BURNOUT" />
            </div>
          </Panel>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="ROSTER" title="People · live status">
            <table className="w-full border-collapse text-[12.5px]">
              <thead className="text-[10.5px] uppercase tracking-wider text-muted-foreground">
                <tr className="border-b border-border">
                  {["Name", "Department", "Attendance", "Status", "Trend"].map((h) => <th key={h} className="px-3 py-2 text-left font-medium">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {team.map((p, i) => (
                  <tr key={p.n} className="border-b border-border/60 hover:bg-accent/40">
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-primary to-ai text-[10px] font-semibold">
                          {p.n.split(" ").map(s => s[0]).join("")}
                        </div>
                        <span className="font-medium">{p.n}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{p.r}</td>
                    <td className="px-3 py-2 font-mono">{p.a}%</td>
                    <td className="px-3 py-2">
                      <span className={`rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase ${
                        p.s === "active" ? "border-success/40 bg-success/10 text-success" :
                        p.s === "leave" ? "border-warning/40 bg-warning/10 text-warning" :
                        "border-info/40 bg-info/10 text-info"}`}>{p.s}</span>
                    </td>
                    <td className="px-3 py-2 w-32"><MiniArea data={generateSeries(20, i + 9, 60, 10)} h={28} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>

          <Panel kicker="HEADCOUNT" title="Departments">
            <Bars data={generateSeries(8, 31, 50, 18)} h={220} color="var(--ai)" />
          </Panel>
        </div>
      </div>
    </div>
  );
}
