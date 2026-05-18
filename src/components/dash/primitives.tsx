import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function PageHeader({
  eyebrow, title, subtitle, actions,
}: { eyebrow?: string; title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
      <div>
        {eyebrow && (
          <div className="mb-2 flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
            <span className="live-dot" />
            <span>{eyebrow}</span>
          </div>
        )}
        <h1 className="text-[26px] font-semibold tracking-tight text-foreground text-glow">{title}</h1>
        {subtitle && <p className="mt-1 max-w-2xl text-[13px] text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({
  title, kicker, action, children, className, padded = true,
}: {
  title?: string; kicker?: string; action?: ReactNode; children: ReactNode;
  className?: string; padded?: boolean;
}) {
  return (
    <section className={cn("panel relative overflow-hidden", className)}>
      {(title || kicker || action) && (
        <header className="flex items-center justify-between gap-3 border-b border-border/70 px-4 py-3">
          <div className="min-w-0">
            {kicker && (
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{kicker}</div>
            )}
            {title && <h3 className="truncate text-[13px] font-semibold text-foreground">{title}</h3>}
          </div>
          {action}
        </header>
      )}
      <div className={padded ? "p-4" : ""}>{children}</div>
    </section>
  );
}

export function Metric({
  label, value, delta, tone = "primary", spark,
}: {
  label: string; value: string; delta?: string;
  tone?: "primary" | "success" | "warning" | "danger" | "ai" | "market" | "info";
  spark?: ReactNode;
}) {
  const toneText = {
    primary: "text-primary", success: "text-success", warning: "text-warning",
    danger: "text-danger", ai: "text-ai", market: "text-market", info: "text-info",
  }[tone];
  return (
    <div className="panel relative overflow-hidden p-4">
      <div className="flex items-center justify-between font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
        <span>{label}</span>
        <span className="hud-corners h-4 w-4" />
      </div>
      <div className="mt-2 flex items-end justify-between gap-2">
        <div className={cn("text-[26px] font-semibold tracking-tight", toneText)}>{value}</div>
        {delta && <div className="text-[11px] text-muted-foreground">{delta}</div>}
      </div>
      {spark && <div className="mt-2 h-10">{spark}</div>}
    </div>
  );
}

export function StatusDot({ tone = "success" }: { tone?: "success" | "warning" | "danger" }) {
  return <span className={cn("live-dot", tone === "warning" && "warn", tone === "danger" && "danger")} />;
}
