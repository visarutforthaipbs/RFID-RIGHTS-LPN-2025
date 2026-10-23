"use client";

import { useEffect, useRef } from "react";
import { Translate } from "@phosphor-icons/react/dist/ssr/Translate";
import { Check } from "@phosphor-icons/react/dist/ssr/Check";
import { LANGS, t, type IntakeLang } from "../_lib/strings";

export function LanguagePicker({
  current,
  onPick,
}: {
  current: IntakeLang | null;
  onPick: (l: IntakeLang) => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  // Heading is shown in every offered language so a first-time user can find theirs.
  return (
    <>
      <span className="inline-ic t-small" aria-hidden="true">
        <Translate size={18} />
        {LANGS.map((l) => t(l.code).chooseLanguage).join(" · ")}
      </span>
      <h1 ref={headingRef} tabIndex={-1} className="t-title">
        {t(current ?? "th").chooseLanguage}
      </h1>
      <div className="lang-list" role="group" aria-label={t(current ?? "th").chooseLanguage}>
        {LANGS.map((l) => (
          <button
            key={l.code}
            type="button"
            lang={l.code}
            className="lang-btn"
            aria-pressed={current === l.code}
            onClick={() => onPick(l.code)}
            data-testid={`lang-${l.code}`}
          >
            <span>{l.label}</span>
            {current === l.code ? <Check size={24} weight="bold" aria-hidden="true" /> : <span className="native">{l.native}</span>}
          </button>
        ))}
      </div>
      <p className="t-cap" lang="th">
        {t("th").chooseLanguageHint}
      </p>
    </>
  );
}
