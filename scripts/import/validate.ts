import { z } from 'zod';

// ── Catering Product Row ──────────────────────────────────────────────

export const CateringProductRowSchema = z
  .object({
    id: z.string().optional(),
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    image_filename: z.string().min(1, 'Image filename is required'),
    category: z.enum(['appetizers', 'entrees', 'sides'], {
      errorMap: () => ({ message: 'Category must be appetizers, entrees, or sides' }),
    }),
    tags: z.string().min(1, 'At least one tag is required'),
    pricing_type: z.enum(['pan', 'tray', 'per-each', 'per-person', 'per-dozen', 'per-container'], {
      errorMap: () => ({ message: 'Invalid pricing type' }),
    }),
    // Pan pricing
    half_price: z.number().positive().optional(),
    full_price: z.number().positive().optional(),
    half_serves_min: z.number().int().positive().optional(),
    half_serves_max: z.number().int().positive().optional(),
    full_serves_min: z.number().int().positive().optional(),
    full_serves_max: z.number().int().positive().optional(),
    // Tray pricing
    small_price: z.number().positive().optional(),
    medium_price: z.number().positive().optional(),
    large_price: z.number().positive().optional(),
    small_serves_min: z.number().int().positive().optional(),
    small_serves_max: z.number().int().positive().optional(),
    medium_serves_min: z.number().int().positive().optional(),
    medium_serves_max: z.number().int().positive().optional(),
    large_serves_min: z.number().int().positive().optional(),
    large_serves_max: z.number().int().positive().optional(),
    // Per-each
    price_each: z.number().positive().optional(),
    // Per-person
    price_per_person: z.number().positive().optional(),
    // Per-dozen
    price_per_dozen: z.number().positive().optional(),
    serves_per_dozen: z.number().int().positive().optional(),
    // Per-container
    price_per_container: z.number().positive().optional(),
    serves_per_container: z.number().int().positive().optional(),
    // Min order
    min_order: z.number().int().positive().optional(),
    // Menu engineering
    classification: z.enum(['STAR', 'PLOWHORSE', 'PUZZLE', 'DOG']).optional(),
    food_cost: z.number().positive().optional(),
    sales_rank: z.number().int().positive().optional(),
    placement_priority: z.number().int().nonnegative().optional(),
    visual_weight: z.enum(['high', 'medium', 'low']).optional(),
    description_strategy: z.enum(['maintain', 'enhance', 'rewrite', 'minimize']).optional(),
    badge_text: z.string().optional(),
    enhanced_description: z.string().optional(),
    // Variants
    variant_label: z.string().optional(),
    variant_mode: z.enum(['single', 'split']).optional(),
    variant_options: z.string().optional(),
    split_total: z.number().int().positive().optional(),
  })
  .refine(
    (row) => {
      if (row.pricing_type === 'pan') {
        return (
          row.half_price != null &&
          row.full_price != null &&
          row.half_serves_min != null &&
          row.half_serves_max != null &&
          row.full_serves_min != null &&
          row.full_serves_max != null
        );
      }
      return true;
    },
    { message: 'Pan pricing requires half_price, full_price, and all serves_min/max fields' }
  )
  .refine(
    (row) => {
      if (row.pricing_type === 'tray') {
        // At least one tray size must be defined
        const hasSmall = row.small_price != null;
        const hasMedium = row.medium_price != null;
        const hasLarge = row.large_price != null;
        return hasSmall || hasMedium || hasLarge;
      }
      return true;
    },
    { message: 'Tray pricing requires at least one size (small, medium, or large) with price and serves' }
  )
  .refine(
    (row) => {
      if (row.pricing_type === 'per-each') return row.price_each != null;
      return true;
    },
    { message: 'Per-each pricing requires price_each' }
  )
  .refine(
    (row) => {
      if (row.pricing_type === 'per-person') return row.price_per_person != null;
      return true;
    },
    { message: 'Per-person pricing requires price_per_person' }
  )
  .refine(
    (row) => {
      if (row.pricing_type === 'per-dozen') {
        return row.price_per_dozen != null && row.serves_per_dozen != null;
      }
      return true;
    },
    { message: 'Per-dozen pricing requires price_per_dozen and serves_per_dozen' }
  )
  .refine(
    (row) => {
      if (row.pricing_type === 'per-container') {
        return row.price_per_container != null && row.serves_per_container != null;
      }
      return true;
    },
    { message: 'Per-container pricing requires price_per_container and serves_per_container' }
  )
  .refine(
    (row) => {
      if (row.variant_label) {
        return row.variant_mode != null && row.variant_options != null;
      }
      return true;
    },
    { message: 'Variants require variant_label, variant_mode, and variant_options' }
  )
  .refine(
    (row) => {
      if (row.variant_mode === 'split') return row.split_total != null;
      return true;
    },
    { message: 'Split variant mode requires split_total' }
  );

export type CateringProductRow = z.infer<typeof CateringProductRowSchema>;

// ── Dine-In Menu Row ──────────────────────────────────────────────────

export const DineInMenuRowSchema = z.object({
  section_id: z.string().min(1, 'Section ID is required'),
  section_title: z.string().min(1, 'Section title is required'),
  section_subtitle: z.string().optional(),
  section_image: z.string().optional(),
  section_group: z.enum(['food', 'drinks'], {
    errorMap: () => ({ message: 'Section group must be food or drinks' }),
  }),
  item_name: z.string().min(1, 'Item name is required'),
  item_description: z.string().optional(),
  item_price: z.string().optional(),
  classification: z.enum(['STAR', 'PLOWHORSE', 'PUZZLE', 'DOG']).optional(),
  visual_weight: z.enum(['high', 'medium', 'low']).optional(),
});

export type DineInMenuRow = z.infer<typeof DineInMenuRowSchema>;

// ── Dine-In Promos ────────────────────────────────────────────────────

export const DineInPromoRowSchema = z.object({
  title: z.string().min(1, 'Promo title is required'),
  description: z.string().min(1, 'Promo description is required'),
});

export type DineInPromoRow = z.infer<typeof DineInPromoRowSchema>;

// ── Packages ──────────────────────────────────────────────────────────

export const PackageRowSchema = z.object({
  id: z.string().min(1, 'Package ID is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price_per_person: z.number().positive('Price must be positive'),
  image_filename: z.string().optional(),
  items: z.string().min(1, 'Items list is required (pipe-separated)'),
  category: z.enum(['appetizers', 'entrees', 'sides']),
  min_headcount: z.number().int().positive().optional(),
  max_headcount: z.number().int().positive().optional(),
});

export type PackageRow = z.infer<typeof PackageRowSchema>;

// ── Event Types ───────────────────────────────────────────────────────

export const EventTypeRowSchema = z.object({
  id: z.enum(['appetizers', 'entrees', 'sides']),
  name: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
  suggested_items: z.string().min(1),
});

export type EventTypeRow = z.infer<typeof EventTypeRowSchema>;

// ── Budget Ranges ─────────────────────────────────────────────────────

export const BudgetRangeRowSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  min: z.number().nonnegative(),
  max: z.number().positive(),
  description: z.string().min(1),
});

export type BudgetRangeRow = z.infer<typeof BudgetRangeRowSchema>;

// ── Site Config ───────────────────────────────────────────────────────

export const SiteConfigSchema = z.object({
  restaurant: z.object({
    name: z.string().min(1),
    shortName: z.string().min(1),
    subtitle: z.string().min(1),
    tagline: z.string().min(1),
    foundedYear: z.string(),
    foundedText: z.string(),
    location: z.string().min(1),
    cuisineType: z.string().min(1),
  }),
  contact: z.object({
    phone: z.string().min(1),
    phoneRaw: z.string().min(1),
    phoneDigits: z.string().min(1),
    email: z.string().email(),
    addressLine1: z.string().min(1),
    addressFull: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    zip: z.string().min(1),
  }),
  social: z.object({
    facebook: z.string(),
    instagram: z.string(),
  }),
  branding: z.object({
    logoPath: z.string().min(1),
    heroImagePath: z.string().min(1),
    bannerImagePath: z.string().min(1),
    faviconPath: z.string(),
    categoryImages: z.object({
      appetizers: z.string().min(1),
      entrees: z.string().min(1),
      sides: z.string().min(1),
    }),
  }),
  colors: z.object({
    primary: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    primaryHover: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    primaryActive: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    orange: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    dark: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    darkActive: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    charcoal: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    green: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    gold: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    teal: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    burntOrange: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    terracotta: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    warmWhite: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    sand: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    maroon: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    cream: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    menuCream: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    successGreen: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    errorRed: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    themeColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  }),
  fonts: z.object({
    heading: z.object({ family: z.string(), weights: z.array(z.string()) }),
    body: z.object({ family: z.string(), weights: z.array(z.string()) }),
    accent: z.object({ family: z.string(), weights: z.array(z.string()) }),
    serif: z.object({ family: z.string(), weights: z.array(z.string()) }),
    dish: z.object({ family: z.string(), weights: z.array(z.string()) }),
  }),
  seo: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    ogImage: z.string(),
  }),
  content: z.object({
    heroTitle: z.string().min(1),
    heroSubtitle: z.string().min(1),
    heroSubline: z.string().min(1),
    serviceType: z.string().min(1),
    cateringCTA: z.string().min(1),
    copyrightText: z.string().min(1),
    dineInSubtitle: z.string().min(1),
    valueProps: z.array(z.object({ title: z.string(), description: z.string() })),
    testimonials: z.array(
      z.object({
        quote: z.string(),
        author: z.string(),
        company: z.string(),
        rating: z.number().int().min(1).max(5),
      })
    ),
    useCases: z.array(z.string()),
    processSteps: z.array(z.object({ title: z.string(), description: z.string() })),
    deliveryNotes: z.array(z.string()),
  }),
  delivery: z.object({
    fees: z.array(z.object({ maxHeadcount: z.number(), fee: z.number() })),
    minimumNotice: z.string(),
    deliveryTimes: z.array(z.string()),
  }),
  platform: z.object({
    name: z.string(),
    url: z.string(),
  }),
  menuEngineering: z.object({
    enabled: z.boolean(),
    averageTicketSize: z.number().optional(),
    targetFoodCostPercent: z.number().optional(),
    businessMix: z.string().optional(),
    revenueGoals: z.string().optional(),
    idealCustomer: z.string().optional(),
    brandPersonality: z.string().optional(),
    signatureDishes: z.array(z.string()).optional(),
    badgeLabels: z.object({
      star: z.array(z.string()),
      puzzle: z.array(z.string()),
      plowhorse: z.array(z.string()),
      dog: z.array(z.string()),
    }).optional(),
    heroSectionTitle: z.string().optional(),
    heroSectionSubtitle: z.string().optional(),
    maxHeroItems: z.number().int().positive().optional(),
    classificationMethod: z.enum(['manual', 'auto', 'hybrid']).optional(),
  }).optional(),
});

export type SiteConfig = z.infer<typeof SiteConfigSchema>;

// ── Validation Runner ─────────────────────────────────────────────────

export interface ValidationError {
  tab: string;
  row?: number;
  field?: string;
  message: string;
}

export function validateRows<T>(
  schema: z.ZodType<T>,
  rows: Record<string, unknown>[],
  tabName: string
): { data: T[]; errors: ValidationError[] } {
  const data: T[] = [];
  const errors: ValidationError[] = [];

  for (let i = 0; i < rows.length; i++) {
    const result = schema.safeParse(rows[i]);
    if (result.success) {
      data.push(result.data);
    } else {
      for (const issue of result.error.issues) {
        errors.push({
          tab: tabName,
          row: i + 2, // +2 for 1-indexed + header row
          field: issue.path.join('.') || undefined,
          message: issue.message,
        });
      }
    }
  }

  return { data, errors };
}
