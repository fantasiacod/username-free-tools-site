# Roadmap

This file is the project's task queue. It is read and updated automatically by
a daily scheduled task (see `PROGRESS.md` for the log of what's already been done).

**Rules for whoever (human or automated session) works from this file:**
- Pick the **first unchecked item** you're able to complete in one sitting. Prefer small, safe, shippable increments over big rewrites.
- After finishing an item, check it off here (`- [x]`) and add a dated entry to `PROGRESS.md` describing exactly what changed.
- If you add a new tool, also: add its card to `index.html`, add its URL to `sitemap.xml`, and give it real (not lorem-ipsum) SEO copy — a title, meta description, and 2+ short paragraphs of genuinely useful content, matching the style of the existing tool pages.
- **The site is bilingual (English/Arabic) via `assets/i18n.js`** — a tiny client-side toggle, not separate URLs. Every new page MUST: wrap all visible text in `data-i18n="key"` (or `data-i18n-content` for `<meta content>`, `data-i18n-placeholder` for input placeholders), add both an `en` and `ar` entry for every new key to `assets/i18n.js`'s dictionary, include `<script src=".../assets/i18n.js"></script>` before its own inline script, and add the `#lang-toggle` button in the header nav (copy it from an existing page). Any dynamically-generated text (JS template strings built at runtime) must pull its labels via `QTH_I18N.t('key', QTH_I18N.getLang())` and re-render on the `qth-lang-changed` event — see `tools/image-converter/index.html`'s `renderChangeSummary()` for the pattern. Verify with the key-coverage check below before committing.
- Never remove ads.txt, privacy-policy.html, terms.html or the ad-slot placeholders — they matter for ad network approval.
- Keep the whole site dependency-free / static (no build step, no server). Third-party JS libraries are fine via CDN `<script>` tags (as done for QRCode.js).
- Before committing, sanity-check: every `data-i18n*` key used across all `.html` files has both an `en` and `ar` entry in `assets/i18n.js` (a quick Node script loading `assets/i18n.js` in a vm sandbox and diffing keys works well — see PROGRESS.md 2026-09-02 entry for the approach), and run each changed page through a headless-browser smoke check (page loads, no console errors, `#lang-toggle` flips `dir` to `rtl` and swaps visible text) if Playwright is available in the environment.
- If something needs a decision only the site owner can make (buying a domain, approving an ad network, creating a Gumroad product), do NOT block on it — add a clearly marked `⚠️ NEEDS HUMAN:` item near the top of this file describing exactly what's needed, and move on to the next independent task.
- Keep commits small and each one working (don't leave the site broken between commits).

---

## Next up (in priority order)

- [x] Improve the PDF Compressor (`tools/pdf-compressor/`) beyond v1: recompress embedded JPEG images for a bigger size reduction on image-heavy PDFs. Done 2026-09-08 — see PROGRESS.md. (A further follow-up — recompressing *non*-JPEG raw/Flate-encoded images — is queued below as a smaller, separate increment.)
- [ ] Follow-up to the PDF image recompression shipped 2026-09-08: it only recompresses images already stored as JPEG (`/DCTDecode`). Raw/FlateDecode pixel data (common for scanner output saved as PNG-like streams) is left untouched. A future increment could decode those via pdf-lib's declared ColorSpace/BitsPerComponent, draw to canvas, and re-encode as JPEG — reuse the same safety pattern (skip Indexed/Separation/DeviceN color spaces and any Decode array, verify dimensions match, only keep the result if it reloads cleanly and is smaller, fall back to the previous behavior otherwise). Deferred again 2026-09-09 (same reasoning as 2026-09-05/06/07: real risk of corrupting a user's PDF from binary color-space/filter handling, and this is a bigger chunk of work than fits a single modest increment) in favor of the smaller, well-scoped blog item below.
- [x] Write a short blog-style article under `/blog/` targeting a real long-tail search query related to one of the tools (e.g. "how to compress a PDF for free without losing quality"), ~500-800 words, genuinely useful, linking to the relevant tool. Add it to the sitemap. Done 2026-09-09 — see PROGRESS.md.
- [ ] Add 2-3 more such articles over time, one every few days, each targeting a different long-tail query. This is the main lever for organic (free) search traffic. Good candidates: "how to convert HEIC to JPG for free", "how to make a QR code for a Wi-Fi password", "why is my JSON invalid" — each should link back to the matching tool (image-converter, qr-generator, json-formatter respectively).
- [ ] Add a "Blog" section/teaser card to the homepage itself (currently only linked via the header nav added 2026-09-09) once there are 2-3 posts, so new visitors discover it without using the nav.
- [ ] Add basic client-side usage counters or lightweight analytics if a free privacy-respecting option is available without any account signup (skip if it requires an account — flag as NEEDS HUMAN instead).
- [ ] Periodically re-check that all pages still load correctly (no console errors) after changes — treat this as part of every session, not a separate roadmap item.

## ⚠️ NEEDS HUMAN (cannot be done by the automated session)

- [ ] Sign up for an ad network that's easy to get approved with low traffic (e.g. Media.net or PropellerAds), get an ad code snippet, and share it so it can be pasted into the `.ad-slot` divs across the site.
- [ ] Once traffic grows, apply for Google AdSense (requires some real traffic + the policy pages, which already exist: privacy-policy.html, terms.html, about.html, contact.html).
- [ ] Create a Gumroad product for a "Pro" tier (idea: remove the reserved ad space + unlock a couple of extra tool options, sold as a one-time small purchase or "pay what you want"). Share the Gumroad product link so it can be wired into a "Go Pro" button.
- [ ] (Optional, later) Buy a short custom domain once there's some traffic, and point it at GitHub Pages via a CNAME file — improves trust/SEO and ad network approval odds vs. the default github.io subdomain.

## Done

- [x] Initial site scaffold: homepage, QR Code Generator (live), Image Converter & Compressor (live), About/Contact/Privacy/Terms pages, robots.txt, sitemap.xml.
- [x] Repo made public and GitHub Pages enabled — site is live at https://fantasiacod.github.io/username-free-tools-site/
- [x] Added 3rd tool: Text Case Converter & Word Counter (`tools/text-case-converter/`) — live, linked from homepage and sitemap.
- [x] Added bilingual English/Arabic support site-wide via `assets/i18n.js` (client-side toggle, RTL-aware) — every existing page converted, `#lang-toggle` button in every header.
- [x] Image Converter & Compressor: added an original-image preview on upload, and a before/after comparison (side-by-side images + a "what changed" summary covering format, quality, dimensions and file size) after conversion.
- [x] Rebranded to "Code Engineer" / "مهندس كود" with a real logo (owner-supplied image, cropped to a circular icon) as favicon + header logo across every page. Brand name is now translatable via the `brand.name` i18n key — keep using that key (never hardcode the brand name) in any new page.
- [x] Added 4th tool: Password Generator (`tools/password-generator/`) — length slider (4-64), uppercase/lowercase/numbers/symbols checkboxes, exclude-similar-characters option, Web Crypto-based generation, strength meter, copy-to-clipboard. Live, bilingual, linked from homepage and sitemap.
- [x] Added 5th tool: PDF Compressor (`tools/pdf-compressor/`) — v1 using `pdf-lib` via CDN: strips embedded metadata and re-saves with compact object streams to shrink file size, with a before/after size + page-count comparison and download. Live, bilingual, linked from homepage (replacing the "coming soon" card) and sitemap. Image-recompression (a bigger win) is queued as a follow-up above.
- [x] Added 6th tool: Image Resizer (`tools/image-resizer/`) — width/height inputs with aspect-ratio lock, before/after preview and size comparison, downloads in the original image format. Live, bilingual, linked from homepage and sitemap.
- [x] Added 7th tool: JSON Formatter & Validator (`tools/json-formatter/`) — Format (pretty-print with 2/4-space or tab indent) and Minify buttons, instant validation via the browser's built-in `JSON.parse`/`JSON.stringify` with a plain-English error message that includes the line/column of the problem when the engine's error exposes it, copy-to-clipboard. Live, bilingual, linked from homepage and sitemap.
- [x] Added 8th tool: Unit Converter (`tools/unit-converter/`) — category dropdown (Length / Weight / Temperature), two linked number inputs with per-side unit selects that convert live and bidirectionally as you type, plus a Swap button. Length/weight go through a common base unit with exact international conversion factors; temperature uses the real Celsius/Fahrenheit/Kelvin formulas. Live, bilingual, linked from homepage and sitemap.
- [x] PDF Compressor v2: recompresses embedded JPEG images (not just metadata) for a much bigger size reduction on image-heavy PDFs, with several safety guards (skips CMYK/indexed/unusual color spaces, verifies the output reloads correctly, falls back to the metadata-only v1 behavior if anything looks off) so it never ships a broken file. See PROGRESS.md 2026-09-08 for the verification approach.
