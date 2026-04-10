import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ขอความช่วยเหลือ",
  description:
    "ช่องทางติดต่อขอความช่วยเหลือสำหรับแรงงานข้ามชาติในประเทศไทย สายด่วนฉุกเฉิน องค์กรที่ให้ความช่วยเหลือ Emergency contacts for migrant workers in Thailand",
  alternates: {
    canonical: "https://rfid-rights.vercel.app/help",
  },
  openGraph: {
    title: "ขอความช่วยเหลือ - รู้สิทธิ ติดกระเป๋า",
    description:
      "ช่องทางติดต่อขอความช่วยเหลือสำหรับแรงงานข้ามชาติในประเทศไทย",
    url: "https://rfid-rights.vercel.app/help",
  },
};

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
