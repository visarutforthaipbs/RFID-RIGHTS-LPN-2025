"use client";

import { useEffect, useRef } from "react";
import { NotePencil } from "@phosphor-icons/react/dist/ssr/NotePencil";
import { Stepper } from "./Stepper";
import { formatCode, t, type IntakeLang } from "../_lib/strings";

/**
 * Full-screen tracking code after a successful upload (guideline §09 mockup 2).
 * The code lives only in React state — never in storage. "Done" clears it.
 */
export function CodeScreen({ lang, code, onDone }: { lang: IntakeLang; code: string; onDone: () => void }) {
  const s = t(lang);
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <>
      <span className="badge b-ok" style={{ alignSelf: "flex-start" }}>
        {s.successBadge}
      </span>
      <h1 ref={headingRef} tabIndex={-1} className="t-headline" style={{ textAlign: "left", alignSelf: "stretch" }}>
        {s.successTitle}
      </h1>
      <div className="code" lang="en" aria-label={`${s.trackLabel} ${formatCode(code).split("").join(" ")}`} data-testid="code">
        {formatCode(code)}
      </div>
      <p className="inline-ic t-body t-strong" style={{ textAlign: "left", alignSelf: "stretch" }}>
        <NotePencil size={22} aria-hidden="true" style={{ flex: "none" }} />
        <span>{s.successWriteDown}</span>
      </p>
      <Stepper lang={lang} stage="received" />
      <p className="t-cap" style={{ textAlign: "left", alignSelf: "stretch" }}>
        {s.successTrackHint} · {s.successNotSaved}
      </p>
      <button type="button" className="btn btn-primary btn-lg" onClick={onDone} data-testid="done">
        {s.done}
      </button>
    </>
  );
}
