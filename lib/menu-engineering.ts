import type { CateringProduct, MenuClassification, VisualWeight } from './types';

const CLASSIFICATION_ORDER: Record<MenuClassification, number> = {
  STAR: 0,
  PUZZLE: 1,
  PLOWHORSE: 2,
  DOG: 3,
};

/** Returns classification, defaults to PLOWHORSE */
export function getClassification(product: CateringProduct): MenuClassification {
  return product.menuEngineering?.classification ?? 'PLOWHORSE';
}

/** Returns visual weight, defaults to medium */
export function getVisualWeight(product: CateringProduct): VisualWeight {
  return product.menuEngineering?.visualWeight ?? 'medium';
}

/** Returns badge text or null */
export function getBadgeText(product: CateringProduct): string | null {
  return product.menuEngineering?.badgeText ?? null;
}

/** Returns enhanced description for STAR/PUZZLE, normal for others */
export function getEffectiveDescription(product: CateringProduct): string {
  const me = product.menuEngineering;
  if (!me) return product.description;
  if ((me.classification === 'STAR' || me.classification === 'PUZZLE') && me.enhancedDescription) {
    return me.enhancedDescription;
  }
  return product.description;
}

/** Sort: STAR -> PUZZLE -> PLOWHORSE -> DOG, then by placementPriority */
export function sortByClassification(products: CateringProduct[]): CateringProduct[] {
  return [...products].sort((a, b) => {
    const classA = CLASSIFICATION_ORDER[getClassification(a)];
    const classB = CLASSIFICATION_ORDER[getClassification(b)];
    if (classA !== classB) return classA - classB;
    const prioA = a.menuEngineering?.placementPriority ?? 999;
    const prioB = b.menuEngineering?.placementPriority ?? 999;
    return prioA - prioB;
  });
}

/** Top N STAR items for featured sections */
export function getHeroItems(products: CateringProduct[], max: number = 3): CateringProduct[] {
  return products
    .filter(p => getClassification(p) === 'STAR')
    .sort((a, b) => {
      const prioA = a.menuEngineering?.placementPriority ?? 999;
      const prioB = b.menuEngineering?.placementPriority ?? 999;
      return prioA - prioB;
    })
    .slice(0, max);
}

/** Returns card size based on classification + weight */
export function getCardSize(product: CateringProduct): 'hero' | 'large' | 'default' | 'compact' {
  const classification = getClassification(product);
  const weight = getVisualWeight(product);

  if (classification === 'STAR' && weight === 'high') return 'hero';
  if (classification === 'STAR') return 'large';
  if (classification === 'PUZZLE') return 'large';
  if (classification === 'DOG') return 'compact';
  return 'default';
}

/** True for STAR and PUZZLE */
export function shouldShowBadge(product: CateringProduct): boolean {
  const classification = getClassification(product);
  return classification === 'STAR' || classification === 'PUZZLE';
}

/** Description line clamp by classification: 4/3/2/1 */
export function getDescriptionClamp(product: CateringProduct): number {
  const classification = getClassification(product);
  switch (classification) {
    case 'STAR': return 4;
    case 'PUZZLE': return 3;
    case 'PLOWHORSE': return 2;
    case 'DOG': return 1;
  }
}

/**
 * Median-split auto-classification from food_cost + sales_rank.
 * Products with both food_cost and sales_rank set are classified
 * using median splits on each dimension.
 */
export function autoClassify(
  inputs: { id: string; foodCost: number; salesRank: number }[]
): Record<string, MenuClassification> {
  if (inputs.length === 0) return {};

  const costs = inputs.map(i => i.foodCost).sort((a, b) => a - b);
  const ranks = inputs.map(i => i.salesRank).sort((a, b) => a - b);
  const medianCost = costs[Math.floor(costs.length / 2)];
  const medianRank = ranks[Math.floor(ranks.length / 2)];

  const result: Record<string, MenuClassification> = {};
  for (const item of inputs) {
    const highProfit = item.foodCost <= medianCost; // lower cost = higher profit
    const highPopularity = item.salesRank <= medianRank; // lower rank = more popular

    if (highProfit && highPopularity) result[item.id] = 'STAR';
    else if (highProfit && !highPopularity) result[item.id] = 'PUZZLE';
    else if (!highProfit && highPopularity) result[item.id] = 'PLOWHORSE';
    else result[item.id] = 'DOG';
  }

  return result;
}

// Future-proofing placeholders

/** Recalculate classifications from sales velocity data (not yet implemented) */
export function weeklyReclassify(_products: CateringProduct[]): void {
  console.warn('[menu-engineering] weeklyReclassify: not yet implemented');
}

/** Detect rising puzzles that may be becoming stars (not yet implemented) */
export function autoPromotePuzzles(_products: CateringProduct[]): CateringProduct[] {
  console.warn('[menu-engineering] autoPromotePuzzles: not yet implemented');
  return [];
}

/** Flag low performers for review (not yet implemented) */
export function flagDogsForReview(_products: CateringProduct[]): CateringProduct[] {
  console.warn('[menu-engineering] flagDogsForReview: not yet implemented');
  return [];
}

/** Log classification changes for impact tracking (not yet implemented) */
export function trackRepositioningImpact(
  _id: string,
  _oldClassification: MenuClassification,
  _newClassification: MenuClassification
): void {
  console.warn('[menu-engineering] trackRepositioningImpact: not yet implemented');
}
