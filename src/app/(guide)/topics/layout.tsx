import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "คู่มือดูแลตัวเอง",
  description:
    "รวมหัวข้อสิทธิแรงงานข้ามชาติทั้งหมด ค้นหาสิทธิของคุณ กฎหมาย และวิธีช่วยตัวเอง All migrant worker rights topics guide",
  alternates: {
    canonical: "https://rfid-rights.vercel.app/topics",
  },
  openGraph: {
    title: "คู่มือดูแลตัวเอง - รู้สิทธิ ติดกระเป๋า",
    description:
      "รวมหัวข้อสิทธิแรงงานข้ามชาติทั้งหมด ค้นหาสิทธิของคุณ กฎหมาย และวิธีช่วยตัวเอง",
    url: "https://rfid-rights.vercel.app/topics",
  },
};

export default function TopicsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
