# di-rico.com

The website of Stefano Di Rico: portfolio, podcast (Creating Your Ladder) and press kit. Built with Astro as a static site and hosted on GitHub Pages.

## How to edit the site (no coding needed)

Everything you are likely to change lives in the `content/` folder. On github.com, open the file, press the pencil icon, make your change and press "Commit changes". The site rebuilds itself and is live in about two minutes.

| I want to change | Edit this file |
|---|---|
| Bios (50, 100, 250 words), host introduction, tagline, quick facts, social links, email | `content/site.json` |
| A rung on the experience ladder | `content/ladder.json` (top of the file is the top rung) |
| Speaking topics, formats, past talks, FAQs | `content/speaking.json` |
| Press coverage and comment topics | `content/media.json` |
| A project page | `content/work/<name>.md` |
| A new project | Add a new `.md` file to `content/work/`, copying an existing one |
| Episode one-liners or a YouTube video for an episode | `content/podcast.json` |
| An episode transcript | Add `content/transcripts/<episode-slug>.md` (for example `peter-wood.md`) |
| Photo alt text and captions | `content/photos.json` |
| Analytics | `analytics` in `content/site.json` |

Tips:

- **New podcast episodes appear on their own.** The site reads the RSS feed every time it builds, and it rebuilds every day at about 05:17 UTC. To get an episode up sooner, go to Actions, choose "Build and deploy" and press "Run workflow".
- **JSON files are fussy.** Keep the quotation marks and commas exactly as they are. If a build fails, the Actions tab shows a red cross and the live site stays as it was, so nothing breaks.
- **New photo:** upload it to `src/assets/photos/`, then add its alt text to `content/photos.json`. The build refuses a photo with no alt text. Location data is stripped automatically.
- **Linking a project to the ladder:** put the rung's `id` in the project's `rung:` line, and the project's file name in the rung's `projects` list.
- **House style:** British English, sentence case, no em dashes, and always "Di Rico" with a capital D. The build checks the last two.

## Analytics and cookies

In `content/site.json`, `analytics.provider` can be:

- empty: no analytics at all;
- `goatcounter`, with `id` set to your GoatCounter code: cookieless, no consent prompt needed;
- `ga4`, with `id` set to `G-XXXXXXX`: Google Analytics, loaded only after a visitor accepts analytics cookies.

The cookie banner, the "Cookie settings" link in the footer and the cookie policy update themselves to match. Spotify and YouTube players never load until a visitor allows embedded media.

## Going live on di-rico.com

1. Add the DNS records at Squarespace (see `docs/going-live.md`). Leave the email records alone.
2. Add a file called `CNAME` to the `public/` folder containing one line: `di-rico.com`. Committing it switches the site from preview mode (hidden from search engines) to live mode.
3. In the repository's Settings, under Pages, set the custom domain to `di-rico.com` and tick "Enforce HTTPS" once it is offered.

## Working on the code

```
npm install
npm run dev      # local preview
npm run build    # build into dist/
npm run check    # launch checks on the built site
```

Read `DESIGN.md` before changing anything visual, and `AGENTS.md` for the rules.
