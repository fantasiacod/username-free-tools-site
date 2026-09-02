# Progress Log

Append a new dated entry at the top each time work is done. Keep entries short and factual.

---

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
