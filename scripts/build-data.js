const fs = require("fs").promises;
const { parse } = require("csv-parse/sync");

function slugify(text) {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\u0E00-\u0E7Fa-zA-Z0-9\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

async function buildData() {
  try {
    console.log("🔍 Reading CSV file...");
    const input = await fs.readFile("data/source.csv", "utf8");

    console.log("📊 Parsing CSV data...");
    const rows = parse(input, {
      columns: true,
      skip_empty_lines: true,
      bom: true,
    });

    console.log(`📝 Processing ${rows.length} rows...`);
    const flat = rows
      .map((r) => ({
        category: r["หมวดหมู่"]?.trim() || "",
        topic: r["หัวข้อ"]?.trim() || "",
        law: r["กฎหมายที่ให้สิทธิ"]?.trim() || undefined,
        knowYourRights: r["รู้สิทธิตัวเอง"]?.trim() || undefined,
        howToIdentify: r["วิธีสังเกตุ"]?.trim() || undefined,
        selfHelp: r["วิธีช่วยตัวเอง"]?.trim() || undefined,
        remark: r["remark"]?.trim() || undefined,
        slug: slugify(r["หัวข้อ"] || ""),
      }))
      .filter((row) => row.topic);

    console.log("🗂️  Grouping data by topic...");
    const grouped = flat.reduce((acc, row) => {
      const key = row.topic;
      (acc[key] ??= []).push(row);
      return acc;
    }, {});

    console.log("📁 Creating output directory...");
    await fs.mkdir("public/data", { recursive: true });

    console.log("💾 Writing JSON files...");
    await fs.writeFile(
      "public/data/data_flat.json",
      JSON.stringify(flat, null, 2),
      "utf8"
    );

    await fs.writeFile(
      "public/data/data_grouped.json",
      JSON.stringify(grouped, null, 2),
      "utf8"
    );

    console.log(`✅ Successfully processed ${flat.length} rows`);
    console.log(`�� Topics: ${Object.keys(grouped).length}`);
    console.log(
      `🏷️  Categories: ${[...new Set(flat.map((r) => r.category))].length}`
    );
  } catch (error) {
    console.error("❌ Error processing data:", error);
    process.exit(1);
  }
}

buildData();
