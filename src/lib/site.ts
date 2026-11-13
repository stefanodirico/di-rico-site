import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

const root = process.cwd();
const read = (f: string) => JSON.parse(fs.readFileSync(path.join(root, 'content', f), 'utf8'));

export const site = read('site.json');
export const ladder: any[] = read('ladder.json').rungs;
export const speaking = read('speaking.json');
export const media = read('media.json');
export const photosMeta: Record<string, { alt: string; caption?: string }> = read('photos.json');
export const podcastExtras: Record<string, any> = read('podcast.json').episodes || {};

declare const __LIVE__: boolean;
export const LIVE: boolean = __LIVE__;
/** The address the site will have once it is live. Canonical URLs, sitemap-style links and JSON-LD always use this. */
export const ORIGIN = 'https://di-rico.com';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');
/** Internal link helper: adds the preview base path and a trailing slash. */
export function u(p: string): string {
  if (/^(https?:|mailto:|#)/.test(p)) return p;
  let [pathname, hash] = p.split('#');
  if (!pathname.startsWith('/')) pathname = '/' + pathname;
  if (!/\.[a-z0-9]+$/i.test(pathname) && !pathname.endsWith('/')) pathname += '/';
  return base + pathname + (hash ? '#' + hash : '');
}
export const abs = (p: string) => ORIGIN + (p.endsWith('/') || /\.[a-z0-9]+$/i.test(p) ? p : p + '/');
export const mail = (key: keyof typeof site.mailSubjects | string) =>
  `mailto:${site.email}?subject=${encodeURIComponent(site.mailSubjects[key] ?? key)}`;

export interface Project {
  slug: string; title: string; polaroid: string; kind: string; with?: string; order: number;
  when?: string; role?: string; how?: string; outcome?: string; rung?: string; photo?: string;
  gallery: string[]; summary: string; description: string; sources: { label: string; url: string }[];
  html: string; pull?: string;
}
export function getProjects(): Project[] {
  const dir = path.join(root, 'content', 'work');
  return fs.readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => {
    const { data, content } = matter(fs.readFileSync(path.join(dir, f), 'utf8'));
    return {
      slug: f.replace(/\.md$/, ''), gallery: [], sources: [], order: 99, ...data,
      html: marked.parse(content, { async: false }) as string,
    } as Project;
  }).sort((a, b) => a.order - b.order);
}
export function getTranscript(slug: string): string | null {
  const f = path.join(root, 'content', 'transcripts', slug + '.md');
  if (!fs.existsSync(f)) return null;
  return marked.parse(matter(fs.readFileSync(f, 'utf8')).content, { async: false }) as string;
}

const imgs = import.meta.glob<{ default: ImageMetadata }>('../assets/photos/*.{jpg,png,webp}', { eager: true });
export function photo(name: string) {
  const hit = Object.entries(imgs).find(([k]) => k.endsWith('/' + name));
  if (!hit) throw new Error(`Photo not found in src/assets/photos: ${name}`);
  const meta = photosMeta[name];
  if (!meta?.alt) throw new Error(`Add alt text for ${name} in content/photos.json`);
  return { src: hit[1].default, alt: meta.alt, caption: meta.caption };
}
export const rungById = (id?: string) => ladder.find((r) => r.id === id);
