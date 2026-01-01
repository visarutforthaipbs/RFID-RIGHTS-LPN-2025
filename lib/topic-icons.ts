export const topicIcons: Record<string, string> = {
  // เอกสารและการเดินทาง
  เริ่มต้นทำงานให้ถูกกฎหมาย: "/icons/topic-icons/imigrant-new.svg",
  วิธีต่ออายุบัตรและพาสปอร์ต: "/icons/topic-icons/document-new.svg",
  "ระวังโดนหลอก/นายหน้าเถื่อน": "/icons/topic-icons/cross-border.svg",
  // ทำงานและสวัสดิการ
  เช็กเงินเดือนและค่าโอที: "/icons/topic-icons/payment.svg",
  สิทธิเมื่อเจ็บป่วยหรือว่างงาน: "/icons/topic-icons/know-your-right.svg",
  ทำงานยังไงให้ปลอดภัย: "/icons/topic-icons/workplace-new.svg",
  เมื่อถูกบังคับหรือโดนเอาเปรียบ: "/icons/topic-icons/human-trafficking.svg",
  // ครอบครัวและชีวิตในชุมชน
  การเรียนและโรงเรียนของลูก: "/icons/topic-icons/education.svg",
  สิทธิและการดูแลเด็ก: "/icons/topic-icons/child-protect-new.svg",
  "ปัญหาในบ้าน/ความรุนแรง": "/icons/topic-icons/family-harm.svg",
  แจ้งเกิดและเอกสารสำคัญ: "/icons/topic-icons/verify-new.svg",
  "ป่วยแล้วไปหาหมอที่ไหน?": "/icons/topic-icons/health.svg",
};

export const getTopicIcon = (topicName: string): string => {
  return topicIcons[topicName] || "/icons/topic-icons/know-your-right.svg"; // Default icon
};
