import { Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CommandPalette } from "./CommandPalette";

export function Shell() {
  const [collapsed, setCollapsed] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenCommand={() => setCmdOpen(true)} />
        {/* Ticker */}
        <div className="ticker-mask relative h-7 overflow-hidden border-b border-border bg-surface/60">
          <div className="animate-ticker flex w-max items-center gap-8 whitespace-nowrap px-4 py-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            {Array.from({ length: 2 }).map((_, k) => (
              <TickerRow key={k} />
            ))}
          </div>
        </div>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
    </div>
  );
}

function TickerRow() {
  const items = [
    ["BTC", "$67,241", "success"],
    ["AWS us-east-1", "OPERATIONAL", "success"],
    ["Stripe charge auth", "1.4M /h", "info"],
    ["Threat radar", "0 active", "success"],
    ["GPU pool", "78% util", "warning"],
    ["EU-WEST latency", "12ms", "info"],
    ["NEW INCIDENT", "DB-7 replica lag", "warning"],
    ["AI tokens", "94.2M today", "ai"],
    ["Affiliate signups", "+142", "success"],
    ["Marketplace GMV", "$1.82M", "market"],
  ] as const;
  return (
    <>
      {items.map(([k, v, tone], i) => (
        <span key={`${k}-${i}`} className="flex items-center gap-2">
          <span className={`live-dot ${tone === "warning" ? "warn" : tone === "danger" ? "danger" : ""}`} />
          <span className="text-foreground/80">{k}</span>
          <span>{v}</span>
          <span className="text-border">/</span>
        </span>
      ))}
    </>
  );
}
