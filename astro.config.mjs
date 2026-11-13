import { defineConfig } from 'astro/config';
import fs from 'node:fs';

// The site is "live" once public/CNAME exists (see README: Going live).
// Until then it builds as a preview under stefanodirico.github.io/di-rico-site and tells search engines not to index it.
const live = fs.existsSync(new URL('./public/CNAME', import.meta.url));

export default defineConfig({
  site: live ? 'https://di-rico.com' : 'https://stefanodirico.github.io',
  base: live ? '/' : '/di-rico-site',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  vite: {
    define: { __LIVE__: JSON.stringify(live) },
    build: { sourcemap: false },
  },
});
