import { BudgetRange } from './types';

export const BUDGET_RANGES: BudgetRange[] = [
  {
    id: 'budget-5-10',
    label: '$5 - $10',
    min: 5,
    max: 10,
    description: 'Appetizers and sides for your group',
  },
  {
    id: 'budget-10-15',
    label: '$10 - $15',
    min: 10,
    max: 15,
    description: 'Party packages and entree selections',
  },
  {
    id: 'budget-15-plus',
    label: '$15+',
    min: 15,
    max: 50,
    description: 'Full fiesta spread with all the fixings',
  },
];

export function getBudgetRangeById(id: string): BudgetRange | undefined {
  return BUDGET_RANGES.find((b) => b.id === id);
}

export function formatBudgetRange(budget: BudgetRange): string {
  if (budget.isCustom) {
    return 'Custom';
  }
  return `$${budget.min} - $${budget.max}`;
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
