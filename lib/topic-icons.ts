export const topicIcons: Record<string, string> = {
  การเข้าเมือง: "/icons/topic-icons/imigrant-new.svg",
  ต่อใบอนุญาต: "/icons/topic-icons/document-new.svg",
  ค้ามนุษย์ระหว่างเดินทาง: "/icons/topic-icons/cross-border.svg",
  "ค่าจ้าง / OT": "/icons/topic-icons/payment.svg",
  "ประกันสังคม / เงินทดแทน": "/icons/topic-icons/know-your-right.svg",
  ความปลอดภัยในงาน: "/icons/topic-icons/workplace-new.svg",
  ค้ามนุษย์ในที่ทำงาน: "/icons/topic-icons/human-trafficking.svg",
  การศึกษา: "/icons/topic-icons/education.svg",
  คุ้มครองเด็ก: "/icons/topic-icons/child-protect-new.svg",
  ความรุนแรงในครอบครัว: "/icons/topic-icons/family-harm.svg",
  "ทะเบียน / สถานะบุคคล": "/icons/topic-icons/verify-new.svg",
  สิทธิรักษาพยาบาล: "/icons/topic-icons/health.svg",
};

export const getTopicIcon = (topicName: string): string => {
  return topicIcons[topicName] || "/icons/topic-icons/know-your-right.svg"; // Default icon
};
