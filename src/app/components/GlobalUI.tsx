"use client";

import { BackToTop } from "./BackToTop";
import { RouteProgress } from "./RouteProgress";

export function GlobalUI() {
  return (
    <>
      <RouteProgress />
      <BackToTop />
    </>
  );
}
