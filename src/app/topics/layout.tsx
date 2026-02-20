import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "คู่มือดูแลตัวเอง - รู้สิทธิ ติดกระเป๋า",
  description:
    "รวมหัวข้อสิทธิแรงงานข้ามชาติทั้งหมด ค้นหาสิทธิของคุณ กฎหมาย และวิธีช่วยตัวเอง",
  openGraph: {
    title: "คู่มือดูแลตัวเอง - รู้สิทธิ ติดกระเป๋า",
    description:
      "รวมหัวข้อสิทธิแรงงานข้ามชาติทั้งหมด ค้นหาสิทธิของคุณ กฎหมาย และวิธีช่วยตัวเอง",
  },
};

export default function TopicsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
