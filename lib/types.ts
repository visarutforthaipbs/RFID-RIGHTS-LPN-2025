export type TopicRow = {
  category: string; // หมวดหมู่
  topic: string; // หัวข้อ
  law?: string; // กฎหมายที่ให้สิทธิ
  knowYourRights?: string; // รู้สิทธิตัวเอง
  howToIdentify?: string; // วิธีสังเกตุ
  selfHelp?: string; // วิธีช่วยตัวเอง
  remark?: string;
  slug: string; // derived kebab
};

export type DataGrouped = {
  [topic: string]: TopicRow[];
};
