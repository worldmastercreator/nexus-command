import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ShieldCheck, UserCog, Eye, Lock } from "lucide-react";

export type Role = "admin" | "operator" | "auditor";

// permission → roles allowed
const MATRIX: Record<string, Role[]> = {
  "webhook.retry": ["admin", "operator"],
  "webhook.delete": ["admin"],
  "ai.publish": ["admin"],
  "ai.rollback": ["admin", "operator"],
  "incident.ack": ["admin", "operator"],
  "incident.resolve": ["admin"],
  "workflow.replay": ["admin", "operator"],
  "logs.export": ["admin", "operator", "auditor"],
  "crashes.assign": ["admin", "operator"],
};

const Ctx = createContext<{ role: Role; setRole: (r: Role) => void; can: (p: string) => boolean } | null>(null);

const KEY = "aegis_role";

export function RbacProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>("admin");
  useEffect(() => {
    const r = (typeof localStorage !== "undefined" && localStorage.getItem(KEY)) as Role | null;
    if (r === "admin" || r === "operator" || r === "auditor") setRoleState(r);
  }, []);
  const setRole = useCallback((r: Role) => {
    setRoleState(r);
    try { localStorage.setItem(KEY, r); } catch { /* ignore */ }
  }, []);
  const can = useCallback((p: string) => (MATRIX[p] ?? ["admin"]).includes(role), [role]);
  const value = useMemo(() => ({ role, setRole, can }), [role, setRole, can]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useRbac() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useRbac outside provider");
  return v;
}

export const ROLE_META: Record<Role, { label: string; icon: typeof ShieldCheck; tone: string }> = {
  admin: { label: "ADMIN", icon: ShieldCheck, tone: "text-danger" },
  operator: { label: "OPERATOR", icon: UserCog, tone: "text-primary" },
  auditor: { label: "AUDITOR", icon: Eye, tone: "text-info" },
};

export function RoleSwitcher() {
  const { role, setRole } = useRbac();
  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-surface-2/60 p-0.5 font-mono text-[10px] uppercase tracking-wider">
      {(Object.keys(ROLE_META) as Role[]).map((r) => {
        const M = ROLE_META[r];
        const active = role === r;
        return (
          <button key={r} onClick={() => setRole(r)}
            className={`flex items-center gap-1 rounded px-1.5 py-1 transition ${active ? `bg-surface-3 ${M.tone}` : "text-muted-foreground hover:text-foreground"}`}>
            <M.icon className="h-3 w-3" />{M.label}
          </button>
        );
      })}
    </div>
  );
}

export function Gated({ perm, children, fallback, label }: { perm: string; children: ReactNode; fallback?: ReactNode; label?: string }) {
  const { can } = useRbac();
  if (can(perm)) return <>{children}</>;
  if (fallback) return <>{fallback}</>;
  return (
    <span className="inline-flex cursor-not-allowed items-center gap-1 rounded border border-border bg-surface-2/40 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground opacity-60" title={`Requires permission: ${perm}`}>
      <Lock className="h-3 w-3" />{label ?? "Locked"}
    </span>
  );
}
