# Design system: di-rico.com

Source: design canvas "R4Home" and "R5Shelf" (merged into the homepage), with "R4CV", "R4Podcast" and "R4Project" for inner pages. This file overrides generic design advice.

## Idea

A desk, not a template. Lined notebook paper, a cassette recorder for the podcast, notebooks on a shelf for the work, a lanyard speaker pass in the hero and a library ladder that opens "My Experience Ladder". Objects are drawn in CSS; photographs are real.

## Colour

| Token | Value | Use |
|---|---|---|
| `--navy` | #162660 | All type, buttons, ladder rails |
| `--baby` | #d0e6fd | Pass, post-its, highlighted cards, tape |
| `--mid` | #175392 | Focus rings, Speaking notebook spine |
| `--butter` | #fdf0b4 | Only behind the word "Ladder" and podcast accents |
| `--screen` | #10162c | Recorder screen and audio panels |
| `--ink` / `--muted` | #1b1f33 / #3f4e5e | Body copy / secondary copy on white |
| `--line` | #e3eefb | Notebook rules |

No brown, cream or beige. Text contrast is at least 4.5:1; navy on baby blue and navy on butter both pass.

## Type (all self-hosted through @fontsource, never Google Fonts)

- Literata 400/700: headings, names, lead paragraphs, long reading.
- IBM Plex Sans 400/500/600: interface and body.
- Caveat 600: handwriting (eyebrows, section headings, captions on polaroids). Never for long text.
- Archivo 800: the podcast title only.
- DotGothic16: the recorder screen only.

## Paper

Lined, not grid: a 1px `--line` rule every 28px. Sheets, notes and cards sit on top in white or baby blue with a soft navy shadow and a slight rotation (never more than 3 degrees).

## Components

Lanyard pass, recorder (`.deck`), cassette (`.tc`), shelf and notebooks (`.shelf`, `.nb`, `.book`), polaroid (`.pol`) with post-it (`.postit`), horizontal ladder (`.hl`), vertical ladder (`.vladder`), notes (`.note`), luggage tag (`.tag`), sheets and panels. All defined in `src/styles/global.css`.

## Behaviour

- Everything is a real link to a real page first. JavaScript only adds: the notebook opening, the post-it, the recorder transport, the stacking polaroids on phones, the ladder climbing in.
- Phones (860px and below) get the short version: one-column notebook, polaroids as a pile with "Next photo".
- `prefers-reduced-motion` turns all animation off.
- Touch targets are at least 44px. One h1 per page.

## Voice

First person, British English, sentence case, no em dashes. "Di Rico" always has a capital D. Never state a fee, a phone number, a location or citizenship. Nothing about the book. The Child Lens: top-line role only.
