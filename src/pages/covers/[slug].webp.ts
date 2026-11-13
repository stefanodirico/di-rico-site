// Episode cover art, copied from the podcast feed at build time so it is served from this site (no third-party request).
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { getPodcast } from '../../lib/podcast';

export async function getStaticPaths() {
  const { show, episodes } = await getPodcast();
  return episodes.map((e) => ({ params: { slug: e.slug }, props: { url: e.image || show.image } }));
}
export async function GET({ props }: { props: { url?: string } }) {
  let input: Buffer;
  try {
    if (!props.url) throw new Error('no image');
    const res = await fetch(props.url, { signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    input = Buffer.from(await res.arrayBuffer());
  } catch {
    // Feed image unavailable: fall back to the show photo.
    input = fs.readFileSync(path.join(process.cwd(), 'src/assets/photos/podcast-hero.jpg'));
  }
  const out = await sharp(input).resize(360, 360, { fit: 'cover', position: 'attention' }).webp({ quality: 78 }).toBuffer();
  return new Response(out, { headers: { 'Content-Type': 'image/webp' } });
}
