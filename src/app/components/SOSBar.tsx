"use client";

import Link from "next/link";
import { trackEvent } from "../../../lib/analytics";
import { useLanguage } from "../contexts/LanguageContext";

export function SOSBar() {
  const { locale } = useLanguage();

  const handleCallClick = (number: string, type: "call") => {
    trackEvent({ type: "sos_contact", method: type });
    window.location.href = `tel:${number}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#FFC314] text-black p-4 shadow-lg z-50">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-sm text-black">
            {locale === "en"
              ? "Need Urgent Help?"
              : locale === "mm"
              ? "အရေးတကြီး အကူအညီလိုအပ်ပါသလား?"
              : "ต้องการความช่วยเหลือเร่งด่วน?"}
          </h3>
          <p className="text-xs text-black/80">
            {locale === "en"
              ? "Contact LPN Foundation"
              : locale === "mm"
              ? "LPN Foundation နှင့်ဆက်သွယ်ပါ"
              : "ติดต่อหามูลนิธิ LPN"}
          </p>
        </div>

        <div className="flex gap-2 ml-4">
          {/* Emergency hotline */}
          <button
            onClick={() => handleCallClick("084-121-609", "call")}
            className="bg-white text-black px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
            aria-label={
              locale === "en"
                ? "Call 084-121-609"
                : locale === "mm"
                ? "084-121-609 ကိုခေါ်ပါ"
                : "โทร 084-121-609"
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 mr-2"
            >
              <path
                fillRule="evenodd"
                d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 5.25V4.5z"
                clipRule="evenodd"
              />
            </svg>
            084-121-609
          </button>

          {/* More help page */}
          <Link
            href="/help"
            className="bg-white text-black px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
            aria-label={
              locale === "en"
                ? "View other help channels"
                : locale === "mm"
                ? "အခြားအကူအညီလမ်းကြောင်းများကြည့်ပါ"
                : "ดูช่องทางช่วยเหลืออื่น ๆ"
            }
          >
            ⋯
          </Link>
        </div>
      </div>
    </div>
  );
}
