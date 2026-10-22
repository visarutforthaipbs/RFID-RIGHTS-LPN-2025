import { notFound } from "next/navigation";

/**
 * Catch-all for unmatched URLs. The app has two root layouts ((guide) and
 * (intake)), so a top-level not-found.tsx cannot render; this route sends every
 * unknown path to (guide)/not-found.tsx inside the guide layout — exactly what
 * the single root layout did before the split (same 404 status, same UI).
 */
export default function CatchAllNotFound() {
  notFound();
}
