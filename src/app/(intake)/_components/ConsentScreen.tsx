"use client";

import { useEffect, useRef } from "react";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { EyeSlash } from "@phosphor-icons/react/dist/ssr/EyeSlash";
import { CONSENT_VERSION, t, type IntakeLang } from "../_lib/strings";

/**
 * Consent screen (PRD §6.5). The copy in strings.ts is a PLACEHOLDER draft
 * awaiting LPN review; CONSENT_VERSION is what gets sent as consent_version.
 */
export function ConsentScreen({
  lang,
  onAgree,
  onBack,
}: {
  lang: IntakeLang;
  onAgree: () => void;
  onBack: () => void;
}) {
  const s = t(lang);
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <>
      <span className="inline-ic t-small">
        <EyeSlash size={18} aria-hidden="true" />
        {s.recPrivacyNote}
      </span>
      <h1 ref={headingRef} tabIndex={-1} className="t-title">
        {s.consentTitle}
      </h1>
      <section className="card reading" aria-label={s.consentTitle}>
        <ol className="consent-list">
          {s.consentBody.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ol>
        <p style={{ marginTop: 16 }}>
          <span className="review-note" data-consent-version={CONSENT_VERSION}>
            {s.consentReviewNote}
          </span>
        </p>
      </section>
      <div className="btn-row">
        <button type="button" className="btn btn-primary btn-lg" onClick={onAgree} data-testid="consent-agree">
          {s.consentAgree}
        </button>
        <button type="button" className="btn btn-plain" onClick={onBack}>
          <ArrowLeft size={20} aria-hidden="true" />
          {s.consentBack}
        </button>
      </div>
    </>
  );
}
