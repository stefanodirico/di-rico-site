# Going live: DNS and retiring the old podcast site

## 1. Squarespace DNS records for di-rico.com

Squarespace: Domains, di-rico.com, DNS, DNS settings, Custom records.

Add these. Leave every MX and TXT record (SPF, DKIM, DMARC, google-site-verification) exactly as it is.

| Host | Type | Value |
|---|---|---|
| @ | A | 185.199.108.153 |
| @ | A | 185.199.109.153 |
| @ | A | 185.199.110.153 |
| @ | A | 185.199.111.153 |
| @ | AAAA | 2606:50c0:8000::153 |
| @ | AAAA | 2606:50c0:8001::153 |
| @ | AAAA | 2606:50c0:8002::153 |
| @ | AAAA | 2606:50c0:8003::153 |
| www | CNAME | stefanodirico.github.io |

Before adding them, delete any existing A, AAAA or CNAME record on `@` or `www` (Squarespace adds "Squarespace defaults" for parked domains: remove that preset). Do not touch the `creatingyourladder.podcast` record yet.

Recommended first: in GitHub, Settings (your account), Pages, "Add a domain", verify di-rico.com with the TXT record it gives you. This stops anyone else claiming the domain on GitHub Pages.

Then: add `public/CNAME` containing `di-rico.com`, set the custom domain in the repository's Pages settings, wait for the certificate, and tick "Enforce HTTPS".

## 2. Redirecting creatingyourladder.podcast.di-rico.com

Keep the Netlify site and its DNS record. Replace the Netlify site's contents with one file called `_redirects`:

```
/*  https://di-rico.com/podcast/  301!
```

Deploy it (drag a folder containing only that file into Netlify's Deploys page, or commit it to the old site's repository). Check that the old address, with and without a path, lands on di-rico.com/podcast/ with a 301.

Also update the links you control so they point at di-rico.com/podcast: the podcast's website field in Spotify for Creators (this feeds Apple and the RSS feed), YouTube channel links, Instagram, TikTok, LinkedIn and Substack.

## 3. Taking it down

Keep the redirect for at least six months, and until Search Console shows the old addresses have dropped out. Earliest date if the redirect goes live in November 2026: mid-May 2027. Then delete the Netlify site, and delete the `creatingyourladder.podcast` CNAME record at Squarespace in the same sitting (a DNS record left pointing at a deleted Netlify site can be claimed by someone else).

## 4. After launch

- Google Search Console: add di-rico.com as a Domain property (one more TXT record), submit `https://di-rico.com/sitemap.xml`.
- Bing Webmaster Tools: import from Search Console.
- In Search Console, also add the old podcast subdomain and use "Change of address" if offered.
- Test with PageSpeed Insights and the Rich Results Test.
