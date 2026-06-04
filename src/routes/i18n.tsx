import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Languages, CheckCircle2, AlertCircle } from "lucide-react";
import { languageCoverageQueryOptions } from "@/lib/i18n.functions";
import { PageHeader, Panel } from "@/components/dash/primitives";

export const Route = createFileRoute("/i18n")({
  head: () => ({
    meta: [
      { title: "Translation Coverage · Vala Nexus" },
      { name: "description", content: "Live i18n coverage dashboard — honest mode. Only fully translated languages are shown in the picker." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(languageCoverageQueryOptions()),
  component: I18nCoveragePage,
  errorComponent: ({ error }) => <div className="p-6 text-danger">Couldn't load coverage: {error.message}</div>,
});

function I18nCoveragePage() {
  const { data: coverage = [] } = useQuery(languageCoverageQueryOptions());
  const ready = coverage.filter((l) => l.is_ready).length;
  const total = coverage.length;
  const totalKeys = coverage[0]?.total_keys ?? 0;

  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader
          eyebrow="MODULE · I18N · HONEST MODE"
          title="Translation Coverage"
          subtitle={`${ready}/${total} languages ready · ${totalKeys} source keys · only 100% languages appear in the picker.`}
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <KpiCard label="Source keys" value={String(totalKeys)} tone="info" />
          <KpiCard label="Languages ready" value={`${ready} / ${total}`} tone="success" />
          <KpiCard label="Languages in progress" value={String(total - ready)} tone="warning" />
        </div>

        <Panel kicker="REGISTRY" title="All languages">
          <table className="w-full border-collapse text-[12.5px]">
            <thead className="text-[10.5px] uppercase tracking-wider text-muted-foreground">
              <tr className="border-b border-border">
                {["Code", "Language", "Native", "Coverage", "Translated", "Missing", "Status"].map((h) => (
                  <th key={h} className="px-3 py-2 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {coverage.map((l) => {
                const missing = Math.max(0, l.total_keys - l.translated_keys);
                return (
                  <tr key={l.code} className="border-b border-border/60 hover:bg-accent/40">
                    <td className="px-3 py-2 font-mono text-[11px]">{l.code.toUpperCase()}{l.rtl && <span className="ml-1 text-warning">RTL</span>}</td>
                    <td className="px-3 py-2 font-medium">{l.name}</td>
                    <td className="px-3 py-2">{l.native_name}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-32 overflow-hidden rounded bg-surface-2">
                          <div
                            className="h-full transition-all"
                            style={{
                              width: `${l.coverage_pct}%`,
                              background: l.is_ready ? "var(--success)" : "var(--warning)",
                              boxShadow: l.is_ready ? "0 0 10px var(--success)" : undefined,
                            }}
                          />
                        </div>
                        <span className="font-mono text-[11px] tabular-nums">{Number(l.coverage_pct).toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 font-mono text-[11px]">{l.translated_keys}</td>
                    <td className="px-3 py-2 font-mono text-[11px]">{missing > 0 ? <span className="text-warning">{missing}</span> : <span className="text-muted-foreground">0</span>}</td>
                    <td className="px-3 py-2">
                      {l.is_ready ? (
                        <span className="inline-flex items-center gap-1 rounded border border-success/40 bg-success/10 px-1.5 py-0.5 font-mono text-[10px] uppercase text-success">
                          <CheckCircle2 className="h-3 w-3" /> Ready
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded border border-warning/40 bg-warning/10 px-1.5 py-0.5 font-mono text-[10px] uppercase text-warning">
                          <AlertCircle className="h-3 w-3" /> In progress
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Panel>

        <Panel kicker="RULE" title="Honest mode">
          <div className="space-y-2 p-4 text-[12.5px] text-muted-foreground">
            <p className="flex items-start gap-2">
              <Languages className="mt-0.5 h-3.5 w-3.5 text-primary" />
              A language only appears in the topbar picker when its coverage is exactly 100%.
            </p>
            <p>Add translations by inserting rows into <code className="font-mono text-foreground">i18n_values</code> for the language code. The coverage view recomputes on every read.</p>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function KpiCard({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="panel relative overflow-hidden p-4">
      <div className="absolute inset-x-0 top-0 h-0.5" style={{ background: `color-mix(in oklab, var(--${tone}) 70%, transparent)` }} />
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
      <div className="mt-1 text-[22px] font-semibold tabular-nums text-foreground">{value}</div>
    </div>
  );
}
