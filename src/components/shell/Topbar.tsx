import { Bell, Command, Search, Globe2, Activity } from "lucide-react";
import { useEffect, useState } from "react";

export function Topbar({ onOpenCommand }: { onOpenCommand: () => void }) {
  const [time, setTime] = useState<Date | null>(null);
  useEffect(() => {
    setTime(new Date());
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl">
      <button
        onClick={onOpenCommand}
        className="group flex h-9 w-[360px] items-center gap-2 rounded-lg border border-border bg-surface-2/60 px-3 text-left text-[12.5px] text-muted-foreground transition hover:border-primary/40 hover:bg-surface-2"
      >
        <Search className="h-3.5 w-3.5" />
        <span>Search modules, commands, alerts…</span>
        <span className="ml-auto flex items-center gap-1 rounded border border-border px-1.5 py-0.5 font-mono text-[10px]">
          <Command className="h-3 w-3" />K
        </span>
      </button>

      <div className="ml-2 hidden items-center gap-4 md:flex">
        <Pill icon={Activity} label="LAT" value="38ms" tone="success" />
        <Pill icon={Globe2} label="REGION" value="ALL · 12" tone="info" />
        <Pill label="INCIDENTS" value="2" tone="warning" />
        <Pill label="THREATS" value="0" tone="danger" inactive />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="hidden font-mono text-[11px] text-muted-foreground lg:block">
          {time.toUTCString().slice(17, 25)} UTC · {time.toLocaleDateString(undefined, { weekday: "short", day: "2-digit", month: "short" })}
        </div>
        <button className="relative grid h-9 w-9 place-items-center rounded-lg border border-border bg-surface-2/60 hover:bg-surface-2">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-warning shadow-[0_0_8px_var(--warning)]" />
        </button>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-2/60 px-2 py-1">
          <div className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-primary to-ai text-[11px] font-semibold">ZK</div>
          <div className="hidden flex-col leading-tight md:flex">
            <span className="text-[12px] font-medium">Zaheer Khan</span>
            <span className="font-mono text-[10px] text-muted-foreground">root · clearance 7</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function Pill({
  icon: Icon, label, value, tone, inactive,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  label: string; value: string; tone: "success" | "info" | "warning" | "danger";
  inactive?: boolean;
}) {
  const toneClass = {
    success: "text-success",
    info: "text-info",
    warning: "text-warning",
    danger: "text-danger",
  }[tone];
  return (
    <div className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground">
      {Icon && <Icon className={`h-3 w-3 ${toneClass}`} />}
      <span>{label}</span>
      <span className={inactive ? "text-muted-foreground" : toneClass}>{value}</span>
    </div>
  );
}
