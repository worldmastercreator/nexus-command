import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity, Users, ShieldCheck, FileCheck2, Map, Award, Briefcase,
  GraduationCap, BadgeDollarSign, KeyRound, RefreshCw, ShoppingCart,
  HeartHandshake, AlertTriangle, MessageSquare, FileText, FolderKanban,
  Sparkles, Building2, Network, Wallet, ShieldAlert, Settings, Crown,
  LayoutDashboard, UserPlus, Headphones, Store, MapPin, ScrollText,
} from "lucide-react";

type Item = { to: string; label: string; icon: React.ComponentType<{ className?: string }>; tone?: string };
type Group = { label: string; items: Item[] };

const GROUPS: Group[] = [
  {
    label: "Command",
    items: [
      { to: "/rm/command", label: "Command Center", icon: LayoutDashboard, tone: "primary" },
      { to: "/rm/ai-command", label: "AI Command", icon: Sparkles, tone: "ai" },
      { to: "/rm/boss-panel", label: "Boss Panel", icon: Crown, tone: "warning" },
      { to: "/rm/heatmap", label: "Heatmap", icon: Map },
    ],
  },
  {
    label: "Pipeline",
    items: [
      { to: "/rm/applications", label: "Applications", icon: UserPlus },
      { to: "/rm/approvals", label: "Approvals", icon: ShieldCheck, tone: "success" },
      { to: "/rm/recruitment", label: "Recruitment", icon: Users },
      { to: "/rm/directory", label: "Directory", icon: FolderKanban },
    ],
  },
  {
    label: "Revenue",
    items: [
      { to: "/rm/deal-registration", label: "Deal Registration", icon: FileCheck2, tone: "primary" },
      { to: "/rm/crm", label: "CRM", icon: HeartHandshake },
      { to: "/rm/orders", label: "Orders", icon: ShoppingCart },
      { to: "/rm/customers", label: "Customers", icon: Building2 },
      { to: "/rm/renewals", label: "Renewals", icon: RefreshCw, tone: "warning" },
      { to: "/rm/commissions", label: "Commissions", icon: BadgeDollarSign, tone: "success" },
    ],
  },
  {
    label: "Operations",
    items: [
      { to: "/rm/territory", label: "Territory", icon: MapPin },
      { to: "/rm/licenses", label: "Licenses", icon: KeyRound },
      { to: "/rm/license-gate", label: "License Gate", icon: ShieldAlert },
      { to: "/rm/marketplace", label: "Marketplace", icon: Store },
      { to: "/rm/sub-resellers", label: "Sub-Resellers", icon: Network },
    ],
  },
  {
    label: "People & Risk",
    items: [
      { to: "/rm/performance", label: "Performance", icon: Activity },
      { to: "/rm/training", label: "Training", icon: GraduationCap },
      { to: "/rm/hrms", label: "HRMS", icon: Briefcase },
      { to: "/rm/risk", label: "Risk", icon: AlertTriangle, tone: "danger" },
      { to: "/rm/finance", label: "Finance", icon: Wallet },
    ],
  },
  {
    label: "Support",
    items: [
      { to: "/rm/support", label: "Support", icon: Headphones },
      { to: "/rm/communications", label: "Communications", icon: MessageSquare },
      { to: "/rm/documents", label: "Documents", icon: FileText },
      { to: "/rm/profile", label: "Profile", icon: ScrollText },
      { to: "/rm/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function RMSidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 border-r border-border bg-surface/40 lg:block">
      <div className="flex h-12 items-center gap-2 border-b border-border px-3">
        <Award className="h-4 w-4 text-primary" />
        <div className="font-mono text-[11px] uppercase tracking-wider text-foreground">Reseller Manager</div>
      </div>
      <nav className="h-[calc(100vh-3rem)] overflow-y-auto px-2 py-3">
        {GROUPS.map((g) => (
          <div key={g.label} className="mb-4">
            <div className="px-2 pb-1 font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground/70">
              {g.label}
            </div>
            <ul className="space-y-0.5">
              {g.items.map((it) => {
                const active = path === it.to;
                const Icon = it.icon;
                return (
                  <li key={it.to}>
                    <Link
                      to={it.to}
                      className={`group flex items-center gap-2 rounded-md px-2 py-1.5 text-[12px] transition-colors ${
                        active
                          ? "bg-primary/10 text-foreground"
                          : "text-muted-foreground hover:bg-surface-2/60 hover:text-foreground"
                      }`}
                    >
                      <Icon
                        className={`h-3.5 w-3.5 ${
                          active
                            ? `text-${it.tone ?? "primary"}`
                            : "text-muted-foreground group-hover:text-foreground"
                        }`}
                      />
                      <span className="truncate">{it.label}</span>
                      {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
