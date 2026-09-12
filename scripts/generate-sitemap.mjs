/**
 * Writes public/sitemap.xml from path: '...' entries in seoContent.js + guidesContent.js.
 * Priorities: home > tools/product pages > guides > legal.
 */
import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const siteSource = readFileSync(join(root, 'src/constants/site.js'), 'utf8');
const domainMatch = siteSource.match(/SITE_DOMAIN\s*=\s*['"]([^'"]+)['"]/);
const SITE_URL = `https://${domainMatch?.[1] || 'ecomcrop.in'}`;

const seoSource = readFileSync(join(root, 'src/constants/seoContent.js'), 'utf8');
const guidesSource = readFileSync(join(root, 'src/constants/guidesContent.js'), 'utf8');

const paths = [
  ...new Set(
    [
      ...seoSource.matchAll(/path:\s*'(\/[^']*)'/g),
      ...guidesSource.matchAll(/path:\s*'(\/[^']*)'/g),
    ]
      .map((m) => m[1])
      .filter((p) => p && p !== '/404')
  ),
];

function priorityFor(path) {
  if (path === '/') return '1.0';
  if (path === '/tools') return '0.9';
  if (['/label-crop', '/meesho-sort', '/amazon-sku', '/add-logo'].includes(path)) return '0.9';
  if (path.startsWith('/guides/')) return '0.8';
  if (path === '/guide' || path === '/about' || path === '/contact') return '0.7';
  if (path === '/privacy' || path === '/terms') return '0.3';
  return '0.6';
}

function changeFreqFor(path) {
  if (path === '/privacy' || path === '/terms') return 'monthly';
  if (path.startsWith('/guides/') || path === '/guide' || path === '/about') return 'monthly';
  return 'weekly';
}

const lastmod = new Date().toISOString().slice(0, 10);

const ranked = ['/', '/tools', ...paths.filter((p) => p !== '/' && p !== '/tools').sort()];

const urls = ranked
  .map((path) => {
    const loc = path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`;
    return [
      '  <url>',
      `    <loc>${loc}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      `    <changefreq>${changeFreqFor(path)}</changefreq>`,
      `    <priority>${priorityFor(path)}</priority>`,
      '  </url>',
    ].join('\n');
  })
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

writeFileSync(join(root, 'public/sitemap.xml'), xml, 'utf8');

// Touch-check that OG assets exist so deploys do not ship broken social previews.
for (const asset of ['public/img/og-cover.png', 'public/img/ecomcrop-icon.png', 'public/favicon.svg']) {
  try {
    statSync(join(root, asset));
  } catch {
    console.warn(`SEO warning: missing ${asset}`);
  }
}

console.log(`sitemap.xml updated (${ranked.length} URLs) · ${SITE_URL} · lastmod ${lastmod}`);
