import fs from 'node:fs';
import path from 'node:path';
import { XMLParser } from 'fast-xml-parser';
import sanitizeHtml from 'sanitize-html';
import { site, podcastExtras, ORIGIN } from './site';

export interface Episode {
  guid: string; number: number; slug: string; guest: string; headline: string; fullTitle: string;
  line: string; date: Date; dateLabel: string; isoDate: string; duration: string; seconds: number;
  durationLabel: string; isoDuration: string; audio: string; image?: string; link?: string;
  html: string; text: string; youtubeId?: string;
}

const slugify = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const txt = (v: any) => (v == null ? '' : typeof v === 'object' ? String(v['#text'] ?? '') : String(v)).trim();

function tidy(html: string): string {
  let h = sanitizeHtml(html, {
    allowedTags: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'a'],
    allowedAttributes: { a: ['href'] },
    transformTags: {
      a: (tag, attribs) => {
        let href = (attribs.href || '').trim();
        if (/^[^@\s/:]+@[^@\s/]+\.[a-z]+$/i.test(href)) href = 'mailto:' + href;
        // Old podcast site links now point at this site.
        if (/creatingyourladder\.podcast\.di-rico\.com/i.test(href)) href = ORIGIN + '/podcast/';
        return { tagName: 'a', attribs: { href, rel: 'noopener' } };
      },
    },
  });
  h = h.replace(/[⁠​]/g, '').replace(/<p>\s*(<br\s*\/?>)?\s*<\/p>/g, '');
  h = h.replace(/https:\/\/creatingyourladder\.podcast\.di-rico\.com\/?/g, ORIGIN.replace('https://', '') + '/podcast');
  // Feed text often runs a heading straight on from the sentence before it.
  h = h.replace(/([.!?])\s*<strong>/g, '$1</p><p><strong>').replace(/<\/strong>(?=[A-Z0-9])/g, '</strong></p><p>');
  // Chapter lists: one timestamp per line.
  if ((h.match(/\b\d{1,2}:\d{2}\b/g) || []).length >= 4) h = h.replace(/([^>\s])\s+(?=\d{1,2}:\d{2}(?::\d{2})?\s)/g, '$1<br>');
  return h.replace(/<p>\s*<\/p>/g, '');
}

function secs(d: string): number {
  if (!d) return 0;
  if (/^\d+$/.test(d)) return Number(d);
  return d.split(':').map(Number).reduce((a, n) => a * 60 + n, 0);
}

function shape(show: any, raw: any[]): { show: any; episodes: Episode[] } {
  const sorted = [...raw].sort((a, b) => +new Date(a.pubDate) - +new Date(b.pubDate));
  const used = new Set<string>();
  const episodes = sorted.map((r, i) => {
    const parts = String(r.title).split('|').map((s) => s.trim()).filter(Boolean);
    const guest = parts[0].replace(/\s+on Creating Your Ladder.*$/i, '').trim();
    const headline = (parts.find((p, k) => k > 0 && !/creating your ladder/i.test(p)) || guest).replace(/\.$/, '');
    let slug = slugify(guest) || 'episode-' + (i + 1);
    if (used.has(slug)) slug += '-' + (r.episode || i + 1);
    used.add(slug);
    const extra = podcastExtras[slug] || {};
    const date = new Date(r.pubDate);
    const s = secs(String(r.duration));
    const html = tidy(r.description || '');
    const text = sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }).replace(/\s+/g, ' ').trim();
    const hrs = Math.floor(s / 3600), mins = Math.round((s % 3600) / 60);
    return {
      guid: r.guid, number: Number(r.episode) || i + 1, slug: extra.slug || slug, guest: extra.guest || guest,
      headline: extra.headline || headline, fullTitle: r.title, line: extra.line || text.split(/(?<=[.?!])\s/)[0],
      date, isoDate: date.toISOString(),
      dateLabel: date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/London' }),
      duration: String(r.duration), seconds: s,
      durationLabel: (hrs ? `${hrs} hr ` : '') + `${mins} min`,
      isoDuration: `PT${hrs ? hrs + 'H' : ''}${Math.floor((s % 3600) / 60)}M${s % 60}S`,
      audio: r.audio, image: r.image, link: r.link, html, text, youtubeId: extra.youtubeId,
    } as Episode;
  });
  return { show, episodes: episodes.reverse() };
}

let memo: Promise<{ show: any; episodes: Episode[] }> | null = null;
export function getPodcast() {
  if (memo) return memo;
  memo = (async () => {
    try {
      const res = await fetch(site.podcast.rss, { signal: AbortSignal.timeout(15000) });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const xml = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_', cdataPropName: false as any }).parse(await res.text());
      const ch = xml.rss.channel;
      const items = Array.isArray(ch.item) ? ch.item : [ch.item].filter(Boolean);
      if (!items.length) throw new Error('feed has no episodes');
      const raw = items.map((it: any) => ({
        guid: txt(it.guid), title: txt(it.title), pubDate: txt(it.pubDate), duration: txt(it['itunes:duration']),
        audio: it.enclosure?.['@_url'], image: it['itunes:image']?.['@_href'], link: txt(it.link),
        episode: txt(it['itunes:episode']), description: txt(it.description),
      }));
      console.log(`[podcast] ${raw.length} episodes from the live RSS feed`);
      return shape({ title: txt(ch.title), description: txt(ch.description), image: ch['itunes:image']?.['@_href'] }, raw);
    } catch (e: any) {
      console.warn(`[podcast] live feed unavailable (${e.message}); using content/podcast-cache.json`);
      const c = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'content', 'podcast-cache.json'), 'utf8'));
      return shape(c.show, c.episodes);
    }
  })();
  return memo;
}
