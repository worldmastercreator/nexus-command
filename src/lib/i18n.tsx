import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, Globe2, Languages } from "lucide-react";
import {
  dictionaryQueryOptions,
  languageCoverageQueryOptions,
  type Dictionary,
  type LanguageCoverage,
} from "@/lib/i18n.functions";

const STORAGE_KEY = "vala.lang";
const DEFAULT_LANG = "en";

type I18nCtx = {
  lang: string;
  rtl: boolean;
  dict: Dictionary;
  setLang: (code: string) => void;
  coverage: LanguageCoverage[];
  ready: boolean;
};

const Ctx = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<string>(DEFAULT_LANG);

  // Hydrate from localStorage after mount (avoid SSR mismatch).
  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (stored) setLangState(stored);
  }, []);

  const coverageQ = useQuery(languageCoverageQueryOptions());
  const dictQ = useQuery(dictionaryQueryOptions(lang));

  // Honest mode: if the chosen language isn't 100%, fall back to English.
  const coverage = coverageQ.data ?? [];
  const chosen = coverage.find((l) => l.code === lang);
  const effectiveLang = chosen?.is_ready ? lang : DEFAULT_LANG;

  const effectiveDictQ = useQuery({
    ...dictionaryQueryOptions(effectiveLang),
    enabled: effectiveLang !== lang || !dictQ.data,
  });

  const active = effectiveLang === lang ? dictQ.data : effectiveDictQ.data;

  // Apply <html lang/dir> for RTL languages.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = effectiveLang;
    document.documentElement.dir = active?.rtl ? "rtl" : "ltr";
  }, [effectiveLang, active?.rtl]);

  const value = useMemo<I18nCtx>(
    () => ({
      lang: effectiveLang,
      rtl: active?.rtl ?? false,
      dict: active?.dict ?? {},
      setLang: (code) => {
        setLangState(code);
        try {
          window.localStorage.setItem(STORAGE_KEY, code);
        } catch {}
      },
      coverage,
      ready: !!active,
    }),
    [effectiveLang, active, coverage],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useI18n must be used within <I18nProvider>");
  return v;
}

/** Translate helper. Falls back to the key itself if missing. */
export function useT() {
  const { dict } = useI18n();
  return (key: string, fallback?: string) => dict[key] ?? fallback ?? key;
}

/** Picker: shows only languages at 100% coverage (honest mode). */
export function LanguagePicker() {
  const { lang, setLang, coverage } = useI18n();
  const [open, setOpen] = useState(false);
  const ready = coverage.filter((l) => l.is_ready);
  const current = coverage.find((l) => l.code === lang);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 items-center gap-2 rounded-lg border border-border bg-surface-2/60 px-2.5 text-[12px] font-mono uppercase tracking-wider text-muted-foreground hover:bg-surface-2"
        aria-label="Language"
      >
        <Globe2 className="h-3.5 w-3.5" />
        <span className="text-foreground">{current?.code.toUpperCase() ?? "EN"}</span>
      </button>
      {open && (
        <>
          <button className="fixed inset-0 z-40 cursor-default" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute right-0 top-11 z-50 w-72 animate-fade-in rounded-lg border border-border bg-background/95 p-1 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-2 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              <Languages className="h-3 w-3" />
              <span>Language · {ready.length} ready</span>
            </div>
            <ul className="max-h-80 overflow-y-auto">
              {ready.map((l) => (
                <li key={l.code}>
                  <button
                    onClick={() => {
                      setLang(l.code);
                      setOpen(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-[12.5px] hover:bg-surface-2"
                  >
                    <span className="font-mono text-[10.5px] w-8 text-muted-foreground">{l.code.toUpperCase()}</span>
                    <span className="flex-1">
                      <div className="text-foreground">{l.native_name}</div>
                      <div className="text-[10.5px] text-muted-foreground">{l.name}</div>
                    </span>
                    {l.code === lang && <Check className="h-3.5 w-3.5 text-success" />}
                  </button>
                </li>
              ))}
            </ul>
            <div className="border-t border-border/60 px-3 py-2 text-[10.5px] text-muted-foreground">
              Honest mode · only 100%-translated languages are shown.{" "}
              <a href="/i18n" className="text-primary hover:underline">
                Coverage
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
