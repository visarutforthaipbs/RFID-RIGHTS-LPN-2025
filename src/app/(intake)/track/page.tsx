import type { Metadata } from "next";
import { TrackFlow } from "./TrackFlow";

export const metadata: Metadata = {
  title: "ติดตามเรื่อง | รู้สิทธิ ติดกระเป๋า",
  robots: { index: false, follow: false },
};

export default function TrackPage() {
  return <TrackFlow />;
}
