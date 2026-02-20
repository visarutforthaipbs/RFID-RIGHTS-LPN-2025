import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ตั้งค่า - รู้สิทธิ ติดกระเป๋า",
  description: "ปรับแต่งการใช้งานแอปรู้สิทธิ ติดกระเป๋า เลือกภาษา และขนาดตัวอักษร",
  robots: { index: false },
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
