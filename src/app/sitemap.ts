import { MetadataRoute } from "next";
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

const BASE_URL = "https://rfid-rights.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/topics`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/help`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/settings`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/volunteer`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Generate topic routes from CSV
  try {
    const csvPath = path.join(process.cwd(), "data", "source.csv");
    if (fs.existsSync(csvPath)) {
      const csvContent = fs.readFileSync(csvPath, "utf-8");
      const rows = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        bom: true,
        relax_column_count: true,
      }) as Record<string, string>[];

      const topicRoutes: MetadataRoute.Sitemap = rows
        .filter((r) => r["หัวข้อ"]?.trim())
        .map((r) => ({
          url: `${BASE_URL}/topic/${slugify(r["หัวข้อ"] || "")}`,
          lastModified: new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.7,
        }));

      return [...staticRoutes, ...topicRoutes];
    }
  } catch (error) {
    console.error("Error generating sitemap topic routes:", error);
  }

  return staticRoutes;
}
