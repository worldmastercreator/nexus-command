import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, StackedArea } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";

export const Route = createFileRoute("/crm")({
  head: () => ({ meta: [{ title: "CRM & Leads · AEGIS OS" }] }),
  component: CrmPage,
});

const stages = [
  { name: "New", count: 248, color: "var(--info)" },
  { name: "Qualified", count: 142, color: "var(--primary)" },
  { name: "Proposal", count: 78, color: "var(--ai)" },
  { name: "Negotiation", count: 41, color: "var(--warning)" },
  { name: "Won", count: 28, color: "var(--success)" },
];

function CrmPage() {
  const live = useLiveSeries(50, 121, 60, 18);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 026 · SALESFORCE CRM"
          title="CRM & Leads"
          subtitle="Pipeline · accounts · conversations — orchestrated revenue surface."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="Pipeline" value="$8.42M" delta="+12.1%" tone="primary" spark={<MiniArea data={generateSeries(30, 1, 60, 14)} />} />
          <Metric label="Win rate" value="28.4%" delta="+1.8pp" tone="success" spark={<MiniArea data={generateSeries(30, 2, 60, 8)} color="var(--success)" />} />
          <Metric label="Avg deal" value="$48,210" delta="+$1.2k" tone="market" spark={<MiniArea data={generateSeries(30, 3, 60, 12)} color="var(--market)" />} />
          <Metric label="Cycle" value="32d" delta="-2d" tone="info" spark={<MiniArea data={generateSeries(30, 4, 60, 8)} color="var(--info)" />} />
        </div>

        <Panel kicker="PIPELINE" title="Kanban · live">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            {stages.map((s) => (
              <div key={s.name} className="rounded-lg border border-border bg-surface-2/60 p-3">
                <div className="flex items-center justify-between font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground">
                  <span style={{ color: s.color }}>{s.name}</span>
                  <span>{s.count}</span>
                </div>
                <div className="mt-3 space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="rounded-md border border-border bg-background/60 p-2 text-[11.5px]">
                      <div className="truncate font-medium text-foreground">
                        {["Globex", "Hooli", "Initech", "Stark", "Wayne"][i % 5]} · enterprise plan
                      </div>
                      <div className="mt-1 flex items-center justify-between font-mono text-[10px] text-muted-foreground">
                        <span>${(20 + ((i + s.count) % 40) * 5).toFixed(0)}k</span>
                        <span>72% AI score</span>
                      </div>
                      <div className="mt-1.5 h-0.5 overflow-hidden rounded-full bg-surface">
                        <div className="h-full" style={{ width: `${30 + i * 22}%`, background: s.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="ACTIVITY" title="Touchpoints · realtime">
            <MultiLine data={live} h={240} />
          </Panel>
          <Panel kicker="FORECAST" title="Q4 attainment">
            <StackedArea data={generateSeries(24, 17, 60, 16)} h={240} />
          </Panel>
        </div>
      </div>
    </div>
  );
}
