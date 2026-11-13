import { ORIGIN } from '../lib/site';
// Everyone is welcome, AI crawlers included: being cited by AI answers is a goal of this site.
const bots = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'CCBot', 'Bingbot', 'Googlebot'];
export const GET = () => new Response(
  `User-agent: *\nAllow: /\n\n${bots.map((b) => `User-agent: ${b}\nAllow: /\n`).join('\n')}\nSitemap: ${ORIGIN}/sitemap.xml\n`,
  { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
