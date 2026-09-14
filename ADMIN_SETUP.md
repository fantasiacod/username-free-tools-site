# Admin Panel Setup (one-time)

This site now has a real, password-protected admin panel backed by serverless
functions on Vercel — not a fake client-side login. It only works once you're
hosted on Vercel (or another platform with serverless/Node function support);
GitHub Pages alone can't run it.

The panel currently does one thing end-to-end, fully tested: **show/hide any
tool or blog post** from the homepage and blog listings, without deleting the
page. More capabilities (adding blog posts, changing the accent color,
uploading a new logo) are planned next, built with the same care.

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
password you chose. You'll see every tool and blog post with a Show/Hide
toggle. Hiding something removes its card from the homepage/blog grid; the
page itself still exists and is reachable by direct link (it isn't removed
from the sitemap yet — that's a known limitation for this first version).

## How it works, briefly

- Login (`/api/admin/login`) checks your password against `ADMIN_PASSWORD_HASH`
  using PBKDF2-SHA256 (210,000 iterations) and a constant-time comparison, then
  issues a signed, `HttpOnly`, `Secure`, `SameSite=Strict` session cookie good
  for 12 hours.
- Every admin API call re-checks that cookie's signature server-side — the
  panel's UI is just a convenience, not where the real security lives.
- Show/Hide commits directly to this GitHub repo via the GitHub Contents API,
  using `ADMIN_GITHUB_TOKEN`. Vercel then redeploys automatically, same as
  any other push to `main`.
- Nothing here touches or requires touching `assets/i18n.js` (the site's
  shared translation dictionary) — hiding/showing a card just wraps its
  existing markup in an HTML comment and can always restore it byte-for-byte.
