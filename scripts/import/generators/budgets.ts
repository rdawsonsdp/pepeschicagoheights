import * as fs from 'fs';
import * as path from 'path';
import type { BudgetRangeRow } from '../validate';

const OUTPUT_PATH = path.resolve(__dirname, '../../../lib/budgets.ts');

function escapeString(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
}

function buildBudgetRange(row: BudgetRangeRow): string {
  const lines: string[] = [];
  lines.push(`  {`);
  lines.push(`    id: '${escapeString(row.id)}',`);
  lines.push(`    label: '${escapeString(row.label)}',`);
  lines.push(`    min: ${row.min},`);
  lines.push(`    max: ${row.max},`);
  lines.push(`    description: '${escapeString(row.description)}',`);
  lines.push(`  }`);
  return lines.join('\n');
}

export function generateBudgets(rows: BudgetRangeRow[]): string {
  const ranges = rows.map(buildBudgetRange).join(',\n');

  return `import { BudgetRange } from './types';

export const BUDGET_RANGES: BudgetRange[] = [
${ranges},
];

export function getBudgetRangeById(id: string): BudgetRange | undefined {
  return BUDGET_RANGES.find((b) => b.id === id);
}

export function formatBudgetRange(budget: BudgetRange): string {
  if (budget.isCustom) {
    return 'Custom';
  }
  return \`\$\${budget.min} - \$\${budget.max}\`;
}

export function isWithinBudget(
  perPersonCost: number,
  budget: BudgetRange | null,
  customBudget: number | null
): boolean {
  if (!budget) return true;

  const maxBudget = budget.isCustom && customBudget ? customBudget : budget.max;
  return perPersonCost <= maxBudget;
}

export function getBudgetStatus(
  perPersonCost: number,
  budget: BudgetRange | null,
  customBudget: number | null
): 'under' | 'on-track' | 'over' {
  if (!budget) return 'on-track';

  const minBudget = budget.isCustom && customBudget ? customBudget * 0.8 : budget.min;
  const maxBudget = budget.isCustom && customBudget ? customBudget : budget.max;

  if (perPersonCost < minBudget) return 'under';
  if (perPersonCost > maxBudget) return 'over';
  return 'on-track';
}
`;
}

export function writeBudgets(rows: BudgetRangeRow[]): void {
  const content = generateBudgets(rows);
  fs.writeFileSync(OUTPUT_PATH, content, 'utf-8');
}
