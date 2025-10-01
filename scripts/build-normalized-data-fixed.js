const fs = require("fs").promises;
const { parse } = require("csv-parse/sync");

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

function generateId(text) {
  if (!text) return "";
  return text
    .toString()
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^\u0E00-\u0E7Fa-zA-Z0-9_]+/g, "")
    .replace(/__+/g, "_")
    .replace(/^_+/, "")
    .replace(/_+$/, "");
}

function processContent(content) {
  if (!content) return null;

  // Split by lines and process bullet points
  const lines = content.split("\n").filter((line) => line.trim());
  const processed = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("• ")) {
      processed.push({
        type: "bullet",
        level: 1,
        content: trimmed.substring(2).trim(),
      });
    } else if (trimmed.startsWith("◦ ")) {
      processed.push({
        type: "bullet",
        level: 2,
        content: trimmed.substring(2).trim(),
      });
    } else if (trimmed.startsWith("- ")) {
      processed.push({
        type: "bullet",
        level: 1,
        content: trimmed.substring(2).trim(),
      });
    } else {
      processed.push({
        type: "text",
        level: 0,
        content: trimmed,
      });
    }
  }

  return {
    raw: content,
    structured: processed,
  };
}

async function buildNormalizedData() {
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

    // Extract unique categories
    const categories = [
      ...new Set(rows.map((r) => r["หมวดหมู่"]?.trim()).filter(Boolean)),
    ].map((name) => ({
      id: generateId(name),
      name: name,
      slug: slugify(name),
    }));

    // Process topics
    const topics = rows
      .filter((r) => r["หัวข้อ"]?.trim())
      .map((r, index) => {
        const topic = r["หัวข้อ"]?.trim();
        const category = r["หมวดหมู่"]?.trim();
        const categoryId = generateId(category);

        return {
          id: generateId(topic),
          slug: slugify(topic),
          title: topic,
          category: {
            id: categoryId,
            name: category,
          },
          sections: {
            law: processContent(r["กฎหมายที่ให้สิทธิ"]?.trim()),
            rights: processContent(r["รู้สิทธิตัวเอง"]?.trim()),
            identification: processContent(r["วิธีสังเกตุ"]?.trim()),
            selfHelp: processContent(r["วิธีช่วยตัวเอง"]?.trim()),
            remarks: processContent(r["remark"]?.trim()),
          },
          // Legacy format for backward compatibility
          legacy: {
            category: category,
            topic: topic,
            law: r["กฎหมายที่ให้สิทธิ"]?.trim() || undefined,
            knowYourRights: r["รู้สิทธิตัวเอง"]?.trim() || undefined,
            howToIdentify: r["วิธีสังเกตุ"]?.trim() || undefined,
            selfHelp: r["วิธีช่วยตัวเอง"]?.trim() || undefined,
            remark: r["remark"]?.trim() || undefined,
            slug: slugify(topic),
          },
          metadata: {
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            version: "1.0.0",
            source: "source.csv",
            rowIndex: index + 1,
          },
        };
      });

    // Group topics by category
    const topicsByCategory = topics.reduce((acc, topic) => {
      const categoryId = topic.category.id;
      if (!acc[categoryId]) {
        acc[categoryId] = {
          category: topic.category,
          topics: [],
        };
      }
      acc[categoryId].topics.push(topic);
      return acc;
    }, {});

    // Create normalized data structure
    const normalizedData = {
      metadata: {
        version: "2.0.0",
        generatedAt: new Date().toISOString(),
        source: "source.csv",
        totalTopics: topics.length,
        totalCategories: categories.length,
        description:
          "Normalized RFID Rights Guide data with structured content and legacy compatibility",
      },
      categories: categories,
      topics: topics,
      topicsByCategory: topicsByCategory,
      // Legacy flat format for backward compatibility
      legacy: {
        flat: topics.map((t) => t.legacy),
        grouped: topics.reduce((acc, topic) => {
          const key = topic.title;
          (acc[key] ??= []).push(topic.legacy);
          return acc;
        }, {}),
      },
    };

    console.log("📁 Creating output directory...");
    await fs.mkdir("public/data", { recursive: true });

    console.log("💾 Writing normalized JSON file...");
    await fs.writeFile(
      "public/data/data_normalized.json",
      JSON.stringify(normalizedData, null, 2),
      "utf8"
    );

    // Also update the existing flat and grouped files for compatibility
    await fs.writeFile(
      "public/data/data_flat.json",
      JSON.stringify(normalizedData.legacy.flat, null, 2),
      "utf8"
    );

    await fs.writeFile(
      "public/data/data_grouped.json",
      JSON.stringify(normalizedData.legacy.grouped, null, 2),
      "utf8"
    );

    // Create a schema file for reference
    const schema = {
      description: "Schema for normalized RFID Rights Guide data",
      version: "2.0.0",
      structure: {
        metadata: {
          type: "object",
          description: "Information about the data generation",
        },
        categories: {
          type: "array",
          description: "Available topic categories",
          items: {
            id: "string (generated from name)",
            name: "string (original Thai name)",
            slug: "string (URL-friendly version)",
          },
        },
        topics: {
          type: "array",
          description: "All topics with structured content",
          items: {
            id: "string (generated from title)",
            slug: "string (URL-friendly version)",
            title: "string (original Thai title)",
            category: "object (category reference)",
            sections: "object (structured content with bullet points)",
            legacy: "object (backward compatibility format)",
            metadata: "object (creation info)",
          },
        },
        topicsByCategory: {
          type: "object",
          description: "Topics grouped by category ID",
        },
        legacy: {
          type: "object",
          description: "Backward compatible data formats",
        },
      },
    };

    await fs.writeFile(
      "public/data/schema.json",
      JSON.stringify(schema, null, 2),
      "utf8"
    );

    console.log(`✅ Successfully processed ${topics.length} topics`);
    console.log(`📂 Categories: ${categories.length}`);
    console.log(`🏷️  Categories: ${categories.map((c) => c.name).join(", ")}`);
    console.log(`📄 Files generated:`);
    console.log(`   - data_normalized.json (new structured format)`);
    console.log(`   - data_flat.json (legacy compatibility)`);
    console.log(`   - data_grouped.json (legacy compatibility)`);
    console.log(`   - schema.json (data structure reference)`);
  } catch (error) {
    console.error("❌ Error processing data:", error);
    process.exit(1);
  }
}

buildNormalizedData();
