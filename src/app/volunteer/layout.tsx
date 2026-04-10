import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "สมัครอาสาสมัคร",
  description:
    "ร่วมเป็นอาสาสมัครช่วยเหลือแรงงานข้ามชาติในประเทศไทย สมัครเพื่อเป็นส่วนหนึ่งของทีม Volunteer for migrant worker rights",
  alternates: {
    canonical: "https://rfid-rights.vercel.app/volunteer",
  },
  openGraph: {
    title: "สมัครอาสาสมัคร - รู้สิทธิ ติดกระเป๋า",
    description: "ร่วมเป็นอาสาสมัครช่วยเหลือแรงงานข้ามชาติในประเทศไทย",
    url: "https://rfid-rights.vercel.app/volunteer",
  },
};

export default function VolunteerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
