"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "../components/Header";
import { LanguageSwitcher } from "../components/LanguageSwitcher";

export default function SettingsPage() {
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">(
    "medium"
  );
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [dataUsage, setDataUsage] = useState<string>("0 MB");
  const [cacheSize, setCacheSize] = useState<string>("0 MB");

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedFontSize =
      (localStorage.getItem("fontSize") as "small" | "medium" | "large") ||
      "medium";
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    const savedNotifications =
      localStorage.getItem("notifications") !== "false";

    setFontSize(savedFontSize);
    setDarkMode(savedDarkMode);
    setNotifications(savedNotifications);

    // Simulate data usage calculation
    const calculateDataUsage = () => {
      // This would normally calculate actual data usage
      setDataUsage("2.5 MB");
      setCacheSize("1.8 MB");
    };

    calculateDataUsage();
  }, []);

  // Apply font size to document
  useEffect(() => {
    const fontSizeMap = {
      small: "14px",
      medium: "16px",
      large: "18px",
    };

    document.documentElement.style.fontSize = fontSizeMap[fontSize];
    localStorage.setItem("fontSize", fontSize);
  }, [fontSize]);

  // Apply dark mode (for future implementation)
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
    // Dark mode implementation would go here
  }, [darkMode]);

  // Save notifications preference
  useEffect(() => {
    localStorage.setItem("notifications", notifications.toString());
  }, [notifications]);

  const clearCache = () => {
    // Clear any cached data
    if ("caches" in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name);
        });
      });
    }

    // Clear localStorage except for settings
    const settingsToKeep = ["fontSize", "darkMode", "notifications"];
    const allKeys = Object.keys(localStorage);
    allKeys.forEach((key) => {
      if (!settingsToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });

    setCacheSize("0 MB");
    alert("ข้อมูลแคชถูกลบแล้ว");
  };

  const resetSettings = () => {
    if (confirm("คุณต้องการรีเซ็ตการตั้งค่าทั้งหมดหรือไม่?")) {
      localStorage.clear();
      setFontSize("medium");
      setDarkMode(false);
      setNotifications(true);
      document.documentElement.style.fontSize = "16px";
      alert("การตั้งค่าถูกรีเซ็ตแล้ว");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8" id="main-content">
        <div className="max-w-2xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <Link href="/" className="text-black hover:text-yellow-600">
              หน้าหลัก
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-700">ตั้งค่า</span>
          </nav>

          {/* Page Header */}
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">ตั้งค่า</h1>
            <p className="text-gray-600">ปรับแต่งการใช้งานแอปให้เหมาะกับคุณ</p>
          </header>

          <div className="space-y-6">
            {/* Language Settings */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg
                  className="h-6 w-6 text-yellow-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                  />
                </svg>
                ภาษา
              </h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 font-medium mb-1">เลือกภาษา</p>
                  <p className="text-gray-500 text-sm">เปลี่ยนภาษาการแสดงผล</p>
                </div>
                <LanguageSwitcher />
              </div>
            </section>

            {/* Display Settings */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg
                  className="h-6 w-6 text-yellow-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                การแสดงผล
              </h2>

              {/* Font Size */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  ขนาดตัวอักษร
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "small", label: "เล็ก", size: "text-sm" },
                    { value: "medium", label: "กลาง", size: "text-base" },
                    { value: "large", label: "ใหญ่", size: "text-lg" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        setFontSize(
                          option.value as "small" | "medium" | "large"
                        )
                      }
                      className={`p-3 rounded-lg border text-center transition-colors ${
                        fontSize === option.value
                          ? "border-yellow-400 bg-yellow-50 text-black"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className={option.size}>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dark Mode (Future Feature) */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 font-medium mb-1">โหมดมืด</p>
                  <p className="text-gray-500 text-sm">
                    ใช้งานในสภาพแสงน้อย (ฟีเจอร์ใหม่เร็วๆ นี้)
                  </p>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  disabled
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 ${
                    darkMode ? "bg-yellow-400" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                      darkMode ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </section>

            {/* Notifications */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg
                  className="h-6 w-6 text-blue-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-5 5v-5zM12 2l3.09 6.26L22 9l-5 4.74L18.18 22 12 19.77 5.82 22 7 13.74 2 9l6.91-.74L12 2z"
                  />
                </svg>
                การแจ้งเตือน
              </h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 font-medium mb-1">การแจ้งเตือน</p>
                  <p className="text-gray-500 text-sm">
                    รับการแจ้งเตือนข่าวสารใหม่
                  </p>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    notifications ? "bg-yellow-400" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                      notifications ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </section>

            {/* Data & Storage */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg
                  className="h-6 w-6 text-blue-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                  />
                </svg>
                ข้อมูลและที่จัดเก็บ
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-gray-700 font-medium">การใช้ข้อมูล</p>
                    <p className="text-gray-500 text-sm">
                      ข้อมูลที่ใช้ไปทั้งหมด
                    </p>
                  </div>
                  <span className="text-gray-900 font-medium">{dataUsage}</span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-gray-700 font-medium">ข้อมูลแคช</p>
                    <p className="text-gray-500 text-sm">
                      ข้อมูลที่จัดเก็บในเครื่อง
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-900 font-medium">
                      {cacheSize}
                    </span>
                    <button
                      onClick={clearCache}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      ลบแคช
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* About & Reset */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg
                  className="h-6 w-6 text-blue-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                เกี่ยวกับ
              </h2>

              <div className="space-y-4">
                <div>
                  <p className="text-gray-700 font-medium">
                    รู้สิทธิ ติดกระเป๋า
                  </p>
                  <p className="text-gray-500 text-sm">เวอร์ชัน 1.0.0</p>
                </div>

                <div>
                  <p className="text-gray-700 font-medium">
                    คู่มือสิทธิแรงงานต่างด้าว
                  </p>
                  <p className="text-gray-500 text-sm">
                    สำหรับใช้งานออฟไลน์โดยไม่ต้องเชื่อมต่ออินเทอร์เน็ต
                  </p>
                </div>
                <div>
                  <p className="text-gray-700 font-medium">ออกแบบและพัฒนาโดย</p>
                  <p className="text-gray-500 text-sm">
                    มูลนิธิเครือข่ายส่งเสริมคุณภาพชีวิตแรงงาน (LPN) และ{" "}
                    <a
                      href="http://visarutsankham.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                    >
                      วิศรุต แสนคำ
                    </a>
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={resetSettings}
                    className="w-full px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                  >
                    รีเซ็ตการตั้งค่าทั้งหมด
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
