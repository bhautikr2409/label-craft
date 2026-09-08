/**
 * Writes public/sitemap.xml from path: '...' entries in seoContent.js.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const SITE_URL = 'https://labelcraft.netlify.app';

const seoSource = readFileSync(join(root, 'src/constants/seoContent.js'), 'utf8');
const paths = [
  ...new Set(
    [...seoSource.matchAll(/path:\s*'(\/[^']*)'/g)]
      .map((m) => m[1])
      .filter((p) => p && p !== '/404')
  ),
];

const ranked = ['/', '/tools', ...paths.filter((p) => p !== '/' && p !== '/tools').sort()];

const urls = ranked
  .map((path) => {
    const loc = path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`;
    return `  <url><loc>${loc}</loc><changefreq>weekly</changefreq><priority>${path === '/' ? '1.0' : '0.8'}</priority></url>`;
  })
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

writeFileSync(join(root, 'public/sitemap.xml'), xml, 'utf8');
console.log(`sitemap.xml updated (${ranked.length} URLs)`);
