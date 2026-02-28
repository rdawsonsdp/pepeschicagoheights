import * as fs from 'fs';
import * as path from 'path';
import type { CateringProductRow } from '../validate';

const OUTPUT_PATH = path.resolve(__dirname, '../../../lib/products.ts');

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function parseVariantOptions(raw: string): { id: string; label: string }[] {
  // Format: "beef:Beef|chicken:Chicken|cheese:Cheese"
  return raw.split('|').map((opt) => {
    const [id, label] = opt.split(':');
    return { id: id.trim(), label: (label || id).trim() };
  });
}

function buildPricing(row: CateringProductRow): string {
  switch (row.pricing_type) {
    case 'pan':
      return `panPricing(${row.half_price}, ${row.full_price}, ${row.half_serves_min}, ${row.half_serves_max}, ${row.full_serves_min}, ${row.full_serves_max})`;

    case 'tray': {
      const sizes: string[] = [];
      if (row.small_price != null) {
        sizes.push(
          `      { size: 'small' as const, price: ${row.small_price}, servesMin: ${row.small_serves_min}, servesMax: ${row.small_serves_max} }`
        );
      }
      if (row.medium_price != null) {
        sizes.push(
          `      { size: 'medium' as const, price: ${row.medium_price}, servesMin: ${row.medium_serves_min}, servesMax: ${row.medium_serves_max} }`
        );
      }
      if (row.large_price != null) {
        sizes.push(
          `      { size: 'large' as const, price: ${row.large_price}, servesMin: ${row.large_serves_min}, servesMax: ${row.large_serves_max} }`
        );
      }
      return `{ type: 'tray' as const, sizes: [\n${sizes.join(',\n')}\n    ] }`;
    }

    case 'per-each':
      return `{ type: 'per-each' as const, priceEach: ${row.price_each}${row.min_order ? `, minOrder: ${row.min_order}` : ''} }`;

    case 'per-person':
      return `{ type: 'per-person' as const, pricePerPerson: ${row.price_per_person}${row.min_order ? `, minOrder: ${row.min_order}` : ''} }`;

    case 'per-dozen':
      return `{ type: 'per-dozen' as const, pricePerDozen: ${row.price_per_dozen}, servesPerDozen: ${row.serves_per_dozen} }`;

    case 'per-container':
      return `{ type: 'per-container' as const, pricePerContainer: ${row.price_per_container}, servesPerContainer: ${row.serves_per_container} }`;

    default:
      throw new Error(`Unknown pricing type: ${row.pricing_type}`);
  }
}

function escapeString(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
}

function buildProduct(row: CateringProductRow): string {
  const id = row.id || slugify(row.title);
  const tags = row.tags.split(',').map((t) => t.trim());
  const categories = `['${row.category}']`;

  const lines: string[] = [];
  lines.push(`  {`);
  lines.push(`    id: '${escapeString(id)}',`);
  lines.push(`    title: '${escapeString(row.title)}',`);
  lines.push(`    description: '${escapeString(row.description)}',`);
  lines.push(`    image: '/images/menu/${escapeString(row.image_filename)}',`);
  lines.push(`    categories: ${categories},`);
  lines.push(`    pricing: ${buildPricing(row)},`);
  lines.push(`    tags: [${tags.map((t) => `'${escapeString(t)}'`).join(', ')}],`);

  // Menu engineering data
  const classification = row.classification || 'PLOWHORSE';
  const visualWeight = row.visual_weight || 'medium';
  const descriptionStrategy = row.description_strategy || 'maintain';
  lines.push(`    menuEngineering: {`);
  lines.push(`      classification: '${classification}',`);
  lines.push(`      foodCost: ${row.food_cost ?? 'null'},`);
  lines.push(`      salesRank: ${row.sales_rank ?? 'null'},`);
  lines.push(`      placementPriority: ${row.placement_priority ?? 'null'},`);
  lines.push(`      visualWeight: '${visualWeight}',`);
  lines.push(`      descriptionStrategy: '${descriptionStrategy}',`);
  lines.push(`      badgeText: ${row.badge_text ? `'${escapeString(row.badge_text)}'` : 'null'},`);
  lines.push(`      enhancedDescription: ${row.enhanced_description ? `'${escapeString(row.enhanced_description)}'` : 'null'},`);
  lines.push(`      salesVelocity7d: null,`);
  lines.push(`      salesVelocity30d: null,`);
  lines.push(`      trendDirection: null,`);
  lines.push(`      lastClassifiedAt: null,`);
  lines.push(`    },`);

  if (row.variant_label && row.variant_options && row.variant_mode) {
    const options = parseVariantOptions(row.variant_options);
    lines.push(`    variants: {`);
    lines.push(`      label: '${escapeString(row.variant_label)}',`);
    lines.push(`      options: [`);
    for (const opt of options) {
      lines.push(`        { id: '${escapeString(opt.id)}', label: '${escapeString(opt.label)}' },`);
    }
    lines.push(`      ],`);
    lines.push(`      selectionMode: '${row.variant_mode}',`);
    if (row.variant_mode === 'split' && row.split_total) {
      lines.push(`      splitTotal: ${row.split_total},`);
    }
    lines.push(`    },`);
  }

  lines.push(`  }`);
  return lines.join('\n');
}

export function generateProducts(rows: CateringProductRow[]): string {
  const products = rows.map(buildProduct).join(',\n');

  return `import { CateringProduct } from './types';

// Helper to create pan pricing with custom serving sizes per item
function panPricing(
  halfPrice: number,
  fullPrice: number,
  halfServesMin: number,
  halfServesMax: number,
  fullServesMin: number,
  fullServesMax: number,
) {
  return {
    type: 'pan' as const,
    sizes: [
      { size: 'half' as const, price: halfPrice, servesMin: halfServesMin, servesMax: halfServesMax },
      { size: 'full' as const, price: fullPrice, servesMin: fullServesMin, servesMax: fullServesMax },
    ],
  };
}

export const CATERING_PRODUCTS: CateringProduct[] = [
${products},
];

// Get products by event type
export function getProductsByEventType(eventType: string | null): CateringProduct[] {
  if (!eventType) return CATERING_PRODUCTS;
  return CATERING_PRODUCTS.filter(product => product.categories.includes(eventType as any));
}

// Get product by ID
export function getProductById(id: string): CateringProduct | undefined {
  return CATERING_PRODUCTS.find(product => product.id === id);
}

// Get recommended products based on event type, budget, and what's already in the cart
export function getRecommendedProducts(
  eventType: string | null,
  cartItemIds: string[],
  budgetRange?: { min: number; max: number } | null,
  limit: number = 6,
): CateringProduct[] {
  let candidates = CATERING_PRODUCTS.filter(p => !cartItemIds.includes(p.id));

  if (eventType) {
    candidates = candidates.filter(p => p.categories.includes(eventType as any));
  }

  candidates = candidates.filter(p =>
    !p.tags?.includes('topping') &&
    !p.tags?.includes('chips')
  );

  candidates.sort((a, b) => {
    const aPopular = a.tags?.includes('popular') ? 1 : 0;
    const bPopular = b.tags?.includes('popular') ? 1 : 0;
    return bPopular - aPopular;
  });

  return candidates.slice(0, limit);
}

// Build a suggested menu for a given event type and headcount
export function getSuggestedMenu(
  eventType: string | null,
  headcount: number,
  budgetRange?: { min: number; max: number } | null,
): CateringProduct[] {
  const category = eventType || 'entrees';
  const available = CATERING_PRODUCTS.filter(p =>
    p.categories.includes(category as any) &&
    !p.tags?.includes('topping') &&
    !p.tags?.includes('chips')
  );

  const pick = (tags: string[], count: number): CateringProduct[] => {
    const matches = available.filter(p => tags.some(t => p.tags?.includes(t)));
    return matches.slice(0, count);
  };

  const menu: CateringProduct[] = [];

  if (category === 'appetizers') {
    menu.push(...pick(['appetizer', 'popular'], 2));
    menu.push(...pick(['salad'], 1));
  } else if (category === 'entrees') {
    menu.push(...pick(['fajita', 'popular'], 1));
    menu.push(...pick(['taco', 'popular'], 1));
    menu.push(...pick(['carnitas'], 1));
  } else if (category === 'sides') {
    menu.push(...pick(['rice'], 1));
    menu.push(...pick(['beans'], 1));
    menu.push(...pick(['dessert', 'popular'], 1));
  }

  const seen = new Set<string>();
  return menu.filter(p => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });
}
`;
}

export function writeProducts(rows: CateringProductRow[]): void {
  const content = generateProducts(rows);
  fs.writeFileSync(OUTPUT_PATH, content, 'utf-8');
}
