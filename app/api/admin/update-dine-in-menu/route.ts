import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface DineInItemUpdate {
  name: string;
  description?: string;
  price?: string;
  classification?: string;
  visualWeight?: string;
  image?: string;
}

interface DineInSectionUpdate {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  items: DineInItemUpdate[];
}

export async function POST(request: Request) {
  try {
    const { requireAdminSession } = await import('@/lib/admin-auth');
    const auth = await requireAdminSession();
    if (!auth.authorized) return auth.response;

    const sections: DineInSectionUpdate[] = await request.json();

    for (const section of sections) {
      // Update section metadata
      await supabase
        .from('dine_in_sections')
        .update({
          title: section.title,
          subtitle: section.subtitle || null,
          image: section.image || null,
        })
        .eq('id', section.id);

      // Delete existing items for this section and re-insert in order
      await supabase
        .from('dine_in_items')
        .delete()
        .eq('section_id', section.id);

      if (section.items.length > 0) {
        const rows = section.items.map((item, idx) => ({
          section_id: section.id,
          name: item.name,
          description: item.description || null,
          price: item.price || null,
          classification: item.classification || null,
          visual_weight: item.visualWeight || null,
          image: item.image || null,
          sort_order: idx + 1,
        }));

        const { error } = await supabase
          .from('dine_in_items')
          .insert(rows);

        if (error) {
          console.error(`Failed to insert items for section ${section.id}:`, error);
        }
      }
    }

    return NextResponse.json({ success: true, updatedCount: sections.length });
  } catch (error) {
    console.error('Failed to update dine-in menu:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
