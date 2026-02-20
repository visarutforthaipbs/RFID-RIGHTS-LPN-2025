import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ขอความช่วยเหลือ - รู้สิทธิ ติดกระเป๋า",
  description:
    "ช่องทางติดต่อขอความช่วยเหลือสำหรับแรงงานข้ามชาติในประเทศไทย สายด่วนฉุกเฉิน และองค์กรที่ให้ความช่วยเหลือ",
  openGraph: {
    title: "ขอความช่วยเหลือ - รู้สิทธิ ติดกระเป๋า",
    description:
      "ช่องทางติดต่อขอความช่วยเหลือสำหรับแรงงานข้ามชาติในประเทศไทย",
  },
};

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
