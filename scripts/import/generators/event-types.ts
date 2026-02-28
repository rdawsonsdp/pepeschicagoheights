import * as fs from 'fs';
import * as path from 'path';
import type { EventTypeRow } from '../validate';

const OUTPUT_PATH = path.resolve(__dirname, '../../../lib/event-types.ts');

function escapeString(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
}

function buildEventType(row: EventTypeRow): string {
  const suggested = row.suggested_items.split(',').map((i) => i.trim());
  const lines: string[] = [];

  lines.push(`  {`);
  lines.push(`    id: '${row.id}',`);
  lines.push(`    name: '${escapeString(row.name)}',`);
  lines.push(`    description: '${escapeString(row.description)}',`);
  lines.push(`    icon: '${escapeString(row.icon)}',`);
  lines.push(`    suggestedItems: [${suggested.map((i) => `'${escapeString(i)}'`).join(', ')}],`);
  lines.push(`  }`);

  return lines.join('\n');
}

export function generateEventTypes(rows: EventTypeRow[]): string {
  const types = rows.map(buildEventType).join(',\n');

  return `import { EventTypeConfig } from './types';

export const EVENT_TYPES: EventTypeConfig[] = [
${types},
];

export function getEventTypeConfig(id: string): EventTypeConfig | undefined {
  return EVENT_TYPES.find((et) => et.id === id);
}

export function getEventTypeName(id: string): string {
  return getEventTypeConfig(id)?.name || id;
}
`;
}

export function writeEventTypes(rows: EventTypeRow[]): void {
  const content = generateEventTypes(rows);
  fs.writeFileSync(OUTPUT_PATH, content, 'utf-8');
}
