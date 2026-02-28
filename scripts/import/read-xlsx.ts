import * as XLSX from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';

const DATA_DIR = path.resolve(__dirname, '../../data');
const WORKBOOK_PATH = path.join(DATA_DIR, 'restaurant-menu.xlsx');

export interface SheetData {
  [tabName: string]: Record<string, unknown>[];
}

const EXPECTED_TABS = [
  'catering_products',
  'dine_in_menu',
  'dine_in_promos',
  'packages',
  'event_types',
  'budget_ranges',
];

/**
 * Read all tabs from the Excel workbook.
 * Returns raw row objects keyed by tab name.
 * Number cells stay as numbers; strings are trimmed.
 */
export function readWorkbook(): SheetData {
  if (!fs.existsSync(WORKBOOK_PATH)) {
    throw new Error(`Workbook not found at ${WORKBOOK_PATH}`);
  }

  const wb = XLSX.readFile(WORKBOOK_PATH);
  const data: SheetData = {};
  const missing: string[] = [];

  for (const tab of EXPECTED_TABS) {
    const sheet = wb.Sheets[tab];
    if (!sheet) {
      missing.push(tab);
      continue;
    }

    const rawRows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet, {
      defval: undefined,
      raw: true,
    });

    // Trim string values and normalize empty strings to undefined
    data[tab] = rawRows.map((row) => {
      const cleaned: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(row)) {
        const trimmedKey = key.trim();
        if (typeof val === 'string') {
          const trimmed = val.trim();
          cleaned[trimmedKey] = trimmed === '' ? undefined : trimmed;
        } else {
          cleaned[trimmedKey] = val;
        }
      }
      return cleaned;
    });
  }

  if (missing.length > 0) {
    console.warn(`⚠  Missing tabs in workbook: ${missing.join(', ')}`);
    console.warn(`   These tabs will be skipped. Add them if you need the data.`);
  }

  return data;
}

/**
 * Read the site-config.json file.
 */
export function readSiteConfig(): unknown {
  const configPath = path.join(DATA_DIR, 'site-config.json');
  if (!fs.existsSync(configPath)) {
    throw new Error(`Site config not found at ${configPath}`);
  }
  return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
}

/**
 * Check that referenced image files exist in data/images/.
 */
export function checkImages(filenames: string[]): string[] {
  const missing: string[] = [];
  for (const filename of filenames) {
    if (!filename) continue;
    // Skip URLs
    if (filename.startsWith('http://') || filename.startsWith('https://')) continue;
    const fullPath = path.join(DATA_DIR, 'images', 'menu', filename);
    if (!fs.existsSync(fullPath)) {
      missing.push(filename);
    }
  }
  return missing;
}
