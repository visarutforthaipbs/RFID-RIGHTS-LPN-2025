"use client";

import Link from "next/link";
import { useState } from "react";
import { Header } from "../components/Header";
import { useLanguage } from "../contexts/LanguageContext";
import { messages } from "../../../lib/i18n";
import { supabase } from "../../../lib/supabaseClient";

export default function VolunteerPage() {
  const { locale } = useLanguage();
  const t = messages[locale];
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    nationality: "",
    languages: "",
    address: "",
    phone: "",
    contact: "",
    reason: "",
    experience: "",
    agreed: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Volunteer page translations
  const volunteerText = {
    th: {
      pageTitle: "ร่วมเป็นอาสาสมัคร LPN",
      pageSubtitle:
        "ร่วมสร้างสังคมแห่งความยุติธรรม เคารพศักดิ์ศรีความเป็นมนุษย์",
      philosophy: "ปรัชญาการทำงาน",
      philosophyText:
        "เราทำงานเพื่อยกระดับคุณภาพชีวิตและความปลอดภัยของเด็ก เยาวชน และแรงงานข้ามชาติที่เปราะบาง ผ่านการปกป้องสิทธิและการให้ความช่วยเหลืออย่างเท่าเทียม ภายใต้ความเคารพศักดิ์ศรีความเป็นมนุษย์",
      spiritOfGiving: "จิตใจแห่งการให้",
      spiritText:
        "การช่วยเหลือเพื่อนมนุษย์ที่ตกทุกข์ได้ยาก คือเกียรติอันสูงสุด ที่ไม่อาจวัดค่าเป็นตัวเงินได้",
      whyVolunteer: "ทำไมต้องเป็นอาสาสมัคร LPN?",
      benefit1: "พัฒนาตนเองและเสริมพลัง (Empowerment)",
      benefit2: "เรียนรู้เรื่องสิทธิมนุษยชนและกฎหมายแรงงาน",
      benefit3: "เป็นส่วนหนึ่งของการเปลี่ยนแปลงสังคม",
      benefit4: "ได้รับการอบรมและพัฒนาอย่างต่อเนื่อง",
      benefit5: "มีโอกาสเป็นผู้นำเครือข่ายและวิทยากร",
      roles: "บทบาทของอาสาสมัคร",
      role1: "เป็นผู้สื่อสารข้อมูลและสิทธิแก่แรงงานข้ามชาติ",
      role2: "เป็นผู้เชื่อมประสานระหว่างแรงงานกับมูลนิธิ LPN",
      role3: "เป็นผู้นำกิจกรรมการเรียนรู้ในชุมชน",
      role4: "เป็นผู้ให้ข้อมูลเบื้องต้นและส่งต่อกรณีผู้ประสบปัญหา",
      role5: "เป็นแบบอย่างของการทำงานด้วยจิตอาสา",
      volunteerRights: "สิทธิของอาสาสมัคร",
      right1: "ได้รับการอบรมและพัฒนาอย่างต่อเนื่อง",
      right2: "ได้รับการคุ้มครองด้านความปลอดภัยขณะปฏิบัติงาน",
      right3: "ได้รับการยกย่องเชิดชูเมื่อมีผลงานดีเด่น",
      training: "การอบรมและพัฒนา",
      basicTraining: "อบรมพื้นฐาน",
      basicTrainingDesc:
        "สิทธิมนุษยชน, กฎหมายแรงงาน, กฎหมายคุ้มครองเด็ก, การสื่อสารระหว่างวัฒนธรรม",
      advancedTraining: "อบรมต่อเนื่อง",
      advancedTrainingDesc:
        "การเป็นผู้นำ, การให้คำปรึกษาเบื้องต้น, การรายงานกรณี",
      applyForm: "แบบฟอร์มสมัครอาสาสมัคร",
      personalInfo: "ข้อมูลส่วนตัว",
      name: "ชื่อ-สกุล",
      age: "อายุ",
      nationality: "สัญชาติ",
      languages: "ภาษาที่ใช้ได้",
      address: "ที่อยู่",
      phone: "เบอร์โทร",
      contact: "ช่องทางติดต่ออื่น (LINE, Facebook)",
      reason: "เหตุผลที่สนใจเป็นอาสาสมัคร",
      experience: "ประสบการณ์การทำงานหรือจิตอาสา",
      agreement:
        "ข้าพเจ้าขอสมัครเป็นอาสาสมัครของมูลนิธิ LPN และยินยอมปฏิบัติตามหลักการและจรรยาบรรณขององค์กร",
      submit: "ส่งใบสมัคร",
      contactLPN: "ติดต่อมูลนิธิ LPN",
      thankYou: "ขอบคุณสำหรับการสมัคร!",
      thankYouText: "ทีมงาน LPN จะติดต่อกลับเพื่อนัดสัมภาษณ์และปฐมนิเทศ",
      submitAnother: "ส่งใบสมัครอีกครั้ง",
    },
    en: {
      pageTitle: "Become an LPN Volunteer",
      pageSubtitle:
        "Join us in building a just society with respect for human dignity",
      philosophy: "Our Philosophy",
      philosophyText:
        "We work to improve the quality of life and safety of vulnerable children, youth, and migrant workers through rights protection and equal assistance, with respect for human dignity",
      spiritOfGiving: "Spirit of Giving",
      spiritText:
        "Helping fellow humans in need is the highest honor that cannot be measured in monetary terms",
      whyVolunteer: "Why Become an LPN Volunteer?",
      benefit1: "Self-development and Empowerment",
      benefit2: "Learn about human rights and labor laws",
      benefit3: "Be part of social change",
      benefit4: "Receive continuous training and development",
      benefit5: "Opportunity to become a network leader and trainer",
      roles: "Volunteer Roles",
      role1: "Communicate information and rights to migrant workers",
      role2: "Connect workers with LPN Foundation",
      role3: "Lead community learning activities",
      role4: "Provide initial information and case referrals",
      role5: "Be a role model for volunteer work",
      volunteerRights: "Volunteer Rights",
      right1: "Receive continuous training and development",
      right2: "Be protected during work activities",
      right3: "Be recognized for outstanding achievements",
      training: "Training & Development",
      basicTraining: "Basic Training",
      basicTrainingDesc:
        "Human rights, Labor laws, Child protection laws, Cross-cultural communication",
      advancedTraining: "Advanced Training",
      advancedTrainingDesc: "Leadership, Basic counseling, Case reporting",
      applyForm: "Volunteer Application Form",
      personalInfo: "Personal Information",
      name: "Full Name",
      age: "Age",
      nationality: "Nationality",
      languages: "Languages Spoken",
      address: "Address",
      phone: "Phone Number",
      contact: "Other Contact (LINE, Facebook)",
      reason: "Why do you want to volunteer?",
      experience: "Work or volunteer experience",
      agreement:
        "I apply to be a volunteer of LPN Foundation and agree to follow the organization's principles and code of conduct",
      submit: "Submit Application",
      contactLPN: "Contact LPN Foundation",
      thankYou: "Thank you for applying!",
      thankYouText:
        "The LPN team will contact you for an interview and orientation",
      submitAnother: "Submit Another Application",
    },
    mm: {
      pageTitle: "LPN စေတနာ့ဝန်ထမ်းအဖြစ် ပါဝင်ပါ",
      pageSubtitle:
        "လူ့ဂုဏ်သိက္ခာကို လေးစားသော တရားမျှတသောလူ့အဖွဲ့အစည်းတစ်ခုတည်ဆောက်ရာတွင် ပါဝင်ပါ",
      philosophy: "ကျွန်ုပ်တို့၏ အတွေးအမြင်",
      philosophyText:
        "လူ့ဂုဏ်သိက္ခာကိုလေးစားလျက် အခွင့်အရေးကာကွယ်ခြင်းနှင့် တန်းတူညီမျှသောအကူအညီများမှတဆင့် ထိခိုက်လွယ်သောကလေးများ၊ လူငယ်များနှင့် ရွှေ့ပြောင်းအလုပ်သမားများ၏ ဘဝအရည်အသွေးနှင့် လုံခြုံရေးကို မြှင့်တင်ရန် ကျွန်ုပ်တို့လုပ်ဆောင်ပါသည်",
      spiritOfGiving: "ပေးဆပ်မှုစိတ်ဓာတ်",
      spiritText:
        "အခက်အခဲဖြစ်နေသော လူသားများကိုကူညီခြင်းသည် ငွေကြေးဖြင့်တိုင်းတာ၍မရသော အမြင့်ဆုံးဂုဏ်သိက္ခာဖြစ်သည်",
      whyVolunteer: "အဘယ်ကြောင့် LPN စေတနာ့ဝန်ထမ်းဖြစ်သင့်သနည်း",
      benefit1:
        "ကိုယ်တိုင်ဖွံ့ဖြိုးတိုးတက်မှုနှင့် စွမ်းဆောင်ရည်မြှင့်တင်ခြင်း",
      benefit2: "လူ့အခွင့်အရေးနှင့် အလုပ်သမားဥပဒေများကို လေ့လာပါ",
      benefit3: "လူမှုပြောင်းလဲရေး၏ အစိတ်အပိုင်းတစ်ခုဖြစ်ပါ",
      benefit4: "စဉ်ဆက်မပြတ်သင်တန်းနှင့် ဖွံ့ဖြိုးတိုးတက်မှုရယူပါ",
      benefit5: "ကွန်ရက်ခေါင်းဆောင်နှင့် သင်တန်းဆရာဖြစ်ရန် အခွင့်အရေး",
      roles: "စေတနာ့ဝန်ထမ်း ကဏ္ဍများ",
      role1:
        "ရွှေ့ပြောင်းအလုပ်သမားများကို အချက်အလက်နှင့်အခွင့်အရေးများ ဆက်သွယ်ပါ",
      role2: "အလုပ်သမားများကို LPN ဖောင်ဒေးရှင်းနှင့် ချိတ်ဆက်ပါ",
      role3: "ရပ်ရွာသင်ယူမှုလှုပ်ရှားမှုများကို ဦးဆောင်ပါ",
      role4: "ကနဦးအချက်အလက်နှင့် ကိစ္စရပ်လွှဲပြောင်းမှုများပေးပါ",
      role5: "စေတနာ့ဝန်ထမ်းအလုပ်အတွက် စံနမူနာဖြစ်ပါ",
      volunteerRights: "စေတနာ့ဝန်ထမ်းအခွင့်အရေးများ",
      right1: "စဉ်ဆက်မပြတ်သင်တန်းနှင့် ဖွံ့ဖြိုးတိုးတက်မှုရယူပါ",
      right2: "အလုပ်လုပ်ဆောင်မှုများအတွင်း ကာကွယ်မှုရရှိပါ",
      right3: "ထူးချွန်သောအောင်မြင်မှုများအတွက် အသိအမှတ်ပြုခံရပါ",
      training: "သင်တန်းနှင့် ဖွံ့ဖြိုးတိုးတက်မှု",
      basicTraining: "အခြေခံသင်တန်း",
      basicTrainingDesc:
        "လူ့အခွင့်အရေး၊ အလုပ်သမားဥပဒေများ၊ ကလေးကာကွယ်ရေးဥပဒေများ၊ ယဉ်ကျေးမှုနှစ်ခုကြားဆက်သွယ်ရေး",
      advancedTraining: "အဆင့်မြင့်သင်တန်း",
      advancedTrainingDesc:
        "ခေါင်းဆောင်မှု၊ အခြေခံအကြံပေးခြင်း၊ ကိစ္စရပ်သတင်းပို့ခြင်း",
      applyForm: "စေတနာ့ဝန်ထမ်းလျှောက်လွှာပုံစံ",
      personalInfo: "ကိုယ်ရေးအချက်အလက်",
      name: "အမည်အပြည့်အစုံ",
      age: "အသက်",
      nationality: "နိုင်ငံသား",
      languages: "ပြောဆိုနိုင်သောဘာသာစကားများ",
      address: "လိပ်စာ",
      phone: "ဖုန်းနံပါတ်",
      contact: "အခြားဆက်သွယ်ရန် (LINE, Facebook)",
      reason: "အဘယ်ကြောင့် စေတနာ့ဝန်ထမ်းဖြစ်လိုသနည်း",
      experience: "အလုပ် သို့မဟုတ် စေတနာ့ဝန်ထမ်းအတွေ့အကြုံ",
      agreement:
        "LPN ဖောင်ဒေးရှင်း၏ စေတနာ့ဝန်ထမ်းအဖြစ် လျှောက်ထားပြီး အဖွဲ့အစည်း၏ မူဝါဒနှင့် ကျင့်ဝတ်များကို လိုက်နာရန် သဘောတူပါသည်",
      submit: "လျှောက်လွှာတင်ပါ",
      contactLPN: "LPN ဖောင်ဒေးရှင်းကို ဆက်သွယ်ပါ",
      thankYou: "လျှောက်ထားမှုအတွက် ကျေးဇူးတင်ပါသည်!",
      thankYouText:
        "LPN အဖွဲ့မှ အင်တာဗျူးနှင့် ဦးတည်ချက်သတ်မှတ်ရန် ဆက်သွယ်ပါမည်",
      submitAnother: "နောက်ထပ်လျှောက်လွှာတင်ပါ",
    },
    km: {
      pageTitle: "ក្លាយជាអ្នកស្ម័គ្រចិត្ត LPN",
      pageSubtitle:
        "ចូលរួមជាមួយយើងក្នុងការកសាងសង្គមដែលមានយុត្តិធម៌ ដោយគោរពសេចក្តីថ្លៃថ្នូររបស់មនុស្ស",
      philosophy: "ទស្សនវិជ្ជារបស់យើង",
      philosophyText:
        "យើងធ្វើការដើម្បីកែលម្អគុណភាពជីវិតនិងសុវត្ថិភាពរបស់កុមារ យុវជន និងកម្មករអន្តោប្រវេសន៍ដែលងាយរងគ្រោះ តាមរយៈការការពារសិទ្ធិ និងជំនួយស្មើភាពគ្នា ដោយគោរពសេចក្តីថ្លៃថ្នូររបស់មនុស្ស",
      spiritOfGiving: "ស្មារតីនៃការផ្តល់ឱ្យ",
      spiritText:
        "ការជួយមនុស្សដែលកំពុងមានតម្រូវការ គឺជាកិត្តិយសខ្ពស់បំផុតដែលមិនអាចវាស់វែងដោយប្រាក់បាន",
      whyVolunteer: "ហេតុអ្វីត្រូវក្លាយជាអ្នកស្ម័គ្រចិត្ត LPN?",
      benefit1: "ការអភិវឌ្ឍខ្លួនឯង និងការពង្រឹងសមត្ថភាព",
      benefit2: "រៀនអំពីសិទ្ធិមនុស្ស និងច្បាប់ការងារ",
      benefit3: "ក្លាយជាផ្នែកមួយនៃការផ្លាស់ប្តូរសង្គម",
      benefit4: "ទទួលបានការបណ្តុះបណ្តាល និងការអភិវឌ្ឍជាបន្តបន្ទាប់",
      benefit5: "មានឱកាសក្លាយជាអ្នកដឹកនាំបណ្តាញ និងគ្រូបង្គោល",
      roles: "តួនាទីអ្នកស្ម័គ្រចិត្ត",
      role1: "ទំនាក់ទំនងព័ត៌មាន និងសិទ្ធិទៅកម្មករអន្តោប្រវេសន៍",
      role2: "ភ្ជាប់កម្មករជាមួយមូលនិធិ LPN",
      role3: "ដឹកនាំសកម្មភាពរៀនសូត្រសហគមន៍",
      role4: "ផ្តល់ព័ត៌មានដំបូង និងការបញ្ជូនករណី",
      role5: "ជាគំរូសម្រាប់ការងារស្ម័គ្រចិត្ត",
      volunteerRights: "សិទ្ធិអ្នកស្ម័គ្រចិត org",
      right1: "ទទួលបានការបណ្តុះបណ្តាល និងការអភិវឌ្ឍជាបន្តបន្ទាប់",
      right2: "ទទួលបានការការពារក្នុងពេលធ្វើការ",
      right3: "ទទួលបានការទទួលស្គាល់សម្រាប់សមិទ្ធិផលល្អ",
      training: "ការបណ្តុះបណ្តាល និងការអភិវឌ្ឍ",
      basicTraining: "ការបណ្តុះបណ្តាលមូលដ្ឋាន",
      basicTrainingDesc:
        "សិទ្ធិមនុស្ស ច្បាប់ការងារ ច្បាប់ការពារកុមារ ការទំនាក់ទំនងអន្តរវប្បធម៌",
      advancedTraining: "ការបណ្តុះបណ្តាលកម្រិតខ្ពស់",
      advancedTrainingDesc:
        "ភាពជាអ្នកដឹកនាំ ការប្រឹក្សាមូលដ្ឋាន ការរាយការណ៍ករណី",
      applyForm: "ទម្រង់ពាក្យសុំអ្នកស្ម័គ្រចិត្ត",
      personalInfo: "ព័ត៌មានផ្ទាល់ខ្លួន",
      name: "ឈ្មោះពេញ",
      age: "អាយុ",
      nationality: "សញ្ជាតិ",
      languages: "ភាសាដែលនិយាយបាន",
      address: "អាសយដ្ឋាន",
      phone: "លេខទូរស័ព្ទ",
      contact: "ទំនាក់ទំនងផ្សេង (LINE, Facebook)",
      reason: "ហេតុអ្វីអ្នកចង់ក្លាយជាអ្នកស្ម័គ្រចិត្ត?",
      experience: "បទពិសោធន៍ការងារ ឬស្ម័គ្រចិត្ត",
      agreement:
        "ខ្ញុំដាក់ពាក្យដើម្បីក្លាយជាអ្នកស្ម័គ្រចិត្តរបស់មូលនិធិ LPN ហើយយល់ព្រមធ្វើតាមគោលការណ៍ និងក្រមប្រតិបត្តិរបស់អង្គការ",
      submit: "ដាក់ស្នើពាក្យសុំ",
      contactLPN: "ទាក់ទងមូលនិធិ LPN",
      thankYou: "សូមអរគុណសម្រាប់ការដាក់ពាក្យ!",
      thankYouText: "ក្រុម LPN នឹងទាក់ទងអ្នកសម្រាប់ការសម្ភាសន៍ និងការណែនាំ",
      submitAnother: "ដាក់ស្នើពាក្យសុំផ្សេងទៀត",
    },
  };

  const vt = volunteerText[locale] || volunteerText.th;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const { error: supabaseError } = await supabase
        .from("volunteers")
        .insert([
          {
            name: formData.name,
            age: formData.age ? parseInt(formData.age) : null,
            nationality: formData.nationality,
            languages: formData.languages,
            address: formData.address,
            phone: formData.phone,
            contact: formData.contact || null,
            reason: formData.reason,
            experience: formData.experience || null,
            agreed: formData.agreed,
          },
        ]);

      if (supabaseError) throw new Error(supabaseError.message);

      setSubmitted(true);
      setFormData({
        name: "",
        age: "",
        nationality: "",
        languages: "",
        address: "",
        phone: "",
        contact: "",
        reason: "",
        experience: "",
        agreed: false,
      });
    } catch (err: any) {
      setError(err.message || "Failed to submit volunteer application");
      console.error("Submission error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8" id="main-content">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <Link href="/" className="text-black hover:text-yellow-600">
              {t.home}
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-700">{vt.pageTitle}</span>
          </nav>

          {/* Hero Section */}
          <header className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-3xl p-8 mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white rounded-full p-4 shadow-lg">
                <svg
                  className="h-12 w-12 text-yellow-600"
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
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-3">
              {vt.pageTitle}
            </h1>
            <p className="text-lg text-black/80">{vt.pageSubtitle}</p>
          </header>

          {/* Philosophy Section */}
          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="bg-yellow-100 rounded-full p-3 flex-shrink-0">
                <svg
                  className="h-6 w-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {vt.philosophy}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {vt.philosophyText}
                </p>
              </div>
            </div>
          </section>

          {/* Spirit of Giving */}
          <section className="bg-gradient-to-r from-black to-gray-800 rounded-2xl p-6 mb-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <svg
                className="h-6 w-6 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
              <h3 className="text-xl font-semibold text-yellow-400">
                {vt.spiritOfGiving}
              </h3>
              <svg
                className="h-6 w-6 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
            <p className="text-white text-lg italic">
              &quot;{vt.spiritText}&quot;
            </p>
          </section>

          {/* Why Volunteer & Roles - Side by Side on Desktop */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Why Volunteer */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-yellow-100 rounded-full p-2 mr-3">
                  <svg
                    className="h-5 w-5 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </span>
                {vt.whyVolunteer}
              </h2>
              <ul className="space-y-3">
                {[
                  vt.benefit1,
                  vt.benefit2,
                  vt.benefit3,
                  vt.benefit4,
                  vt.benefit5,
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Volunteer Roles */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-black rounded-full p-2 mr-3">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </span>
                {vt.roles}
              </h2>
              <ul className="space-y-3">
                {[vt.role1, vt.role2, vt.role3, vt.role4, vt.role5].map(
                  (role, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-6 h-6 bg-black text-yellow-400 rounded-full text-center text-sm font-medium mr-3 flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{role}</span>
                    </li>
                  )
                )}
              </ul>
            </section>
          </div>

          {/* Volunteer Rights */}
          <section className="bg-yellow-50 rounded-2xl border border-yellow-200 p-6 mb-6">
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
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              {vt.volunteerRights}
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[vt.right1, vt.right2, vt.right3].map((right, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-4 border border-yellow-100"
                >
                  <div className="flex items-center gap-3">
                    <span className="bg-yellow-400 text-black rounded-full w-8 h-8 flex items-center justify-center">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                    <span className="text-gray-800">{right}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Training Section */}
          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="bg-yellow-100 rounded-full p-2 mr-3">
                <svg
                  className="h-5 w-5 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </span>
              {vt.training}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  {vt.basicTraining}
                </h3>
                <p className="text-gray-700 text-sm">{vt.basicTrainingDesc}</p>
              </div>
              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  {vt.advancedTraining}
                </h3>
                <p className="text-gray-700 text-sm">
                  {vt.advancedTrainingDesc}
                </p>
              </div>
            </div>
          </section>

          {/* Application Form */}
          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center flex items-center justify-center gap-2">
              <svg
                className="h-7 w-7 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              {vt.applyForm}
            </h2>

            {submitted ? (
              <div className="text-center py-8">
                <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="h-10 w-10 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {vt.thankYou}
                </h3>
                <p className="text-gray-600 mb-6">{vt.thankYouText}</p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: "",
                      age: "",
                      nationality: "",
                      languages: "",
                      address: "",
                      phone: "",
                      contact: "",
                      reason: "",
                      experience: "",
                      agreed: false,
                    });
                  }}
                  className="px-6 py-3 bg-yellow-400 text-black rounded-xl font-medium hover:bg-yellow-300 transition-colors"
                >
                  {vt.submitAnother}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <h3 className="font-semibold text-gray-800 mb-4">
                    {vt.personalInfo}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {vt.name} *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {vt.age} *
                      </label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                        min="18"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {vt.nationality} *
                      </label>
                      <input
                        type="text"
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {vt.languages} *
                      </label>
                      <input
                        type="text"
                        name="languages"
                        value={formData.languages}
                        onChange={handleChange}
                        required
                        placeholder={
                          locale === "th"
                            ? "เช่น ไทย, พม่า, อังกฤษ"
                            : "e.g., Thai, Myanmar, English"
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {vt.phone} *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {vt.contact}
                      </label>
                      <input
                        type="text"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {vt.address} *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {vt.reason} *
                  </label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {vt.experience}
                  </label>
                  <textarea
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all resize-none"
                  />
                </div>

                <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreed"
                      checked={formData.agreed}
                      onChange={handleChange}
                      required
                      className="mt-1 w-5 h-5 text-yellow-500 border-gray-300 rounded focus:ring-yellow-400"
                    />
                    <span className="text-gray-800">{vt.agreement}</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-yellow-400 text-black rounded-xl font-semibold text-lg hover:bg-yellow-300 transition-colors shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {submitting ? "ส่งข้อมูล..." : vt.submit}
                </button>
              </form>
            )}
          </section>

          {/* Contact LPN */}
          <section className="bg-black rounded-2xl p-6 text-center">
            <h2 className="text-xl font-semibold text-yellow-400 mb-4">
              {vt.contactLPN}
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="tel:084-121-609"
                className="inline-flex items-center px-5 py-3 bg-yellow-400 text-black rounded-xl font-medium hover:bg-yellow-300 transition-colors"
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
                084-121-609
              </a>
              <a
                href="https://www.lpnfoundation.org/th"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-5 py-3 bg-white text-black rounded-xl font-medium hover:bg-gray-100 transition-colors"
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
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
                lpnfoundation.org
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
