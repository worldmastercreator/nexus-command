import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Line, LineChart, Tooltip, XAxis, YAxis, RadialBar, RadialBarChart, CartesianGrid } from "recharts";
import { generateSeries } from "@/lib/data";

const TT = {
  contentStyle: {
    background: "var(--surface-2)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    fontSize: 11,
    color: "var(--foreground)",
  },
  labelStyle: { color: "var(--muted-foreground)" },
  cursor: { fill: "color-mix(in oklab, var(--primary) 8%, transparent)" },
} as const;

export function MiniArea({ data, color = "var(--primary)", h = 40 }: { data: { i: number; v: number }[]; color?: string; h?: number }) {
  return (
    <ResponsiveContainer width="100%" height={h}>
      <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`g-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.55} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} fill={`url(#g-${color})`} isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function MultiLine({ data, h = 240 }: { data: ReturnType<typeof generateSeries>; h?: number }) {
  return (
    <ResponsiveContainer width="100%" height={h}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="i" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
        <Tooltip {...TT} />
        <Line type="monotone" dataKey="v" stroke="var(--primary)" strokeWidth={1.8} dot={false} isAnimationActive={false} />
        <Line type="monotone" dataKey="v2" stroke="var(--ai)" strokeWidth={1.5} dot={false} isAnimationActive={false} />
        <Line type="monotone" dataKey="v3" stroke="var(--analytics)" strokeWidth={1.5} dot={false} isAnimationActive={false} strokeDasharray="3 3" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function StackedArea({ data, h = 240 }: { data: ReturnType<typeof generateSeries>; h?: number }) {
  return (
    <ResponsiveContainer width="100%" height={h}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.6} />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gb" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--ai)" stopOpacity={0.5} />
            <stop offset="100%" stopColor="var(--ai)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="i" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
        <Tooltip {...TT} />
        <Area type="monotone" dataKey="v" stackId="1" stroke="var(--primary)" fill="url(#ga)" isAnimationActive={false} />
        <Area type="monotone" dataKey="v2" stackId="1" stroke="var(--ai)" fill="url(#gb)" isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function Bars({ data, h = 200, color = "var(--primary)" }: { data: ReturnType<typeof generateSeries>; h?: number; color?: string }) {
  return (
    <ResponsiveContainer width="100%" height={h}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="i" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
        <Tooltip {...TT} />
        <Bar dataKey="v" fill={color} radius={[4, 4, 0, 0]} isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function Radial({ value, color = "var(--primary)", h = 140, label }: { value: number; color?: string; h?: number; label?: string }) {
  const data = [{ name: "x", value, fill: color }];
  return (
    <div className="relative" style={{ height: h }}>
      <ResponsiveContainer width="100%" height={h}>
        <RadialBarChart innerRadius="70%" outerRadius="100%" data={data} startAngle={90} endAngle={-270}>
          <RadialBar background={{ fill: "var(--surface)" }} dataKey="value" cornerRadius={8} isAnimationActive={false} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="text-[22px] font-semibold" style={{ color }}>{value}%</div>
          {label && <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>}
        </div>
      </div>
    </div>
  );
}
