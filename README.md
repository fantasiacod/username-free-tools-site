# QuickToolsHub

A small collection of free, browser-based tools (QR code generator, image
converter/compressor, and more being added over time). Static site, no
backend, no build step — hosted on GitHub Pages.

## Structure
- `index.html` — homepage / tool directory
- `tools/<tool-name>/index.html` — one folder per tool
- `assets/style.css` — shared stylesheet used by every page
- `about.html`, `contact.html`, `privacy-policy.html`, `terms.html` — trust/policy pages
- `robots.txt`, `sitemap.xml` — SEO basics
- `ROADMAP.md` — task queue for what to build/improve next (read this first)
- `PROGRESS.md` — dated log of work done
- `MONETIZATION.md` — ad network + Gumroad monetization plan and where to wire in codes/links

## How this project moves forward
A daily scheduled session reads `ROADMAP.md`, picks the next task, implements
it, commits, and pushes to `main`, then logs what it did in `PROGRESS.md` and
updates `ROADMAP.md`. See those two files for current status.

## Local preview
No build step needed — just open `index.html` in a browser, or serve the
folder with any static file server, e.g. `python3 -m http.server`.
