import type { Metadata } from "next";
import { VoiceReportFlow } from "./VoiceReportFlow";

export const metadata: Metadata = {
  title: "ส่งเสียงเล่าเรื่อง | รู้สิทธิ ติดกระเป๋า",
  robots: { index: false, follow: false },
};

export default function VoiceReportPage() {
  return <VoiceReportFlow />;
}
