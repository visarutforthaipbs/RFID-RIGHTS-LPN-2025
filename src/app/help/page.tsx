"use client";

import Link from "next/link";
import { Header } from "../components/Header";
import { SOSBar } from "../components/SOSBar";
import { useLanguage } from "../contexts/LanguageContext";
import { messages } from "../../../lib/i18n";

export default function HelpPage() {
  const { locale } = useLanguage();
  const t = messages[locale];

  const emergencyContacts = [
    {
      name:
        locale === "en"
          ? "Police Hotline"
          : locale === "mm"
          ? "ရဲဖုန်းလိုင်း"
          : locale === "km"
          ? "ខ្សែទូរស័ព្ទប៉ូលីស"
          : "สายด่วนตำรวจ",
      number: "191",
      description:
        locale === "en"
          ? "For emergencies, danger, or immediate assistance needed"
          : locale === "mm"
          ? "အရေးပေါ်အခြေအနေ၊ အန္တရာယ် သို့မဟုတ်ချက်ချင်းအကူအညီလိုအပ်သည့်အခါ"
          : locale === "km"
          ? "សម្រាប់ករណីបន្ទាន់ គ្រោះថ្នាក់ ឬត្រូវការជំនួយភ្លាមៗ"
          : "เมื่อเกิดเหตุฉุกเฉิน อันตราย หรือต้องการความช่วยเหลือทันที",
      available: t.hours24,
    },
    {
      name:
        locale === "en"
          ? "Department of Employment"
          : locale === "mm"
          ? "အလုပ်အကိုင်ဌာန"
          : locale === "km"
          ? "នាយកដ្ឋានការងារ"
          : "กรมการจัดหางาน",
      number: "1694",
      description:
        locale === "en"
          ? "Work-related issues, labor, or employer problems"
          : locale === "mm"
          ? "အလုပ်နှင့်ပတ်သက်သောပြဿနာများ၊ အလုပ်သမား သို့မဟုတ်အလုပ်ရှင်"
          : locale === "km"
          ? "បញ្ហាការងារ ពលករ ឬនិយោជក"
          : "ปัญหาเกี่ยวกับการทำงาน แรงงาน หรือนายจ้าง",
      available: t.weekdayHours,
    },
    {
      name:
        locale === "en"
          ? "Immigration Bureau"
          : locale === "mm"
          ? "လူဝင်မှုကြီးကြပ်ရေးဗျူရို"
          : locale === "km"
          ? "ការិយាល័យអន្តោប្រវេសន៍"
          : "สำนักงานตรวจคนเข้าเมือง",
      number: "1178",
      description:
        locale === "en"
          ? "Immigration, visa, or residence document issues"
          : locale === "mm"
          ? "လူဝင်မှု၊ ဗီဇာ သို့မဟုတ်နေထိုင်ခွင့်စာရွက်စာတမ်းပြဿနာများ"
          : locale === "km"
          ? "បញ្ហាអន្តោប្រវេសន៍ ទិដ្ឋាការ ឬឯកសារស្នាក់នៅ"
          : "ปัญหาเกี่ยวกับการเข้าเมือง วีซ่า หรือเอกสารการอยู่อาศัย",
      available: t.hours24,
    },
    {
      name:
        locale === "en"
          ? "Mental Health Hotline"
          : locale === "mm"
          ? "စိတ်ကျန်းမာရေးဖုန်းလိုင်း"
          : locale === "km"
          ? "ខ្សែទូរស័ព្ទសុខភាពផ្លូវចិត្ត"
          : "สายด่วนสุขภาพจิต",
      number: "1323",
      description:
        locale === "en"
          ? "Mental health counseling, stress, or depression"
          : locale === "mm"
          ? "စိတ်ကျန်းမာရေးအကြံဉာဏ်၊ စိတ်ဖိစီးမှု သို့မဟုတ်စိတ်ဓာတ်ကျခြင်း"
          : locale === "km"
          ? "ការប្រឹក្សាសុខភាពផ្លូវចិត្ត ភាពតានតឹង ឬការធ្លាក់ទឹកចិត្ត"
          : "ปรึกษาปัญหาสุขภาพจิต ความเครียด หรือซึมเศร้า",
      available: t.hours24,
    },
  ];

  const helpfulResources = [
    {
      title:
        locale === "en"
          ? "Migrant Worker Assistance Center"
          : locale === "mm"
          ? "ရွှေ့ပြောင်းအလုပ်သမားအကူအညီဌာန"
          : locale === "km"
          ? "មជ្ឈមណ្ឌលជំនួយកម្មករអន្តោប្រវេសន៍"
          : "ศูนย์ช่วยเหลือแรงงานต่างด้าว",
      organization:
        locale === "en"
          ? "Ministry of Labour"
          : locale === "mm"
          ? "အလုပ်သမားဝန်ကြီးဌာန"
          : locale === "km"
          ? "ក្រសួងការងារ"
          : "กระทรวงแรงงาน",
      phone: "02-354-9999",
      website: "www.mol.go.th",
      description:
        locale === "en"
          ? "Provides advice and assistance to migrant workers on all matters"
          : locale === "mm"
          ? "ရွှေ့ပြောင်းအလုပ်သမားများကိုကိစ္စရပ်အားလုံးအတွက်အကြံဉာဏ်နှင့်အကူအညီပေးသည်"
          : locale === "km"
          ? "ផ្តល់ដំបូន្មាននិងជំនួយដល់កម្មករអន្តោប្រវេសន៍លើបញ្ហាទាំងអស់"
          : "ให้คำปรึกษาและช่วยเหลือแรงงานต่างด้าวในทุกเรื่อง",
    },
    {
      title:
        locale === "en"
          ? "Labor Protection Network Foundation"
          : locale === "mm"
          ? "အလုပ်သမားကာကွယ်ရေးကွန်ရက်ဖောင်ဒေးရှင်း"
          : locale === "km"
          ? "មូលនិធិបណ្តាញការពារកម្មករ"
          : "มูลนิธิเครือข่ายส่งเสริมคุณภาพชีวิตแรงงาน",
      organization: "Labor Protection Network",
      phone: "084-121-1609",
      website: "https://www.lpnfoundation.org/th",
      description:
        locale === "en"
          ? "Civil society organization helping migrant workers"
          : locale === "mm"
          ? "ရွှေ့ပြောင်းအလုပ်သမားများကိုကူညီသောအရပ်ဘက်အဖွဲ့အစည်း"
          : locale === "km"
          ? "អង្គការសង្គមស៊ីវិលជួយកម្មករអន្តោប្រវេសន៍"
          : "ภาคประชาชนช่วยเหลือแรงงานข้ามชาติ",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header />

      <main className="container mx-auto px-4 py-8" id="main-content">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <Link href="/" className="text-gray-900 hover:text-yellow-600">
              {t.home}
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600">{t.helpPageTitle}</span>
          </nav>

          {/* Page Header */}
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {t.helpPageTitle}
            </h1>
            <p className="text-gray-600">{t.helpPageDescription}</p>
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
                {t.emergency}
              </h2>
            </div>
            <p className="text-red-800 mb-4">{t.emergencyDescription}</p>
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
                {t.callPolice}
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
                {t.callAmbulance}
              </a>
            </div>
          </div>

          {/* Emergency Contacts */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              {t.importantHotlines}
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
                    {t.availableHours}: {contact.available}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Helpful Organizations */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              {t.helpfulOrganizations}
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
                        href={resource.website.startsWith("http") ? resource.website : `https://${resource.website}`}
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
                        {t.website}
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
            <h2 className="text-xl font-semibold text-yellow-900 mb-4 flex items-center">
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
              {t.additionalTips}
            </h2>
            <ul className="text-black space-y-2">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                {locale === "en"
                  ? "Save important phone numbers in your mobile phone"
                  : locale === "mm"
                  ? "သင့်မိုဘိုင်းဖုန်းတွင်အရေးကြီးသောဖုန်းနံပါတ်များကိုသိမ်းဆည်းပါ"
                  : locale === "km"
                  ? "រក្សាទុកលេខទូរស័ព្ទសំខាន់ៗក្នុងទូរស័ព្ទរបស់អ្នក"
                  : "เก็บเบอร์โทรศัพท์สำคัญไว้ในมือถือของคุณ"}
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                {locale === "en"
                  ? "Remember your address and workplace location to inform authorities in emergencies"
                  : locale === "mm"
                  ? "အရေးပေါ်အခြေအနေများတွင်အာဏာပိုင်များကိုအကြောင်းကြားရန်သင့်လိပ်စာနှင့်အလုပ်ခွင်တည်နေရာကိုမှတ်ထားပါ"
                  : locale === "km"
                  ? "ចងចាំអាសយដ្ឋាននិងទីតាំងកន្លែងធ្វើការរបស់អ្នក ដើម្បីជូនដំណឹងដល់អាជ្ញាធរក្នុងករណីបន្ទាន់"
                  : "จำที่อยู่ของคุณและสถานที่ทำงานให้ได้ เพื่อแจ้งเจ้าหน้าที่ในกรณีฉุกเฉิน"}
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                {locale === "en"
                  ? "Keep copies of important documents on your phone, such as passport and work permit"
                  : locale === "mm"
                  ? "သင့်ဖုန်းတွင်အရေးကြီးသောစာရွက်စာတမ်းများဖြစ်သောနိုင်ငံကူးလက်မှတ်၊ အလုပ်ခွင့်ပြုလက်မှတ်စသည်တို့ကိုသိမ်းဆည်းထားပါ"
                  : locale === "km"
                  ? "រក្សាទុកច្បាប់ចំលងនៃឯកសារសំខាន់ៗក្នុងទូរស័ព្ទរបស់អ្នក ដូចជាលិខិតឆ្លងដែន និងអាជ្ញាប័ណ្ណការងារ"
                  : "เก็บสำเนาเอกสารสำคัญไว้ในมือถือ เช่น หนังสือเดินทาง ใบอนุญาตทำงาน"}
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                {locale === "en"
                  ? "If you don't speak Thai, ask a friend or acquaintance to help translate when contacting agencies"
                  : locale === "mm"
                  ? "သင်ထိုင်းဘာသာမပြောနိုင်ပါက အေဂျင်စီများကိုဆက်သွယ်သည့်အခါ သူငယ်ချင်း သို့မဟုတ်အသိများအားဘာသာပြန်ပေးရန်တောင်းပါ"
                  : locale === "km"
                  ? "ប្រសិនបើអ្នកមិននិយាយភាសាថៃបាន សូមស្នើឱ្យមិត្តភក្តិ ឬអ្នកស្គាល់ជួយបកប្រែពេលទាក់ទងទៅស្ថាប័ន"
                  : "หากไม่พูดภาษาไทยได้ ขอให้เพื่อนหรือคนรู้จักช่วยแปลเมื่อติดต่อหน่วยงาน"}
              </li>
            </ul>
          </section>
        </div>
      </main>
      <SOSBar />
    </div>
  );
}
