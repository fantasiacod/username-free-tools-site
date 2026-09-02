# Monetization Plan

## Phase 1 — easy-approval ad network (now)
Sign up for one of these (no minimum traffic, fast approval):
- Media.net — https://www.media.net
- PropellerAds — https://propellerads.com

Once approved, you'll get a JS snippet or ad unit code. Paste it into the
`<div class="ad-slot">...</div>` blocks found on:
- `index.html`
- `tools/qr-generator/index.html`
- `tools/image-converter/index.html`
(and any new tool pages added later — every tool page should keep one `.ad-slot`).

## Phase 2 — Google AdSense (once there's real traffic)
Apply at https://www.google.com/adsense once the site has some organic visits.
The required policy pages already exist (`privacy-policy.html`, `terms.html`,
`about.html`, `contact.html`). Update `ads.txt` at the site root with the line
AdSense gives you during setup.

## Phase 3 — Gumroad "Pro" tier
Create a small paid product on Gumroad (one-time purchase or pay-what-you-want).
Ideas for what "Pro" unlocks:
- No reserved ad space shown
- Batch image conversion (multiple files at once)
- Higher QR code resolution / logo-in-QR option

Once the Gumroad product link exists, add a "Go Pro" button to the header
(`assets/style.css` already has `.card`/`button` styles ready to reuse) linking
to the Gumroad checkout URL.

## Tracking progress toward $100/month
Revenue realistically comes from search traffic compounding over weeks, not
days. The daily task's job is to keep shipping useful tools and SEO content
(see ROADMAP.md) so organic traffic keeps growing. Revisit this file's numbers
once analytics and an ad network are wired in.
