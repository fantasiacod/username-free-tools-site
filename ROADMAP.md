# Roadmap

This file is the project's task queue. It is read and updated automatically by
a daily scheduled task (see `PROGRESS.md` for the log of what's already been done).

**Rules for whoever (human or automated session) works from this file:**
- Pick the **first unchecked item** you're able to complete in one sitting. Prefer small, safe, shippable increments over big rewrites.
- After finishing an item, check it off here (`- [x]`) and add a dated entry to `PROGRESS.md` describing exactly what changed.
- If you add a new tool, also: add its card to `index.html`, add its URL to `sitemap.xml`, and give it real (not lorem-ipsum) SEO copy — a title, meta description, and 2+ short paragraphs of genuinely useful content, matching the style of the existing tool pages.
- Never remove ads.txt, privacy-policy.html, terms.html or the ad-slot placeholders — they matter for ad network approval.
- Keep the whole site dependency-free / static (no build step, no server). Third-party JS libraries are fine via CDN `<script>` tags (as done for QRCode.js).
- If something needs a decision only the site owner can make (buying a domain, approving an ad network, creating a Gumroad product), do NOT block on it — add a clearly marked `⚠️ NEEDS HUMAN:` item near the top of this file describing exactly what's needed, and move on to the next independent task.
- Keep commits small and each one working (don't leave the site broken between commits).

---

## Next up (in priority order)

- [ ] Add a 3rd tool: **Text Case / Word Counter** (uppercase/lowercase/title case converter + live word & character count). Pure JS, no library needed.
- [ ] Add a 4th tool: **Password Generator** (length slider, character-set checkboxes, copy-to-clipboard). Pure JS.
- [ ] Add a 5th tool: **PDF Compressor** using `pdf-lib` via CDN (https://cdn.jsdelivr.net/npm/pdf-lib/dist/pdf-lib.min.js) — re-save/re-encode embedded images at lower quality to shrink file size. This is more involved; it's fine to ship a first version that only strips metadata and re-saves, then improve compression in a later increment.
- [ ] Add a 6th tool: **Image Resizer** (dedicated, simpler UI than the converter — just width/height/aspect-ratio lock and download).
- [ ] Add a 7th tool: **JSON Formatter / Validator** (paste JSON, pretty-print + validate, copy button).
- [ ] Write a short blog-style article under `/blog/` targeting a real long-tail search query related to one of the tools (e.g. "how to compress a PDF for free without losing quality"), ~500-800 words, genuinely useful, linking to the relevant tool. Add it to the sitemap.
- [ ] Add 2-3 more such articles over time, one every few days, each targeting a different long-tail query. This is the main lever for organic (free) search traffic.
- [ ] Add basic client-side usage counters or lightweight analytics if a free privacy-respecting option is available without any account signup (skip if it requires an account — flag as NEEDS HUMAN instead).
- [ ] Periodically re-check that all pages still load correctly (no console errors) after changes — treat this as part of every session, not a separate roadmap item.

## ⚠️ NEEDS HUMAN (cannot be done by the automated session)

- [ ] Sign up for an ad network that's easy to get approved with low traffic (e.g. Media.net or PropellerAds), get an ad code snippet, and share it so it can be pasted into the `.ad-slot` divs across the site.
- [ ] Once traffic grows, apply for Google AdSense (requires some real traffic + the policy pages, which already exist: privacy-policy.html, terms.html, about.html, contact.html).
- [ ] Create a Gumroad product for a "Pro" tier (idea: remove the reserved ad space + unlock a couple of extra tool options, sold as a one-time small purchase or "pay what you want"). Share the Gumroad product link so it can be wired into a "Go Pro" button.
- [ ] (Optional, later) Buy a short custom domain once there's some traffic, and point it at GitHub Pages via a CNAME file — improves trust/SEO and ad network approval odds vs. the default github.io subdomain.
- [ ] Enable GitHub Pages in the repo settings if it isn't already serving at the expected URL (Settings → Pages → Source: Deploy from branch → `main` / root).

## Done

- [x] Initial site scaffold: homepage, QR Code Generator (live), Image Converter & Compressor (live), About/Contact/Privacy/Terms pages, robots.txt, sitemap.xml.
