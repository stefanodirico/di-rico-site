import { ORIGIN, getProjects } from '../lib/site';
import { getPodcast } from '../lib/podcast';
export async function GET() {
  const { episodes } = await getPodcast();
  const today = new Date().toISOString().slice(0, 10);
  const urls: [string, string][] = [
    ['/', today], ['/podcast/', episodes[0]?.isoDate.slice(0, 10) ?? today], ['/work/', today], ['/speaking/', today], ['/media/', today],
    ['/experience-ladder/', today], ['/about/', today],
    ...getProjects().map((p) => [`/work/${p.slug}/`, today] as [string, string]),
    ...episodes.map((e) => [`/podcast/${e.slug}/`, e.isoDate.slice(0, 10)] as [string, string]),
    ['/privacy/', today], ['/cookies/', today], ['/terms/', today], ['/accessibility/', today],
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(([u, d]) => `<url><loc>${ORIGIN}${u}</loc><lastmod>${d}</lastmod></url>`).join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
