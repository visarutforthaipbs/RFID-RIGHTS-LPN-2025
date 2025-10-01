"use client";

import Link from "next/link";
import { trackEvent } from "../../../lib/analytics";

export function SOSBar() {
  const handleCallClick = (number: string, type: "call") => {
    trackEvent({ type: "sos_contact", method: type });
    window.location.href = `tel:${number}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-yellow-400 p-4 shadow-lg z-50">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-sm text-yellow-400">
            ต้องการความช่วยเหลือเร่งด่วน?
          </h3>
          <p className="text-xs text-gray-300">โทรหาสายด่วนหรือติดต่อผ่านแอป</p>
        </div>

        <div className="flex gap-2 ml-4">
          {/* Emergency hotline */}
          <button
            onClick={() => handleCallClick("191", "call")}
            className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold text-sm hover:bg-yellow-300 transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
            aria-label="โทร 191 ตำรวจ"
          >
            📞 191
          </button>

          {/* Department of Employment hotline */}
          <button
            onClick={() => handleCallClick("1694", "call")}
            className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold text-sm hover:bg-yellow-300 transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
            aria-label="โทร 1694 กรมการจัดหางาน"
          >
            🏢 1694
          </button>

          {/* More help page */}
          <Link
            href="/help"
            className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold text-sm hover:bg-yellow-300 transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
            aria-label="ดูช่องทางช่วยเหลืออื่น ๆ"
          >
            ⋯
          </Link>
        </div>
      </div>
    </div>
  );
}
