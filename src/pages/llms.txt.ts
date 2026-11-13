import { llms } from '../lib/llms';
export const GET = async () => new Response(await llms(false), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
