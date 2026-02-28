#!/usr/bin/env npx tsx
/**
 * Main import script: reads spreadsheet + site config, validates, and generates TypeScript source files.
 *
 * Usage:
 *   npm run import              # Full import (menu + config)
 *   npm run import -- --dry-run # Validate only, don't write files
 *   npm run import -- --menu    # Menu data only
 *   npm run import -- --config  # Site config only
 */

import * as fs from 'fs';
import * as path from 'path';
import { readWorkbook, readSiteConfig, checkImages } from './read-xlsx';
import {
  CateringProductRowSchema,
  DineInMenuRowSchema,
  DineInPromoRowSchema,
  PackageRowSchema,
  EventTypeRowSchema,
  BudgetRangeRowSchema,
  SiteConfigSchema,
  validateRows,
  type ValidationError,
  type CateringProductRow,
  type DineInMenuRow,
  type DineInPromoRow,
  type PackageRow,
  type EventTypeRow,
  type BudgetRangeRow,
  type SiteConfig,
} from './validate';
import {
  writeProducts,
  writeDineInMenu,
  writePackages,
  writeEventTypes,
  writeBudgets,
  writeSiteConfig,
  updateGlobalsCss,
  updateTailwindColors,
} from './generators';

const DATA_DIR = path.resolve(__dirname, '../../data');
const PUBLIC_IMAGES = path.resolve(__dirname, '../../public/images');

// ── CLI Flags ────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const menuOnly = args.includes('--menu');
const configOnly = args.includes('--config');
const doAll = !menuOnly && !configOnly;

// ── Helpers ──────────────────────────────────────────────────────────

function printErrors(errors: ValidationError[]): void {
  for (const err of errors) {
    const loc = err.row ? ` row ${err.row}` : '';
    const field = err.field ? ` [${err.field}]` : '';
    console.error(`  ✗ ${err.tab}${loc}${field}: ${err.message}`);
  }
}

function copyImages(): void {
  const srcDir = path.join(DATA_DIR, 'images');
  if (!fs.existsSync(srcDir)) {
    console.warn('⚠  No data/images/ directory found — skipping image copy.');
    return;
  }

  // Copy recursively
  const copyDir = (src: string, dest: string) => {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        copyDir(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  };

  copyDir(srcDir, PUBLIC_IMAGES);
  console.log('✓ Images copied to public/images/');
}

// ── Main ─────────────────────────────────────────────────────────────

function main(): void {
  console.log('');
  console.log('╔══════════════════════════════════════╗');
  console.log('║    Restaurant Data Import Pipeline   ║');
  console.log('╚══════════════════════════════════════╝');
  console.log('');

  if (isDryRun) {
    console.log('  Mode: DRY RUN (validate only, no files written)\n');
  }

  const allErrors: ValidationError[] = [];

  // ── Site Config ──────────────────────────────────────────────────
  let siteConfig: SiteConfig | null = null;

  if (doAll || configOnly) {
    console.log('── Site Config ──────────────────────────');
    try {
      const rawConfig = readSiteConfig();
      const result = SiteConfigSchema.safeParse(rawConfig);
      if (result.success) {
        siteConfig = result.data;
        console.log('  ✓ site-config.json validated');
      } else {
        for (const issue of result.error.issues) {
          allErrors.push({
            tab: 'site-config',
            field: issue.path.join('.') || undefined,
            message: issue.message,
          });
        }
        console.error('  ✗ site-config.json has validation errors');
      }
    } catch (e) {
      console.error(`  ✗ ${(e as Error).message}`);
      allErrors.push({ tab: 'site-config', message: (e as Error).message });
    }
    console.log('');
  }

  // ── Excel Workbook ──────────────────────────────────────────────
  let products: CateringProductRow[] = [];
  let dineInRows: DineInMenuRow[] = [];
  let promoRows: DineInPromoRow[] = [];
  let packageRows: PackageRow[] = [];
  let eventTypeRows: EventTypeRow[] = [];
  let budgetRows: BudgetRangeRow[] = [];

  if (doAll || menuOnly) {
    console.log('── Excel Workbook ───────────────────────');
    let sheetData;
    try {
      sheetData = readWorkbook();
      console.log('  ✓ Workbook loaded');
    } catch (e) {
      console.error(`  ✗ ${(e as Error).message}`);
      allErrors.push({ tab: 'workbook', message: (e as Error).message });
    }

    if (sheetData) {
      // Catering Products
      if (sheetData.catering_products) {
        const result = validateRows(CateringProductRowSchema, sheetData.catering_products, 'catering_products');
        products = result.data;
        allErrors.push(...result.errors);
        console.log(`  ✓ catering_products: ${products.length} products validated${result.errors.length ? ` (${result.errors.length} errors)` : ''}`);
      }

      // Dine-In Menu
      if (sheetData.dine_in_menu) {
        const result = validateRows(DineInMenuRowSchema, sheetData.dine_in_menu, 'dine_in_menu');
        dineInRows = result.data;
        allErrors.push(...result.errors);
        console.log(`  ✓ dine_in_menu: ${dineInRows.length} rows validated${result.errors.length ? ` (${result.errors.length} errors)` : ''}`);
      }

      // Dine-In Promos
      if (sheetData.dine_in_promos) {
        const result = validateRows(DineInPromoRowSchema, sheetData.dine_in_promos, 'dine_in_promos');
        promoRows = result.data;
        allErrors.push(...result.errors);
        console.log(`  ✓ dine_in_promos: ${promoRows.length} promos validated${result.errors.length ? ` (${result.errors.length} errors)` : ''}`);
      }

      // Packages
      if (sheetData.packages) {
        const result = validateRows(PackageRowSchema, sheetData.packages, 'packages');
        packageRows = result.data;
        allErrors.push(...result.errors);
        console.log(`  ✓ packages: ${packageRows.length} packages validated${result.errors.length ? ` (${result.errors.length} errors)` : ''}`);
      }

      // Event Types
      if (sheetData.event_types) {
        const result = validateRows(EventTypeRowSchema, sheetData.event_types, 'event_types');
        eventTypeRows = result.data;
        allErrors.push(...result.errors);
        console.log(`  ✓ event_types: ${eventTypeRows.length} types validated${result.errors.length ? ` (${result.errors.length} errors)` : ''}`);
      }

      // Budget Ranges
      if (sheetData.budget_ranges) {
        const result = validateRows(BudgetRangeRowSchema, sheetData.budget_ranges, 'budget_ranges');
        budgetRows = result.data;
        allErrors.push(...result.errors);
        console.log(`  ✓ budget_ranges: ${budgetRows.length} ranges validated${result.errors.length ? ` (${result.errors.length} errors)` : ''}`);
      }
    }

    // Check images
    if (products.length > 0) {
      const imageFiles = products.map((p) => p.image_filename);
      const missingImages = checkImages(imageFiles);
      if (missingImages.length > 0) {
        console.warn(`\n  ⚠  Missing images (${missingImages.length}):`);
        for (const img of missingImages) {
          console.warn(`     - ${img}`);
        }
      }
    }

    console.log('');
  }

  // ── Report Errors ──────────────────────────────────────────────
  if (allErrors.length > 0) {
    console.log('── Validation Errors ────────────────────');
    printErrors(allErrors);
    console.log('');
    console.error(`✗ ${allErrors.length} validation error(s) found.`);

    if (!isDryRun) {
      console.error('  Fix the errors above and re-run the import.');
      process.exit(1);
    }
    console.log('  (Dry run — not writing files.)\n');
    return;
  }

  if (isDryRun) {
    console.log('✓ All validations passed! (Dry run — no files written.)\n');
    return;
  }

  // ── Generate Files ─────────────────────────────────────────────
  console.log('── Generating Files ─────────────────────');

  if ((doAll || menuOnly) && products.length > 0) {
    writeProducts(products);
    console.log('  ✓ lib/products.ts');
  }

  if ((doAll || menuOnly) && dineInRows.length > 0) {
    writeDineInMenu(dineInRows, promoRows);
    console.log('  ✓ lib/dine-in-menu.ts');
  }

  if ((doAll || menuOnly) && packageRows.length > 0) {
    writePackages(packageRows);
    console.log('  ✓ lib/packages.ts');
  }

  if ((doAll || menuOnly) && eventTypeRows.length > 0) {
    writeEventTypes(eventTypeRows);
    console.log('  ✓ lib/event-types.ts');
  }

  if ((doAll || menuOnly) && budgetRows.length > 0) {
    writeBudgets(budgetRows);
    console.log('  ✓ lib/budgets.ts');
  }

  if ((doAll || configOnly) && siteConfig) {
    writeSiteConfig(siteConfig);
    console.log('  ✓ lib/site-config.ts');

    updateGlobalsCss(siteConfig);
    console.log('  ✓ app/globals.css (colors updated)');

    updateTailwindColors(siteConfig);
    console.log('  ✓ tailwind.config.js (colors updated)');
  }

  // Copy images
  if (doAll || menuOnly) {
    copyImages();
  }

  console.log('');
  console.log('✓ Import complete!\n');
}

main();
