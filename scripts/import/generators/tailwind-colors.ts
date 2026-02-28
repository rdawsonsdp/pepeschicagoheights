import * as fs from 'fs';
import * as path from 'path';
import type { SiteConfig } from '../validate';

const TAILWIND_PATH = path.resolve(__dirname, '../../../tailwind.config.js');

/**
 * Map site-config color keys to Tailwind color token names.
 */
const TAILWIND_COLOR_MAP: Record<string, string> = {
  cream: 'cream',
  dark: 'pepe-dark',
  primary: 'pepe-red',
  green: 'pepe-green',
  gold: 'pepe-gold',
  orange: 'pepe-orange',
  teal: 'pepe-teal',
  charcoal: 'pepe-charcoal',
  cream2: 'pepe-cream',  // handled separately
  burntOrange: 'pepe-burnt-orange',
  terracotta: 'pepe-terracotta',
  warmWhite: 'pepe-warm-white',
  sand: 'pepe-sand',
  maroon: 'pepe-maroon',
  successGreen: 'success-green',
  errorRed: 'error-red',
  dark2: 'dark',  // handled separately
  dark3: 'primary-brown',  // handled separately
  charcoal2: 'charcoal',  // handled separately
  primaryHover: 'pepe-red-hover',
  primaryActive: 'pepe-red-active',
  darkActive: 'pepe-dark-active',
  menuCream: 'pepe-menu-cream',
};

/**
 * Update color hex values in tailwind.config.js.
 * Uses regex to find and replace each color token's hex value.
 */
export function updateTailwindColors(config: SiteConfig): void {
  let content = fs.readFileSync(TAILWIND_PATH, 'utf-8');
  const colors = config.colors;

  // Direct mapping of tailwind token name -> config color key
  const replacements: [string, string][] = [
    ['cream', colors.cream],
    ['pepe-dark', colors.dark],
    ['pepe-red', colors.primary],
    ['pepe-green', colors.green],
    ['pepe-gold', colors.gold],
    ['pepe-orange', colors.orange],
    ['pepe-teal', colors.teal],
    ['pepe-charcoal', colors.charcoal],
    ['pepe-cream', colors.cream],
    ['pepe-burnt-orange', colors.burntOrange],
    ['pepe-terracotta', colors.terracotta],
    ['pepe-warm-white', colors.warmWhite],
    ['pepe-sand', colors.sand],
    ['pepe-maroon', colors.maroon],
    ['success-green', colors.successGreen],
    ['error-red', colors.errorRed],
    ['primary-brown', colors.dark],
    ['charcoal', colors.charcoal],
    ['pepe-red-hover', colors.primaryHover],
    ['pepe-red-active', colors.primaryActive],
    ['pepe-dark-active', colors.darkActive],
    ['pepe-menu-cream', colors.menuCream],
  ];

  for (const [token, value] of replacements) {
    // Match: 'token-name': '#xxxxxx'  (with possible quotes around the key)
    const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`('${escaped}':\\s*)'#[0-9a-fA-F]{6}'`, 'g');
    content = content.replace(regex, `$1'${value}'`);
  }

  // Also update 'muted' and 'light-brown' tokens
  const lightBrown = `'light-brown': '${colors.charcoal}'`;
  content = content.replace(/'light-brown':\s*'#[0-9a-fA-F]{6}'/, lightBrown);

  // Update 'dark' token (standalone, not pepe-dark)
  // Be careful to match exactly `'dark': '#...'` (without pepe- prefix)
  content = content.replace(/('dark':\s*)'#[0-9a-fA-F]{6}'/, `$1'${colors.dark}'`);

  fs.writeFileSync(TAILWIND_PATH, content, 'utf-8');
}
