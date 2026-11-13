// Launch checks on the built site. Run with: npm run build && npm run check
import fs from 'node:fs';
import path from 'node:path';
const dist = path.join(process.cwd(), 'dist');
const pages = [];
(function walk(d) { for (const f of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, f.name); f.isDirectory() ? walk(p) : f.name.endsWith('.html') && pages.push(p); } })(dist);
const errors = [], titles = new Map(), descs = new Map();
const base = fs.existsSync(path.join(process.cwd(), 'public', 'CNAME')) ? '' : '/di-rico-site';
for (const file of pages) {
  const html = fs.readFileSync(file, 'utf8'), rel = '/' + path.relative(dist, file);
  const bad = (m) => errors.push(`${rel}: ${m}`);
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) bad(`expected one h1, found ${h1}`);
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
  if (!title) bad('no title'); else if (title.length > 65) bad(`title is ${title.length} characters (aim for about 60)`);
  if (!desc) bad('no meta description'); else if (desc.length > 165 || desc.length < 70) bad(`description is ${desc.length} characters (aim for about 155)`);
  if (titles.has(title)) bad(`same title as ${titles.get(title)}`); titles.set(title, rel);
  if (descs.has(desc)) bad(`same description as ${descs.get(desc)}`); descs.set(desc, rel);
  if (!/<link rel="canonical" href="https:\/\/di-rico\.com\//.test(html)) bad('no canonical URL');
  if (!/property="og:image"/.test(html)) bad('no Open Graph image');
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) { try { JSON.parse(m[1]); } catch { bad('JSON-LD does not parse'); } }
  if (!/application\/ld\+json/.test(html)) bad('no JSON-LD');
  for (const m of html.matchAll(/<img\b[^>]*>/g)) if (!/\balt="[^"]+"/.test(m[0])) bad(`image without alt text: ${m[0].slice(0, 80)}`);
  if (/[—]/.test(html.replace(/<script[\s\S]*?<\/script>/g, ''))) bad('contains an em dash');
  if (/Stefano di Rico|SdR\b/.test(html)) bad('"Di Rico" must have a capital D');
  if (/fonts\.googleapis|fonts\.gstatic/.test(html)) bad('loads Google Fonts');
  for (const m of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
    let p = m[1]; if (p.startsWith('//')) continue;
    if (base && !p.startsWith(base + '/') && p !== base) { bad(`link ignores the base path: ${p}`); continue; }
    p = decodeURIComponent(p.slice(base.length)) || '/';
    const target = path.join(dist, p.endsWith('/') ? p + 'index.html' : p);
    if (!fs.existsSync(target)) bad(`broken internal link: ${m[1]}`);
  }
  for (const m of html.matchAll(/href="[^"]*#([a-z0-9-]+)"/g)) { /* anchors are checked in the browser */ }
}
for (const f of ['robots.txt', 'sitemap.xml', 'llms.txt', 'llms-full.txt', '404.html', 'favicon.svg']) if (!fs.existsSync(path.join(dist, f))) errors.push(`missing ${f}`);
const robots = fs.existsSync(path.join(dist, 'robots.txt')) ? fs.readFileSync(path.join(dist, 'robots.txt'), 'utf8') : '';
if (/Disallow: \/\s*$/m.test(robots)) errors.push('robots.txt blocks crawlers');
let js = 0; (function walk(d) { for (const f of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, f.name); f.isDirectory() ? walk(p) : f.name.endsWith('.js') && (js += fs.statSync(p).size); } })(dist);
if (js > 60000) errors.push(`JavaScript is ${Math.round(js / 1024)} KB (budget 60 KB)`);
console.log(`${pages.length} pages checked, ${Math.round(js / 1024)} KB of JavaScript.`);
if (errors.length) { console.error(errors.map((e) => ' - ' + e).join('\n')); process.exit(1); }
console.log('All checks passed.');
