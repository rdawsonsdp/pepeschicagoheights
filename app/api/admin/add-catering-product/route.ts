import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface NewProduct {
  id: string;
  title: string;
  description: string;
  image: string;
  categories: string[];
  pricingType: 'pan' | 'per-each';
  halfPrice?: number;
  fullPrice?: number;
  halfServesMin?: number;
  halfServesMax?: number;
  fullServesMin?: number;
  fullServesMax?: number;
  priceEach?: number;
}

function escapeStr(v: string): string {
  return v.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function buildProductBlock(p: NewProduct): string {
  const cats = p.categories.map(c => `'${c}'`).join(', ');

  let pricingStr: string;
  if (p.pricingType === 'pan') {
    pricingStr = `panPricing(${p.halfPrice ?? 0}, ${p.fullPrice ?? 0}, ${p.halfServesMin ?? 10}, ${p.halfServesMax ?? 15}, ${p.fullServesMin ?? 20}, ${p.fullServesMax ?? 30})`;
  } else {
    pricingStr = `{ type: 'per-each' as const, priceEach: ${p.priceEach ?? 0} }`;
  }

  return `  {
    id: '${escapeStr(p.id)}',
    title: '${escapeStr(p.title)}',
    description: '${escapeStr(p.description)}',
    image: '${escapeStr(p.image)}',
    categories: [${cats}],
    pricing: ${pricingStr},
    tags: [],
    menuEngineering: {
      classification: 'PLOWHORSE',
      foodCost: null,
      salesRank: null,
      placementPriority: null,
      visualWeight: 'medium',
      descriptionStrategy: 'maintain',
      badgeText: null,
      enhancedDescription: null,
      salesVelocity7d: null,
      salesVelocity30d: null,
      trendDirection: null,
      lastClassifiedAt: null,
    },
  }`;
}

export async function POST(request: Request) {
  try {
    const product: NewProduct = await request.json();
    const filePath = path.join(process.cwd(), 'lib', 'products.ts');
    let content = fs.readFileSync(filePath, 'utf-8');

    // Check for duplicate ID
    if (content.includes(`id: '${product.id}'`)) {
      return NextResponse.json(
        { success: false, error: `Product with ID '${product.id}' already exists` },
        { status: 400 },
      );
    }

    // Find the closing `];` of the CATERING_PRODUCTS array
    const arrayEnd = content.lastIndexOf('];');
    if (arrayEnd === -1) {
      return NextResponse.json(
        { success: false, error: 'Could not find CATERING_PRODUCTS array end' },
        { status: 500 },
      );
    }

    const block = buildProductBlock(product);
    content = content.slice(0, arrayEnd) + block + ',\n' + content.slice(arrayEnd);

    fs.writeFileSync(filePath, content, 'utf-8');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to add product:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
