import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { requireAdminSession } = await import('@/lib/admin-auth');
    const auth = await requireAdminSession();
    if (!auth.authorized) return auth.response;

    const { order }: { order: string[] } = await request.json();
    if (!Array.isArray(order) || order.length === 0) {
      return NextResponse.json({ success: false, error: 'Invalid order array' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'lib', 'products.ts');
    let content = fs.readFileSync(filePath, 'utf-8');

    // Find the CATERING_PRODUCTS array
    const arrayMarker = 'CateringProduct[] = [';
    const markerIdx = content.indexOf(arrayMarker);
    if (markerIdx === -1) {
      return NextResponse.json({ success: false, error: 'Could not find CATERING_PRODUCTS array' }, { status: 500 });
    }

    // Find the actual data array bracket (the `= [` part, not the `[]` in the type)
    const bracketStart = content.indexOf('= [', markerIdx) + 2;
    let depth = 0;
    let arrayEnd = -1;
    for (let i = bracketStart; i < content.length; i++) {
      if (content[i] === '[') depth++;
      if (content[i] === ']') {
        depth--;
        if (depth === 0) { arrayEnd = i + 1; break; }
      }
    }
    if (arrayEnd === -1) {
      return NextResponse.json({ success: false, error: 'Could not find end of array' }, { status: 500 });
    }

    const arrayContent = content.slice(bracketStart, arrayEnd);

    // Extract individual product blocks - only match top-level product ids
    // (indented with exactly 4 spaces, not deeper like variant option ids)
    const productBlocks: { id: string; block: string }[] = [];
    const idRegex = /\n    id:\s*'([^']+)'/g;
    let match;
    const idPositions: { id: string; start: number }[] = [];

    while ((match = idRegex.exec(arrayContent)) !== null) {
      idPositions.push({ id: match[1], start: match.index });
    }

    for (let i = 0; i < idPositions.length; i++) {
      // Find the start of this product block (the opening brace before the id)
      let blockStart = idPositions[i].start;
      while (blockStart > 0 && arrayContent[blockStart] !== '{') blockStart--;

      // Find end: either next product's opening brace or end of array
      let blockEnd: number;
      if (i + 1 < idPositions.length) {
        blockEnd = idPositions[i + 1].start;
        while (blockEnd > 0 && arrayContent[blockEnd] !== '{') blockEnd--;
        // Include the comma and whitespace before next block
        const between = arrayContent.slice(0, blockEnd);
        const lastComma = between.lastIndexOf(',');
        // blockEnd is just before the next block's opening brace
      } else {
        blockEnd = arrayContent.length - 1; // before the closing ]
      }

      // Use balanced braces to find exact block end
      let braceDepth = 0;
      let exactEnd = blockStart;
      for (let j = blockStart; j < arrayContent.length; j++) {
        if (arrayContent[j] === '{') braceDepth++;
        if (arrayContent[j] === '}') {
          braceDepth--;
          if (braceDepth === 0) { exactEnd = j + 1; break; }
        }
      }

      productBlocks.push({
        id: idPositions[i].id,
        block: arrayContent.slice(blockStart, exactEnd),
      });
    }

    // Reorder blocks based on the provided order
    const blockMap = new Map(productBlocks.map(b => [b.id, b.block]));
    const orderedBlocks: string[] = [];

    // First add items in the specified order
    for (const id of order) {
      const block = blockMap.get(id);
      if (block) {
        orderedBlocks.push(block);
        blockMap.delete(id);
      }
    }
    // Then add any remaining items not in the order array
    blockMap.forEach((block) => {
      orderedBlocks.push(block);
    });

    // Rebuild the array
    const newArrayContent = '[\n' + orderedBlocks.map(b => '  ' + b.trimStart()).join(',\n') + ',\n]';
    const newContent = content.slice(0, bracketStart) + newArrayContent + content.slice(arrayEnd);

    fs.writeFileSync(filePath, newContent, 'utf-8');

    return NextResponse.json({ success: true, reorderedCount: orderedBlocks.length });
  } catch (error) {
    console.error('Failed to reorder products:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
