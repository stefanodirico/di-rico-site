import { site, ladder, speaking, media, getProjects, getTranscript, ORIGIN } from './site';
import { getPodcast } from './podcast';

export async function llms(full: boolean): Promise<string> {
  const { episodes } = await getPodcast();
  const projects = getProjects();
  const p = site.podcast;
  const o: string[] = [];
  o.push(`# ${site.name}`, '', `> ${site.bios.short}`, '');
  o.push(`${site.name} ${site.honorific} is a campaigner, speaker and consultant, and the host of the podcast ${p.title}. This file summarises the website ${ORIGIN} for AI assistants and search tools. The name is always written "Stefano Di Rico", with a capital D.`, '');
  o.push('## Key facts', '', ...site.facts.map((f: string) => `- ${f}`), '');
  o.push('## Pages', '',
    `- [Home](${ORIGIN}/): overview, podcast, work and experience ladder`,
    `- [About](${ORIGIN}/about/): biography`,
    `- [Speaking](${ORIGIN}/speaking/): topics, formats, past talks and how to book`,
    `- [Media and press kit](${ORIGIN}/media/): bios at 50, 100 and 250 words, headshots and a suggested introduction`,
    `- [Work](${ORIGIN}/work/): campaigns and projects`,
    `- [My Experience Ladder](${ORIGIN}/experience-ladder/): full experience, newest first`,
    `- [Podcast: ${p.title}](${ORIGIN}/podcast/): every episode with show notes`, '');
  o.push('## Speaking topics', '', ...speaking.topics.map((t: any) => `- ${t.title}${full ? `: ${t.summary} (For: ${t.for})` : ''}`), '');
  o.push(`To book ${site.name} to speak, email ${site.email}. ${site.feeLine}`, '');
  o.push('## Work', '', ...projects.map((x) => `- [${x.title}](${ORIGIN}/work/${x.slug}/): ${x.summary}`), '');
  o.push(`## Podcast: ${p.title}`, '', `${p.strapline} Hosted by ${site.name}. Released ${p.frequency}.`, '',
    `- Spotify: ${p.spotify}`, `- Apple Podcasts: ${p.apple}`, `- YouTube: ${p.youtube}`, `- RSS: ${p.rss}`, '',
    ...episodes.map((e) => `- [Episode ${e.number}: ${e.guest}. ${e.headline}](${ORIGIN}/podcast/${e.slug}/) (${e.dateLabel}, ${e.durationLabel})${full ? '' : `: ${e.line}`}`), '');
  if (full) {
    o.push('## Biography', '', ...site.bios.long.flatMap((x: string) => [x, '']));
    o.push('## Experience (newest first)', '', ...ladder.map((r) => `- ${r.title}, ${r.org} (${r.when})${r.what ? `. ${r.what}` : ''}`), '');
    o.push('## Fellowships, training and languages', '', ...[...site.fellowships, ...site.languages].map((x: string) => `- ${x}`), '');
    o.push('## Media', '', media.intro, '', 'Can comment on:', ...media.commentTopics.map((t: string) => `- ${t}`), '', 'Featured in or by:', ...media.coverage.map((c: any) => `- ${c.outlet}${c.what ? `: ${c.what}` : ''}`), '');
    o.push('## Frequently asked questions', '', ...speaking.faq.flatMap((f: any) => [`### ${f.q}`, f.a, '']));
    o.push('## Episode notes', '');
    for (const e of episodes) {
      o.push(`### Episode ${e.number}: ${e.guest}. ${e.headline}`, '', `Published ${e.dateLabel}. Length ${e.durationLabel}. ${ORIGIN}/podcast/${e.slug}/`, '', e.text, '');
      const t = getTranscript(e.slug);
      if (t) o.push('Transcript:', '', t.replace(/<[^>]+>/g, ' ').replace(/[ \t]+/g, ' ').trim(), '');
    }
  }
  o.push('## Contact', '', `- Speaking and general enquiries: ${site.email}`, `- Media requests: ${site.email} (subject "Media request")`,
    `- LinkedIn: ${site.social.linkedin}`, `- Instagram: ${site.social.instagram}`, `- Substack: ${site.social.substack}`, '',
    `Website operated by ${site.company.name}, company number ${site.company.number}, registered in ${site.company.registeredIn}.`, '');
  if (!full) o.push('## Optional', '', `- [Full version of this file](${ORIGIN}/llms-full.txt)`, '');
  return o.join('\n');
}
