import { supabase } from './supabase';
import type { CateringProduct, EventType, ProductPricing, VariantConfig, MenuEngineeringData } from './types';
import type { DineInMenuSection, DineInMenuItem } from './dine-in-menu';

// ---------------------------------------------------------------------------
// Catering Products
// ---------------------------------------------------------------------------

interface CateringProductRow {
  id: string;
  title: string;
  description: string;
  image: string;
  hidden: boolean;
  categories: string[];
  tags: string[] | null;
  sort_order: number;
  pricing: ProductPricing;
  variants: VariantConfig | null;
  classification: string | null;
  food_cost: number | null;
  sales_rank: number | null;
  placement_priority: number | null;
  visual_weight: string | null;
  description_strategy: string | null;
  badge_text: string | null;
  enhanced_description: string | null;
  sales_velocity_7d: number | null;
  sales_velocity_30d: number | null;
  trend_direction: string | null;
  last_classified_at: string | null;
}

function rowToProduct(row: CateringProductRow): CateringProduct {
  const product: CateringProduct = {
    id: row.id,
    title: row.title,
    description: row.description,
    image: row.image,
    categories: row.categories as EventType[],
    pricing: row.pricing,
    tags: row.tags ?? undefined,
    hidden: row.hidden || undefined,
    variants: row.variants ?? undefined,
  };

  if (row.classification) {
    product.menuEngineering = {
      classification: row.classification as MenuEngineeringData['classification'],
      foodCost: row.food_cost,
      salesRank: row.sales_rank,
      placementPriority: row.placement_priority,
      visualWeight: (row.visual_weight ?? 'medium') as MenuEngineeringData['visualWeight'],
      descriptionStrategy: (row.description_strategy ?? 'maintain') as MenuEngineeringData['descriptionStrategy'],
      badgeText: row.badge_text,
      enhancedDescription: row.enhanced_description,
      salesVelocity7d: row.sales_velocity_7d,
      salesVelocity30d: row.sales_velocity_30d,
      trendDirection: row.trend_direction as MenuEngineeringData['trendDirection'],
      lastClassifiedAt: row.last_classified_at,
    };
  }

  return product;
}

export async function getCateringProducts(): Promise<CateringProduct[]> {
  const { data, error } = await supabase
    .from('catering_products')
    .select('*')
    .order('sort_order');

  if (error) throw new Error(`Failed to fetch catering products: ${error.message}`);
  return (data as CateringProductRow[]).map(rowToProduct);
}

export async function getCateringProductById(id: string): Promise<CateringProduct | null> {
  const { data, error } = await supabase
    .from('catering_products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return rowToProduct(data as CateringProductRow);
}

export async function getCateringProductsByEventType(eventType: string | null): Promise<CateringProduct[]> {
  if (!eventType) return getCateringProducts();

  const { data, error } = await supabase
    .from('catering_products')
    .select('*')
    .contains('categories', [eventType])
    .order('sort_order');

  if (error) throw new Error(`Failed to fetch products by event type: ${error.message}`);
  return (data as CateringProductRow[]).map(rowToProduct);
}

// ---------------------------------------------------------------------------
// Dine-In Menu
// ---------------------------------------------------------------------------

interface DineInSectionRow {
  id: string;
  title: string;
  subtitle: string | null;
  image: string | null;
  section_type: 'food' | 'drink';
  sort_order: number;
}

interface DineInItemRow {
  id: string;
  section_id: string;
  name: string;
  description: string | null;
  price: string | null;
  classification: string | null;
  visual_weight: string | null;
  image: string | null;
  sort_order: number;
}

export async function getDineInMenu(): Promise<DineInMenuSection[]> {
  const [sectionsRes, itemsRes] = await Promise.all([
    supabase.from('dine_in_sections').select('*').order('sort_order'),
    supabase.from('dine_in_items').select('*').order('sort_order'),
  ]);

  if (sectionsRes.error) throw new Error(`Failed to fetch sections: ${sectionsRes.error.message}`);
  if (itemsRes.error) throw new Error(`Failed to fetch items: ${itemsRes.error.message}`);

  const sections = sectionsRes.data as DineInSectionRow[];
  const items = itemsRes.data as DineInItemRow[];

  const itemsBySection = new Map<string, DineInMenuItem[]>();
  for (const item of items) {
    const list = itemsBySection.get(item.section_id) ?? [];
    list.push({
      name: item.name,
      description: item.description ?? undefined,
      price: item.price ?? undefined,
      classification: item.classification as DineInMenuItem['classification'],
      visualWeight: item.visual_weight as DineInMenuItem['visualWeight'],
      image: item.image ?? undefined,
    });
    itemsBySection.set(item.section_id, list);
  }

  return sections.map((s) => ({
    id: s.id,
    title: s.title,
    subtitle: s.subtitle ?? undefined,
    image: s.image ?? undefined,
    items: itemsBySection.get(s.id) ?? [],
  }));
}

export async function getDineInFoodSections(): Promise<string[]> {
  const { data, error } = await supabase
    .from('dine_in_sections')
    .select('id')
    .eq('section_type', 'food')
    .order('sort_order');

  if (error) throw new Error(`Failed to fetch food sections: ${error.message}`);
  return data.map((r: { id: string }) => r.id);
}

export async function getDineInDrinkSections(): Promise<string[]> {
  const { data, error } = await supabase
    .from('dine_in_sections')
    .select('id')
    .eq('section_type', 'drink')
    .order('sort_order');

  if (error) throw new Error(`Failed to fetch drink sections: ${error.message}`);
  return data.map((r: { id: string }) => r.id);
}

export async function getDineInPromos(): Promise<{ title: string; description: string }[]> {
  const { data, error } = await supabase
    .from('dine_in_promos')
    .select('title, description')
    .eq('active', true)
    .order('sort_order');

  if (error) throw new Error(`Failed to fetch promos: ${error.message}`);
  return data;
}
