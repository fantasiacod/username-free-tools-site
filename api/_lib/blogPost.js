// Pure functions for the admin panel's "add a blog post" capability.
//
// Design (see ROADMAP.md "Admin panel v2" notes): an admin-created post must
// NOT mutate assets/i18n.js (the site's large shared translation dictionary)
// from a public-facing endpoint with no interactive safety net. Instead each
// post is fully self-contained and bilingual on its own: it uses the shared
// data-i18n keys only for chrome that already exists everywhere (brand, nav,
// footer, ad-slot), and carries its own English/Arabic content inline via
// two small generic mechanisms added to assets/i18n.js's applyLang():
//   - data-lang="en"|"ar"           -> element shown only in that language
//   - data-lang-en="..." + data-lang-ar="..." -> element's text/content/
//     placeholder is swapped between the two attribute values
// Both are dictionary-free, so a post never needs an i18n.js edit.
//
// Kept as pure functions (strings in, strings out) so they can be unit
// tested without touching the network or GitHub, same pattern as
// cardVisibility.js.
'use strict';

const EN_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const AR_MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const EASTERN_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

function slugify(str) {
  return String(str || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '');
}

function escapeHtml(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function toEasternDigits(n) {
  return String(n).replace(/[0-9]/g, function (d) { return EASTERN_DIGITS[+d]; });
}

// isoDate: "YYYY-MM-DD". Returns { en: "September 24, 2026", ar: "٢٤ سبتمبر ٢٠٢٦" } or null.
function formatDateBilingual(isoDate) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(isoDate || '').trim());
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const en = EN_MONTHS[month - 1] + ' ' + day + ', ' + year;
  const ar = toEasternDigits(day) + ' ' + AR_MONTHS[month - 1] + ' ' + toEasternDigits(year);
  return { en: en, ar: ar };
}

// A deliberately small, safe subset of markdown-like conventions: blank-line
// separated paragraphs, "## " headings, and "- " bullet lists. Every bit of
// text content is HTML-escaped before any tag is wrapped around it, so this
// can never emit raw/unescaped markup regardless of what an admin types.
function liteMarkdownToHtml(text, indent) {
  const pad = indent || '        ';
  const blocks = String(text || '')
    .replace(/\r\n/g, '\n')
    .split(/\n\s*\n/)
    .map(function (b) { return b.trim(); })
    .filter(Boolean);

  const parts = blocks.map(function (block) {
    const lines = block.split('\n').map(function (l) { return l.trim(); }).filter(Boolean);
    if (!lines.length) return '';

    if (lines.every(function (l) { return l.indexOf('- ') === 0; })) {
      const items = lines
        .map(function (l) { return pad + '  <li>' + escapeHtml(l.slice(2).trim()) + '</li>'; })
        .join('\n');
      return pad + '<ul>\n' + items + '\n' + pad + '</ul>';
    }

    if (lines.length === 1 && lines[0].indexOf('## ') === 0) {
      return pad + '<h2>' + escapeHtml(lines[0].slice(3).trim()) + '</h2>';
    }

    return pad + '<p>' + escapeHtml(lines.join(' ')) + '</p>';
  });

  return parts.filter(Boolean).join('\n\n');
}

// Builds one card block (used identically on blog/index.html and, with a
// different `href`/indent, the homepage "From the blog" strip). Bilingual
// via data-lang-en/ar attribute-swap, self-contained — no i18n.js edit.
function buildCardBlock(opts, indent) {
  const pad = indent || '      ';
  const id = opts.id;
  const href = opts.href;
  const icon = opts.icon;
  const titleEn = escapeHtml(opts.titleEn);
  const titleAr = escapeHtml(opts.titleAr);
  const descEn = escapeHtml(opts.descEn);
  const descAr = escapeHtml(opts.descAr);
  const dateEn = escapeHtml(opts.dateEn);
  const dateAr = escapeHtml(opts.dateAr);

  return [
    pad + '<!-- card:' + id + ' -->',
    pad + '<a class="card" href="' + href + '">',
    pad + '  <div class="icon">' + icon + '</div>',
    pad + '  <h3 data-lang-en="' + titleEn + '" data-lang-ar="' + titleAr + '">' + titleEn + '</h3>',
    pad + '  <p data-lang-en="' + descEn + '" data-lang-ar="' + descAr + '">' + descEn + '</p>',
    pad + '  <span class="badge" data-lang-en="' + dateEn + '" data-lang-ar="' + dateAr + '">' + dateEn + '</span>',
    pad + '</a>',
    pad + '<!-- /card:' + id + ' -->',
  ].join('\n');
}

// Builds the full standalone post page. `ctaHref` may be '' to omit the CTA
// link entirely (a post doesn't have to point at a specific tool).
function buildPostPage(opts) {
  const titleEn = escapeHtml(opts.titleEn);
  const titleAr = escapeHtml(opts.titleAr);
  const metaEn = escapeHtml(opts.metaEn);
  const metaAr = escapeHtml(opts.metaAr);
  const dateEn = escapeHtml(opts.dateEn);
  const dateAr = escapeHtml(opts.dateAr);
  const icon = opts.icon;
  const slug = opts.slug;

  let ctaBlock = '';
  const hasCta = opts.ctaHref && opts.ctaLinkTextEn && opts.ctaLinkTextAr;
  if (hasCta) {
    const ctaTextEn = escapeHtml(opts.ctaTextEn || '');
    const ctaTextAr = escapeHtml(opts.ctaTextAr || '');
    const ctaLinkTextEn = escapeHtml(opts.ctaLinkTextEn);
    const ctaLinkTextAr = escapeHtml(opts.ctaLinkTextAr);
    const ctaHref = escapeHtml(opts.ctaHref);
    ctaBlock = '\n' +
      (ctaTextEn ? '        <p data-lang-en="' + ctaTextEn + '" data-lang-ar="' + ctaTextAr + '">' + ctaTextEn + '</p>\n' : '') +
      '        <p><a href="' + ctaHref + '" data-lang-en="' + ctaLinkTextEn + '" data-lang-ar="' + ctaLinkTextAr + '">' + ctaLinkTextEn + '</a></p>';
  }

  return '<!doctype html>\n' +
'<html lang="en">\n' +
'<head>\n' +
'<meta charset="utf-8">\n' +
'<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
'<title data-lang-en="' + titleEn + ' | Code Engineer" data-lang-ar="' + titleAr + ' | مهندس كود">' + titleEn + ' | Code Engineer</title>\n' +
'<meta name="description" content="' + metaEn + '" data-lang-en="' + metaEn + '" data-lang-ar="' + metaAr + '">\n' +
'<link rel="canonical" href="https://fantasiacod.github.io/username-free-tools-site/blog/' + slug + '/index.html">\n' +
'<link rel="stylesheet" href="../../assets/style.css">\n' +
'<link rel="icon" type="image/x-icon" href="../../favicon.ico">\n' +
'<link rel="icon" type="image/png" sizes="32x32" href="../../favicon-32.png">\n' +
'<link rel="apple-touch-icon" sizes="180x180" href="../../favicon-180.png">\n' +
'</head>\n' +
'<body>\n' +
'<header class="site">\n' +
'  <div class="wrap">\n' +
'    <div class="brand"><a href="../../index.html" style="color:inherit;display:flex;align-items:center;gap:8px"><img src="../../assets/logo-icon.png" alt="Code Engineer logo" width="28" height="28" style="border-radius:50%;display:block"><span data-i18n="brand.name">Code Engineer</span></a></div>\n' +
'    <nav class="site">\n' +
'      <a href="../../index.html" data-i18n="nav.tools">Tools</a>\n' +
'      <a href="../index.html" data-i18n="nav.blog">Blog</a>\n' +
'      <a href="../../about.html" data-i18n="nav.about">About</a>\n' +
'      <a href="../../contact.html" data-i18n="nav.contact">Contact</a>\n' +
'      <button id="lang-toggle" type="button">العربية</button>\n' +
'    </nav>\n' +
'  </div>\n' +
'</header>\n' +
'\n' +
'<main>\n' +
'  <div class="wrap">\n' +
'    <div class="tool-panel">\n' +
'      <h1 data-lang-en="' + titleEn + '" data-lang-ar="' + titleAr + '">' + titleEn + '</h1>\n' +
'      <p class="note" data-lang-en="' + dateEn + '" data-lang-ar="' + dateAr + '">' + dateEn + '</p>\n' +
'\n' +
'      <div class="content">\n' +
'        <div data-lang="en">\n' +
opts.bodyHtmlEn + '\n' +
'        </div>\n' +
'        <div data-lang="ar" style="display:none">\n' +
opts.bodyHtmlAr + '\n' +
'        </div>' + ctaBlock + '\n' +
'      </div>\n' +
'    </div>\n' +
'\n' +
'    <div class="ad-slot" data-i18n="ad.slot">Ad space (reserved)</div>\n' +
'  </div>\n' +
'</main>\n' +
'\n' +
'<footer class="site">\n' +
'  <div class="wrap">\n' +
'    <div>© <span id="y"></span> <span data-i18n="brand.name">Code Engineer</span></div>\n' +
'    <div>\n' +
'      <a href="../../privacy-policy.html" data-i18n="footer.privacy">Privacy Policy</a> ·\n' +
'      <a href="../../terms.html" data-i18n="footer.terms">Terms</a>\n' +
'    </div>\n' +
'  </div>\n' +
'</footer>\n' +
'<script src="../../assets/i18n.js"></script>\n' +
'<script>document.getElementById(\'y\').textContent = new Date().getFullYear();</script>\n' +
'</body>\n' +
'</html>\n';
}

// Inserts a new card right before the `<!-- grid:end -->` sentinel in
// blog/index.html, so a new post always lands as the last (newest) card.
function insertCardIntoBlogIndex(html, cardBlockHtml) {
  const marker = '<!-- grid:end -->';
  const idx = html.indexOf(marker);
  if (idx === -1) return { ok: false, error: 'marker_not_found' };
  const insertion = cardBlockHtml + '\n      ';
  return { ok: true, html: html.slice(0, idx) + insertion + html.slice(idx) };
}

// Swaps a new card into the homepage's "From the blog" strip (scoped to the
// <!-- blogstrip:start/end --> region so this never touches the tool cards
// elsewhere on the same page): drops the oldest shown post if the strip
// already has 2, then appends the new one, keeping the 2 most recent.
function insertCardIntoHomeStrip(html, cardBlockHtml) {
  const startMarker = '<!-- blogstrip:start -->';
  const endMarker = '<!-- blogstrip:end -->';
  const startIdx = html.indexOf(startMarker);
  const endIdx = html.indexOf(endMarker);
  if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
    return { ok: false, error: 'marker_not_found' };
  }

  const before = html.slice(0, startIdx + startMarker.length);
  const stripInner = html.slice(startIdx + startMarker.length, endIdx);
  const after = html.slice(endIdx);

  const cardRe = /<!-- card:([a-z0-9-]+) -->[\s\S]*?<!-- \/card:\1 -->/g;
  const matches = Array.from(stripInner.matchAll(cardRe));

  let remaining = stripInner;
  if (matches.length >= 2) {
    const oldest = matches[0];
    remaining = stripInner.slice(0, oldest.index) + stripInner.slice(oldest.index + oldest[0].length);
  }

  const trimmed = remaining.replace(/\s+$/, '');
  const newInner = trimmed + '\n\n        ' + cardBlockHtml + '\n        ';
  return { ok: true, html: before + newInner + after };
}

// Inserts a new <url> entry right before the about.html entry, matching the
// spot every prior manual/automated sitemap update has used.
function insertUrlIntoSitemap(xml, url) {
  const anchor = xml.indexOf('/about.html</loc></url>');
  if (anchor === -1) return { ok: false, error: 'marker_not_found' };
  const lineStart = xml.lastIndexOf('\n', anchor) + 1;
  const newLine = '  <url><loc>' + url + '</loc></url>\n';
  return { ok: true, xml: xml.slice(0, lineStart) + newLine + xml.slice(lineStart) };
}

module.exports = {
  slugify,
  escapeHtml,
  formatDateBilingual,
  liteMarkdownToHtml,
  buildCardBlock,
  buildPostPage,
  insertCardIntoBlogIndex,
  insertCardIntoHomeStrip,
  insertUrlIntoSitemap,
};
