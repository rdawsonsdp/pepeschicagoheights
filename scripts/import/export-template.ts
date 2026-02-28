#!/usr/bin/env npx tsx
/**
 * Export current Pepe's data into the Excel template format.
 * This creates data/restaurant-menu.xlsx from the existing lib/ files.
 *
 * Usage: npm run export-template
 */

import * as XLSX from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';

// Import current data
import { CATERING_PRODUCTS } from '../../lib/products';
import { DINE_IN_MENU, DINE_IN_PROMOS, FOOD_SECTIONS, DRINK_SECTIONS } from '../../lib/dine-in-menu';
import { CATERING_PACKAGES } from '../../lib/packages';
import { EVENT_TYPES } from '../../lib/event-types';
import { BUDGET_RANGES } from '../../lib/budgets';

const OUTPUT_PATH = path.resolve(__dirname, '../../data/restaurant-menu.xlsx');

function exportCateringProducts(): Record<string, unknown>[] {
  return CATERING_PRODUCTS.map((p) => {
    const row: Record<string, unknown> = {
      id: p.id,
      title: p.title,
      description: p.description,
      image_filename: p.image.replace('/images/menu/', ''),
      category: p.categories[0],
      tags: (p.tags || []).join(', '),
      pricing_type: p.pricing.type,
    };

    switch (p.pricing.type) {
      case 'pan': {
        const half = p.pricing.sizes.find((s) => s.size === 'half');
        const full = p.pricing.sizes.find((s) => s.size === 'full');
        if (half) {
          row.half_price = half.price;
          row.half_serves_min = half.servesMin;
          row.half_serves_max = half.servesMax;
        }
        if (full) {
          row.full_price = full.price;
          row.full_serves_min = full.servesMin;
          row.full_serves_max = full.servesMax;
        }
        break;
      }
      case 'tray': {
        for (const size of p.pricing.sizes) {
          row[`${size.size}_price`] = size.price;
          row[`${size.size}_serves_min`] = size.servesMin;
          row[`${size.size}_serves_max`] = size.servesMax;
        }
        break;
      }
      case 'per-each':
        row.price_each = p.pricing.priceEach;
        if (p.pricing.minOrder) row.min_order = p.pricing.minOrder;
        break;
      case 'per-person':
        row.price_per_person = p.pricing.pricePerPerson;
        if (p.pricing.minOrder) row.min_order = p.pricing.minOrder;
        break;
      case 'per-dozen':
        row.price_per_dozen = p.pricing.pricePerDozen;
        row.serves_per_dozen = p.pricing.servesPerDozen;
        break;
      case 'per-container':
        row.price_per_container = p.pricing.pricePerContainer;
        row.serves_per_container = p.pricing.servesPerContainer;
        break;
    }

    if (p.variants) {
      row.variant_label = p.variants.label;
      row.variant_mode = p.variants.selectionMode;
      row.variant_options = p.variants.options
        .map((o) => `${o.id}:${o.label}`)
        .join('|');
      if (p.variants.splitTotal) {
        row.split_total = p.variants.splitTotal;
      }
    }

    // Menu engineering fields
    if (p.menuEngineering) {
      row.classification = p.menuEngineering.classification;
      if (p.menuEngineering.foodCost != null) row.food_cost = p.menuEngineering.foodCost;
      if (p.menuEngineering.salesRank != null) row.sales_rank = p.menuEngineering.salesRank;
      if (p.menuEngineering.placementPriority != null) row.placement_priority = p.menuEngineering.placementPriority;
      row.visual_weight = p.menuEngineering.visualWeight;
      row.description_strategy = p.menuEngineering.descriptionStrategy;
      if (p.menuEngineering.badgeText) row.badge_text = p.menuEngineering.badgeText;
      if (p.menuEngineering.enhancedDescription) row.enhanced_description = p.menuEngineering.enhancedDescription;
    }

    return row;
  });
}

function exportDineInMenu(): Record<string, unknown>[] {
  const rows: Record<string, unknown>[] = [];

  for (const section of DINE_IN_MENU) {
    const group = FOOD_SECTIONS.includes(section.id) ? 'food' : 'drinks';

    for (const item of section.items) {
      const row: Record<string, unknown> = {
        section_id: section.id,
        section_title: section.title,
        section_subtitle: section.subtitle || '',
        section_image: section.image || '',
        section_group: group,
        item_name: item.name,
        item_description: item.description || '',
        item_price: item.price || '',
      };
      if (item.classification) row.classification = item.classification;
      if (item.visualWeight) row.visual_weight = item.visualWeight;
      rows.push(row);
    }
  }

  return rows;
}

function exportDineInPromos(): Record<string, unknown>[] {
  return DINE_IN_PROMOS.map((p) => ({
    title: p.title,
    description: p.description,
  }));
}

function exportPackages(): Record<string, unknown>[] {
  return CATERING_PACKAGES.map((pkg) => ({
    id: pkg.id,
    title: pkg.title,
    description: pkg.description,
    price_per_person: pkg.pricePerPerson,
    image_filename: pkg.image.replace('/images/menu/', ''),
    items: pkg.items.join('|'),
    category: pkg.categories[0],
    min_headcount: pkg.minHeadcount || '',
    max_headcount: pkg.maxHeadcount || '',
  }));
}

function exportEventTypes(): Record<string, unknown>[] {
  return EVENT_TYPES.map((et) => ({
    id: et.id,
    name: et.name,
    description: et.description,
    icon: et.icon,
    suggested_items: et.suggestedItems.join(', '),
  }));
}

function exportBudgetRanges(): Record<string, unknown>[] {
  return BUDGET_RANGES.map((br) => ({
    id: br.id,
    label: br.label,
    min: br.min,
    max: br.max,
    description: br.description,
  }));
}

function main(): void {
  console.log('');
  console.log('Exporting current data to Excel template...');
  console.log('');

  const wb = XLSX.utils.book_new();

  // Tab 1: catering_products
  const productsData = exportCateringProducts();
  const productsSheet = XLSX.utils.json_to_sheet(productsData);
  XLSX.utils.book_append_sheet(wb, productsSheet, 'catering_products');
  console.log(`  ✓ catering_products: ${productsData.length} rows`);

  // Tab 2: dine_in_menu
  const dineInData = exportDineInMenu();
  const dineInSheet = XLSX.utils.json_to_sheet(dineInData);
  XLSX.utils.book_append_sheet(wb, dineInSheet, 'dine_in_menu');
  console.log(`  ✓ dine_in_menu: ${dineInData.length} rows`);

  // Tab 3: dine_in_promos
  const promosData = exportDineInPromos();
  const promosSheet = XLSX.utils.json_to_sheet(promosData);
  XLSX.utils.book_append_sheet(wb, promosSheet, 'dine_in_promos');
  console.log(`  ✓ dine_in_promos: ${promosData.length} rows`);

  // Tab 4: packages
  const packagesData = exportPackages();
  const packagesSheet = XLSX.utils.json_to_sheet(packagesData);
  XLSX.utils.book_append_sheet(wb, packagesSheet, 'packages');
  console.log(`  ✓ packages: ${packagesData.length} rows`);

  // Tab 5: event_types
  const eventTypesData = exportEventTypes();
  const eventTypesSheet = XLSX.utils.json_to_sheet(eventTypesData);
  XLSX.utils.book_append_sheet(wb, eventTypesSheet, 'event_types');
  console.log(`  ✓ event_types: ${eventTypesData.length} rows`);

  // Tab 6: budget_ranges
  const budgetData = exportBudgetRanges();
  const budgetSheet = XLSX.utils.json_to_sheet(budgetData);
  XLSX.utils.book_append_sheet(wb, budgetSheet, 'budget_ranges');
  console.log(`  ✓ budget_ranges: ${budgetData.length} rows`);

  // Ensure output directory exists
  const dir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Write the workbook
  XLSX.writeFile(wb, OUTPUT_PATH);
  console.log(`\n✓ Template saved to: ${OUTPUT_PATH}\n`);
}

main();
