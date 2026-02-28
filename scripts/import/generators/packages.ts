import * as fs from 'fs';
import * as path from 'path';
import type { PackageRow } from '../validate';

const OUTPUT_PATH = path.resolve(__dirname, '../../../lib/packages.ts');

function escapeString(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
}

function buildPackage(row: PackageRow): string {
  const items = row.items.split('|').map((i) => i.trim());
  const lines: string[] = [];

  lines.push(`  {`);
  lines.push(`    id: '${escapeString(row.id)}',`);
  lines.push(`    title: '${escapeString(row.title)}',`);
  lines.push(`    description: '${escapeString(row.description)}',`);
  lines.push(`    pricePerPerson: ${row.price_per_person},`);
  if (row.image_filename) {
    lines.push(`    image: '/images/menu/${escapeString(row.image_filename)}',`);
  } else {
    lines.push(`    image: '/images/menu/placeholder.svg',`);
  }
  lines.push(`    items: [`);
  for (const item of items) {
    lines.push(`      '${escapeString(item)}',`);
  }
  lines.push(`    ],`);
  lines.push(`    categories: ['${row.category}'],`);
  if (row.min_headcount) {
    lines.push(`    minHeadcount: ${row.min_headcount},`);
  }
  if (row.max_headcount) {
    lines.push(`    maxHeadcount: ${row.max_headcount},`);
  }
  lines.push(`  }`);

  return lines.join('\n');
}

export function generatePackages(rows: PackageRow[]): string {
  const packages = rows.map(buildPackage).join(',\n');

  return `import { CateringPackage, EventType } from './types';

export const CATERING_PACKAGES: CateringPackage[] = [
${packages},
];

export function getPackagesByEventType(eventType: EventType): CateringPackage[] {
  return CATERING_PACKAGES.filter((pkg) => pkg.categories.includes(eventType));
}

export function getPackagesByBudget(
  packages: CateringPackage[],
  minBudget: number,
  maxBudget: number
): CateringPackage[] {
  return packages.filter(
    (pkg) => pkg.pricePerPerson >= minBudget && pkg.pricePerPerson <= maxBudget
  );
}
`;
}

export function writePackages(rows: PackageRow[]): void {
  const content = generatePackages(rows);
  fs.writeFileSync(OUTPUT_PATH, content, 'utf-8');
}
