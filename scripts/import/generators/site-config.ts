import * as fs from 'fs';
import * as path from 'path';
import type { SiteConfig } from '../validate';

const OUTPUT_PATH = path.resolve(__dirname, '../../../lib/site-config.ts');

export function generateSiteConfig(config: SiteConfig): string {
  const json = JSON.stringify(config, null, 2);

  return `// Auto-generated from data/site-config.json — do not edit manually.
// Run \`npm run import\` to regenerate.

export const siteConfig = ${json} as const;

export type SiteConfig = typeof siteConfig;
`;
}

export function writeSiteConfig(config: SiteConfig): void {
  const content = generateSiteConfig(config);
  fs.writeFileSync(OUTPUT_PATH, content, 'utf-8');
}
