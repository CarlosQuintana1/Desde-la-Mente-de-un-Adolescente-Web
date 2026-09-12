import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { episodes } from '../src/data/episodes.js';
import { SITE } from '../src/data/constants.js';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const hoy = new Date().toISOString().slice(0, 10);

const urls = [
  { loc: '/', lastmod: hoy, changefreq: 'weekly', priority: '1.0' },
  { loc: '/episodios', lastmod: hoy, changefreq: 'weekly', priority: '0.8' },
  // mismo formato que los enlaces de EpisodeCard, para no declarar rutas que el sitio no usa
  ...episodes.map((ep) => ({ loc: `/episodio/${ep.number}`, changefreq: 'monthly', priority: '0.6' })),
];

const bloque = ({ loc, lastmod, changefreq, priority }) => [
  '  <url>',
  `    <loc>${SITE.url}${loc}</loc>`,
  lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
  `    <changefreq>${changefreq}</changefreq>`,
  `    <priority>${priority}</priority>`,
  '  </url>',
].filter(Boolean).join('\n');

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map(bloque),
  '</urlset>',
  '',
].join('\n');

writeFileSync(join(raiz, 'public', 'sitemap.xml'), xml);
console.log(`sitemap: ${urls.length} urls`);
