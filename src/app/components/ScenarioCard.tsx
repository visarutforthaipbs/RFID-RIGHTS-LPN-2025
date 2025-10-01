"use client";

import Image from "next/image";
import { useState } from "react";

export interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconType?: "emoji" | "image";
  color: {
    bg: string;
    border: string;
    text: string;
    hoverBg: string;
  };
  keywords: string[];
  category?: string;
  urgency?: "low" | "medium" | "high";
}

interface ScenarioCardProps {
  scenario: Scenario;
  onClick?: () => void;
}

export function ScenarioCard({ scenario, onClick }: ScenarioCardProps) {
  const [imageError, setImageError] = useState(false);

  const urgencyBadge =
    scenario.urgency === "high"
      ? "🚨 ด่วน"
      : scenario.urgency === "medium"
      ? "⚡ สำคัญ"
      : null;

  const handleImageError = () => {
    console.error(`Failed to load image: ${scenario.icon}`);
    setImageError(true);
  };

  return (
    <div
      onClick={onClick}
      className={`${scenario.color.bg} ${scenario.color.border} border-2 rounded-xl p-6 ${scenario.color.hoverBg} transition-all duration-300 cursor-pointer group hover:shadow-xl hover:-translate-y-2 relative transform-gpu`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {urgencyBadge && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg animate-pulse">
          {urgencyBadge}
        </div>
      )}

      <div className="text-center">
        <div className="mb-4 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
          {scenario.iconType === "image" ? (
            <div className="w-28 h-28 sm:w-32 sm:h-32 relative">
              {!imageError ? (
                <Image
                  src={scenario.icon}
                  alt={scenario.title}
                  fill
                  className="object-contain drop-shadow-sm"
                  sizes="(max-width: 640px) 112px, 128px"
                  priority={
                    scenario.id === "new-worker" ||
                    scenario.id === "workplace-problem" ||
                    scenario.id === "document-expiring" ||
                    scenario.id === "family-issues" ||
                    scenario.id === "healthcare" ||
                    scenario.id === "community-life" ||
                    scenario.id === "legal-rights" ||
                    scenario.id === "emergency-help"
                  }
                  onError={handleImageError}
                  onLoad={() =>
                    console.log(`Image loaded successfully: ${scenario.icon}`)
                  }
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl text-gray-400">
                  🖼️
                </div>
              )}
            </div>
          ) : (
            <div className="text-4xl">{scenario.icon}</div>
          )}
        </div>

        <h3
          className={`font-bold ${
            scenario.iconType === "image" ? "text-xl sm:text-2xl" : "text-lg"
          } ${
            scenario.color.text
          } mb-3 group-hover:text-black transition-colors duration-200`}
        >
          {scenario.title}
        </h3>

        <p
          className={`${
            scenario.iconType === "image" ? "text-base" : "text-sm"
          } text-gray-600 mb-4 group-hover:text-gray-800 transition-colors duration-200 leading-relaxed`}
        >
          {scenario.description}
        </p>

        <div className="flex flex-wrap gap-1 justify-center opacity-75 group-hover:opacity-100 transition-opacity duration-200">
          {scenario.keywords.slice(0, 3).map((keyword, index) => (
            <span
              key={index}
              className="text-xs bg-white/70 backdrop-blur-sm px-2 py-1 rounded-full text-gray-700 border border-white/50"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>

      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}

export const scenarios: Scenario[] = [
  {
    id: "new-worker",
    title: "เพิ่งมาทำงานใหม่",
    description: "ต้องการทราบสิทธิพื้นฐาน เอกสาร และการปรับตัว",
    icon: "/images/newjob-2.png",
    iconType: "image",
    color: {
      bg: "bg-slate-50",
      border: "border-slate-200",
      text: "text-slate-800",
      hoverBg: "hover:bg-slate-100",
    },
    keywords: ["เอกสาร", "ใบอนุญาต", "วีซ่า", "สิทธิพื้นฐาน"],
    category: "เอกสารและการเดินทาง",
    urgency: "high",
  },
  {
    id: "workplace-problem",
    title: "มีปัญหาที่ทำงาน",
    description: "ค่าแรงไม่ได้รับ ทำงานหนัก หรือถูกปฏิบัติไม่ดี",
    icon: "/images/problem-job-1.png",
    iconType: "image",
    color: {
      bg: "bg-slate-50",
      border: "border-slate-200",
      text: "text-slate-800",
      hoverBg: "hover:bg-slate-100",
    },
    keywords: ["ค่าแรง", "ความปลอดภัย", "โอที", "การทำงาน"],
    category: "ทำงานและสวัสดิการ",
    urgency: "high",
  },
  {
    id: "document-expiring",
    title: "เอกสารใกล้หมดอายุ",
    description: "ต้องต่อใบอนุญาต วีซ่า หรือเอกสารสำคัญ",
    icon: "/images/expire-workpermit.png",
    iconType: "image",
    color: {
      bg: "bg-slate-50",
      border: "border-slate-200",
      text: "text-slate-800",
      hoverBg: "hover:bg-slate-100",
    },
    keywords: ["ต่ออายุ", "ใบอนุญาต", "วีซ่า", "เอกสาร"],
    category: "เอกสารและการเดินทาง",
    urgency: "medium",
  },
  {
    id: "family-issues",
    title: "เรื่องครอบครัว",
    description: "การแต่งงาน การมีบุตร การศึกษา หรือปัญหาครอบครัว",
    icon: "/images/family-1.png",
    iconType: "image",
    color: {
      bg: "bg-slate-50",
      border: "border-slate-200",
      text: "text-slate-800",
      hoverBg: "hover:bg-slate-100",
    },
    keywords: ["แต่งงาน", "บุตร", "การศึกษา", "ครอบครัว"],
    category: "ครอบครัวและชีวิตในชุมชน",
    urgency: "medium",
  },
  {
    id: "healthcare",
    title: "ปัญหาสุขภาพ",
    description: "ต้องการรักษา ประกันสุขภาพ หรือข้อมูลโรงพยาบาล",
    icon: "/images/hospital-1.png",
    iconType: "image",
    color: {
      bg: "bg-slate-50",
      border: "border-slate-200",
      text: "text-slate-800",
      hoverBg: "hover:bg-slate-100",
    },
    keywords: ["รักษา", "ประกันสุขภาพ", "โรงพยาบาล", "สุขภาพ"],
    category: "ทำงานและสวัสดิการ",
    urgency: "high",
  },
  {
    id: "community-life",
    title: "ชีวิตในชุมชน",
    description: "ปรับตัวเข้าสังคม ภาษา วัฒนธรรม และการอยู่ร่วมกัน",
    icon: "/images/community-1.png",
    iconType: "image",
    color: {
      bg: "bg-slate-50",
      border: "border-slate-200",
      text: "text-slate-800",
      hoverBg: "hover:bg-slate-100",
    },
    keywords: ["ภาษา", "วัฒนธรรม", "ชุมชน", "การปรับตัว"],
    category: "ครอบครัวและชีวิตในชุมชน",
    urgency: "low",
  },
  {
    id: "emergency-help",
    title: "ฉุกเฉิน! ต้องการความช่วยเหลือ",
    description: "สถานการณ์ฉุกเฉิน ถูกคุกคาม หรือต้องการช่วยเหลือทันที",
    icon: "/images/help-2.png",
    iconType: "image",
    color: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-800",
      hoverBg: "hover:bg-red-100",
    },
    keywords: ["ฉุกเฉิน", "ช่วยเหลือ", "สายด่วน", "ตำรวจ"],
    category: "emergency",
    urgency: "high",
  },
  {
    id: "legal-rights",
    title: "ต้องการรู้สิทธิ",
    description: "ศึกษาสิทธิตามกฎหมาย และวิธีการคุ้มครองตนเอง",
    icon: "/images/know-your-right.png",
    iconType: "image",
    color: {
      bg: "bg-slate-50",
      border: "border-slate-200",
      text: "text-slate-800",
      hoverBg: "hover:bg-slate-100",
    },
    keywords: ["กฎหมาย", "สิทธิ", "คุ้มครอง", "ความรู้"],
    category: "general",
    urgency: "low",
  },
];
