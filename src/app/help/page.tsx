"use client";

import Link from "next/link";
import { Header } from "../components/Header";

export default function HelpPage() {
  const emergencyContacts = [
    {
      name: "สายด่วนตำรวจ",
      number: "191",
      description: "เมื่อเกิดเหตุฉุกเฉิน อันตราย หรือต้องการความช่วยเหลือทันที",
      available: "24 ชั่วโมง",
    },
    {
      name: "กรมการจัดหางาน",
      number: "1694",
      description: "ปัญหาเกี่ยวกับการทำงาน แรงงาน หรือนายจ้าง",
      available: "จันทร์-ศุกร์ 8:30-16:30",
    },
    {
      name: "สำนักงานตรวจคนเข้าเมือง",
      number: "1178",
      description: "ปัญหาเกี่ยวกับการเข้าเมือง วีซ่า หรือเอกสารการอยู่อาศัย",
      available: "24 ชั่วโมง",
    },
    {
      name: "สายด่วนสุขภาพจิต",
      number: "1323",
      description: "ปรึกษาปัญหาสุขภาพจิต ความเครียด หรือซึมเศร้า",
      available: "24 ชั่วโมง",
    },
  ];

  const helpfulResources = [
    {
      title: "ศูนย์ช่วยเหลือแรงงานต่างด้าว",
      organization: "กระทรวงแรงงาน",
      phone: "02-354-9999",
      website: "www.mol.go.th",
      description: "ให้คำปรึกษาและช่วยเหลือแรงงานต่างด้าวในทุกเรื่อง",
    },
    {
      title: "มูลนิธิเครือข่ายส่งเสริมคุณภาพชีวิตแรงงาน",
      organization: "Labor Protection Network",
      phone: "034-434-726",
      website: "https://www.lpnfoundation.org/th",
      description: "ภาคประชาชนช่วยเหลือแรงงานข้ามชาติ",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8" id="main-content">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <Link href="/" className="text-black hover:text-yellow-600">
              หน้าหลัก
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-700">ขอความช่วยเหลือ</span>
          </nav>

          {/* Page Header */}
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              ขอความช่วยเหลือ
            </h1>
            <p className="text-gray-600">
              หากคุณต้องการความช่วยเหลือเร่งด่วน หรือต้องการคำปรึกษา
              ติดต่อได้ตามช่องทางด้านล่าง
            </p>
          </header>

          {/* Emergency Alert */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center mb-3">
              <svg
                className="h-6 w-6 text-red-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <h2 className="text-xl font-semibold text-red-900">
                เหตุฉุกเฉิน
              </h2>
            </div>
            <p className="text-red-800 mb-4">
              หากคุณอยู่ในสถานการณ์อันตราย ต้องการความช่วยเหลือทันที
              หรือเห็นใครกำลังถูกทำร้าย
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="tel:191"
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                โทร 191 ตำรวจ
              </a>
              <a
                href="tel:1669"
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                โทร 1669 การแพทย์ฉุกเฉิน
              </a>
            </div>
          </div>

          {/* Emergency Contacts */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              สายด่วนสำคัญ
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {emergencyContacts.map((contact, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {contact.name}
                    </h3>
                    <a
                      href={`tel:${contact.number}`}
                      className="inline-flex items-center px-3 py-1 bg-yellow-400 text-black rounded-full text-sm font-medium hover:bg-yellow-300 transition-colors"
                    >
                      {contact.number}
                    </a>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">
                    {contact.description}
                  </p>
                  <p className="text-green-600 text-sm font-medium">
                    เปิดให้บริการ: {contact.available}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Helpful Organizations */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              องค์กรที่ให้ความช่วยเหลือ
            </h2>
            <div className="space-y-4">
              {helpfulResources.map((resource, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {resource.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {resource.organization}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0">
                      <a
                        href={`tel:${resource.phone}`}
                        className="inline-flex items-center px-3 py-1 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors justify-center"
                      >
                        <svg
                          className="h-4 w-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        {resource.phone}
                      </a>
                      <a
                        href={`https://${resource.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1 bg-black text-yellow-400 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors justify-center"
                      >
                        <svg
                          className="h-4 w-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                        เว็บไซต์
                      </a>
                    </div>
                  </div>
                  <p className="text-gray-600">{resource.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Additional Tips */}
          <section className="bg-yellow-50 rounded-2xl border border-yellow-200 p-6">
            <h2 className="text-xl font-semibold text-black mb-4 flex items-center">
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              คำแนะนำเพิ่มเติม
            </h2>
            <ul className="text-black space-y-2">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                เก็บเบอร์โทรศัพท์สำคัญไว้ในมือถือของคุณ
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                จำที่อยู่ของคุณและสถานที่ทำงานให้ได้
                เพื่อแจ้งเจ้าหน้าที่ในกรณีฉุกเฉิน
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                เก็บสำเนาเอกสารสำคัญไว้ในมือถือ เช่น หนังสือเดินทาง
                ใบอนุญาตทำงาน
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                หากไม่พูดภาษาไทยได้
                ขอให้เพื่อนหรือคนรู้จักช่วยแปลเมื่อติดต่อหน่วยงาน
              </li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
