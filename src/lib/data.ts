import { useEffect, useState } from "react";

// Deterministic seeded RNG for stable SSR/CSR
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateSeries(n: number, seed = 1, base = 50, vol = 18) {
  const r = mulberry32(seed);
  const arr: { i: number; v: number; v2: number; v3: number }[] = [];
  let v = base, v2 = base * 0.7, v3 = base * 1.2;
  for (let i = 0; i < n; i++) {
    v = Math.max(2, v + (r() - 0.5) * vol);
    v2 = Math.max(2, v2 + (r() - 0.5) * vol * 0.7);
    v3 = Math.max(2, v3 + (r() - 0.5) * vol * 1.3);
    arr.push({ i, v: Math.round(v), v2: Math.round(v2), v3: Math.round(v3) });
  }
  return arr;
}

// Live data hook — adds gentle jitter every interval, but starts deterministic
export function useLiveSeries(n: number, seed = 1, base = 50, vol = 18, ms = 1800) {
  const [data, setData] = useState(() => generateSeries(n, seed, base, vol));
  useEffect(() => {
    const t = setInterval(() => {
      setData((prev) => {
        const last = prev[prev.length - 1];
        const next = {
          i: last.i + 1,
          v: Math.max(2, last.v + (Math.random() - 0.5) * vol),
          v2: Math.max(2, last.v2 + (Math.random() - 0.5) * vol * 0.7),
          v3: Math.max(2, last.v3 + (Math.random() - 0.5) * vol * 1.3),
        };
        return [...prev.slice(1), next];
      });
    }, ms);
    return () => clearInterval(t);
  }, [vol, ms]);
  return data;
}

export function useTicker(start = 0, step = 1, ms = 1200) {
  const [v, setV] = useState(start);
  useEffect(() => {
    const t = setInterval(() => setV((x) => x + step), ms);
    return () => clearInterval(t);
  }, [step, ms]);
  return v;
}
