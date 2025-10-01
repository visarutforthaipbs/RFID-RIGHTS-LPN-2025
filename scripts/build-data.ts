import fs from "node:fs/promises";
import { parse } from "csv-parse/sync";
import slugify from "@sindresorhus/slugify";
import type { TopicRow, DataGrouped } from "../lib/types";

interface RawCsvRow {
  [key: string]: string | undefined;
}

async function buildData() {
  try {
    console.log("🔍 Reading CSV file...");
    const input = await fs.readFile("data/source.csv", "utf8");

    console.log("📊 Parsing CSV data...");
    const rows: RawCsvRow[] = parse(input, {
      columns: true,
      skip_empty_lines: true,
      bom: true, // Handle UTF-8 BOM
    });

    console.log(`📝 Processing ${rows.length} rows...`);
    const flat: TopicRow[] = rows
      .map((r: RawCsvRow) => ({
        category: r["หมวดหมู่"]?.trim() || "",
        topic: r["หัวข้อ"]?.trim() || "",
        law: r["กฎหมายที่ให้สิทธิ"]?.trim() || undefined,
        knowYourRights: r["รู้สิทธิตัวเอง"]?.trim() || undefined,
        howToIdentify: r["วิธีสังเกตุ"]?.trim() || undefined,
        selfHelp: r["วิธีช่วยตัวเอง"]?.trim() || undefined,
        remark: r["remark"]?.trim() || undefined,
        slug: slugify(r["หัวข้อ"] || ""),
      }))
      .filter((row) => row.topic); // Remove empty topics

    console.log("🗂️  Grouping data by topic...");
    const grouped: DataGrouped = flat.reduce(
      (acc: DataGrouped, row: TopicRow) => {
        const key = row.topic;
        (acc[key] ??= []).push(row);
        return acc;
      },
      {}
    );

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
    console.log(`📊 Topics: ${Object.keys(grouped).length}`);
    console.log(
      `🏷️  Categories: ${[...new Set(flat.map((r) => r.category))].length}`
    );
  } catch (error) {
    console.error("❌ Error processing data:", error);
    process.exit(1);
  }
}

buildData();
