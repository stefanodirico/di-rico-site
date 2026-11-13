# Agent rules for di-rico-site

## Standards
- Follow the web-app-build-standards skill (github.com/stefanodirico/web-app-build-standards) for all UI, security and launch work.
- British English, sentence case, no em dashes. "Di Rico" always has a capital D.
- Read DESIGN.md before any UI change.
- Secrets stay server-side; permissions are enforced on the server or database. This site has neither: never add a secret, API key or token to this repository.

## Project rules
- Static Astro site on GitHub Pages. No server, no database, no forms, no accounts.
- Editable content lives in `content/` only. Do not hard-code copy that belongs there.
- All content must be in the HTML without JavaScript. JavaScript is progressive enhancement and stays under 60 KB.
- Fonts are self-hosted. Never load Google Fonts or any third-party script without consent handling (see `src/scripts/site.js`).
- Third-party embeds (Spotify, YouTube) load only after the visitor allows "embedded media".
- Never publish: a speaking fee, a phone number, a location, citizenship, anything about the book, or detail about The Child Lens beyond the top-line role.
- Email records for di-rico.com (MX, SPF, DKIM, DMARC) must never be changed.
- Run `npm run build && npm run check` before every commit, and look at the result at desktop and phone widths.

## Access control
| Resource | Signed out | User | Owner of the record | Admin |
|---|---|---|---|---|
| Public pages | read | n/a | n/a | n/a |
| Repository content | none | n/a | n/a | edit through GitHub (repository collaborators only) |

Rules: there are no user accounts. The only write path is a commit to this repository. Anything not listed is denied.
