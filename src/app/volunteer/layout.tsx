import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "สมัครอาสาสมัคร - รู้สิทธิ ติดกระเป๋า",
  description:
    "ร่วมเป็นอาสาสมัครช่วยเหลือแรงงานข้ามชาติในประเทศไทย สมัครเพื่อเป็นส่วนหนึ่งของทีม",
  openGraph: {
    title: "สมัครอาสาสมัคร - รู้สิทธิ ติดกระเป๋า",
    description: "ร่วมเป็นอาสาสมัครช่วยเหลือแรงงานข้ามชาติในประเทศไทย",
  },
};

export default function VolunteerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
