import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import type { MenuEngineeringData, ProductPricing } from '@/lib/types';

interface ProductUpdate {
  title: string;
  description: string;
  image: string;
  pricing: ProductPricing;
  menuEngineering: MenuEngineeringData;
}

function escapeStr(v: string | null): string {
  if (v === null) return 'null';
  return `'${v.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

function numStr(v: number | null): string {
  return v === null ? 'null' : String(v);
}

/** Find the end of a balanced brace block starting at the opening brace */
function findMatchingBrace(content: string, start: number): number {
  let depth = 0;
  for (let i = start; i < content.length; i++) {
    if (content[i] === '{') depth++;
    if (content[i] === '}') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

/** Find the boundary of the next product block (or end of array) */
function findBlockEnd(content: string, idIndex: number): number {
  // Look for the next `  {` that starts a new product, or `];` that ends the array
  const nextProduct = content.indexOf("\n  {\n", idIndex + 10);
  const arrayEnd = content.indexOf('];', idIndex);
  if (nextProduct !== -1 && nextProduct < arrayEnd) return nextProduct;
  return arrayEnd;
}

/** Replace a simple string field like title: '...' or description: '...' */
function replaceStringField(
  content: string,
  fieldName: string,
  newValue: string,
  searchStart: number,
  searchEnd: number,
): string {
  // Match field: '...' (handling escaped quotes)
  const fieldPrefix = `${fieldName}: '`;
  const fieldIdx = content.indexOf(fieldPrefix, searchStart);
  if (fieldIdx === -1 || fieldIdx >= searchEnd) return content;

  const valueStart = fieldIdx + fieldPrefix.length;
  // Find the closing quote (not escaped)
  let valueEnd = valueStart;
  while (valueEnd < content.length) {
    if (content[valueEnd] === "'" && content[valueEnd - 1] !== '\\') break;
    valueEnd++;
  }

  const escaped = newValue.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  return content.slice(0, valueStart) + escaped + content.slice(valueEnd);
}

function buildMeBlock(data: MenuEngineeringData, indent: string): string {
  const i = indent + '  ';
  return `menuEngineering: {\n` +
    `${i}classification: '${data.classification}',\n` +
    `${i}foodCost: ${numStr(data.foodCost)},\n` +
    `${i}salesRank: ${numStr(data.salesRank)},\n` +
    `${i}placementPriority: ${numStr(data.placementPriority)},\n` +
    `${i}visualWeight: '${data.visualWeight}',\n` +
    `${i}descriptionStrategy: '${data.descriptionStrategy}',\n` +
    `${i}badgeText: ${escapeStr(data.badgeText)},\n` +
    `${i}enhancedDescription: ${escapeStr(data.enhancedDescription)},\n` +
    `${i}salesVelocity7d: ${numStr(data.salesVelocity7d)},\n` +
    `${i}salesVelocity30d: ${numStr(data.salesVelocity30d)},\n` +
    `${i}trendDirection: ${escapeStr(data.trendDirection)},\n` +
    `${i}lastClassifiedAt: ${escapeStr(data.lastClassifiedAt)},\n` +
    `${indent}}`;
}

function buildPricingStr(pricing: ProductPricing): string {
  if (pricing.type === 'pan') {
    const h = pricing.sizes.find(s => s.size === 'half');
    const f = pricing.sizes.find(s => s.size === 'full');
    if (h && f) {
      return `panPricing(${h.price}, ${f.price}, ${h.servesMin}, ${h.servesMax}, ${f.servesMin}, ${f.servesMax})`;
    }
  }
  if (pricing.type === 'per-each') {
    return `{ type: 'per-each' as const, priceEach: ${pricing.priceEach} }`;
  }
  if (pricing.type === 'per-person') {
    const min = pricing.minOrder ? `, minOrder: ${pricing.minOrder}` : '';
    return `{ type: 'per-person' as const, pricePerPerson: ${pricing.pricePerPerson}${min} }`;
  }
  if (pricing.type === 'per-dozen') {
    return `{ type: 'per-dozen' as const, pricePerDozen: ${pricing.pricePerDozen}, servesPerDozen: ${pricing.servesPerDozen} }`;
  }
  if (pricing.type === 'per-container') {
    return `{ type: 'per-container' as const, pricePerContainer: ${pricing.pricePerContainer}, servesPerContainer: ${pricing.servesPerContainer} }`;
  }
  // tray type
  if (pricing.type === 'tray') {
    return JSON.stringify(pricing);
  }
  return JSON.stringify(pricing);
}

export async function POST(request: Request) {
  try {
    const { requireAdminSession } = await import('@/lib/admin-auth');
    const auth = await requireAdminSession();
    if (!auth.authorized) return auth.response;

    const updates: Record<string, ProductUpdate> = await request.json();
    const filePath = path.join(process.cwd(), 'lib', 'products.ts');
    let content = fs.readFileSync(filePath, 'utf-8');

    // Process each product — iterate in reverse order of position to avoid index shifts
    const entries = Object.entries(updates)
      .map(([id, data]) => ({ id, data, idx: content.indexOf(`id: '${id}'`) }))
      .filter(e => e.idx !== -1)
      .sort((a, b) => b.idx - a.idx); // reverse order

    for (const { id, data, idx: idIndex } of entries) {
      const blockEnd = findBlockEnd(content, idIndex);

      // 1. Replace title
      content = replaceStringField(content, 'title', data.title, idIndex, blockEnd);

      // 2. Replace description
      content = replaceStringField(content, 'description', data.description, idIndex, blockEnd);

      // 3. Replace image
      content = replaceStringField(content, 'image', data.image, idIndex, blockEnd);

      // 4. Replace pricing — find `pricing: ` then the value (could be function call or object)
      const pricingPrefix = 'pricing: ';
      const pricingIdx = content.indexOf(pricingPrefix, idIndex);
      if (pricingIdx !== -1 && pricingIdx < findBlockEnd(content, idIndex)) {
        const pricingValueStart = pricingIdx + pricingPrefix.length;
        // Find end: either a balanced brace object or a function call ending with )
        let pricingEnd: number;
        if (content[pricingValueStart] === '{') {
          pricingEnd = findMatchingBrace(content, pricingValueStart);
          if (pricingEnd !== -1) pricingEnd += 1; // include the }
        } else {
          // Function call like panPricing(...)
          const parenEnd = content.indexOf(')', pricingValueStart);
          pricingEnd = parenEnd !== -1 ? parenEnd + 1 : -1;
        }
        if (pricingEnd !== -1) {
          const newPricing = buildPricingStr(data.pricing);
          content = content.slice(0, pricingValueStart) + newPricing + content.slice(pricingEnd);
        }
      }

      // 5. Replace menuEngineering block
      // Recalculate idIndex after previous replacements
      const newIdIndex = content.indexOf(`id: '${id}'`);
      if (newIdIndex === -1) continue;
      const newBlockEnd = findBlockEnd(content, newIdIndex);

      const meStart = content.indexOf('menuEngineering: {', newIdIndex);
      if (meStart !== -1 && meStart < newBlockEnd) {
        const braceStart = content.indexOf('{', meStart);
        const braceEnd = findMatchingBrace(content, braceStart);
        if (braceEnd !== -1) {
          // Detect indent from the line
          const lineStart = content.lastIndexOf('\n', meStart) + 1;
          const indent = content.slice(lineStart, meStart).replace(/[^\s]/g, '');
          const replacement = buildMeBlock(data.menuEngineering, indent);
          content = content.slice(0, meStart) + replacement + content.slice(braceEnd + 1);
        }
      }
    }

    fs.writeFileSync(filePath, content, 'utf-8');

    return NextResponse.json({ success: true, updatedCount: entries.length });
  } catch (error) {
    console.error('Failed to update products.ts:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 },
    );
  }
}
