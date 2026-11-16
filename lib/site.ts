/**
 * Canonical origin for metadata, sitemap and JSON-LD.
 * Production host: https://guide.lpnfoundation.org (owner decision 2026-11-16;
 * www.lpnrightguide.site 308-redirects here). NEXT_PUBLIC_SITE_URL overrides.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://guide.lpnfoundation.org").replace(/\/$/, "");
