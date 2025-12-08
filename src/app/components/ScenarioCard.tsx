"use client";

import Image from "next/image";
import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

export interface Scenario {
  id: string;
  title: string;
  titleEn: string;
  titleMm: string;
  description: string;
  descriptionEn: string;
  descriptionMm: string;
  icon: string;
  iconType?: "emoji" | "image";
  color: {
    bg: string;
    border: string;
    text: string;
    hoverBg: string;
  };
  keywords: string[];
  keywordsEn: string[];
  keywordsMm: string[];
  category?: string;
  urgency?: "low" | "medium" | "high";
}

interface ScenarioCardProps {
  scenario: Scenario;
  onClick?: () => void;
}

export function ScenarioCard({ scenario, onClick }: ScenarioCardProps) {
  const [imageError, setImageError] = useState(false);
  const { locale } = useLanguage();

  const urgencyBadge =
    scenario.urgency === "high" ? (
      <div className="flex items-center gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4"
        >
          <path
            fillRule="evenodd"
            d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
            clipRule="evenodd"
          />
        </svg>
        <span>
          {locale === "en" ? "Urgent" : locale === "mm" ? "အရေးတကြီး" : "ด่วน"}
        </span>
      </div>
    ) : scenario.urgency === "medium" ? (
      <div className="flex items-center gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4"
        >
          <path
            fillRule="evenodd"
            d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z"
            clipRule="evenodd"
          />
        </svg>
        <span>
          {locale === "en"
            ? "Important"
            : locale === "mm"
            ? "အရေးကြီး"
            : "สำคัญ"}
        </span>
      </div>
    ) : null;

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
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-12 h-12"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
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
          {locale === "en"
            ? scenario.titleEn
            : locale === "mm"
            ? scenario.titleMm
            : scenario.title}
        </h3>

        <p
          className={`${
            scenario.iconType === "image" ? "text-base" : "text-sm"
          } text-gray-600 mb-4 group-hover:text-gray-800 transition-colors duration-200 leading-relaxed`}
        >
          {locale === "en"
            ? scenario.descriptionEn
            : locale === "mm"
            ? scenario.descriptionMm
            : scenario.description}
        </p>

        <div className="flex flex-wrap gap-1 justify-center opacity-75 group-hover:opacity-100 transition-opacity duration-200">
          {(locale === "en"
            ? scenario.keywordsEn
            : locale === "mm"
            ? scenario.keywordsMm
            : scenario.keywords
          )
            .slice(0, 3)
            .map((keyword, index) => (
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
    titleEn: "New to Work",
    titleMm: "အလုပ်အသစ်",
    description: "ต้องการทราบสิทธิพื้นฐาน เอกสาร และการปรับตัว",
    descriptionEn: "Want to know basic rights, documents, and adaptation",
    descriptionMm:
      "အခြေခံအခွင့်အရေးများ၊ စာရွက်စာတမ်းများနှင့် လိုက်လျောညီထွေဖြစ်ရန်",
    icon: "/images/newjob-new.svg",
    iconType: "image",
    color: {
      bg: "bg-slate-50",
      border: "border-yellow-400",
      text: "text-slate-800",
      hoverBg: "hover:bg-slate-100",
    },
    keywords: ["เอกสาร", "ใบอนุญาต", "วีซ่า", "สิทธิพื้นฐาน"],
    keywordsEn: ["Documents", "Permit", "Visa", "Basic Rights"],
    keywordsMm: [
      "စာရွက်စာတမ်းများ",
      "ခွင့်ပြုမိန့်",
      "ဗီဇာ",
      "အခြေခံအခွင့်အရေးများ",
    ],
    category: "เอกสารและการเดินทาง",
    urgency: "high",
  },
  {
    id: "workplace-problem",
    title: "มีปัญหาที่ทำงาน",
    titleEn: "Workplace Problems",
    titleMm: "အလုပ်ခွင်ပြဿနာများ",
    description: "ค่าแรงไม่ได้รับ ทำงานหนัก หรือถูกปฏิบัติไม่ดี",
    descriptionEn: "Unpaid wages, hard work, or mistreatment",
    descriptionMm:
      "လုပ်ခမရရှိခြင်း၊ လုပ်ငန်းခက်ခဲခြင်း သို့မဟုတ် အလွဲသုံးစားခံရခြင်း",
    icon: "/images/problem-job-new.svg",
    iconType: "image",
    color: {
      bg: "bg-slate-50",
      border: "border-yellow-400",
      text: "text-slate-800",
      hoverBg: "hover:bg-slate-100",
    },
    keywords: ["ค่าแรง", "ความปลอดภัย", "โอที", "การทำงาน"],
    keywordsEn: ["Wages", "Safety", "Overtime", "Work"],
    keywordsMm: ["လုပ်ခ", "ဘေးကင်းရေး", "အချိန်ပို", "အလုပ်"],
    category: "ทำงานและสวัสดิการ",
    urgency: "high",
  },
  {
    id: "document-expiring",
    title: "เอกสารใกล้หมดอายุ",
    titleEn: "Documents Expiring",
    titleMm: "စာရွက်စာတမ်းများ သက်တမ်းကုန်ဆုံးမည်",
    description: "ต้องต่อใบอนุญาต วีซ่า หรือเอกสารสำคัญ",
    descriptionEn: "Need to renew permit, visa, or important documents",
    descriptionMm:
      "ခွင့်ပြုမိန့်၊ ဗီဇာ သို့မဟုတ် အရေးကြီးစာရွက်စာတမ်းများ သက်တမ်းတိုးရန်",
    icon: "/images/expire-workpermit-new.svg",
    iconType: "image",
    color: {
      bg: "bg-slate-50",
      border: "border-yellow-400",
      text: "text-slate-800",
      hoverBg: "hover:bg-slate-100",
    },
    keywords: ["ต่ออายุ", "ใบอนุญาต", "วีซ่า", "เอกสาร"],
    keywordsEn: ["Renewal", "Permit", "Visa", "Documents"],
    keywordsMm: [
      "သက်တမ်းတိုးခြင်း",
      "ခွင့်ပြုမိန့်",
      "ဗီဇာ",
      "စာရွက်စာတမ်းများ",
    ],
    category: "เอกสารและการเดินทาง",
    urgency: "medium",
  },
  {
    id: "family-issues",
    title: "เรื่องครอบครัว",
    titleEn: "Family Matters",
    titleMm: "မိသားစုကိစ္စရပ်များ",
    description: "การแต่งงาน การมีบุตร การศึกษา หรือปัญหาครอบครัว",
    descriptionEn: "Marriage, children, education, or family issues",
    descriptionMm:
      "လက်ထပ်ခြင်း၊ သားသမီးများ၊ ပညာရေး သို့မဟုတ် မိသားစုပြဿနာများ",
    icon: "/images/family-new.svg",
    iconType: "image",
    color: {
      bg: "bg-slate-50",
      border: "border-yellow-400",
      text: "text-slate-800",
      hoverBg: "hover:bg-slate-100",
    },
    keywords: ["แต่งงาน", "บุตร", "การศึกษา", "ครอบครัว"],
    keywordsEn: ["Marriage", "Children", "Education", "Family"],
    keywordsMm: ["လက်ထပ်ခြင်း", "သားသမီးများ", "ပညာရေး", "မိသားစု"],
    category: "ครอบครัวและชีวิตในชุมชน",
    urgency: "medium",
  },
  {
    id: "healthcare",
    title: "ปัญหาสุขภาพ",
    titleEn: "Health Issues",
    titleMm: "ကျန်းမာရေးပြဿနာများ",
    description: "ต้องการรักษา ประกันสุขภาพ หรือข้อมูลโรงพยาบาล",
    descriptionEn: "Need treatment, health insurance, or hospital information",
    descriptionMm: "ကုသမှု၊ ကျန်းမာရေးအာမခံ သို့မဟုတ် ဆေးရုံအချက်အလက်များ",
    icon: "/images/hospital-new.svg",
    iconType: "image",
    color: {
      bg: "bg-slate-50",
      border: "border-yellow-400",
      text: "text-slate-800",
      hoverBg: "hover:bg-slate-100",
    },
    keywords: ["รักษา", "ประกันสุขภาพ", "โรงพยาบาล", "สุขภาพ"],
    keywordsEn: ["Treatment", "Health Insurance", "Hospital", "Health"],
    keywordsMm: ["ကုသမှု", "ကျန်းမာရေးအာမခံ", "ဆေးရုံ", "ကျန်းမာရေး"],
    category: "ทำงานและสวัสดิการ",
    urgency: "high",
  },
  {
    id: "community-life",
    title: "ชีวิตในชุมชน",
    titleEn: "Community Life",
    titleMm: "အသိုင်းအဝိုင်းဘဝ",
    description: "ปรับตัวเข้าสังคม ภาษา วัฒนธรรม และการอยู่ร่วมกัน",
    descriptionEn: "Social adaptation, language, culture, and living together",
    descriptionMm:
      "လူမှုရေးလိုက်လျောညီထွေဖြစ်ခြင်း၊ ဘာသာစကား၊ ယဉ်ကျေးမှုနှင့် အတူနေထိုင်ခြင်း",
    icon: "/images/community-new.svg",
    iconType: "image",
    color: {
      bg: "bg-slate-50",
      border: "border-yellow-400",
      text: "text-slate-800",
      hoverBg: "hover:bg-slate-100",
    },
    keywords: ["ภาษา", "วัฒนธรรม", "ชุมชน", "การปรับตัว"],
    keywordsEn: ["Language", "Culture", "Community", "Adaptation"],
    keywordsMm: [
      "ဘာသာစကား",
      "ယဉ်ကျေးမှု",
      "အသိုင်းအဝိုင်း",
      "လိုက်လျောညီထွေဖြစ်ခြင်း",
    ],
    category: "ครอบครัวและชีวิตในชุมชน",
    urgency: "low",
  },
  {
    id: "emergency-help",
    title: "ฉุกเฉิน! ต้องการความช่วยเหลือ",
    titleEn: "Emergency! Need Help",
    titleMm: "အရေးပေါ်! အကူအညီလိုအပ်သည်",
    description: "สถานการณ์ฉุกเฉิน ถูกคุกคาม หรือต้องการช่วยเหลือทันที",
    descriptionEn: "Emergency situation, threatened, or need immediate help",
    descriptionMm:
      "အရေးပေါ်အခြေအနေ၊ ခြိမ်းခြောက်ခံရခြင်း သို့မဟုတ် ချက်ချင်းအကူအညီလိုအပ်ခြင်း",
    icon: "/images/help-new.svg",
    iconType: "image",
    color: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-800",
      hoverBg: "hover:bg-red-100",
    },
    keywords: ["ฉุกเฉิน", "ช่วยเหลือ", "สายด่วน", "ตำรวจ"],
    keywordsEn: ["Emergency", "Help", "Hotline", "Police"],
    keywordsMm: ["အရေးပေါ်", "အကူအညီ", "အရေးပေါ်ဖုန်း", "ရဲ"],
    category: "emergency",
    urgency: "high",
  },
  {
    id: "legal-rights",
    title: "ต้องการรู้สิทธิ",
    titleEn: "Know Your Rights",
    titleMm: "သင့်အခွင့်အရေးများကို သိပါ",
    description: "ศึกษาสิทธิตามกฎหมาย และวิธีการคุ้มครองตนเอง",
    descriptionEn: "Learn about legal rights and self-protection methods",
    descriptionMm:
      "ဥပဒေအရအခွင့်အရေးများနှင့် မိမိကိုယ်ကို ကာကွယ်သောနည်းလမ်းများ",
    icon: "/images/know-your-right-new.svg",
    iconType: "image",
    color: {
      bg: "bg-slate-50",
      border: "border-yellow-400",
      text: "text-slate-800",
      hoverBg: "hover:bg-slate-100",
    },
    keywords: ["กฎหมาย", "สิทธิ", "คุ้มครอง", "ความรู้"],
    keywordsEn: ["Law", "Rights", "Protection", "Knowledge"],
    keywordsMm: ["ဥပဒေ", "အခွင့်အရေးများ", "ကာကွယ်မှု", "အသိပညာ"],
    category: "general",
    urgency: "low",
  },
];
