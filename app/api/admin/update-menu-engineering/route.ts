import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { MenuEngineeringData, ProductPricing } from '@/lib/types';

interface ProductUpdate {
  title: string;
  description: string;
  image: string;
  pricing: ProductPricing;
  hidden: boolean;
  menuEngineering: MenuEngineeringData;
}

export async function POST(request: Request) {
  try {
    const { requireAdminSession } = await import('@/lib/admin-auth');
    const auth = await requireAdminSession();
    if (!auth.authorized) return auth.response;

    const updates: Record<string, ProductUpdate> = await request.json();

    const entries = Object.entries(updates);
    let updatedCount = 0;

    for (const [id, data] of entries) {
      const { error } = await supabase
        .from('catering_products')
        .update({
          title: data.title,
          description: data.description,
          image: data.image,
          pricing: data.pricing,
          hidden: data.hidden,
          classification: data.menuEngineering.classification,
          food_cost: data.menuEngineering.foodCost,
          sales_rank: data.menuEngineering.salesRank,
          placement_priority: data.menuEngineering.placementPriority,
          visual_weight: data.menuEngineering.visualWeight,
          description_strategy: data.menuEngineering.descriptionStrategy,
          badge_text: data.menuEngineering.badgeText,
          enhanced_description: data.menuEngineering.enhancedDescription,
          sales_velocity_7d: data.menuEngineering.salesVelocity7d,
          sales_velocity_30d: data.menuEngineering.salesVelocity30d,
          trend_direction: data.menuEngineering.trendDirection,
          last_classified_at: data.menuEngineering.lastClassifiedAt,
        })
        .eq('id', id);

      if (error) {
        console.error(`Failed to update product ${id}:`, error);
      } else {
        updatedCount++;
      }
    }

    return NextResponse.json({ success: true, updatedCount });
  } catch (error) {
    console.error('Failed to update menu engineering:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 },
    );
  }
}
