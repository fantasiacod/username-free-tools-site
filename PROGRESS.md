# Progress Log

Append a new dated entry at the top each time work is done. Keep entries short and factual.

---

### 2026-09-05 — 6th tool: Image Resizer
- Shipped a 6th tool: Image Resizer (`tools/image-resizer/index.html`) — a dedicated, simpler UI than the Image Converter: width/height number inputs with an aspect-ratio-lock checkbox (editing one field auto-recalculates the other), an original-image preview on upload, and a before/after comparison (dimensions + file size) after resizing. Uses the same canvas draw/re-encode approach as the Image Converter; downloads in the original file's format (JPEG/PNG/WebP detected from the source file, defaulting to PNG for anything else) with quality 0.92 for lossy formats.
- Deliberately picked this over the top ROADMAP item (PDF image-recompression via pdf-lib XObjects) this round: that item needs careful embedded-image color-space/filter handling and is hard to visually verify without a PDF renderer available in this sandbox, so it stays queued at the top of ROADMAP.md with a note, to be tackled with more care in a future run rather than rushed.
- Fully bilingual: all new `resize.*` and `home.card.resize.*` keys added to both `en` and `ar` dictionaries in `assets/i18n.js`; verified with a Node/vm key-coverage script (159 keys used across all 11 HTML pages, zero missing in either language).
- Linked from the homepage grid (new card, 6th tool) and added to `sitemap.xml`. Includes a reserved `.ad-slot`, canonical link, real meta description, and two SEO paragraphs (how it works + when to resize an image).
- Sanity-checked before commit: JS syntax check (`new Function(...)`) on the inline script and `assets/i18n.js`, an HTML open/close tag-balance check on the new and changed files, and a Playwright smoke test served over a local `http.server` — uploaded a generated test PNG, verified the aspect-ratio lock recalculates height from width, clicked Resize and confirmed the before/after summary and blob-URL download wiring, and confirmed `#lang-toggle` flips to RTL Arabic — all passed with zero console errors. Also smoke-tested the homepage: card count, new card renders and links through to the tool page correctly.

### 2026-09-04 — 5th tool: PDF Compressor
- Shipped a 5th tool: PDF Compressor (`tools/pdf-compressor/index.html`), the first roadmap item under "Next up". v1 uses `pdf-lib` via CDN (`https://cdn.jsdelivr.net/npm/pdf-lib/dist/pdf-lib.min.js`) client-side: loads the uploaded PDF, strips embedded metadata (title, author, subject, keywords, producer, creator), and re-saves it with compact cross-reference object streams. Shows a before/after page-count and file-size comparison and a download button. Scoped deliberately to metadata-stripping + object-stream re-save per the roadmap's note that image recompression could wait for a later increment — added that as a new roadmap follow-up item.
- Fully bilingual: all new `pdf.*` keys added to both `en` and `ar` dictionaries in `assets/i18n.js`; verified with the Node/vm key-coverage script (139 keys used across all pages, zero missing in either language).
- Homepage: replaced the "PDF Compressor — coming soon" placeholder card with a live link, badge changed to "Live". Added the tool to `sitemap.xml`. Includes a reserved `.ad-slot`, canonical link, real meta description, and two SEO paragraphs (how the compression works + tips for shrinking PDFs further).
- Sanity-checked before commit: JS syntax check (`new Function(...)` on the inline script and `assets/i18n.js`), HTML tag-balance check on the new and changed files, and a Playwright smoke test — since this sandbox's network blocks the jsdelivr CDN outright (unrelated to whether it'll work for real site visitors), the test intercepted the `pdf-lib.min.js` request with a same-API stub to exercise the real UI flow: file upload, Compress click, before/after result rendering, download-button wiring, and `#lang-toggle` flipping to RTL Arabic — all passed with zero console errors.

### 2026-09-03 — 4th tool: Password Generator
- Shipped a 4th tool: Password Generator (`tools/password-generator/index.html`) — length slider (4-64 chars, live-updating), checkboxes for uppercase/lowercase/numbers/symbols, an "exclude similar characters" option (l, 1, I, O, 0), a Weak/Fair/Good/Strong strength indicator, and copy-to-clipboard. Passwords are generated with `crypto.getRandomValues()` (Web Crypto API), not `Math.random()`.
- Fully bilingual: all new `pwd.*` and `home.card.pwd.*` keys added to both `en` and `ar` dictionaries in `assets/i18n.js`, including RTL-correct Arabic copy; verified with the Node/vm key-coverage script (125 keys used across all pages, zero missing in either language).
- Linked the new tool from the homepage grid (replacing its slot before the "PDF Compressor — coming soon" card) and added it to `sitemap.xml`. Includes a reserved `.ad-slot`, canonical link, real meta description, and two SEO paragraphs (how it works + password-strength tips).
- Sanity-checked before commit: JS syntax check (`new Function(...)` on the inline script and `assets/i18n.js`), HTML tag-balance check, and a Playwright smoke test (page loads with zero console errors, Generate/length-slider/checkbox validation/strength meter all work, `#lang-toggle` correctly flips to RTL Arabic and swaps all visible text).

### 2026-09-02 — Rebrand to "Code Engineer" / "مهندس كود" + real logo
- Site owner supplied a logo image ("مهندس كود / CODE ENGINEER", a gear+dollar-sign mark). Cropped it down to just the circular gear icon (transparent background) and generated `assets/logo-icon.png` plus `favicon.ico` / `favicon-32.png` / `favicon-180.png` / `favicon-512.png`, linked from every page's `<head>`.
- Renamed the brand everywhere from "QuickToolsHub" to **"Code Engineer"** (English) / **"مهندس كود"** (Arabic) via a new `brand.name` i18n key — header logo+name, footer copyright, all page titles/meta, README. The name now correctly switches with the language toggle (verified: browser tab title and header text both flip EN↔AR on `#lang-toggle`).
- Re-ran the i18n key-coverage check, JS syntax check, tag-balance check, and a Playwright smoke test (logo image loads, title/brand swap language, no console errors, RTL header layout looks correct) before committing.


### 2026-09-02 — Bilingual (EN/AR) support + image tool preview/compare
- Added `assets/i18n.js`: a small client-side i18n system (English/Arabic dictionary, `data-i18n`/`data-i18n-content`/`data-i18n-placeholder` attributes, `#lang-toggle` button, persists choice in `localStorage`, flips `<html dir>` to `rtl` for Arabic). Applied it across every existing page (homepage, about, contact, privacy, terms, and all 3 tools).
- Validated coverage with a Node script that loads `assets/i18n.js` in a `vm` sandbox and diffs every `data-i18n*` key found across the `.html` files against the `en`/`ar` dictionaries — zero missing keys.
- Smoke-tested every page with Playwright (headless Chromium): page loads with no console errors, `#lang-toggle` correctly flips `dir="rtl"` and swaps visible text.
- Image Converter & Compressor: now shows an original-image preview (thumbnail, dimensions, file size, format) immediately after upload, and after conversion shows a side-by-side before/after comparison plus a "what changed" summary line (format, quality, dimensions, file size delta with %), fully translated and re-rendered on language toggle.
- Added an i18n convention + a verification checklist to `ROADMAP.md` so future tools (built by the daily automated session) stay bilingual and get sanity-checked before commit.

### 2026-09-02 — Site went live + 3rd tool shipped
- Repo made public and GitHub Pages enabled (Deploy from branch: `main` / root). Site confirmed live at https://fantasiacod.github.io/username-free-tools-site/.
- Shipped a 3rd tool: Text Case Converter & Word Counter (`tools/text-case-converter/index.html`) — UPPERCASE/lowercase/Title Case/Sentence case buttons, copy/clear, and a live word/character/sentence counter. Pure JS, no dependencies.
- Linked the new tool from the homepage grid and added it to `sitemap.xml`.

### 2026-09-02 — Initial scaffold
- Created the site from scratch: homepage (`index.html`), shared stylesheet (`assets/style.css`).
- Built two fully working tools: QR Code Generator (`tools/qr-generator/`) and Image Converter & Compressor (`tools/image-converter/`).
- Added policy/trust pages required for future ad network approval: `about.html`, `contact.html`, `privacy-policy.html`, `terms.html`.
- Added `robots.txt`, `sitemap.xml`, `.nojekyll`.
- Set up `ROADMAP.md` (task queue) and this `PROGRESS.md` (log) as the persistent memory for the daily automated session.
- Pushed to `main` on GitHub. GitHub Pages needs to be enabled once in repo settings if not already (see ROADMAP "NEEDS HUMAN").
