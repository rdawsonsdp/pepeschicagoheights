import * as fs from 'fs';
import * as path from 'path';
import type { SiteConfig } from '../validate';

const CSS_PATH = path.resolve(__dirname, '../../../app/globals.css');

/**
 * Map site-config color keys to CSS variable names.
 */
const COLOR_VAR_MAP: Record<string, string> = {
  primary: '--pepe-red',
  primaryHover: '--pepe-red-hover',
  primaryActive: '--pepe-red-active',
  orange: '--pepe-orange',
  dark: '--pepe-dark',
  darkActive: '--pepe-dark-active',
  charcoal: '--pepe-charcoal',
  green: '--pepe-green',
  gold: '--pepe-gold',
  teal: '--pepe-teal',
  burntOrange: '--pepe-burnt-orange',
  terracotta: '--pepe-terracotta',
  warmWhite: '--pepe-warm-white',
  sand: '--pepe-sand',
  maroon: '--pepe-maroon',
  cream: '--pepe-cream',
  menuCream: '--pepe-menu-cream',
  successGreen: '--success-green',
  errorRed: '--error-red',
  themeColor: '--pepe-orange', // themeColor maps to pepe-orange
};

/**
 * Update the :root block in globals.css with new color values.
 * Preserves all non-color content in the file.
 */
export function updateGlobalsCss(config: SiteConfig): void {
  let css = fs.readFileSync(CSS_PATH, 'utf-8');

  const colors = config.colors;

  for (const [configKey, cssVar] of Object.entries(COLOR_VAR_MAP)) {
    const value = (colors as Record<string, string>)[configKey];
    if (!value) continue;

    // Match the CSS variable declaration in the :root block
    const regex = new RegExp(`(${cssVar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:\\s*)#[0-9a-fA-F]{6}`, 'g');
    css = css.replace(regex, `$1${value}`);
  }

  // Also update the semantic aliases that reference specific hex values
  const semanticMap: Record<string, string> = {
    '--primary-brown': colors.dark,
    '--charcoal': colors.charcoal,
    '--accent-gold': colors.gold,
    '--background': colors.cream,
    '--foreground': colors.charcoal,
  };

  for (const [cssVar, value] of Object.entries(semanticMap)) {
    const regex = new RegExp(`(${cssVar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:\\s*)#[0-9a-fA-F]{6}`, 'g');
    css = css.replace(regex, `$1${value}`);
  }

  // Update scrollbar colors
  const scrollbarThumbRegex = /(::-webkit-scrollbar-thumb\s*\{[^}]*background:\s*)#[0-9a-fA-F]{6}/;
  css = css.replace(scrollbarThumbRegex, `$1${colors.primary}`);

  const scrollbarHoverRegex = /(::-webkit-scrollbar-thumb:hover\s*\{[^}]*background:\s*)#[0-9a-fA-F]{6}/;
  css = css.replace(scrollbarHoverRegex, `$1${colors.primaryHover}`);

  // Update gradient-text colors
  const gradientTextRegex = /(\.gradient-text\s*\{[^}]*background:\s*linear-gradient\([^,]+,\s*)#[0-9a-fA-F]{6}(\s+0%,\s*)#[0-9a-fA-F]{6}/;
  css = css.replace(gradientTextRegex, `$1${colors.primary}$2${colors.orange}`);

  // Update button glow shadow color
  const buttonGlowRegex = /(\.btn-primary:hover\s*\{[^}]*box-shadow:[^;]*rgba\()[\d, ]+(\))/;
  // Convert primary hex to RGB for shadow
  const r = parseInt(colors.primary.slice(1, 3), 16);
  const g = parseInt(colors.primary.slice(3, 5), 16);
  const b = parseInt(colors.primary.slice(5, 7), 16);
  css = css.replace(buttonGlowRegex, `$1${r}, ${g}, ${b}$2`);

  // Update texture-tile color
  const tileRegex = /(\.texture-tile::before\s*\{[^}]*)(#[0-9a-fA-F]{6})/g;
  css = css.replace(tileRegex, (match, before) => {
    return match.replace(/#[0-9a-fA-F]{6}/g, colors.primary);
  });

  fs.writeFileSync(CSS_PATH, css, 'utf-8');
}
