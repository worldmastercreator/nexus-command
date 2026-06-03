import { useQuery } from "@tanstack/react-query";
import { Panel } from "@/components/dash/primitives";
import { roleDashboardQueryOptions, type RoleSlug } from "@/lib/role-dashboard.functions";
import { Activity, Zap, Bell, ArrowUpRight, type LucideIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

type Identity = { tone: string; tagline: string; icon: LucideIcon };
const ROLE_IDENTITY: Record<RoleSlug, Identity> = {
  boss:       { tone: "primary", tagline: "Global command · all signals live",        icon: Zap },
  admin:      { tone: "info",    tagline: "Platform operations · health · governance", icon: Zap },
  ceo:        { tone: "warning", tagline: "Revenue · growth · strategic telemetry",    icon: Zap },
  rm:         { tone: "ai",      tagline: "Reseller pipeline · onboarding · approvals", icon: Zap },
  reseller:   { tone: "success", tagline: "Your territory · your customers · your earnings", icon: Zap },
  franchise:  { tone: "warning", tagline: "Territory expansion · locations · royalties", icon: Zap },
  sales:      { tone: "primary", tagline: "Pipeline velocity · close rate · revenue",  icon: Zap },
  support:    { tone: "info",    tagline: "Ticket flow · customer health · response",  icon: Zap },
  hr:         { tone: "ai",      tagline: "People · attendance · payroll · culture",   icon: Zap },
  accountant: { tone: "success", tagline: "Books · payments · receivables · reports",  icon: Zap },
  author:     { tone: "ai",      tagline: "Your catalog · sales · royalties",          icon: Zap },
  customer:   { tone: "primary", tagline: "Your subscriptions · licenses · orders",    icon: Zap },
  user:       { tone: "info",    tagline: "Explore · install · learn",                 icon: Zap },
  employee:   { tone: "success", tagline: "Your day · tasks · payroll",                icon: Zap },
  manager:    { tone: "warning", tagline: "Team performance · pipeline · operations",  icon: Zap },
};

type QuickAction = { label: string; to: string };

export function RoleDashboardKit({
  role,
  title,
  quickActions = [],
}: {
  role: RoleSlug;
  title: string;
  quickActions?: QuickAction[];
}) {
  const { data, isLoading } = useQuery(roleDashboardQueryOptions(role));
  const id = ROLE_IDENTITY[role];

  return (
    <section className="space-y-4">
      <RoleHero role={role} title={title} tagline={id.tagline} />

      {/* KPI strip — real Supabase */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {(data?.kpis ?? Array.from({ length: 4 }, () => ({ label: "—", value: "—" }))).map((k, i) => (
          <KpiCard key={i} label={k.label} value={k.value} loading={isLoading} accent={id.tone} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel kicker="LIVE" title="Recent Activity" className="lg:col-span-2">
          <ActivityFeed items={data?.activity ?? []} loading={isLoading} />
        </Panel>
        <div className="space-y-4">
          {quickActions.length > 0 && (
            <Panel kicker="ACTIONS" title="Quick Actions">
              <ul className="space-y-1.5 p-3">
                {quickActions.map((a) => (
                  <li key={a.to}>
                    <Link
                      to={a.to}
                      className="group flex items-center justify-between rounded-md border border-border/70 bg-surface-2/40 px-3 py-2 text-[12.5px] text-foreground hover:bg-surface-2/80"
                    >
                      <span>{a.label}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary" />
                    </Link>
                  </li>
                ))}
              </ul>
            </Panel>
          )}
          <Panel kicker="ALERTS" title="Notifications">
            <NotificationsPanel role={role} />
          </Panel>
        </div>
      </div>
    </section>
  );
}

function RoleHero({ role, title, tagline }: { role: RoleSlug; title: string; tagline: string }) {
  const id = ROLE_IDENTITY[role];
  const Icon = id.icon;
  const [pulse, setPulse] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setPulse((p) => (p + 1) % 100), 80);
    return () => clearInterval(t);
  }, []);
  return (
    <div
      className="panel panel-glow relative overflow-hidden p-5"
      style={{
        background: `linear-gradient(135deg, color-mix(in oklab, var(--${id.tone}) 14%, transparent), transparent 70%)`,
      }}
    >
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-1.5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            <span className="live-dot" />
            <span>{role.toUpperCase()} · WORKSPACE</span>
          </div>
          <h1 className="text-[24px] font-semibold tracking-tight text-foreground text-glow">{title}</h1>
          <p className="mt-1 max-w-2xl text-[12.5px] text-muted-foreground">{tagline}</p>
        </div>
        <div
          className="grid h-12 w-12 shrink-0 place-items-center rounded-xl"
          style={{
            background: `color-mix(in oklab, var(--${id.tone}) 25%, transparent)`,
            boxShadow: `0 0 ${12 + (pulse % 8)}px color-mix(in oklab, var(--${id.tone}) 40%, transparent)`,
          }}
        >
          <Icon className="h-5 w-5" style={{ color: `var(--${id.tone})` }} />
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, loading, accent }: { label: string; value: string; loading: boolean; accent: string }) {
  return (
    <div className="panel relative overflow-hidden p-3.5">
      <div
        className="absolute inset-x-0 top-0 h-0.5"
        style={{ background: `color-mix(in oklab, var(--${accent}) 70%, transparent)` }}
      />
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
      <div className="mt-1 text-[20px] font-semibold tabular-nums text-foreground">
        {loading ? <span className="inline-block h-5 w-16 animate-pulse rounded bg-surface-2" /> : value}
      </div>
    </div>
  );
}

function ActivityFeed({ items, loading }: { items: Array<any>; loading: boolean }) {
  if (loading && items.length === 0) {
    return (
      <div className="space-y-2 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 animate-pulse rounded bg-surface-2/50" />
        ))}
      </div>
    );
  }
  if (items.length === 0) {
    return <div className="p-6 text-center text-[12px] text-muted-foreground">No activity yet — actions will appear here.</div>;
  }
  return (
    <ul className="divide-y divide-border/60">
      {items.map((it) => (
        <li key={it.id} className="flex items-center gap-3 px-4 py-2.5 text-[12.5px]">
          <Activity className="h-3.5 w-3.5 shrink-0 text-primary" />
          <span className="font-medium text-foreground">{it.action}</span>
          {it.entity_type && (
            <span className="font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground">
              {it.entity_type}
            </span>
          )}
          <span className="ml-auto font-mono text-[10.5px] text-muted-foreground">
            {new Date(it.created_at).toLocaleString()}
          </span>
        </li>
      ))}
    </ul>
  );
}

function NotificationsPanel({ role }: { role: RoleSlug }) {
  // Derived static-by-role hints (placeholder until per-role inbox lands).
  const items: Record<RoleSlug, string[]> = {
    boss: ["Cross-tenant MRR up 4.2% WoW", "3 critical alerts cleared"],
    admin: ["Backup verified · 02:14 UTC", "2 RBAC changes pending review"],
    ceo: ["Q-board pack ready", "Forecast variance: -1.8%"],
    rm: ["5 new reseller applications", "3 deal-reg expirations < 48h"],
    reseller: ["You earned $420 in commissions", "Renewal due for ACME · 7 days"],
    franchise: ["New franchise inquiry · Pune", "Royalty statement ready"],
    sales: ["12 hot leads assigned to you", "Pipeline weighted: $148K"],
    support: ["4 high-priority tickets", "CSAT 4.8 · 30-day"],
    hr: ["3 leave requests pending", "Payroll cutoff in 2 days"],
    accountant: ["Reconciliation: 2 mismatches", "Invoices overdue: 6"],
    author: ["New sale · $39", "Review pending moderation"],
    customer: ["Your invoice is ready", "License renews in 14 days"],
    user: ["New marketplace drops", "Welcome bundle unlocked"],
    employee: ["Timesheet due Friday", "Team standup at 10:00"],
    manager: ["Team hit 92% of quota", "1-on-1 with Priya · 15:00"],
  };
  return (
    <ul className="space-y-1.5 p-3">
      {items[role].map((t, i) => (
        <li key={i} className="flex items-start gap-2 rounded-md border border-border/60 bg-surface-2/40 px-3 py-2 text-[12px] text-foreground">
          <Bell className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}
