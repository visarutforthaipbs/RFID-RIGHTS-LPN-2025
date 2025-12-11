export type TopicRow = {
  category: string; // หมวดหมู่
  topic: string; // หัวข้อ
  law?: string; // กฎหมายที่ให้สิทธิ
  lawUrls?: string[]; // กฎหมายที่อ้างอิง (multiple URLs separated by semicolon)
  knowYourRights?: string; // รู้สิทธิตัวเอง
  howToIdentify?: string; // วิธีสังเกตุ
  selfHelp?: string; // วิธีช่วยตัวเอง
  remark?: string;
  videoUrl?: string; // YouTube video URL
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

export interface Scenario {
  id: string;
  title: string;
  titleEn: string;
  titleMm: string;
  description: string;
  descriptionEn: string;
  descriptionMm: string;
  icon: string;
  iconType?: "emoji" | "image";
  color: {
    bg: string;
    border: string;
    text: string;
    hoverBg: string;
  };
  keywords: string[];
  keywordsEn: string[];
  keywordsMm: string[];
  category?: string;
  urgency?: "low" | "medium" | "high";
  priority?: boolean;
}
