import type { Metadata } from "next";
import { SITE_URL } from "../../../../lib/site";

export const metadata: Metadata = {
  title: "คู่มือดูแลตัวเอง",
  description:
    "รวมหัวข้อสิทธิแรงงานข้ามชาติทั้งหมด ค้นหาสิทธิของคุณ กฎหมาย และวิธีช่วยตัวเอง All migrant worker rights topics guide",
  alternates: {
    canonical: `${SITE_URL}/topics`,
  },
  openGraph: {
    title: "คู่มือดูแลตัวเอง - รู้สิทธิ ติดกระเป๋า",
    description:
      "รวมหัวข้อสิทธิแรงงานข้ามชาติทั้งหมด ค้นหาสิทธิของคุณ กฎหมาย และวิธีช่วยตัวเอง",
    url: `${SITE_URL}/topics`,
  },
};

export default function TopicsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
