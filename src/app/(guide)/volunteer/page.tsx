"use client";

import Link from "next/link";
import { useState } from "react";
import { HandHeart } from "@phosphor-icons/react/dist/ssr/HandHeart";
import { Lightbulb } from "@phosphor-icons/react/dist/ssr/Lightbulb";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr/CheckCircle";
import { UsersThree } from "@phosphor-icons/react/dist/ssr/UsersThree";
import { ShieldCheck } from "@phosphor-icons/react/dist/ssr/ShieldCheck";
import { Check } from "@phosphor-icons/react/dist/ssr/Check";
import { GraduationCap } from "@phosphor-icons/react/dist/ssr/GraduationCap";
import { Certificate } from "@phosphor-icons/react/dist/ssr/Certificate";
import { NotePencil } from "@phosphor-icons/react/dist/ssr/NotePencil";
import { Phone } from "@phosphor-icons/react/dist/ssr/Phone";
import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr/ArrowSquareOut";
import { Header } from "../../components/Header";
import { SOSBar } from "../../components/SOSBar";
import { useLanguage } from "../../contexts/LanguageContext";
import { messages } from "../../../../lib/i18n";
import { getSupabase } from "../../../../lib/supabaseClient";

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
      const { error: supabaseError } = await getSupabase()
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
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to submit volunteer application";
      setError(errorMessage);
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
    <div className="min-h-screen bg-surface pb-24">
      <Header />

      <main className="container mx-auto px-4 py-8" id="main-content">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="crumb mb-6" aria-label="Breadcrumb">
            <Link href="/">{t.home}</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{vt.pageTitle}</span>
          </nav>

          {/* Hero Section */}
          <header className="bg-surface-secondary border border-separator rounded-xl p-8 mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="duo-accent text-label inline-flex p-2">
                <HandHeart size={48} weight="duotone" aria-hidden="true" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-label mb-3">
              {vt.pageTitle}
            </h1>
            <p className="text-lg text-label-secondary">{vt.pageSubtitle}</p>
          </header>

          {/* Philosophy Section */}
          <section className="card p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="text-label flex-shrink-0 pt-1">
                <Lightbulb size={26} aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-label mb-2">
                  {vt.philosophy}
                </h2>
                <p className="text-label-secondary">
                  {vt.philosophyText}
                </p>
              </div>
            </div>
          </section>

          {/* Spirit of Giving */}
          <section className="bg-surface-secondary border border-separator rounded-xl p-6 mb-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              
              <h3 className="text-xl font-semibold text-label">
                {vt.spiritOfGiving}
              </h3>
              
            </div>
            <p className="reading text-label-secondary text-lg">
              &quot;{vt.spiritText}&quot;
            </p>
          </section>

          {/* Why Volunteer & Roles - Side by Side on Desktop */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Why Volunteer */}
            <section className="card p-6">
              <h2 className="text-xl font-semibold text-label mb-4 flex items-center gap-2">
                <span className="text-label inline-flex">
                  <CheckCircle size={22} aria-hidden="true" />
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
                    <span className="inline-block w-2 h-2 bg-label-secondary rounded-full mt-3 mr-3 flex-shrink-0"></span>
                    <span className="text-label">{benefit}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Volunteer Roles */}
            <section className="card p-6">
              <h2 className="text-xl font-semibold text-label mb-4 flex items-center gap-2">
                <span className="text-label inline-flex">
                  <UsersThree size={22} aria-hidden="true" />
                </span>
                {vt.roles}
              </h2>
              <ul className="space-y-3">
                {[vt.role1, vt.role2, vt.role3, vt.role4, vt.role5].map(
                  (role, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-flex items-center justify-center w-7 h-7 bg-surface-tertiary text-label rounded-full text-sm font-semibold mr-3 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-label">{role}</span>
                    </li>
                  )
                )}
              </ul>
            </section>
          </div>

          {/* Volunteer Rights */}
          <section className="card p-6 mb-6">
            <h2 className="text-xl font-semibold text-label mb-4 flex items-center gap-2">
              <ShieldCheck size={26} aria-hidden="true" />
              {vt.volunteerRights}
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[vt.right1, vt.right2, vt.right3].map((right, index) => (
                <div
                  key={index}
                  className="bg-surface-secondary rounded-xl p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="bg-success-tint text-success-ink rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      <Check size={18} weight="bold" aria-hidden="true" />
                    </span>
                    <span className="text-label">{right}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Training Section */}
          <section className="card p-6 mb-8">
            <h2 className="text-xl font-semibold text-label mb-4 flex items-center gap-2">
              <span className="text-label inline-flex">
                <GraduationCap size={26} aria-hidden="true" />
              </span>
              {vt.training}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-surface-secondary rounded-xl p-4">
                <h3 className="font-semibold text-label mb-2 flex items-center gap-2">
                  <GraduationCap size={22} aria-hidden="true" />
                  {vt.basicTraining}
                </h3>
                <p className="text-label-secondary text-sm">{vt.basicTrainingDesc}</p>
              </div>
              <div className="bg-surface-secondary rounded-xl p-4">
                <h3 className="font-semibold text-label mb-2 flex items-center gap-2">
                  <Certificate size={22} aria-hidden="true" />
                  {vt.advancedTraining}
                </h3>
                <p className="text-label-secondary text-sm">
                  {vt.advancedTrainingDesc}
                </p>
              </div>
            </div>
          </section>

          {/* Application Form */}
          <section className="card p-6 mb-8">
            <h2 className="text-2xl font-semibold text-label mb-6 text-center flex items-center justify-center gap-2">
              <NotePencil size={26} aria-hidden="true" />
              {vt.applyForm}
            </h2>

            {submitted ? (
              <div className="text-center py-8">
                <div className="bg-success-tint text-success-ink rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <Check size={40} weight="bold" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold text-label mb-2">
                  {vt.thankYou}
                </h3>
                <p className="text-label-secondary mb-6">{vt.thankYouText}</p>
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
                  className="btn btn-secondary"
                >
                  {vt.submitAnother}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-critical-tint border border-critical rounded-xl p-4" role="alert">
                    <p className="text-critical-ink text-sm">{error}</p>
                  </div>
                )}
                <div className="bg-surface-secondary rounded-xl p-4 mb-4">
                  <h3 className="font-semibold text-label mb-4">
                    {vt.personalInfo}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="volunteer-name" className="block text-sm font-medium text-label mb-1">
                        {vt.name} *
                      </label>
                      <input
                        id="volunteer-name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="field-input px-4 py-3"
                      />
                    </div>
                    <div>
                      <label htmlFor="volunteer-age" className="block text-sm font-medium text-label mb-1">
                        {vt.age} *
                      </label>
                      <input
                        id="volunteer-age"
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                        min="18"
                        className="field-input px-4 py-3"
                      />
                    </div>
                    <div>
                      <label htmlFor="volunteer-nationality" className="block text-sm font-medium text-label mb-1">
                        {vt.nationality} *
                      </label>
                      <input
                        id="volunteer-nationality"
                        type="text"
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleChange}
                        required
                        className="field-input px-4 py-3"
                      />
                    </div>
                    <div>
                      <label htmlFor="volunteer-languages" className="block text-sm font-medium text-label mb-1">
                        {vt.languages} *
                      </label>
                      <input
                        id="volunteer-languages"
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
                        className="field-input px-4 py-3"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-surface-secondary rounded-xl p-4">
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="volunteer-phone" className="block text-sm font-medium text-label mb-1">
                        {vt.phone} *
                      </label>
                      <input
                        id="volunteer-phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="field-input px-4 py-3"
                      />
                    </div>
                    <div>
                      <label htmlFor="volunteer-contact" className="block text-sm font-medium text-label mb-1">
                        {vt.contact}
                      </label>
                      <input
                        id="volunteer-contact"
                        type="text"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        className="field-input px-4 py-3"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="volunteer-address" className="block text-sm font-medium text-label mb-1">
                      {vt.address} *
                    </label>
                    <input
                      id="volunteer-address"
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="field-input px-4 py-3"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="volunteer-reason" className="block text-sm font-medium text-label mb-1">
                    {vt.reason} *
                  </label>
                  <textarea
                    id="volunteer-reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="field-input px-4 py-3 resize-none"
                  />
                </div>

                <div>
                  <label htmlFor="volunteer-experience" className="block text-sm font-medium text-label mb-1">
                    {vt.experience}
                  </label>
                  <textarea
                    id="volunteer-experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    rows={3}
                    className="field-input px-4 py-3 resize-none"
                  />
                </div>

                <div className="bg-surface-secondary rounded-xl p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreed"
                      checked={formData.agreed}
                      onChange={handleChange}
                      required
                      className="mt-1 w-6 h-6 min-w-0 min-h-0 accent-[var(--accent)] rounded"
                    />
                    <span className="text-label">{vt.agreement}</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary btn-lg w-full text-lg"
                >
                  {submitting ? "ส่งข้อมูล..." : vt.submit}
                </button>
              </form>
            )}
          </section>

          {/* Contact LPN */}
          <section className="card p-6 text-center">
            <h2 className="text-xl font-semibold text-label mb-4">
              {vt.contactLPN}
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="tel:084-121-1609"
                aria-label="โทรหามูลนิธิ LPN 084-121-1609"
                className="btn btn-secondary"
              >
                <Phone size={20} weight="fill" aria-hidden="true" />
                084-121-1609
              </a>
              <a
                href="https://www.lpnfoundation.org/th"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="เว็บไซต์มูลนิธิ LPN (เปิดในแท็บใหม่)"
                className="btn btn-plain"
              >
                <ArrowSquareOut size={20} aria-hidden="true" />
                lpnfoundation.org
                <span className="sr-only"> (เปิดในแท็บใหม่)</span>
              </a>
            </div>
          </section>
        </div>
      </main>
      <SOSBar />
    </div>
  );
}
