import fs from "fs";
import path from "path";
import { TopicRow } from "../lib/types";

// Function to generate URL-friendly slugs
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[ก-๙]/g, (match) => {
      // Thai character mapping for URL-friendly slugs
      const thaiMap: { [key: string]: string } = {
        ก: "ga",
        ข: "kh",
        ค: "kh",
        ฆ: "kh",
        ง: "ng",
        จ: "j",
        ฉ: "ch",
        ช: "ch",
        ซ: "s",
        ฌ: "ch",
        ญ: "y",
        ฎ: "d",
        ฏ: "t",
        ฐ: "th",
        ฑ: "th",
        ฒ: "th",
        ณ: "n",
        ด: "d",
        ต: "t",
        ถ: "th",
        ท: "th",
        ธ: "th",
        น: "n",
        บ: "b",
        ป: "p",
        ผ: "ph",
        ฝ: "f",
        พ: "ph",
        ฟ: "f",
        ภ: "ph",
        ม: "m",
        ย: "y",
        ร: "r",
        ล: "l",
        ว: "w",
        ศ: "s",
        ษ: "s",
        ส: "s",
        ห: "h",
        ฬ: "l",
        อ: "o",
        ฮ: "h",
        ะ: "a",
        "ั": "a",
        า: "a",
        ำ: "am",
        "ิ": "i",
        "ี": "i",
        "ึ": "ue",
        "ื": "ue",
        "ุ": "u",
        "ู": "u",
        เ: "e",
        แ: "ae",
        โ: "o",
        ใ: "ai",
        ไ: "ai",
        ๆ: "2",
        "่": "",
        "้": "",
        "๊": "",
        "๋": "",
        "็": "",
        "๎": "",
        "๏": "",
      };
      return thaiMap[match] || match;
    })
    .replace(/[^\w\s-]/g, "") // Remove special characters except hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .trim()
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
}

// Read the current data
const dataPath = path.join(process.cwd(), "public/data/data_flat.json");
const data: TopicRow[] = JSON.parse(fs.readFileSync(dataPath, "utf8"));

// Generate slugs for each item
const updatedData = data.map((item: TopicRow, index: number) => ({
  ...item,
  slug: item.slug || generateSlug(item.topic) || `topic-${index + 1}`,
}));

// Write back the updated data
fs.writeFileSync(dataPath, JSON.stringify(updatedData, null, 2), "utf8");

console.log("✅ Generated slugs for all topics");
console.log(
  "Sample slugs:",
  updatedData
    .slice(0, 5)
    .map((item: TopicRow) => ({ topic: item.topic, slug: item.slug }))
);
