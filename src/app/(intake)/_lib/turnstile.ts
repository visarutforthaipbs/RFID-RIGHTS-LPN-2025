"use client";

/**
 * Cloudflare Turnstile, loaded lazily with the plain script tag (no SDK).
 * Only mounted on the recorder step so the language/consent screens stay
 * free of third-party requests.
 *
 * Dev: NEXT_PUBLIC_TURNSTILE_SITE_KEY defaults to Cloudflare's always-pass
 * test key. If the script cannot load at all (offline dev box) we fall back
 * to the literal token "dev", which the intake API accepts only when
 * TURNSTILE_SECRET=dev (intake/docs/API.md). Never in production.
 */

export const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";

const IS_DEV = process.env.NODE_ENV !== "production";
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type TurnstileApi = {
  render: (
    el: HTMLElement,
    opts: {
      sitekey: string;
      callback: (token: string) => void;
      "error-callback"?: () => void;
      "expired-callback"?: () => void;
      appearance?: "always" | "execute" | "interaction-only";
      size?: "normal" | "compact" | "flexible";
      theme?: "light" | "dark" | "auto";
      language?: string;
    },
  ) => string;
  reset: (id?: string) => void;
  remove: (id?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<TurnstileApi | null> | null = null;

function loadScript(): Promise<TurnstileApi | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve(window.turnstile ?? null);
    s.onerror = () => resolve(null);
    document.head.appendChild(s);
  });
  return scriptPromise;
}

export type TurnstileHandle = {
  /** Resolves with a token, or null if none could be obtained in time. */
  getToken: () => Promise<string | null>;
  /** Ask for a fresh token (after a failed submit / expiry). */
  reset: () => void;
  destroy: () => void;
};

export function mountTurnstile(container: HTMLElement, lang: string): TurnstileHandle {
  let token: string | null = null;
  let widgetId: string | null = null;
  let scriptFailed = false;
  let waiters: ((t: string | null) => void)[] = [];
  let destroyed = false;

  const flush = () => {
    const w = waiters;
    waiters = [];
    w.forEach((fn) => fn(token));
  };

  loadScript().then((api) => {
    if (destroyed) return;
    if (!api) {
      scriptFailed = true;
      if (IS_DEV) token = "dev";
      flush();
      return;
    }
    try {
      widgetId = api.render(container, {
        sitekey: TURNSTILE_SITE_KEY,
        appearance: "interaction-only",
        size: "flexible",
        theme: "auto",
        language: lang === "my" ? "auto" : lang,
        callback: (t) => {
          token = t;
          flush();
        },
        "expired-callback": () => {
          token = null;
        },
        "error-callback": () => {
          if (IS_DEV) token = "dev";
          flush();
        },
      });
    } catch {
      scriptFailed = true;
      if (IS_DEV) token = "dev";
      flush();
    }
  });

  return {
    getToken: () =>
      new Promise<string | null>((resolve) => {
        if (token) return resolve(token);
        if (scriptFailed) return resolve(IS_DEV ? "dev" : null);
        const timer = setTimeout(() => {
          waiters = waiters.filter((w) => w !== done);
          resolve(IS_DEV ? "dev" : null);
        }, 10_000);
        const done = (t: string | null) => {
          clearTimeout(timer);
          resolve(t);
        };
        waiters.push(done);
      }),
    reset: () => {
      token = null;
      if (widgetId && window.turnstile) {
        try {
          window.turnstile.reset(widgetId);
        } catch {
          /* widget gone */
        }
      }
    },
    destroy: () => {
      destroyed = true;
      waiters = [];
      if (widgetId && window.turnstile) {
        try {
          window.turnstile.remove(widgetId);
        } catch {
          /* already removed */
        }
      }
    },
  };
}
