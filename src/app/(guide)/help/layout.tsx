import type { Metadata } from "next";
import { SITE_URL } from "../../../../lib/site";

export const metadata: Metadata = {
  title: "ขอความช่วยเหลือ",
  description:
    "ช่องทางติดต่อขอความช่วยเหลือสำหรับแรงงานข้ามชาติในประเทศไทย สายด่วนฉุกเฉิน องค์กรที่ให้ความช่วยเหลือ Emergency contacts for migrant workers in Thailand",
  alternates: {
    canonical: `${SITE_URL}/help`,
  },
  openGraph: {
    title: "ขอความช่วยเหลือ - รู้สิทธิ ติดกระเป๋า",
    description:
      "ช่องทางติดต่อขอความช่วยเหลือสำหรับแรงงานข้ามชาติในประเทศไทย",
    url: `${SITE_URL}/help`,
  },
};

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
