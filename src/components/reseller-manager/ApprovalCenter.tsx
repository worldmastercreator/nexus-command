import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { rmQueryOptions, setApplicationStatus } from "@/lib/reseller-manager.functions";
import { PageHeader, Panel } from "@/components/dash/primitives";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Check, X, PauseCircle, UserCheck, FileSearch } from "lucide-react";

const TABS = ["NEW", "KYC", "INTERVIEW", "APPROVED", "REJECTED", "HOLD", "WAITING"] as const;

export function ApprovalCenter() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("NEW");
  const { data } = useSuspenseQuery(rmQueryOptions("reseller_applications", 200));
  const qc = useQueryClient();
  const setStatus = useServerFn(setApplicationStatus);
  const [busy, setBusy] = useState<string | null>(null);

  const rows = data.rows.filter((r: any) => r.status === tab);
  const counts = TABS.reduce((acc, t) => {
    acc[t] = data.rows.filter((r: any) => r.status === t).length; return acc;
  }, {} as Record<string, number>);

  async function act(id: string, status: any) {
    setBusy(id);
    try {
      await setStatus({ data: { id, status } });
      toast.success(`Application ${status.toLowerCase()}`);
      await qc.invalidateQueries({ queryKey: ["rm"] });
    } catch (e: any) {
      toast.error(e.message ?? "Action failed (boss role required)");
    } finally { setBusy(null); }
  }

  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader
          eyebrow="MODULE · 002 · APPLICATION & APPROVAL CENTER"
          title="Reseller Application Queue"
          subtitle="Verify KYC, schedule interviews, approve or reject reseller applications. All actions are written to the audit log."
        />

        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`rounded border px-3 py-1.5 text-[12px] font-mono uppercase tracking-wider transition ${
                tab === t ? "border-primary bg-primary/10 text-primary" : "border-border bg-surface-2 text-muted-foreground hover:text-foreground"
              }`}>
              {t} <span className="ml-2 text-[10px] opacity-70">{counts[t] ?? 0}</span>
            </button>
          ))}
        </div>

        <Panel kicker={`QUEUE · ${tab}`} title={`${rows.length} application(s)`}>
          {rows.length === 0 ? (
            <div className="rounded border border-dashed border-border p-8 text-center text-muted-foreground">
              No applications in {tab}.
            </div>
          ) : (
            <table className="w-full text-[12.5px]">
              <thead className="border-b border-border text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="py-2">Applicant</th><th>Company</th><th>Territory</th>
                  <th>KYC</th><th>Created</th><th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r: any) => (
                  <tr key={r.id} className="border-b border-border/40">
                    <td className="py-2">
                      <div className="font-medium text-foreground">{r.applicant_name}</div>
                      <div className="text-[11px] text-muted-foreground">{r.email}</div>
                    </td>
                    <td>{r.company ?? "—"}</td>
                    <td>{r.country ?? r.territory_requested ?? "—"}</td>
                    <td><span className="rounded border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[10px]">{r.kyc_status}</span></td>
                    <td className="font-mono text-[11px] text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className="flex justify-end gap-1">
                        <Button size="sm" variant="ghost" disabled={busy === r.id} onClick={() => act(r.id, "KYC")}><FileSearch className="h-3.5 w-3.5"/></Button>
                        <Button size="sm" variant="ghost" disabled={busy === r.id} onClick={() => act(r.id, "INTERVIEW")}><UserCheck className="h-3.5 w-3.5"/></Button>
                        <Button size="sm" variant="ghost" disabled={busy === r.id} onClick={() => act(r.id, "HOLD")}><PauseCircle className="h-3.5 w-3.5 text-warning"/></Button>
                        <Button size="sm" variant="ghost" disabled={busy === r.id} onClick={() => act(r.id, "APPROVED")}><Check className="h-3.5 w-3.5 text-success"/></Button>
                        <Button size="sm" variant="ghost" disabled={busy === r.id} onClick={() => act(r.id, "REJECTED")}><X className="h-3.5 w-3.5 text-destructive"/></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Panel>

        <Panel kicker="GATE" title="Master flow">
          <div className="flex flex-wrap items-center gap-2 text-[12px] text-muted-foreground">
            {"Application → Verification → Approval → Territory → Activation → Leads → Sales → Customers → Renewals → Revenue → Scaling".split(" → ").map((s, i, a) => (
              <span key={s} className="flex items-center gap-2">
                <span className="rounded border border-border bg-surface-2 px-2 py-0.5 font-mono text-[10.5px] uppercase">{s}</span>
                {i < a.length - 1 && <span className="text-primary">→</span>}
              </span>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
