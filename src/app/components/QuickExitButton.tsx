"use client";

import { useCallback, useEffect } from "react";
import { SignOut } from "@phosphor-icons/react/dist/ssr/SignOut";

/**
 * Quick Exit — PRD v1.1 §6.4. Fixed top-right on every worker-facing page.
 * Click or Escape: run registered cleanups (stop MediaRecorder + tracks,
 * drop blobs), clear sessionStorage, remove intake keys from localStorage
 * (the guide's own "locale" key is kept), then replace the page with Google
 * so Back does not return here.
 */

type Cleanup = () => void;
const cleanups = new Set<Cleanup>();

/** Register work to run before leaving (recorder stop, blob drop…). Returns an unregister fn. */
export function registerQuickExitCleanup(fn: Cleanup): () => void {
  cleanups.add(fn);
  return () => {
    cleanups.delete(fn);
  };
}

/** Prefix used by every intake key we ever put in storage. */
export const INTAKE_STORAGE_PREFIX = "lpn-intake";

export function quickExit(): void {
  for (const fn of Array.from(cleanups)) {
    try {
      fn();
    } catch {
      /* keep going — leaving is the priority */
    }
  }
  cleanups.clear();
  try {
    sessionStorage.clear();
  } catch {
    /* storage blocked */
  }
  try {
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith(INTAKE_STORAGE_PREFIX)) localStorage.removeItem(key);
    }
  } catch {
    /* storage blocked */
  }
  window.location.replace("https://www.google.com");
}

export function QuickExitButton({
  label,
  ariaLabel,
  className = "",
}: {
  label: string;
  ariaLabel?: string;
  className?: string;
}) {
  const onExit = useCallback(() => quickExit(), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        quickExit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <button
      type="button"
      onClick={onExit}
      aria-label={ariaLabel ?? label}
      title={ariaLabel ?? label}
      className={`quick-exit ${className}`.trim()}
      data-testid="quick-exit"
    >
      <SignOut size={20} weight="regular" aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}

export default QuickExitButton;
