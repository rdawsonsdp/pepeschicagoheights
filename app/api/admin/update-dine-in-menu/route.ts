import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface DineInItemUpdate {
  name: string;
  description?: string;
  price?: string;
  classification?: string;
  visualWeight?: string;
  image?: string;
}

interface DineInSectionUpdate {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  items: DineInItemUpdate[];
}

function escapeStr(v: string): string {
  return v.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function serializeItem(item: DineInItemUpdate): string {
  const parts: string[] = [];
  parts.push(`name: '${escapeStr(item.name)}'`);
  if (item.description) parts.push(`description: '${escapeStr(item.description)}'`);
  if (item.price) parts.push(`price: '${escapeStr(item.price)}'`);
  if (item.classification) parts.push(`classification: '${item.classification}' as const`);
  if (item.visualWeight) parts.push(`visualWeight: '${item.visualWeight}' as const`);
  if (item.image) parts.push(`image: '${escapeStr(item.image)}'`);
  return `      { ${parts.join(', ')} }`;
}

export async function POST(request: Request) {
  try {
    const sections: DineInSectionUpdate[] = await request.json();
    const filePath = path.join(process.cwd(), 'lib', 'dine-in-menu.ts');
    let content = fs.readFileSync(filePath, 'utf-8');

    for (const section of sections) {
      // Find the section by its id
      const idPattern = `id: '${section.id}'`;
      const idIndex = content.indexOf(idPattern);
      if (idIndex === -1) continue;

      // Find the items array for this section
      const itemsStart = content.indexOf('items: [', idIndex);
      if (itemsStart === -1) continue;

      // Make sure this items belongs to this section (not a later one)
      const between = content.slice(idIndex + idPattern.length, itemsStart);
      if (between.includes("id: '")) continue;

      const bracketStart = content.indexOf('[', itemsStart);
      // Find matching closing bracket
      let depth = 0;
      let bracketEnd = -1;
      for (let i = bracketStart; i < content.length; i++) {
        if (content[i] === '[') depth++;
        if (content[i] === ']') {
          depth--;
          if (depth === 0) { bracketEnd = i; break; }
        }
      }
      if (bracketEnd === -1) continue;

      // Also update section title and subtitle
      // Replace title
      const titlePrefix = "title: '";
      const titleIdx = content.indexOf(titlePrefix, idIndex);
      if (titleIdx !== -1 && titleIdx < itemsStart) {
        const titleValueStart = titleIdx + titlePrefix.length;
        let titleEnd = titleValueStart;
        while (titleEnd < content.length && !(content[titleEnd] === "'" && content[titleEnd - 1] !== '\\')) titleEnd++;
        content = content.slice(0, titleValueStart) + escapeStr(section.title) + content.slice(titleEnd);
        // Recalculate positions after edit
        const shift = escapeStr(section.title).length - (titleEnd - titleValueStart);
        // We need to re-find itemsStart and bracketEnd
        const newItemsStart = content.indexOf('items: [', idIndex);
        const newBracketStart = content.indexOf('[', newItemsStart);
        depth = 0;
        bracketEnd = -1;
        for (let i = newBracketStart; i < content.length; i++) {
          if (content[i] === '[') depth++;
          if (content[i] === ']') {
            depth--;
            if (depth === 0) { bracketEnd = i; break; }
          }
        }
        if (bracketEnd === -1) continue;

        // Build new items array
        const serializedItems = section.items.map(serializeItem).join(',\n');
        const replacement = `[\n${serializedItems},\n    ]`;
        content = content.slice(0, newBracketStart) + replacement + content.slice(bracketEnd + 1);
      } else {
        const serializedItems = section.items.map(serializeItem).join(',\n');
        const replacement = `[\n${serializedItems},\n    ]`;
        content = content.slice(0, bracketStart) + replacement + content.slice(bracketEnd + 1);
      }
    }

    fs.writeFileSync(filePath, content, 'utf-8');
    return NextResponse.json({ success: true, updatedCount: sections.length });
  } catch (error) {
    console.error('Failed to update dine-in-menu.ts:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
