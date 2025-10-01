/**
 * Privacy-first analytics for migrant rights site
 * Supports Plausible with custom events and RFID hash tracking
 */

declare global {
  interface Window {
    plausible?: (
      event: string,
      options?: { props?: Record<string, string | number> }
    ) => void;
  }
}

export type AnalyticsEvent =
  | { type: "topic_view"; slug: string }
  | { type: "search"; q_len: number; results_count: number }
  | { type: "rfid_visit"; uid_hash: string }
  | { type: "sos_contact"; method: "call" | "line" | "form" }
  | { type: "pwa_install"; source: "button" | "browser" };

export function trackEvent(event: AnalyticsEvent) {
  // Only track if analytics is enabled and available
  if (typeof window !== "undefined" && window.plausible) {
    try {
      switch (event.type) {
        case "topic_view":
          window.plausible("Topic View", { props: { slug: event.slug } });
          break;
        case "search":
          window.plausible("Search", {
            props: {
              query_length: event.q_len,
              results: event.results_count,
            },
          });
          break;
        case "rfid_visit":
          window.plausible("RFID Visit", {
            props: { uid_hash: event.uid_hash },
          });
          break;
        case "sos_contact":
          window.plausible("SOS Contact", { props: { method: event.method } });
          break;
        case "pwa_install":
          window.plausible("PWA Install", { props: { source: event.source } });
          break;
      }
    } catch (error) {
      console.warn("Analytics tracking error:", error);
    }
  }
}
