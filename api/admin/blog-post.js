'use strict';
const { requireAuth, readJsonBody } = require('../_lib/auth');
const { getFile, putTextFile } = require('../_lib/github');
const {
  slugify,
  formatDateBilingual,
  liteMarkdownToHtml,
  buildCardBlock,
  buildPostPage,
  insertCardIntoBlogIndex,
  insertCardIntoHomeStrip,
  insertUrlIntoSitemap,
} = require('../_lib/blogPost');

const SITE_ORIGIN = 'https://fantasiacod.github.io/username-free-tools-site';

function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

module.exports = async function handler(req, res) {
  if (!requireAuth(req, res)) return;
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  const body = await readJsonBody(req);
  const titleEn = body && body.titleEn;
  const titleAr = body && body.titleAr;
  const descEn = body && body.descEn;
  const descAr = body && body.descAr;
  const bodyEn = body && body.bodyEn;
  const bodyAr = body && body.bodyAr;
  const date = body && body.date;
  const icon = (body && body.icon) || '📝';
  const toolSlug = body && body.toolSlug;
  const ctaTextEn = (body && body.ctaTextEn) || '';
  const ctaTextAr = (body && body.ctaTextAr) || '';
  const ctaLinkTextEn = (body && body.ctaLinkTextEn) || '';
  const ctaLinkTextAr = (body && body.ctaLinkTextAr) || '';

  const required = { titleEn, titleAr, descEn, descAr, bodyEn, bodyAr, date };
  for (const key of Object.keys(required)) {
    if (!isNonEmptyString(required[key])) {
      res.status(400).json({ error: 'missing_field', field: key });
      return;
    }
  }

  const dates = formatDateBilingual(date);
  if (!dates) {
    res.status(400).json({ error: 'invalid_date' });
    return;
  }

  const slug = slugify(titleEn);
  if (!slug) {
    res.status(400).json({ error: 'invalid_title' });
    return;
  }

  let ctaHref = '';
  if (isNonEmptyString(toolSlug)) {
    const cleanToolSlug = String(toolSlug).trim();
    if (!/^[a-z0-9-]+$/.test(cleanToolSlug)) {
      res.status(400).json({ error: 'invalid_tool_slug' });
      return;
    }
    ctaHref = '../../tools/' + cleanToolSlug + '/index.html';
  }

  const iconSafe = (typeof icon === 'string' && icon.trim()) ? icon.trim().slice(0, 4) : '📝';
  const postPath = 'blog/' + slug + '/index.html';
  const warnings = [];

  try {
    const existingPost = await getFile(postPath);
    if (existingPost) {
      res.status(409).json({ error: 'slug_exists', slug: slug });
      return;
    }

    // If a tool slug was given, verify that tool actually exists before
    // linking to it — a broken CTA link is worse than no CTA link.
    if (ctaHref) {
      const toolFile = await getFile('tools/' + toolSlug.trim() + '/index.html');
      if (!toolFile) {
        res.status(400).json({ error: 'tool_not_found', toolSlug: toolSlug });
        return;
      }
    }

    const bodyHtmlEn = liteMarkdownToHtml(bodyEn);
    const bodyHtmlAr = liteMarkdownToHtml(bodyAr);

    const postHtml = buildPostPage({
      slug: slug,
      icon: iconSafe,
      titleEn: titleEn.trim(),
      titleAr: titleAr.trim(),
      metaEn: descEn.trim(),
      metaAr: descAr.trim(),
      dateEn: dates.en,
      dateAr: dates.ar,
      bodyHtmlEn: bodyHtmlEn,
      bodyHtmlAr: bodyHtmlAr,
      ctaTextEn: ctaTextEn.trim(),
      ctaTextAr: ctaTextAr.trim(),
      ctaHref: ctaHref,
      ctaLinkTextEn: ctaLinkTextEn.trim(),
      ctaLinkTextAr: ctaLinkTextAr.trim(),
    });

    // 1) Create the new post page. If this fails, nothing else has been
    // touched, so we bail out with a clean error and no partial state.
    await putTextFile(postPath, postHtml, 'Add blog post: ' + slug + ' (via admin panel)', null);

    const cardId = 'blog-' + slug;
    const cardCommon = {
      id: cardId,
      icon: iconSafe,
      titleEn: titleEn.trim(),
      titleAr: titleAr.trim(),
      descEn: descEn.trim(),
      descAr: descAr.trim(),
      dateEn: dates.en,
      dateAr: dates.ar,
    };

    // 2) Add its card to the blog index (best-effort past this point — the
    // post itself already exists and is reachable even if a listing update
    // below fails; each failure is reported back so it can be fixed by hand).
    try {
      const blogIndexFile = await getFile('blog/index.html');
      if (!blogIndexFile) throw new Error('blog/index.html not found');
      const cardForBlogIndex = buildCardBlock(Object.assign({ href: './' + slug + '/index.html' }, cardCommon), '      ');
      const result = insertCardIntoBlogIndex(blogIndexFile.content, cardForBlogIndex);
      if (!result.ok) throw new Error(result.error);
      await putTextFile('blog/index.html', result.html, 'List new post ' + slug + ' on blog index (via admin panel)', blogIndexFile.sha);
    } catch (e) {
      warnings.push('Could not update blog/index.html: ' + String((e && e.message) || e));
    }

    // 3) Swap it into the homepage's "From the blog" strip.
    try {
      const homeFile = await getFile('index.html');
      if (!homeFile) throw new Error('index.html not found');
      const cardForHome = buildCardBlock(Object.assign({ href: './blog/' + slug + '/index.html' }, cardCommon), '        ');
      const result = insertCardIntoHomeStrip(homeFile.content, cardForHome);
      if (!result.ok) throw new Error(result.error);
      await putTextFile('index.html', result.html, 'Update homepage blog strip with ' + slug + ' (via admin panel)', homeFile.sha);
    } catch (e) {
      warnings.push('Could not update the homepage blog strip: ' + String((e && e.message) || e));
    }

    // 4) Add it to the sitemap.
    try {
      const sitemapFile = await getFile('sitemap.xml');
      if (!sitemapFile) throw new Error('sitemap.xml not found');
      const result = insertUrlIntoSitemap(sitemapFile.content, SITE_ORIGIN + '/blog/' + slug + '/index.html');
      if (!result.ok) throw new Error(result.error);
      await putTextFile('sitemap.xml', result.xml, 'Add ' + slug + ' to sitemap (via admin panel)', sitemapFile.sha);
    } catch (e) {
      warnings.push('Could not update sitemap.xml: ' + String((e && e.message) || e));
    }

    res.status(200).json({ ok: true, slug: slug, url: '/blog/' + slug + '/index.html', warnings: warnings });
  } catch (e) {
    res.status(500).json({ error: 'github_error', message: String((e && e.message) || e) });
  }
};
