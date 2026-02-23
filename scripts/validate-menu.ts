/**
 * Menu Validation Script
 * Run with: npm run menu:validate
 *
 * Checks:
 * - Every product has an image that exists on disk
 * - No duplicate product IDs
 * - Valid pricing (no $0 prices, serving counts > 0)
 * - Tags match what the menu page filters expect
 * - Reports which items still need real photos
 */

import * as fs from 'fs';
import * as path from 'path';
import { CATERING_PRODUCTS } from '../lib/products';
import { CATERING_PACKAGES } from '../lib/packages';

const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');

let errors = 0;
let warnings = 0;

function error(msg: string) {
  console.error(`  \x1b[31m✗\x1b[0m ${msg}`);
  errors++;
}

function warn(msg: string) {
  console.warn(`  \x1b[33m!\x1b[0m ${msg}`);
  warnings++;
}

function ok(msg: string) {
  console.log(`  \x1b[32m✓\x1b[0m ${msg}`);
}

function heading(msg: string) {
  console.log(`\n\x1b[1m${msg}\x1b[0m`);
}

// ---------- 1. Check for duplicate IDs ----------
heading('Checking for duplicate product IDs...');
const ids = CATERING_PRODUCTS.map(p => p.id);
const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
if (dupes.length > 0) {
  error(`Duplicate product IDs: ${Array.from(new Set(dupes)).join(', ')}`);
} else {
  ok(`All ${ids.length} product IDs are unique`);
}

// ---------- 2. Check images exist on disk ----------
heading('Checking product images...');
const placeholderPath = '/images/menu/placeholder.svg';
let needsPhoto = 0;

for (const product of CATERING_PRODUCTS) {
  if (!product.image) {
    error(`${product.id}: missing image field`);
    continue;
  }

  const diskPath = path.join(PUBLIC, product.image);
  if (!fs.existsSync(diskPath)) {
    error(`${product.id}: image not found: ${product.image}`);
  }

  if (product.image === placeholderPath) {
    needsPhoto++;
  }
}

for (const pkg of CATERING_PACKAGES) {
  if (!pkg.image) {
    error(`package ${pkg.id}: missing image field`);
    continue;
  }
  const diskPath = path.join(PUBLIC, pkg.image);
  if (!fs.existsSync(diskPath)) {
    error(`package ${pkg.id}: image not found: ${pkg.image}`);
  }
}

if (needsPhoto > 0) {
  warn(`${needsPhoto} of ${CATERING_PRODUCTS.length} products still using placeholder image`);
} else {
  ok('All products have real photos');
}

// ---------- 3. Check pricing validity ----------
heading('Checking pricing...');

for (const product of CATERING_PRODUCTS) {
  const p = product.pricing;

  if (p.type === 'pan') {
    for (const size of p.sizes) {
      if (size.price <= 0) {
        error(`${product.id}: ${size.size} pan price is $${size.price}`);
      }
      if (size.servesMin <= 0 || size.servesMax <= 0) {
        error(`${product.id}: ${size.size} pan serving count invalid (${size.servesMin}-${size.servesMax})`);
      }
      if (size.servesMin > size.servesMax) {
        error(`${product.id}: ${size.size} pan servesMin (${size.servesMin}) > servesMax (${size.servesMax})`);
      }
    }
  } else if (p.type === 'per-each') {
    if (p.priceEach <= 0) {
      error(`${product.id}: per-each price is $${p.priceEach}`);
    }
  } else if (p.type === 'per-person') {
    if (p.pricePerPerson <= 0) {
      error(`${product.id}: per-person price is $${p.pricePerPerson}`);
    }
  } else if (p.type === 'tray') {
    for (const size of p.sizes) {
      if (size.price <= 0) {
        error(`${product.id}: ${size.size} tray price is $${size.price}`);
      }
    }
  }
}

ok('Pricing validation complete');

// ---------- 4. Check tags match menu page subsection filters ----------
heading('Checking menu page tag coverage...');

// These are the tags that menus/page.tsx getProductsForSubsection() uses
const MENU_SUBSECTION_TAGS: Record<string, { category: string; tags: string[] }> = {
  'apps': { category: 'appetizers', tags: ['appetizer'] },
  'salads': { category: 'appetizers', tags: ['salad'] },
  'chips': { category: 'appetizers', tags: ['chips'] },
  'taco-filling': { category: 'entrees', tags: ['taco-filling'] },
  'fajitas': { category: 'entrees', tags: ['fajita'] },
  'carnitas': { category: 'entrees', tags: ['carnitas'] },
  'a-la-cart': { category: 'entrees', tags: ['tamale', 'enchilada', 'taco-tray'] },
  'sides-main': { category: 'sides', tags: ['side'] },
  'toppings': { category: 'sides', tags: ['topping'] },
  'desserts': { category: 'sides', tags: ['dessert'] },
};

// Check that every product appears in at least one menu subsection
for (const product of CATERING_PRODUCTS) {
  let appearsInSection = false;

  for (const [sectionId, config] of Object.entries(MENU_SUBSECTION_TAGS)) {
    if (!product.categories.includes(config.category as any)) continue;
    if (config.tags.some(tag => product.tags?.includes(tag))) {
      appearsInSection = true;
      break;
    }
  }

  if (!appearsInSection) {
    error(`${product.id}: not matched by any menu subsection filter (tags: ${product.tags?.join(', ')})`);
  }
}

// Check each subsection has at least one product
for (const [sectionId, config] of Object.entries(MENU_SUBSECTION_TAGS)) {
  const count = CATERING_PRODUCTS.filter(p => {
    if (!p.categories.includes(config.category as any)) return false;
    return config.tags.some(tag => p.tags?.includes(tag));
  }).length;

  if (count === 0) {
    error(`Menu subsection "${sectionId}" has 0 products`);
  } else {
    ok(`Menu subsection "${sectionId}": ${count} products`);
  }
}

// ---------- 5. Check category images ----------
heading('Checking category/section images...');
const sectionImages = [
  '/images/appetizers.jpg',
  '/images/entrees.jpg',
  '/images/sides.jpg',
  '/images/hero-tacos.jpg',
];

for (const img of sectionImages) {
  const diskPath = path.join(PUBLIC, img);
  if (fs.existsSync(diskPath)) {
    ok(`${img} exists`);
  } else {
    error(`${img} missing`);
  }
}

// ---------- Summary ----------
heading('Summary');
console.log(`  Products: ${CATERING_PRODUCTS.length}`);
console.log(`  Packages: ${CATERING_PACKAGES.length}`);
if (needsPhoto > 0) {
  console.log(`  Need real photos: ${needsPhoto}`);
  heading('Products needing photos:');
  for (const p of CATERING_PRODUCTS) {
    if (p.image === placeholderPath) {
      console.log(`    - ${p.title} (${p.id})`);
    }
  }
}

console.log('');
if (errors > 0) {
  console.log(`\x1b[31m${errors} error(s)\x1b[0m, ${warnings} warning(s)`);
  process.exit(1);
} else if (warnings > 0) {
  console.log(`\x1b[32m0 errors\x1b[0m, \x1b[33m${warnings} warning(s)\x1b[0m`);
} else {
  console.log('\x1b[32mAll checks passed!\x1b[0m');
}
