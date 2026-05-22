import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { FilterableTable, Sev, type Column } from "@/components/dash/FilterableTable";
import { useEvents } from "@/lib/eventBus";
import { useMemo } from "react";

export const Route = createFileRoute("/logs")({
  head: () => ({ meta: [{ title: "Realtime Logs · AEGIS OS" }] }),
  component: Page,
});

interface LogRow {
  id: string; ts: string; severity: "info" | "success" | "warning" | "danger";
  source: string; message: string; region: string; latency: number;
}

function Page() {
  const live = useLiveSeries(48, 751, 90, 22);
  const events = useEvents((e) => e.channel === "logs", 150);

  const rows: LogRow[] = useMemo(() => events.map((e) => ({
    id: e.id, ts: new Date(e.ts).toISOString().slice(11, 23),
    severity: e.severity, source: e.source, message: e.message,
    region: String(e.meta?.region ?? "—"), latency: Number(e.meta?.latency_ms ?? 0),
  })).reverse(), [events]);

  const cols: Column<LogRow>[] = [
    { key: "ts", label: "Time", mono: true },
    { key: "severity", label: "Sev", render: (r) => <Sev s={r.severity} /> },
    { key: "source", label: "Source", mono: true },
    { key: "message", label: "Message" },
    { key: "region", label: "Region", mono: true },
    { key: "latency", label: "ms", align: "right", mono: true },
  ];

  const errCount = rows.filter((r) => r.severity === "danger").length;
  const warnCount = rows.filter((r) => r.severity === "warning").length;

  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="DRILL-DOWN · LOGS · STREAM" title="Realtime Logs"
          subtitle="Live structured logs from the unified event bus · filterable · exportable." />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="Lines · live" value={String(rows.length)} delta="rolling 150" tone="primary" spark={<MiniArea data={generateSeries(24, 771, 80, 18)} />} />
          <Metric label="Errors" value={String(errCount)} delta="window" tone="danger" spark={<MiniArea data={generateSeries(24, 772, 20, 16)} color="var(--danger)" />} />
          <Metric label="Warnings" value={String(warnCount)} delta="window" tone="warning" spark={<MiniArea data={generateSeries(24, 773, 40, 14)} color="var(--warning)" />} />
          <Metric label="Sources" value={String(new Set(rows.map((r) => r.source)).size)} delta="unique" tone="info" spark={<MiniArea data={generateSeries(24, 774, 30, 8)} color="var(--info)" />} />
        </div>
        <Panel kicker="THROUGHPUT" title="Lines · errors · latency"><MultiLine data={live} h={240} /></Panel>
        <FilterableTable<LogRow>
          kicker="LOG STREAM · FILTERABLE" title="Recent log lines"
          rows={rows} columns={cols} exportName="logs"
          facets={[
            { key: "severity", label: "SEV", options: ["info", "success", "warning", "danger"] },
            { key: "region", label: "REGION", options: ["us-east-1", "eu-west-1", "ap-south-1"] },
          ]}
        />
      </div>
    </div>
  );
}
