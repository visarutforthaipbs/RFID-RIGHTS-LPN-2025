# 📚 Content Hierarchy System Guide

## Symbol Reference

Use these **exact symbols** at the start of each line in your CSV data:

| Symbol | Name         | Level | Rendering (LPN One CI)                         | Usage                            |
| ------ | ------------ | ----- | ---------------------------------------------- | -------------------------------- |
| `•`    | Bullet       | 1     | semibold label, collapsible row ≥ 44 px        | Main collapsible sections        |
| `◦`    | White Bullet | 2     | secondary label, collapsible row               | Sub-sections (can also collapse) |
| `▪`    | Small Square | 3     | secondary label, 2 px separator rail           | Detail points                    |
| `‣`    | Triangle     | 4     | secondary label, 2 px separator rail           | Sub-details                      |
| (none) | Plain text   | 0     | label                                          | Regular text without bullets     |

Levels are told apart by indentation, weight and the caret — **not by colour**
(brand rule: no hashed/level colours, yellow is reserved for the one primary
action, selection and focus). The whole block reads in IBM Plex Sans Thai
Looped (`.reading`).

---

## How to Use in CSV

### Basic Example:

```
• Main topic (click to expand/collapse)
◦ Sub-topic under main
▪ Detail under sub-topic
‣ Sub-detail
Plain text without any symbol
```

### Real Example:

```
• หากคุณไม่เคยเรียนในโรงเรียนมาก่อน
◦ 1. ใบเกิด (สูติบัตร) – ถ้ามีให้นำมาแสดง
◦ 2. ถ้าไม่มีสูติบัตร ให้ใช้หลักฐานอื่นแทน เช่น
▪ หนังสือรับรองการเกิด
▪ บัตรประชาชน
▪ สำเนาทะเบียนบ้านจากเจ้าบ้าน
◦ 3. ถ้าไม่มีทั้งสูติบัตรและเอกสารข้อ 2
▪ ให้ใช้เอกสารที่ทางราชการออกให้
‣ หรือเอกสารที่กระทรวงศึกษาธิการอนุญาต
```

---

## Features

### ✅ Auto-Collapse

- **Level 1** (`•`) and **Level 2** (`◦`) items with children automatically become collapsible
- The whole row is one button (Phosphor `caret-right` / `caret-down`), 44 px tall

### ✅ Auto-Link Detection

- Any URL in your text automatically becomes a clickable link
- Example: `https://example.com` → [https://example.com](https://example.com)

### ✅ Visual Hierarchy

- Each level has its own indentation and weight; a 2 px separator rail shows parent-child relationships
- Hover = secondary surface tint only (no motion, no colour change)

---

## How to Type These Symbols

### On Mac:

- `•` : **Option + 8**
- `◦` : **Option + Shift + 9** (or copy from here)
- `▪` : **Option + Shift + /** (or copy from here)
- `‣` : Copy from this guide

### On Windows:

- `•` : **Alt + 0149**
- `◦` : Copy from this guide
- `▪` : **Alt + 0162** or copy from here
- `‣` : Copy from this guide

### Easy Copy:

```
•
◦
▪
‣
```

---

## CSV Formatting Tips

1. **Start each line with the symbol** followed by a **space**

   - ✅ `• Text here`
   - ❌ `•Text here` (missing space)

2. **Nest items properly** - children must come after their parent

   ```
   • Parent
   ◦ Child of parent
   ▪ Child of ◦
   ◦ Another child of parent
   ```

3. **URLs are auto-detected** - just paste them directly

   ```
   • ดูข้อมูลเพิ่มเติมที่ https://example.com
   ```

4. **Mix Thai and English** - works perfectly with Unicode

---

## Live Reload

Since we're using the API route (`/api/topics`), your changes are **instant**:

1. Edit CSV file
2. Save file
3. Refresh browser ✨
4. See changes immediately!

No need to run `npm run build:data` anymore!

---

## Testing Your Hierarchy

Visit any topic page and check:

- ✅ Main points have collapse arrows if they have children
- ✅ Level 1 rows are semibold; deeper levels are indented behind a separator rail
- ✅ Indentation shows parent-child relationships
- ✅ URLs are clickable
- ✅ Clicking anywhere on the line toggles collapse

---

## Troubleshooting

**Problem**: Bullets not showing

- **Solution**: Make sure there's a space after the symbol: `• Text` not `•Text`

**Problem**: Wrong nesting

- **Solution**: Check that children come immediately after their parent

**Problem**: Symbol not recognized

- **Solution**: Copy the exact symbols from this guide

---

Created: 2025-10-22 · Restyled for LPN One CI (see DESIGN_SYSTEM.md)
Component: `/src/app/components/FormattedContent.tsx`
