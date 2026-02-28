import * as fs from 'fs';
import * as path from 'path';
import type { DineInMenuRow, DineInPromoRow } from '../validate';

const OUTPUT_PATH = path.resolve(__dirname, '../../../lib/dine-in-menu.ts');

function escapeString(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
}

interface DineInSection {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  group: 'food' | 'drinks';
  items: { name: string; description?: string; price?: string; classification?: string; visualWeight?: string }[];
}

/**
 * Group flat rows by section_id, preserving order of first appearance.
 */
function groupBySections(rows: DineInMenuRow[]): DineInSection[] {
  const sectionMap = new Map<string, DineInSection>();
  const order: string[] = [];

  for (const row of rows) {
    let section = sectionMap.get(row.section_id);
    if (!section) {
      section = {
        id: row.section_id,
        title: row.section_title,
        subtitle: row.section_subtitle,
        image: row.section_image,
        group: row.section_group,
        items: [],
      };
      sectionMap.set(row.section_id, section);
      order.push(row.section_id);
    }

    section.items.push({
      name: row.item_name,
      description: row.item_description,
      price: row.item_price,
      classification: row.classification,
      visualWeight: row.visual_weight,
    });
  }

  return order.map((id) => sectionMap.get(id)!);
}

function buildSection(section: DineInSection): string {
  const lines: string[] = [];
  lines.push(`  {`);
  lines.push(`    id: '${escapeString(section.id)}',`);
  lines.push(`    title: '${escapeString(section.title)}',`);
  if (section.subtitle) {
    lines.push(`    subtitle: '${escapeString(section.subtitle)}',`);
  }
  if (section.image) {
    lines.push(`    image: '${escapeString(section.image)}',`);
  }
  lines.push(`    items: [`);

  for (const item of section.items) {
    const parts = [`name: '${escapeString(item.name)}'`];
    if (item.description) {
      parts.push(`description: '${escapeString(item.description)}'`);
    }
    if (item.price) {
      parts.push(`price: '${escapeString(item.price)}'`);
    }
    if (item.classification) {
      parts.push(`classification: '${item.classification}' as const`);
    }
    if (item.visualWeight) {
      parts.push(`visualWeight: '${item.visualWeight}' as const`);
    }
    lines.push(`      { ${parts.join(', ')} },`);
  }

  lines.push(`    ],`);
  lines.push(`  }`);
  return lines.join('\n');
}

export function generateDineInMenu(rows: DineInMenuRow[], promos: DineInPromoRow[]): string {
  const sections = groupBySections(rows);
  const foodSections = sections.filter((s) => s.group === 'food');
  const drinkSections = sections.filter((s) => s.group === 'drinks');

  const allSections = sections.map(buildSection).join(',\n');

  const foodIds = foodSections.map((s) => `'${s.id}'`).join(', ');
  const drinkIds = drinkSections.map((s) => `'${s.id}'`).join(', ');

  const promoEntries = promos
    .map(
      (p) =>
        `  { title: '${escapeString(p.title)}', description: '${escapeString(p.description)}' }`
    )
    .join(',\n');

  return `import type { MenuClassification, VisualWeight } from './types';

export interface DineInMenuItem {
  name: string;
  description?: string;
  price?: string; // string to support ranges like "$8 / 16oz $13"
  classification?: MenuClassification;
  visualWeight?: VisualWeight;
}

export interface DineInMenuSection {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  items: DineInMenuItem[];
}

export const DINE_IN_MENU: DineInMenuSection[] = [
${allSections},
];

// Special info items (not menu items but promotions)
export const DINE_IN_PROMOS = [
${promoEntries},
];

// Helper to group sections into food and drinks
export const FOOD_SECTIONS = [
  ${foodIds},
];

export const DRINK_SECTIONS = [
  ${drinkIds},
];
`;
}

export function writeDineInMenu(rows: DineInMenuRow[], promos: DineInPromoRow[]): void {
  const content = generateDineInMenu(rows, promos);
  fs.writeFileSync(OUTPUT_PATH, content, 'utf-8');
}
