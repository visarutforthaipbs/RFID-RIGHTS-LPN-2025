/**
 * Canonical origin for metadata, sitemap and JSON-LD.
 * Set NEXT_PUBLIC_SITE_URL on the host (e.g. https://guide.lpnfoundation.org)
 * once LPN confirms the domain; until then the Vercel URL stays the canonical.
 * (website/docs/RIGHT-GUIDE-REVIEW.md — canonical/OG/sitemap point at vercel.)
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://rfid-rights.vercel.app").replace(/\/$/, "");
