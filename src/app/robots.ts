import type { MetadataRoute } from "next";
import { SITE_URL } from "../../lib/site";

// Generated from SITE_URL so the sitemap line follows the canonical host
// (guide.lpnfoundation.org) instead of a hard-coded domain.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/settings", "/voice-report", "/track"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
