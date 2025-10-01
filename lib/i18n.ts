// Define supported locales
export const locales = ["th", "mm", "km"] as const;
export const defaultLocale = "th" as const;

export type Locale = (typeof locales)[number];

// Simple messages for now - will be expanded later
export const messages = {
  th: {
    title: "รู้สิทธิ ติดกระเป๋า",
    search: "ค้นหา",
    categories: "หมวดหมู่",
    topics: "หัวข้อ",
    help: "ขอความช่วยเหลือ",
    knowYourRights: "รู้สิทธิตัวเอง",
    howToIdentify: "วิธีสังเกต",
    selfHelp: "วิธีช่วยตัวเอง",
    law: "กฎหมายที่ให้สิทธิ",
    contact: "ช่องทางติดต่อช่วยเหลือ",
    settings: "ตั้งค่า",
    about: "เกี่ยวกับ",
    privacy: "ความเป็นส่วนตัว",
  },
  mm: {
    title: "အခွင့်အရေးများ သိထားခြင်း",
    search: "ရှာဖွေပါ",
    categories: "အမျိုးအစားများ",
    topics: "အကြောင်းအရာများ",
    help: "အကူအညီတောင်းပါ",
    knowYourRights: "သင့်အခွင့်အရေးများကို သိပါ",
    howToIdentify: "မည်သို့ မှတ်မှတ်ရရ သိရှိရန်",
    selfHelp: "ကိုယ့်ကို ကိုယ် ကူညီနည်းများ",
    law: "အခွင့်အရေးပေးသော ဥပဒေ",
    contact: "အကူအညီရယူရန် ဆက်သွယ်ရမည့်နေရာများ",
    settings: "ဆက်တင်များ",
    about: "အကြောင်း",
    privacy: "ကိုယ်ရေးကိုယ်တာ လုံခြုံရေး",
  },
  km: {
    title: "ដឹងសិទ្ធិ ចាំទុកក្នុងកាបូប",
    search: "ស្វែងរក",
    categories: "ប្រភេទ",
    topics: "ប្រធានបទ",
    help: "សុំជំនួយ",
    knowYourRights: "ដឹងសិទ្ធិខ្លួនឯង",
    howToIdentify: "របៀបសម្គាល់",
    selfHelp: "របៀបជួយខ្លួនឯង",
    law: "ច្បាប់ផ្តល់សិទ្ធិ",
    contact: "ช่องทางទំនាក់ទំនងសុំជំនួយ",
    settings: "ការកំណត់",
    about: "អំពី",
    privacy: "ឯកជនភាព",
  },
};
