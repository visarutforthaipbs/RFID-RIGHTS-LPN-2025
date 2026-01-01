const fs = require("fs");

// Read the CSV file
let csv = fs.readFileSync("data/source.csv", "utf8");

// Topic mappings (for the หัวข้อ column)
const topicMappings = {
  การเข้าเมือง: "มาทำงานให้ถูกกฎหมาย",
  ต่อใบอนุญาต: "วิธีต่อบัตร/ใบอนุญาต",
  "ค่าจ้าง / OT": "เช็กเงินเดือนและค่าโอที",
  "ประกันสังคม / เงินทดแทน": "สิทธิหาหมอ/ประกันสังคม",
  สิทธิรักษาพยาบาล: "เจ็บป่วย หาหมอที่ไหน?",
  "ทะเบียน / สถานะบุคคล": "แจ้งเกิด/ทำบัตรลูก",
  ค้ามนุษย์ในที่ทำงาน: "ถูกบังคับหรือโดนเอาเปรียบ",
};

// Category mappings (for the หมวดหมู่ column)
const categoryMappings = {
  เอกสารและการเดินทาง: "เรื่องวีซ่าและพาสปอร์ต",
  ทำงานและสวัสดิการ: "สิทธิทำงานและเงินเดือน",
  ครอบครัวและชีวิตในชุมชน: "การใช้ชีวิตและครอบครัว",
};

// Replace topics
for (const [old, newVal] of Object.entries(topicMappings)) {
  csv = csv.split(old).join(newVal);
}

// Replace categories
for (const [old, newVal] of Object.entries(categoryMappings)) {
  csv = csv.split(old).join(newVal);
}

fs.writeFileSync("data/source.csv", csv, "utf8");
console.log("Updated source.csv successfully!");
