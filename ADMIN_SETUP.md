# Admin Panel Setup (one-time)

This site now has a real, password-protected admin panel backed by serverless
functions on Vercel — not a fake client-side login. It only works once you're
hosted on Vercel (or another platform with serverless/Node function support);
GitHub Pages alone can't run it.

The panel does four things end-to-end, fully tested:

1. **Show/hide any tool or blog post** from the homepage and blog listings, without deleting the page.
2. **Publish a new, fully bilingual blog post** — creates its page, lists it on the blog index, swaps it into the homepage's "From the blog" strip, and adds it to the sitemap.
3. **Change the site's accent color** (buttons, links, badges).
4. **Upload a new logo** (`assets/logo-icon.png`) — any image format, converted to PNG in your browser before upload.

## 1. Set three environment variables in Vercel

Go to your Vercel project → **Settings → Environment Variables** and add:

| Name | Value | Notes |
|---|---|---|
| `ADMIN_PASSWORD_HASH` | (see step 2 below) | Never your raw password — a one-way hash of it. |
| `SESSION_SECRET` | any long random string | Used to sign login sessions. A ready-to-use random value was generated for you in chat — or generate your own with `openssl rand -hex 32`. |
| `ADMIN_GITHUB_TOKEN` | a GitHub fine-grained PAT scoped to **only this repo**, with **Contents: Read and write** permission | The panel uses this to commit your changes to `main`, the same way the daily automated session does. Create one at GitHub → Settings → Developer settings → Fine-grained tokens if you don't already have one you're comfortable reusing here. |

Apply all three to the **Production** environment (and Preview, if you want
the panel to work on preview deployments too). Redeploy after adding them —
environment variables only take effect on new deployments.

## 2. Generate your password hash

Open `/admin/setup-password.html` on your live site (it's not linked from
anywhere, so bookmark it). Type the password you want to log in with and
click **Generate Hash** — this runs entirely in your browser using the Web
Crypto API; your actual password is never sent anywhere, not even to this
site's own server. Copy the resulting hash into `ADMIN_PASSWORD_HASH` above.

To change your password later, just come back to this page, generate a new
hash for the new password, and update the environment variable in Vercel.

## 3. Log in

Once the environment variables are set and the site has redeployed, open
`/admin/index.html` (also unlinked — bookmark it) and log in with the
password you chose.

- **Show/Hide**: every tool and blog post gets a toggle. Hiding something
  removes its card from the homepage/blog grid; the page itself still exists
  and is reachable by direct link (it isn't removed from the sitemap yet —
  a known limitation, tracked in ROADMAP.md as a small follow-up).
- **Add a Blog Post**: fill in an English and an Arabic title, meta
  description and body for each language (body text supports blank-line
  paragraphs, `## ` for a heading, and `- ` lines for a bullet list — plain
  text only, safely escaped either way), optionally point it at an existing
  tool for the closing call-to-action, and click Publish. The post goes
  live, gets listed on the blog index, becomes one of the two posts shown in
  the homepage's "From the blog" strip, and is added to the sitemap — all in
  one commit sequence.
- **Accent Color**: pick a color (or type a hex code) and save. Updates
  `assets/style.css`'s `--accent` value only — nothing else in the file.
- **Logo**: choose any image file; your browser converts it to PNG before
  upload, so the server only ever receives a plain PNG. This replaces
  `assets/logo-icon.png` only — the 4 favicon files (`favicon.ico`,
  `favicon-32.png`, `favicon-180.png`, `favicon-512.png`) are separate and
  still need regenerating by hand if you want them to match.

## How it works, briefly

- Login (`/api/admin/login`) checks your password against `ADMIN_PASSWORD_HASH`
  using PBKDF2-SHA256 (210,000 iterations) and a constant-time comparison, then
  issues a signed, `HttpOnly`, `Secure`, `SameSite=Strict` session cookie good
  for 12 hours.
- Every admin API call re-checks that cookie's signature server-side — the
  panel's UI is just a convenience, not where the real security lives.
- Every change commits directly to this GitHub repo via the GitHub Contents
  API, using `ADMIN_GITHUB_TOKEN`. Vercel then redeploys automatically, same
  as any other push to `main`.
- Nothing here touches or requires touching `assets/i18n.js` (the site's
  large shared translation dictionary). Show/Hide just wraps a card's
  existing markup in an HTML comment (always restorable byte-for-byte).
  Admin-created blog posts are fully self-contained instead: they carry
  their own English/Arabic text inline via two small, generic, dictionary-free
  mechanisms in `assets/i18n.js` (`data-lang="en"|"ar"` to show/hide a whole
  block, and `data-lang-en="..."`/`data-lang-ar="..."` to swap a short
  string like a title or date) — reusable by any future self-contained page,
  not just blog posts.
- Blog-post body text is converted from plain text to HTML by a small,
  deliberately limited "lite markdown" — every character is HTML-escaped
  before any tag is wrapped around it, so it can never emit raw/unescaped
  markup regardless of what's typed in.
