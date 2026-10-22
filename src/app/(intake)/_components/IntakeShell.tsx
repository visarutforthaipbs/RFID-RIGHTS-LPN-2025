"use client";

import type { ReactNode } from "react";
import { Phone } from "@phosphor-icons/react/dist/ssr/Phone";
import { QuickExitButton } from "@/app/components/QuickExitButton";
import { HOTLINE_DISPLAY, HOTLINE_TEL, t, type IntakeLang } from "../_lib/strings";

/**
 * Top bar (mark + title + Quick Exit) and bottom help bar (hotline) shared by
 * /voice-report and /track — mirrors the two phone mockups in
 * brand/guideline.html §09. No photos, no brackets, no analytics.
 */
export function IntakeShell({
  lang,
  title,
  children,
  center = false,
  helpQuestion,
  mainRef,
}: {
  lang: IntakeLang | null;
  title: string;
  children: ReactNode;
  center?: boolean;
  helpQuestion?: string;
  mainRef?: React.Ref<HTMLElement>;
}) {
  const s = t(lang ?? "th");
  return (
    <div className="intake-shell">
      <header className="intake-bar">
        <div className="brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/favicon-new.svg" alt="" width={30} height={30} />
          <b>{title}</b>
        </div>
        <QuickExitButton label={s.quickExit} ariaLabel={s.quickExitAria} />
      </header>

      <main
        id="main-content"
        ref={mainRef}
        className={`intake-main${center ? " center" : ""}`}
        tabIndex={-1}
      >
        {children}
      </main>

      <footer className="intake-helpbar">
        <b>{helpQuestion ?? s.helpBarQuestion}</b>
        <a className="btn btn-inverse" href={HOTLINE_TEL} aria-label={`${s.callHotline} ${HOTLINE_DISPLAY}`}>
          <Phone size={20} aria-hidden="true" />
          <span>{HOTLINE_DISPLAY}</span>
        </a>
      </footer>
    </div>
  );
}
