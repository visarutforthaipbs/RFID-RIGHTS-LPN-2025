/**
 * UI strings for the worker-facing intake pages (/voice-report, /track).
 *
 * TH strings follow the shared vocabulary in brand/guideline.html §10.
 * MY and KM strings are PLACEHOLDERS written without a native-speaker check —
 * every MY/KM value below must be reviewed by LPN before launch
 * (see intake/pm/NEEDS.md). Khmer is hidden behind SHOW_KHMER until the
 * consent text has been reviewed (PRD v1.1 §7.1).
 */

export const SHOW_KHMER = false;

/** Version of the consent text the worker agrees to; sent as consent_version. */
export const CONSENT_VERSION = "2026-01";

export const HOTLINE_DISPLAY = "084-121-1609";
export const HOTLINE_TEL = "tel:+66841211609";
/**
 * PLACEHOLDER: LPN must supply the real Facebook Page username for Messenger
 * (https://m.me/<page-username>). Until then this points at the m.me root.
 */
export const MESSENGER_URL = "https://m.me/";

export type IntakeLang = "th" | "my" | "km";

export const LANGS: { code: IntakeLang; label: string; native: string }[] = [
  { code: "th", label: "ภาษาไทย", native: "ไทย" },
  { code: "my", label: "မြန်မာဘာသာ", native: "မြန်မာ" },
  ...(SHOW_KHMER ? [{ code: "km" as IntakeLang, label: "ភាសាខ្មែរ", native: "ខ្មែរ" }] : []),
];

export type Stage = "received" | "reviewing" | "in_progress" | "closed";
export const STAGES: Stage[] = ["received", "reviewing", "in_progress", "closed"];

type Strings = {
  appName: string;
  quickExit: string;
  quickExitAria: string;
  changeLanguage: string;
  chooseLanguage: string;
  chooseLanguageHint: string;
  // consent
  consentTitle: string;
  consentBody: string[];
  consentReviewNote: string;
  consentAgree: string;
  consentBack: string;
  // recorder
  recTitle: string;
  recSubtitle: string;
  recTapToStart: string;
  recPrivacyNote: string;
  recStart: string;
  recStop: string;
  recRecording: string;
  recRemaining: string;
  recStopped: string;
  recMaxReached: string;
  recListen: string;
  recRedo: string;
  recSend: string;
  recMicDenied: string;
  recUnsupported: string;
  recTooShort: string;
  recLevel: string;
  // upload
  uploading: string;
  uploadProgress: string;
  securityCheck: string;
  // fallback
  failTitle: string;
  failBody: string;
  callHotline: string;
  messenger: string;
  tryAgain: string;
  rateLimited: string;
  rejected: string;
  rejectedVerify: string;
  rejectedTooLong: string;
  // success
  successBadge: string;
  successTitle: string;
  successWriteDown: string;
  successNotSaved: string;
  successTrackHint: string;
  done: string;
  // help bar
  helpBarQuestion: string;
  helpBarTrack: string;
  // track
  trackTitle: string;
  trackIntro: string;
  trackLabel: string;
  trackPlaceholder: string;
  trackSubmit: string;
  trackChecking: string;
  trackInvalid: string;
  trackNotFoundTitle: string;
  trackNotFoundBody: string;
  trackTryLater: string;
  trackError: string;
  trackUpdated: string;
  trackAgain: string;
  stages: Record<Stage, string>;
  stepLabel: string;
  stepCurrent: string;
  stepDone: string;
};

const th: Strings = {
  appName: "รู้สิทธิ ติดกระเป๋า",
  quickExit: "ออกทันที",
  quickExitAria: "ออกทันที — ปิดหน้านี้และไปที่ Google",
  changeLanguage: "เปลี่ยนภาษา",
  chooseLanguage: "เลือกภาษา",
  chooseLanguageHint: "เลือกภาษาที่คุณถนัด เจ้าหน้าที่ LPN ฟังได้ทุกภาษา",
  consentTitle: "ก่อนอัดเสียง ขอให้คุณทราบ",
  consentBody: [
    "เสียงของคุณจะถูกส่งไปยังเจ้าหน้าที่มูลนิธิ LPN เท่านั้น เพื่อใช้ช่วยเหลือเรื่องของคุณ",
    "คุณไม่ต้องบอกชื่อจริง เบอร์โทร หรือที่อยู่ ถ้าไม่ต้องการ",
    "เสียงจะไม่ถูกเก็บไว้ในโทรศัพท์ของคุณ และจะถูกลบจากระบบของ LPN เมื่อปิดเรื่องแล้วตามระยะเวลาที่กำหนด",
    "คุณจะได้รหัสติดตามเรื่อง 8 ตัว ใช้ดูความคืบหน้าได้ที่หน้า “ติดตามเรื่อง”",
  ],
  consentReviewNote: "ข้อความฉบับร่าง — รอ LPN ตรวจทาน (consent 2026-01)",
  consentAgree: "เข้าใจแล้ว เริ่มอัดเสียง",
  consentBack: "กลับไปเลือกภาษา",
  recTitle: "เล่าเรื่องของคุณด้วยเสียง",
  recSubtitle: "พูดได้ไม่เกิน 3 นาที เจ้าหน้าที่ LPN จะฟังทุกเรื่อง",
  recTapToStart: "แตะเพื่อเริ่มอัด",
  recPrivacyNote: "ไม่ต้องบอกชื่อจริง · เสียงไม่ถูกเก็บในโทรศัพท์",
  recStart: "เริ่มอัดเสียง",
  recStop: "หยุดอัด",
  recRecording: "กำลังอัดเสียง",
  recRemaining: "เหลือเวลา",
  recStopped: "อัดเสียงเสร็จแล้ว ฟังก่อนส่ง หรืออัดใหม่ก็ได้",
  recMaxReached: "ครบ 3 นาทีแล้ว หยุดอัดอัตโนมัติ",
  recListen: "ฟังเสียงที่อัด",
  recRedo: "อัดใหม่",
  recSend: "ส่งเรื่อง",
  recMicDenied: "ยังใช้ไมโครโฟนไม่ได้ — กรุณาอนุญาตการใช้ไมโครโฟนในเบราว์เซอร์ หรือโทรสายด่วนแทน",
  recUnsupported: "เบราว์เซอร์นี้อัดเสียงไม่ได้ — กรุณาโทรสายด่วน หรือส่งข้อความทาง Messenger",
  recTooShort: "เสียงสั้นเกินไป ลองอัดใหม่อีกครั้ง",
  recLevel: "ระดับเสียง",
  uploading: "กำลังส่งเสียง…",
  uploadProgress: "ส่งแล้ว",
  securityCheck: "กำลังตรวจสอบความปลอดภัย…",
  failTitle: "ส่งไม่สำเร็จ",
  failBody: "ระบบรับเรื่องติดต่อไม่ได้ในขณะนี้ เสียงของคุณไม่ได้ถูกเก็บไว้ที่ไหน — ติดต่อเจ้าหน้าที่ได้ทางนี้",
  callHotline: "โทรสายด่วน LPN",
  messenger: "ส่งข้อความทาง Messenger",
  tryAgain: "ลองส่งอีกครั้ง",
  rateLimited: "มีการส่งเรื่องถี่เกินไป กรุณารอสักครู่แล้วลองใหม่ หรือโทรสายด่วน",
  rejected: "ระบบไม่รับไฟล์เสียงนี้ กรุณาอัดใหม่ หรือโทรสายด่วน",
  rejectedVerify: "การตรวจสอบความปลอดภัยไม่ผ่าน กรุณากด \"ลองส่งอีกครั้ง\" หรือโทรสายด่วน",
  rejectedTooLong: "เสียงยาวเกิน 3 นาที กรุณาอัดใหม่ให้สั้นลง",
  successBadge: "ส่งเรื่องแล้ว",
  successTitle: "จดรหัสนี้ไว้ — ใช้ดูความคืบหน้า",
  successWriteDown: "เขียนรหัสนี้ลงกระดาษ หรือถ่ายรูปหน้าจอไว้ รหัสจะไม่ถูกเก็บในโทรศัพท์",
  successNotSaved: "เมื่อกด “เสร็จแล้ว” รหัสจะหายจากหน้าจอทันที",
  successTrackHint: "ดูความคืบหน้าได้ที่หน้า “ติดตามเรื่อง”",
  done: "เสร็จแล้ว",
  helpBarQuestion: "ไม่อยากอัดเสียง?",
  helpBarTrack: "มีคำถาม? โทรหาเจ้าหน้าที่",
  trackTitle: "ติดตามเรื่อง",
  trackIntro: "กรอกรหัสติดตามเรื่อง 8 ตัวที่ได้รับหลังส่งเสียง",
  trackLabel: "รหัสติดตามเรื่อง",
  trackPlaceholder: "K7Q2 M9XD",
  trackSubmit: "ดูความคืบหน้า",
  trackChecking: "กำลังตรวจสอบ…",
  trackInvalid: "รหัสต้องมี 8 ตัว (ตัวอักษรและตัวเลข) ตรวจอีกครั้ง",
  trackNotFoundTitle: "ไม่พบรหัสนี้",
  trackNotFoundBody: "ตรวจรหัสอีกครั้ง — ตัว 0 กับ O และ 1 กับ I ดูคล้ายกัน ถ้ายังไม่พบ โทรสายด่วน LPN",
  trackTryLater: "ตรวจสอบบ่อยเกินไป กรุณารอประมาณ 1 ชั่วโมงแล้วลองใหม่",
  trackError: "ติดต่อระบบไม่ได้ในขณะนี้ ลองใหม่อีกครั้ง หรือโทรสายด่วน",
  trackUpdated: "อัปเดตล่าสุด",
  trackAgain: "ตรวจรหัสอื่น",
  stages: {
    received: "ได้รับเรื่องแล้ว",
    reviewing: "เจ้าหน้าที่กำลังตรวจสอบ",
    in_progress: "กำลังช่วยเหลือ",
    closed: "ปิดเรื่อง",
  },
  stepLabel: "ขั้นตอน",
  stepCurrent: "ขั้นตอนปัจจุบัน",
  stepDone: "เสร็จแล้ว",
};

// PLACEHOLDER (Burmese) — machine-assisted draft, pending LPN native-speaker review.
const my: Strings = {
  appName: "ရပိုင်ခွင့် သိရှိရေး",
  quickExit: "ချက်ချင်းထွက်",
  quickExitAria: "ချက်ချင်းထွက် — ဤစာမျက်နှာကိုပိတ်ပြီး Google သို့သွားမည်",
  changeLanguage: "ဘာသာစကားပြောင်းရန်",
  chooseLanguage: "ဘာသာစကားရွေးပါ",
  chooseLanguageHint: "သင်အကျွမ်းတဝင်ရှိသောဘာသာစကားကိုရွေးပါ LPN ဝန်ထမ်းများ ဘာသာစကားအားလုံးနားလည်ပါသည်",
  consentTitle: "အသံမသွင်းမီ သိထားရန်",
  consentBody: [
    "သင့်အသံကို LPN ဖောင်ဒေးရှင်းဝန်ထမ်းများထံသာ ပေးပို့မည်ဖြစ်ပြီး သင့်ကိစ္စကို ကူညီရန်အတွက်သာ အသုံးပြုပါမည်",
    "မလိုလားပါက အမည်ရင်း၊ ဖုန်းနံပါတ် သို့မဟုတ် လိပ်စာ ပြောရန်မလိုပါ",
    "အသံကို သင့်ဖုန်းထဲတွင် သိမ်းမထားပါ။ ကိစ္စပြီးဆုံးပြီး သတ်မှတ်ကာလကုန်လွန်ပါက LPN စနစ်မှ ဖျက်ပါမည်",
    "သင့်ကိစ္စကို ခြေရာခံရန် ကုဒ် ၈ လုံးရရှိပါမည်။ “ကိစ္စခြေရာခံ” စာမျက်နှာတွင် တိုးတက်မှုကို ကြည့်နိုင်ပါသည်",
  ],
  consentReviewNote: "မူကြမ်း — LPN စိစစ်ရန်ကျန်ရှိ (consent 2026-01)",
  consentAgree: "နားလည်ပါပြီ အသံသွင်းမည်",
  consentBack: "ဘာသာစကားရွေးရန် ပြန်သွားမည်",
  recTitle: "သင့်အဖြစ်အပျက်ကို အသံဖြင့်ပြောပြပါ",
  recSubtitle: "၃ မိနစ်အတွင်း ပြောနိုင်ပါသည်။ LPN ဝန်ထမ်းများ အားလုံးကို နားထောင်ပါမည်",
  recTapToStart: "စတင်အသံသွင်းရန် ထိပါ",
  recPrivacyNote: "အမည်ရင်းပြောရန်မလို · အသံကို ဖုန်းထဲသိမ်းမထားပါ",
  recStart: "အသံသွင်းစတင်မည်",
  recStop: "အသံသွင်းရပ်မည်",
  recRecording: "အသံသွင်းနေသည်",
  recRemaining: "ကျန်ချိန်",
  recStopped: "အသံသွင်းပြီးပါပြီ။ မပေးပို့မီ နားထောင်နိုင်သည် သို့မဟုတ် ပြန်သွင်းနိုင်သည်",
  recMaxReached: "၃ မိနစ်ပြည့်ပြီ။ အလိုအလျောက် ရပ်လိုက်ပါသည်",
  recListen: "သွင်းထားသောအသံကို နားထောင်ရန်",
  recRedo: "ပြန်သွင်းမည်",
  recSend: "ပေးပို့မည်",
  recMicDenied: "မိုက်ခရိုဖုန်း အသုံးမပြုနိုင်သေးပါ — ဘရောက်ဇာတွင် ခွင့်ပြုပါ သို့မဟုတ် အရေးပေါ်ဖုန်းခေါ်ပါ",
  recUnsupported: "ဤဘရောက်ဇာတွင် အသံသွင်းမရပါ — အရေးပေါ်ဖုန်းခေါ်ပါ သို့မဟုတ် Messenger မှ စာပို့ပါ",
  recTooShort: "အသံတိုလွန်းသည်။ ထပ်မံသွင်းပါ",
  recLevel: "အသံအဆင့်",
  uploading: "အသံပေးပို့နေသည်…",
  uploadProgress: "ပေးပို့ပြီး",
  securityCheck: "လုံခြုံရေးစစ်ဆေးနေသည်…",
  failTitle: "ပေးပို့မရပါ",
  failBody: "ယခုအချိန်တွင် စနစ်ကို ဆက်သွယ်မရပါ။ သင့်အသံကို မည်သည့်နေရာတွင်မှ သိမ်းမထားပါ — ဝန်ထမ်းများကို ဤနည်းဖြင့် ဆက်သွယ်ပါ",
  callHotline: "LPN အရေးပေါ်ဖုန်းခေါ်ရန်",
  messenger: "Messenger မှ စာပို့ရန်",
  tryAgain: "ထပ်မံပေးပို့ကြည့်ရန်",
  rateLimited: "ပေးပို့မှုမြောက်မြားစွာရှိနေသည်။ ခဏစောင့်ပြီး ထပ်ကြိုးစားပါ သို့မဟုတ် အရေးပေါ်ဖုန်းခေါ်ပါ",
  rejected: "ဤအသံဖိုင်ကို စနစ်လက်မခံပါ။ ပြန်သွင်းပါ သို့မဟုတ် အရေးပေါ်ဖုန်းခေါ်ပါ",
  rejectedVerify: "လုံခြုံရေးစစ်ဆေးမှု မအောင်မြင်ပါ။ ထပ်ပို့ကြည့်ပါ သို့မဟုတ် အရေးပေါ်ဖုန်းခေါ်ပါ",
  rejectedTooLong: "အသံသည် ၃ မိနစ်ထက် ရှည်နေသည်။ တိုတိုပြန်သွင်းပါ",
  successBadge: "ပေးပို့ပြီးပါပြီ",
  successTitle: "ဤကုဒ်ကို မှတ်ထားပါ — တိုးတက်မှုကြည့်ရန်",
  successWriteDown: "ဤကုဒ်ကို စက္ကူပေါ်ရေးထားပါ သို့မဟုတ် မျက်နှာပြင်ဓာတ်ပုံရိုက်ထားပါ။ ကုဒ်ကို ဖုန်းထဲသိမ်းမထားပါ",
  successNotSaved: "“ပြီးပါပြီ” နှိပ်လျှင် ကုဒ်သည် မျက်နှာပြင်မှ ချက်ချင်းပျောက်သွားပါမည်",
  successTrackHint: "“ကိစ္စခြေရာခံ” စာမျက်နှာတွင် တိုးတက်မှုကို ကြည့်နိုင်သည်",
  done: "ပြီးပါပြီ",
  helpBarQuestion: "အသံသွင်းမလိုလားဘူးလား?",
  helpBarTrack: "မေးစရာရှိလား? ဝန်ထမ်းကို ဖုန်းခေါ်ပါ",
  trackTitle: "ကိစ္စခြေရာခံ",
  trackIntro: "အသံပေးပို့ပြီးနောက် ရရှိသော ကုဒ် ၈ လုံးကို ထည့်ပါ",
  trackLabel: "ခြေရာခံကုဒ်",
  trackPlaceholder: "K7Q2 M9XD",
  trackSubmit: "တိုးတက်မှုကြည့်ရန်",
  trackChecking: "စစ်ဆေးနေသည်…",
  trackInvalid: "ကုဒ်တွင် ၈ လုံး (စာလုံးနှင့်ဂဏန်း) ရှိရမည်။ ပြန်စစ်ပါ",
  trackNotFoundTitle: "ဤကုဒ်ကို မတွေ့ပါ",
  trackNotFoundBody: "ကုဒ်ကို ပြန်စစ်ပါ — 0 နှင့် O၊ 1 နှင့် I ဆင်တူသည်။ မတွေ့သေးပါက LPN အရေးပေါ်ဖုန်းခေါ်ပါ",
  trackTryLater: "စစ်ဆေးမှု မြောက်မြားလွန်းသည်။ ၁ နာရီခန့်စောင့်ပြီး ထပ်ကြိုးစားပါ",
  trackError: "ယခုအချိန်တွင် စနစ်ကို ဆက်သွယ်မရပါ။ ထပ်ကြိုးစားပါ သို့မဟုတ် အရေးပေါ်ဖုန်းခေါ်ပါ",
  trackUpdated: "နောက်ဆုံးအပ်ဒေတ်",
  trackAgain: "အခြားကုဒ်စစ်ရန်",
  stages: {
    received: "ကိစ္စလက်ခံရရှိပြီ",
    reviewing: "ဝန်ထမ်းစိစစ်နေသည်",
    in_progress: "ကူညီဆောင်ရွက်နေသည်",
    closed: "ကိစ္စပိတ်ပြီ",
  },
  stepLabel: "အဆင့်",
  stepCurrent: "လက်ရှိအဆင့်",
  stepDone: "ပြီးစီး",
};

// PLACEHOLDER (Khmer) — hidden behind SHOW_KHMER; falls back to Thai for any
// string not yet translated. Must be fully reviewed by LPN before enabling.
const km: Strings = {
  ...th,
  appName: "ដឹងសិទ្ធិ",
  quickExit: "ចាកចេញភ្លាម",
  quickExitAria: "ចាកចេញភ្លាម — បិទទំព័រនេះ ហើយទៅ Google",
  changeLanguage: "ប្ដូរភាសា",
  chooseLanguage: "ជ្រើសរើសភាសា",
  recTitle: "និយាយរឿងរបស់អ្នកដោយសំឡេង",
  recSend: "ផ្ញើ",
  recRedo: "ថតម្ដងទៀត",
  done: "រួចរាល់",
  trackTitle: "តាមដានរឿង",
  stages: {
    received: "បានទទួលរឿងហើយ",
    reviewing: "បុគ្គលិកកំពុងពិនិត្យ",
    in_progress: "កំពុងជួយ",
    closed: "បិទរឿង",
  },
};

export const STRINGS: Record<IntakeLang, Strings> = { th, my, km };

export function t(lang: IntakeLang): Strings {
  return STRINGS[lang] ?? th;
}

/** Display an 8-char code as "K7Q2 M9XD". */
export function formatCode(code: string): string {
  const c = normaliseCode(code);
  return c.length > 4 ? `${c.slice(0, 4)} ${c.slice(4)}` : c;
}

/** Uppercase, strip spaces/hyphens/dots — the API wants the bare 8 chars. */
export function normaliseCode(input: string): string {
  return input.toUpperCase().replace(/[\s\-_.]/g, "");
}

export const CODE_RE = /^[0-9A-Z]{8}$/;
