"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { INTAKE_STORAGE_PREFIX } from "@/app/components/QuickExitButton";
import { LANGS, type IntakeLang } from "./strings";

/**
 * Language for the intake pages. Independent of the guide's LanguageContext
 * (different codes: guide uses "mm", the intake API wants "my").
 * Kept in sessionStorage only so /voice-report and /track agree during one
 * visit; Quick Exit wipes it. Nothing else is ever stored.
 */
const KEY = `${INTAKE_STORAGE_PREFIX}-lang`;

type Ctx = {
  lang: IntakeLang | null; // null = not chosen yet
  setLang: (l: IntakeLang) => void;
  clearLang: () => void;
};

const IntakeLangContext = createContext<Ctx | undefined>(undefined);

export function IntakeLangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<IntakeLang | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(KEY);
      if (stored && LANGS.some((l) => l.code === stored)) setLangState(stored as IntakeLang);
    } catch {
      /* storage blocked */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang ?? "th";
  }, [lang]);

  const setLang = useCallback((l: IntakeLang) => {
    setLangState(l);
    try {
      sessionStorage.setItem(KEY, l);
    } catch {
      /* storage blocked */
    }
  }, []);

  const clearLang = useCallback(() => {
    setLangState(null);
    try {
      sessionStorage.removeItem(KEY);
    } catch {
      /* storage blocked */
    }
  }, []);

  return (
    <IntakeLangContext.Provider value={{ lang, setLang, clearLang }}>
      {/* avoid a flash of the picker before sessionStorage is read */}
      <div hidden={!ready} style={ready ? undefined : { display: "none" }}>
        {children}
      </div>
    </IntakeLangContext.Provider>
  );
}

export function useIntakeLang(): Ctx {
  const ctx = useContext(IntakeLangContext);
  if (!ctx) throw new Error("useIntakeLang must be used inside IntakeLangProvider");
  return ctx;
}
