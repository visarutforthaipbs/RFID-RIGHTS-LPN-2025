/**
 * Topic pictograms — Phosphor duotone with the #FFC314 second layer
 * (LPN One CI, BRAND.md rule 10). The SVG files under public/icons/topic-icons/
 * are copied from LPN/brand/assets/icons/phosphor/duotone/ (named by icons.json
 * concept) for OG/print use; on pages render <TopicIcon> (src/app/components/
 * TopicIcon.tsx), which draws the same Phosphor glyph inline so the ink layer
 * follows the text colour in dark mode.
 */
export type TopicIconName =
  | "identification-card"
  | "file-text"
  | "handshake"
  | "hand-coins"
  | "first-aid"
  | "shield-check"
  | "link-break"
  | "graduation-cap"
  | "baby"
  | "hand-palm"
  | "note-pencil"
  | "heartbeat"
  | "scales"
  | "users-four";

/** Thai topic title (data/source.csv "หัวข้อ") → Phosphor icon name. */
export const topicIconNames: Record<string, TopicIconName> = {
  // เอกสารและการเดินทาง
  เริ่มต้นทำงานให้ถูกกฎหมาย: "identification-card",
  วิธีต่ออายุบัตรและพาสปอร์ต: "file-text",
  "ระวังโดนหลอก/นายหน้าเถื่อน": "handshake",
  // ทำงานและสวัสดิการ
  เช็กเงินเดือนและค่าโอที: "hand-coins",
  สิทธิเมื่อเจ็บป่วยหรือว่างงาน: "first-aid",
  ทำงานยังไงให้ปลอดภัย: "shield-check",
  เมื่อถูกบังคับหรือโดนเอาเปรียบ: "link-break",
  // ครอบครัวและชีวิตในชุมชน
  การเรียนและโรงเรียนของลูก: "graduation-cap",
  สิทธิและการดูแลเด็ก: "baby",
  "ปัญหาในบ้าน/ความรุนแรง": "hand-palm",
  แจ้งเกิดและเอกสารสำคัญ: "note-pencil",
  "ป่วยแล้วไปหาหมอที่ไหน?": "heartbeat",
};

/** icons.json concept file for each Phosphor name (public/icons/topic-icons/<file>.svg). */
const iconFiles: Record<TopicIconName, string> = {
  "identification-card": "confiscated-docs",
  "file-text": "document",
  handshake: "broker-fraud",
  "hand-coins": "unpaid-wages",
  "first-aid": "work-injury",
  "shield-check": "watchdog",
  "link-break": "human-trafficking",
  "graduation-cap": "education",
  baby: "child",
  "hand-palm": "physical-abuse",
  "note-pencil": "note",
  heartbeat: "health",
  scales: "rights",
  "users-four": "community",
};

export const getTopicIconName = (topicName: string): TopicIconName =>
  topicIconNames[topicName] || "scales";

/** Static duotone SVG path (light surfaces / OG only — use <TopicIcon> in pages). */
export const getTopicIcon = (topicName: string): string =>
  `/icons/topic-icons/${iconFiles[getTopicIconName(topicName)]}.svg`;

/** Category (Thai key) → Phosphor name for the neutral category badge (regular weight). */
export const categoryIconNames: Record<string, TopicIconName> = {
  เอกสารและการเดินทาง: "identification-card",
  ทำงานและสวัสดิการ: "hand-coins",
  ครอบครัวและชีวิตในชุมชน: "users-four",
};
export const getCategoryIconName = (category: string): TopicIconName =>
  categoryIconNames[category] || "scales";
