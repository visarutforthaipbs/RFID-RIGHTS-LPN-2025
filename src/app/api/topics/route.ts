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

    // Check if file exists
    if (!fs.existsSync(csvPath)) {
      return NextResponse.json(
        { error: "CSV file not found" },
        { status: 404 }
      );
    }

    const csvContent = fs.readFileSync(csvPath, "utf-8");

    // Parse CSV using csv-parse
    const rows = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      bom: true,
    }) as Record<string, string>[];

    const data = rows
      .filter((r) => r["หัวข้อ"]?.trim())
      .map((r) => {
        // Parse multiple law URLs separated by semicolon
        const lawUrlString = r["กฎหมายที่อ้างอิง"]?.trim();
        const lawUrls = lawUrlString
          ? lawUrlString
              .split(";")
              .map((url) => url.trim())
              .filter(Boolean)
          : undefined;

        return {
          category: r["หมวดหมู่"]?.trim() || "",
          topic: r["หัวข้อ"]?.trim() || "",
          law: r["กฎหมายที่ให้สิทธิ"]?.trim() || undefined,
          lawUrls: lawUrls,
          knowYourRights: r["รู้สิทธิตัวเอง"]?.trim() || undefined,
          howToIdentify: r["วิธีสังเกตุ"]?.trim() || undefined,
          selfHelp: r["วิธีช่วยตัวเอง"]?.trim() || undefined,
          remark: r["remark"]?.trim() || undefined,
          slug: slugify(r["หัวข้อ"] || ""),
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
