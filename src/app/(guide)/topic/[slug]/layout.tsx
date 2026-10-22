import type { Metadata } from "next";
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

function getTopicBySlug(slug: string) {
  try {
    const csvPath = path.join(process.cwd(), "data", "source.csv");
    if (!fs.existsSync(csvPath)) return null;

    const csvContent = fs.readFileSync(csvPath, "utf-8");
    const rows = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      bom: true,
      relax_column_count: true,
    }) as Record<string, string>[];

    return rows.find((r) => slugify(r["หัวข้อ"] || "") === slug) || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);

  if (!topic) {
    return {
      title: "ไม่พบหัวข้อ - รู้สิทธิ ติดกระเป๋า",
    };
  }

  const topicName = topic["หัวข้อ"]?.trim() || "";
  const category = topic["หมวดหมู่"]?.trim() || "";
  const description =
    topic["รู้สิทธิตัวเอง"]?.trim()?.slice(0, 160) ||
    `ข้อมูลเกี่ยวกับ${topicName} สิทธิแรงงานข้ามชาติในประเทศไทย`;

  return {
    title: topicName,
    description,
    alternates: {
      canonical: `https://rfid-rights.vercel.app/topic/${slug}`,
    },
    openGraph: {
      title: `${topicName} - ${category}`,
      description,
      url: `https://rfid-rights.vercel.app/topic/${slug}`,
      images: [
        {
          url: "/images/thumnail-image.png",
          width: 1200,
          height: 630,
          alt: topicName,
        },
      ],
    },
  };
}

export default function TopicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
