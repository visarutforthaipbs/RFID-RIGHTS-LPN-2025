export type TopicRow = {
  category: string; // หมวดหมู่
  topic: string; // หัวข้อ
  law?: string; // กฎหมายที่ให้สิทธิ
  lawUrls?: string[]; // กฎหมายที่อ้างอิง (multiple URLs separated by semicolon)
  knowYourRights?: string; // รู้สิทธิตัวเอง
  howToIdentify?: string; // วิธีสังเกตุ
  selfHelp?: string; // วิธีช่วยตัวเอง
  remark?: string;
  slug: string; // derived kebab-case
  // English translations
  categoryEn?: string;
  topicEn?: string;
  lawEn?: string;
  knowYourRightsEn?: string;
  howToIdentifyEn?: string;
  selfHelpEn?: string;
  // Myanmar translations
  categoryMm?: string;
  topicMm?: string;
  lawMm?: string;
  knowYourRightsMm?: string;
  howToIdentifyMm?: string;
  selfHelpMm?: string;
};

export type DataGrouped = {
  [topic: string]: TopicRow[];
};
