import { useEffect, useState } from "react";

export type EventChannel = "workflow" | "logs" | "crash";
export type EventSeverity = "info" | "success" | "warning" | "danger";

export interface BusEvent {
  id: string;
  ts: number;
  channel: EventChannel;
  severity: EventSeverity;
  source: string;
  message: string;
  meta?: Record<string, string | number>;
}

const WORKFLOWS = ["lead.crm.sync", "order.shopify.slack", "invoice.email", "ticket.escalate", "bi.snapshot", "bug.report"];
const LOG_SOURCES = ["edge-gw", "api-core", "auth-svc", "billing", "ai-router", "search-idx"];
const CRASH_SVCS = ["web-app", "ios-app", "android-app", "worker-node", "graphql-gw"];
const MESSAGES = {
  workflow: ["run completed in 240ms", "step retried (transient)", "fan-out 12 → 12 ok", "rate-limit hit, backing off", "failed: 502 upstream", "scheduled trigger fired"],
  logs: ["GET /v1/users 200", "POST /v1/charge 201", "cache miss → db hit", "JWT verify ok", "WARN payload truncated", "ERROR connection reset"],
  crash: ["TypeError: Cannot read 'id' of undefined", "UnhandledPromiseRejection at runtime", "OOM in worker (>512MB)", "fatal: native bridge timeout", "RangeError: maximum call stack"],
} as const;

const subs = new Set<(e: BusEvent) => void>();
const buffer: BusEvent[] = [];
const BUFFER_MAX = 200;

function rand<T>(a: readonly T[]) { return a[Math.floor(Math.random() * a.length)]; }

function synth(): BusEvent {
  const ch = (["workflow", "logs", "logs", "crash"] as EventChannel[])[Math.floor(Math.random() * 4)];
  const sev: EventSeverity = ch === "crash"
    ? (Math.random() < 0.7 ? "danger" : "warning")
    : (Math.random() < 0.04 ? "danger" : Math.random() < 0.15 ? "warning" : Math.random() < 0.5 ? "success" : "info");
  const src = ch === "workflow" ? rand(WORKFLOWS) : ch === "logs" ? rand(LOG_SOURCES) : rand(CRASH_SVCS);
  const message = rand(MESSAGES[ch]);
  return {
    id: `evt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    ts: Date.now(),
    channel: ch, severity: sev, source: src, message,
    meta: { latency_ms: Math.floor(40 + Math.random() * 400), region: rand(["us-east-1", "eu-west-1", "ap-south-1"] as const) },
  };
}

let timer: ReturnType<typeof setInterval> | null = null;
function ensureRunning() {
  if (timer || typeof window === "undefined") return;
  timer = setInterval(() => {
    const e = synth();
    buffer.push(e);
    if (buffer.length > BUFFER_MAX) buffer.shift();
    subs.forEach((fn) => fn(e));
  }, 900);
}

export function subscribe(fn: (e: BusEvent) => void) {
  ensureRunning();
  subs.add(fn);
  return () => { subs.delete(fn); };
}

export function getBuffer() { return [...buffer]; }

export function useEvents(filter?: (e: BusEvent) => boolean, max = 100) {
  const [events, setEvents] = useState<BusEvent[]>(() => getBuffer().filter(filter ?? (() => true)).slice(-max));
  useEffect(() => {
    return subscribe((e) => {
      if (filter && !filter(e)) return;
      setEvents((prev) => [...prev.slice(-(max - 1)), e]);
    });
  }, [filter, max]);
  return events;
}

export function exportCsv<T extends Record<string, unknown>>(rows: T[], filename: string) {
  if (typeof window === "undefined" || rows.length === 0) return;
  const cols = Object.keys(rows[0]);
  const csv = [cols.join(","), ...rows.map((r) => cols.map((c) => JSON.stringify(r[c] ?? "")).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
