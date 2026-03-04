import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

function slugify(text: string): string {
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

export const dynamic = "force-dynamic"; // Disable caching for development

export async function GET() {
  try {
    const csvPath = path.join(process.cwd(), "data", "source.csv");
    const csvPathEn = path.join(process.cwd(), "data", "english-source.csv");
    const csvPathMm = path.join(process.cwd(), "data", "myanmar-content.csv");

    // Check if files exist
    if (!fs.existsSync(csvPath)) {
      return NextResponse.json(
        { error: "CSV file not found" },
        { status: 404 }
      );
    }

    // Read Thai CSV
    const csvContent = fs.readFileSync(csvPath, "utf-8");
    const rows = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      bom: true,
      relax_column_count: true,
    }) as Record<string, string>[];

    // Read English CSV if it exists
    let rowsEn: Record<string, string>[] = [];
    if (fs.existsSync(csvPathEn)) {
      const csvContentEn = fs.readFileSync(csvPathEn, "utf-8");
      rowsEn = parse(csvContentEn, {
        columns: true,
        skip_empty_lines: true,
        bom: true,
        relax_column_count: true,
      }) as Record<string, string>[];
    }

    // Read Myanmar CSV if it exists
    let rowsMm: Record<string, string>[] = [];
    if (fs.existsSync(csvPathMm)) {
      const csvContentMm = fs.readFileSync(csvPathMm, "utf-8");
      rowsMm = parse(csvContentMm, {
        columns: true,
        skip_empty_lines: true,
        bom: true,
        relax_column_count: true,
      }) as Record<string, string>[];
    }

    const data = rows
      .filter((r) => r["หัวข้อ"]?.trim())
      .map((r, index) => {
        // Parse multiple law URLs separated by semicolon
        const lawUrlString = r["กฎหมายที่อ้างอิง"]?.trim();
        const lawUrls = lawUrlString
          ? lawUrlString
              .split(";")
              .map((url) => url.trim())
              .filter(Boolean)
          : undefined;

        // Get corresponding English row (same index)
        const enRow = rowsEn[index] || {};

        // Get corresponding Myanmar row (same index)
        const mmRow = rowsMm[index] || {};

        return {
          category: r["หมวดหมู่"]?.trim() || "",
          topic: r["หัวข้อ"]?.trim() || "",
          law: r["กฎหมายที่ให้สิทธิ"]?.trim() || undefined,
          lawUrls: lawUrls,
          knowYourRights: r["รู้สิทธิตัวเอง"]?.trim() || undefined,
          howToIdentify: r["วิธีสังเกตุ"]?.trim() || undefined,
          selfHelp: r["วิธีช่วยตัวเอง"]?.trim() || undefined,
          remark: r["remark"]?.trim() || undefined,
          videoUrl: r["videoUrl"]?.trim() || undefined,
          slug: slugify(r["หัวข้อ"] || ""),
          // English translations
          categoryEn: enRow["Category"]?.trim() || undefined,
          topicEn: enRow["Topic"]?.trim() || undefined,
          lawEn: enRow["Law Granting Rights"]?.trim() || undefined,
          knowYourRightsEn: enRow["Know Your Rights"]?.trim() || undefined,
          howToIdentifyEn:
            enRow["How to Observe (Signs of Violation)"]?.trim() || undefined,
          selfHelpEn: enRow["How to Help Yourself"]?.trim() || undefined,
          // Myanmar translations
          categoryMm: mmRow["အမျိုးအစား"]?.trim() || undefined,
          topicMm:
            mmRow["ကြုံရတဲ့အကြောင်းအရာ"]?.trim() || undefined,
          lawMm: mmRow["အခွင့်အရေးရနိုင်တဲ့ဥပဒေတွေ"]?.trim() || undefined,
          knowYourRightsMm:
            mmRow["ကိုယ့်အခွင့်အရေးကိုယ်သိပါ"]?.trim() || undefined,
          howToIdentifyMm:
            mmRow["အခွင့်အရေးချိုးဖောက်တဲ့လက္ခဏာရပ်တွေ"]?.trim() ||
            undefined,
          selfHelpMm:
            mmRow["ကိုယ့်ကိုယ်ကိုကူနိုင်မယ့်နည်းလမ်းတွေ"]?.trim() || undefined,
        };
      });

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store, max-age=0", // No caching in development
      },
    });
  } catch (error) {
    console.error("Error reading CSV:", error);
    return NextResponse.json(
      { error: "Failed to read CSV data" },
      { status: 500 }
    );
  }
}
