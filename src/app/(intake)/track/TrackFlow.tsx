"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass";
import { Phone } from "@phosphor-icons/react/dist/ssr/Phone";
import { Warning } from "@phosphor-icons/react/dist/ssr/Warning";
import { Translate } from "@phosphor-icons/react/dist/ssr/Translate";
import { IntakeShell } from "../_components/IntakeShell";
import { LanguagePicker } from "../_components/LanguagePicker";
import { Stepper } from "../_components/Stepper";
import { useIntakeLang } from "../_lib/IntakeLangContext";
import { trackCode, type TrackResult } from "../_lib/api";
import { CODE_RE, HOTLINE_DISPLAY, HOTLINE_TEL, LANGS, formatCode, normaliseCode, t, type IntakeLang } from "../_lib/strings";

type View = "language" | "form";

export function TrackFlow() {
  const { lang, setLang } = useIntakeLang();
  const [view, setView] = useState<View>(lang ? "form" : "language");
  const [input, setInput] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<(TrackResult & { code: string }) | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (lang && view === "language") setView("form");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  useEffect(() => {
    if (view === "form" && !result) headingRef.current?.focus();
  }, [view, result]);

  useEffect(() => {
    if (result) resultRef.current?.focus();
  }, [result]);

  const pick = useCallback(
    (l: IntakeLang) => {
      setLang(l);
      setView("form");
    },
    [setLang],
  );

  const submit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!lang) return;
      const code = normaliseCode(input);
      if (!CODE_RE.test(code)) {
        setInvalid(true);
        inputRef.current?.focus();
        return;
      }
      setInvalid(false);
      setBusy(true);
      const r = await trackCode(code, lang);
      setBusy(false);
      setResult({ ...r, code });
    },
    [input, lang],
  );

  const reset = useCallback(() => {
    setResult(null);
    setInput("");
    setInvalid(false);
  }, []);

  const s = t(lang ?? "th");

  if (view === "language" || !lang) {
    return (
      <IntakeShell lang={lang} title={s.trackTitle} helpQuestion={s.helpBarTrack} center>
        <LanguagePicker current={lang} onPick={pick} />
      </IntakeShell>
    );
  }

  const langLabel = LANGS.find((l) => l.code === lang)?.label ?? lang;

  return (
    <IntakeShell lang={lang} title={s.trackTitle} helpQuestion={s.helpBarTrack}>
      <button type="button" className="btn btn-plain inline-ic t-small" onClick={() => setView("language")} style={{ minHeight: 44, alignSelf: "flex-start" }}>
        <Translate size={18} aria-hidden="true" />
        {langLabel} · {s.changeLanguage}
      </button>

      {!result && (
        <form onSubmit={submit} noValidate className="btn-row" aria-busy={busy}>
          <h1 ref={headingRef} tabIndex={-1} className="t-title">
            {s.trackTitle}
          </h1>
          <p className="t-small">{s.trackIntro}</p>
          <div className={`field${invalid ? " err" : ""}`}>
            <label htmlFor="track-code">{s.trackLabel}</label>
            <input
              id="track-code"
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                if (invalid) setInvalid(false);
              }}
              placeholder={s.trackPlaceholder}
              inputMode="text"
              autoComplete="off"
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
              maxLength={12}
              aria-invalid={invalid || undefined}
              aria-describedby="track-hint"
              data-testid="code-input"
            />
            <span id="track-hint" className="hint" role={invalid ? "alert" : undefined}>
              {invalid ? s.trackInvalid : s.trackPlaceholder}
            </span>
          </div>
          <button type="submit" className="btn btn-primary btn-lg" disabled={busy} data-testid="track-submit">
            <MagnifyingGlass size={22} aria-hidden="true" />
            {busy ? s.trackChecking : s.trackSubmit}
          </button>
          <p role="status" aria-live="polite" className="visually-hidden">
            {busy ? s.trackChecking : ""}
          </p>
        </form>
      )}

      {result && (
        <div ref={resultRef} tabIndex={-1} className="btn-row" role="region" aria-live="polite" data-testid="track-result">
          <p className="t-small">{s.trackLabel}</p>
          <div className="code" lang="en" style={{ fontSize: "2rem", padding: "12px" }}>
            {formatCode(result.code)}
          </div>

          {result.ok && (
            <>
              <Stepper lang={lang} stage={result.stage} serverLabel={result.label} />
              {result.updatedAt && (
                <p className="t-cap">
                  {s.trackUpdated}:{" "}
                  <time dateTime={result.updatedAt}>{new Date(result.updatedAt).toLocaleString(lang === "my" ? "my-MM" : lang === "km" ? "km-KH" : "th-TH")}</time>
                </p>
              )}
            </>
          )}

          {!result.ok && (
            <section className="card" aria-labelledby="track-err-h" data-testid={`track-${result.kind}`}>
              <h2 id="track-err-h" className="t-headline inline-ic">
                <Warning size={24} aria-hidden="true" />
                {result.kind === "not_found" ? s.trackNotFoundTitle : result.kind === "rate_limited" ? s.trackTryLater : s.trackError}
              </h2>
              {result.kind === "not_found" && (
                <p className="t-body" style={{ marginTop: 8 }}>
                  {s.trackNotFoundBody}
                </p>
              )}
              <a className="btn btn-secondary btn-lg" href={HOTLINE_TEL} style={{ marginTop: 16 }}>
                <Phone size={22} aria-hidden="true" />
                {s.callHotline} {HOTLINE_DISPLAY}
              </a>
            </section>
          )}

          <button type="button" className="btn btn-primary btn-lg" onClick={reset} data-testid="track-again">
            {result.ok ? s.done : s.trackAgain}
          </button>
        </div>
      )}
    </IntakeShell>
  );
}
