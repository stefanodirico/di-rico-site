// Generated share images (1200 x 630), one per page, project and episode.
import fs from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { getProjects, site } from '../../lib/site';
import { getPodcast } from '../../lib/podcast';

const font = (pkg: string, file: string) => fs.readFileSync(path.join(process.cwd(), 'node_modules/@fontsource', pkg, 'files', file));
const fonts = [
  { name: 'Literata', data: font('literata', 'literata-latin-700-normal.woff'), weight: 700 as const, style: 'normal' as const },
  { name: 'Plex', data: font('ibm-plex-sans', 'ibm-plex-sans-latin-500-normal.woff'), weight: 500 as const, style: 'normal' as const },
  { name: 'Caveat', data: font('caveat', 'caveat-latin-600-normal.woff'), weight: 600 as const, style: 'normal' as const },
  { name: 'Archivo', data: font('archivo', 'archivo-latin-800-normal.woff'), weight: 800 as const, style: 'normal' as const },
];
type Card = { kicker: string; title: string; foot?: string; dark?: boolean };

export async function getStaticPaths() {
  const { episodes } = await getPodcast();
  const cards: Record<string, Card> = {
    home: { kicker: 'Campaigner, speaker and podcast host', title: 'Stefano Di Rico' },
    podcast: { kicker: 'A podcast with Stefano Di Rico', title: 'Creating Your Ladder', foot: 'New episodes fortnightly', dark: true },
    work: { kicker: 'Notebook no. 1', title: 'Work and campaigns' },
    speaking: { kicker: 'Notebook no. 2', title: 'Book Stefano Di Rico to speak' },
    media: { kicker: 'Notebook no. 3', title: 'Media and press kit' },
    about: { kicker: 'Notebook no. 4', title: 'About Stefano Di Rico' },
    'experience-ladder': { kicker: 'Instead of a CV', title: 'My Experience Ladder' },
  };
  for (const p of getProjects()) cards['work-' + p.slug] = { kicker: `${p.kind} with ${p.with}`, title: p.title, foot: p.outcome };
  for (const e of episodes) cards['podcast-' + e.slug] = { kicker: `Creating Your Ladder · Episode ${e.number}`, title: e.guest, foot: e.headline, dark: true };
  return Object.entries(cards).map(([slug, card]) => ({ params: { slug }, props: { card } }));
}

const el = (type: string, style: any, children?: any) => ({ type, props: { style, children } });

export async function GET({ props }: { props: { card: Card } }) {
  const c = props.card;
  const navy = '#162660', baby = '#d0e6fd', butter = '#fdf0b4', screen = '#10162c';
  const fg = c.dark ? '#ffffff' : navy;
  const size = c.title.length > 34 ? 64 : c.title.length > 20 ? 80 : 104;
  const lines = Array.from({ length: 15 }, (_, i) => el('div', { position: 'absolute', left: 0, right: 0, top: 30 + i * 42, height: 2, background: '#e3eefb' }));
  const tree = el('div', {
    width: 1200, height: 630, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '64px 72px',
    background: c.dark ? screen : '#ffffff', color: fg, fontFamily: 'Plex', position: 'relative',
  }, [
    ...(c.dark ? [] : lines),
    el('div', { display: 'flex', fontFamily: 'Caveat', fontSize: 44, color: c.dark ? butter : navy }, c.kicker),
    el('div', { display: 'flex', flexDirection: 'column' }, [
      el('div', { display: 'flex', fontFamily: c.dark ? 'Archivo' : 'Literata', fontSize: size, lineHeight: 1.02, letterSpacing: -1 }, c.title),
      ...(c.foot ? [el('div', { display: 'flex', marginTop: 22, fontSize: 32, lineHeight: 1.3, color: c.dark ? baby : '#1b1f33' }, c.foot)] : []),
    ]),
    el('div', { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 28 }, [
      el('div', { display: 'flex' }, site.name),
      el('div', { display: 'flex', background: c.dark ? butter : baby, color: navy, padding: '8px 20px', borderRadius: 999 }, 'di-rico.com'),
    ]),
  ]);
  const svg = await satori(tree as any, { width: 1200, height: 630, fonts });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
}
