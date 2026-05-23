import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Radial } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Auth & RBAC · AEGIS OS" }] }),
  component: AuthPage,
});

function AuthPage() {
  const live = useLiveSeries(60, 401, 80, 18);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 008 · AUTH0 + CLERK"
          title="Identity, Auth & RBAC"
          subtitle="Tenants · orgs · roles · sessions · MFA · passkeys · SSO."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <Metric label="Active users" value="84,210" tone="primary" spark={<MiniArea data={generateSeries(24, 41, 80, 8)} />} />
          <Metric label="Sessions /h" value="12,481" tone="info" spark={<MiniArea data={generateSeries(24, 42, 60, 12)} color="var(--info)" />} />
          <Metric label="MFA coverage" value="98.4%" tone="success" />
          <Metric label="Failed logins" value="2,184" delta="24h" tone="warning" spark={<MiniArea data={generateSeries(24, 44, 30, 18)} color="var(--warning)" />} />
          <Metric label="Passkey adopt" value="62%" tone="ai" spark={<MiniArea data={generateSeries(24, 45, 50, 6)} color="var(--ai)" />} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="AUTH FLOW" title="Login · signup · refresh · revoke">
            <MultiLine data={live} h={260} />
          </Panel>
          <Panel kicker="MFA POSTURE" title="Strong factors enforced">
            <Radial value={98} color="var(--success)" label="MFA · ENFORCED" h={200} />
          </Panel>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Panel kicker="ROLE MATRIX" title="Active assignments">
            <ul className="space-y-3 text-[12.5px]">
              {[
                ["root · clearance 7", 4, "danger"],
                ["admin", 38, "warning"],
                ["operator", 412, "primary"],
                ["auditor", 28, "info"],
                ["billing.manager", 19, "market"],
                ["ml.publisher", 11, "ai"],
              ].map(([r, c, t]) => (
                <li key={r as string} className="flex items-center gap-3">
                  <span className={`w-48 truncate text-${t}`}>{r}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface"><div className={`h-full bg-${t}`} style={{ width: `${Math.min(100, (c as number) * 3)}%` }} /></div>
                  <span className="w-12 text-right font-mono text-[11px]">{c}</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel kicker="SSO PROVIDERS" title="Active integrations">
            <ul className="grid grid-cols-2 gap-2 text-[12px]">
              {[
                ["Google Workspace", "8,210", "success"],
                ["Microsoft Entra", "5,184", "success"],
                ["Okta", "2,140", "success"],
                ["GitHub", "1,824", "success"],
                ["SAML · custom", "684", "info"],
                ["LDAP bridge", "412", "warning"],
              ].map(([p, c, t]) => (
                <li key={p} className="flex items-center justify-between rounded-md border border-border bg-surface-2/40 px-3 py-2">
                  <span className="truncate">{p}</span>
                  <span className={`font-mono text-[11px] text-${t}`}>{c}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
