import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

/**
 * Worker-facing intake routes and the intake API must NEVER be cached by the
 * service worker (PRD v1.1 §6.4 — nothing persisted on the device). They are
 * NetworkOnly at runtime and their page chunks are excluded from the precache.
 */
const INTAKE_URL = (process.env.NEXT_PUBLIC_INTAKE_URL || "http://localhost:3100").replace(/\/$/, "");
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const intakeApiSource = `^${escapeRe(INTAKE_URL)}/`;

// Workbox serialises urlPattern functions with .toString(), so they must be
// self-contained: no closure variables. Build them with `new Function` so the
// intake host is inlined as a literal.
const intakePageMatcher = new Function(
  "ctx",
  "return ctx.sameOrigin && /\\/(voice-report|track)(\\/|\\?|$)/i.test(ctx.url.pathname);",
);
const intakeApiMatcher = new Function(
  "ctx",
  `return new RegExp(${JSON.stringify(intakeApiSource)}, "i").test(ctx.url.href) || /\\/api\\/(intake|track)(\\/|\\?|$)/i.test(ctx.url.pathname);`,
);

const networkOnlyIntake = [
  {
    urlPattern: intakePageMatcher,
    handler: "NetworkOnly",
    options: { cacheName: "intake-pages-never-cached" },
  },
  {
    urlPattern: intakeApiMatcher,
    handler: "NetworkOnly",
    options: { cacheName: "intake-api-never-cached" },
  },
  {
    // Cloudflare Turnstile must always hit the network.
    urlPattern: /^https:\/\/challenges\.cloudflare\.com\//i,
    handler: "NetworkOnly",
  },
];

// Only wrap with next-pwa in production to avoid
// "Webpack is configured while Turbopack is not" warning during dev
let config = nextConfig;
if (process.env.NODE_ENV !== "development") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const defaultRuntimeCaching = require("next-pwa/cache");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const withPWA = require("next-pwa")({
    dest: "public",
    register: true,
    skipWaiting: true,
    // Order matters: Workbox uses the first matching route.
    runtimeCaching: [...networkOnlyIntake, ...defaultRuntimeCaching],
    // Do not precache the intake route-group chunks or the intake pages.
    buildExcludes: [/\(intake\)/, /voice-report/, /\/track\//],
  });
  config = withPWA(nextConfig);
}

export default config;
