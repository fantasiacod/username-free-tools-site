// Shared auth helpers for the admin panel's serverless functions.
// No external dependencies — everything here uses Node's built-in `crypto` module,
// consistent with the rest of the site's "no dependencies unless truly needed" approach.
//
// Design:
// - The admin password is never stored anywhere. Only a PBKDF2 hash of it
//   (computed client-side in /admin/setup-password.html, or here) is kept,
//   in the ADMIN_PASSWORD_HASH environment variable (set in the Vercel dashboard,
//   never committed to the repo).
// - A successful login issues a signed, HttpOnly session cookie. The signature
//   uses the SESSION_SECRET environment variable (also Vercel-only, never committed).
//   The cookie's payload just carries an expiry timestamp — no user data, so a
//   forged/tampered cookie can't grant access without knowing SESSION_SECRET,
//   and a stolen valid cookie only works until it expires (12 hours).
'use strict';

const crypto = require('crypto');

// Not secret — pairs with PBKDF2 so this site's hash doesn't match a generic
// rainbow table. Real protection comes from password strength + PBKDF2 cost +
// keeping ADMIN_PASSWORD_HASH/SESSION_SECRET private in Vercel's env vars.
const PBKDF2_SALT = 'qth-admin-v1-2f8c1a9e6b3d-fixed-salt';
const PBKDF2_ITERATIONS = 210000;
const PBKDF2_KEYLEN = 32;
const PBKDF2_DIGEST = 'sha256';

const SESSION_COOKIE_NAME = 'qth_admin_session';
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

function hashPassword(password) {
  return crypto
    .pbkdf2Sync(String(password), PBKDF2_SALT, PBKDF2_ITERATIONS, PBKDF2_KEYLEN, PBKDF2_DIGEST)
    .toString('hex');
}

function verifyPassword(password) {
  const expectedHex = process.env.ADMIN_PASSWORD_HASH || '';
  if (!expectedHex || typeof password !== 'string' || !password) return false;
  const actual = Buffer.from(hashPassword(password), 'hex');
  let expected;
  try {
    expected = Buffer.from(expectedHex, 'hex');
  } catch (e) {
    return false;
  }
  if (actual.length !== expected.length) return false;
  return crypto.timingSafeEqual(actual, expected);
}

function signSession() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error('SESSION_SECRET is not configured');
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + SESSION_TTL_MS })).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  return payload + '.' + sig;
}

function verifySession(token) {
  try {
    const secret = process.env.SESSION_SECRET;
    if (!secret || !token || typeof token !== 'string') return false;
    const dot = token.lastIndexOf('.');
    if (dot === -1) return false;
    const payload = token.slice(0, dot);
    const sig = token.slice(dot + 1);
    if (!payload || !sig) return false;
    const expectedSig = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
    const a = Buffer.from(sig);
    const b = Buffer.from(expectedSig);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return typeof data.exp === 'number' && Date.now() < data.exp;
  } catch (e) {
    return false;
  }
}

function getCookie(req, name) {
  const header = (req.headers && req.headers.cookie) || '';
  const parts = header.split(';');
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i].trim();
    if (p.indexOf(name + '=') === 0) {
      return decodeURIComponent(p.slice(name.length + 1));
    }
  }
  return null;
}

function setSessionCookie(res, token) {
  const maxAge = Math.floor(SESSION_TTL_MS / 1000);
  res.setHeader(
    'Set-Cookie',
    SESSION_COOKIE_NAME + '=' + token + '; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=' + maxAge
  );
}

function clearSessionCookie(res) {
  res.setHeader(
    'Set-Cookie',
    SESSION_COOKIE_NAME + '=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0'
  );
}

// Returns true and lets the caller continue if the request has a valid session;
// otherwise sends a 401 JSON response itself and returns false.
function requireAuth(req, res) {
  const token = getCookie(req, SESSION_COOKIE_NAME);
  if (!verifySession(token)) {
    res.status(401).json({ error: 'unauthorized' });
    return false;
  }
  return true;
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch (e) { return {}; }
  }
  // Fallback: read the raw stream (older/edge runtimes may not pre-parse JSON bodies).
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => { data += chunk; });
    req.on('end', () => {
      try { resolve(JSON.parse(data || '{}')); } catch (e) { resolve({}); }
    });
    req.on('error', () => resolve({}));
  });
}

module.exports = {
  SESSION_COOKIE_NAME,
  SESSION_TTL_MS,
  hashPassword,
  verifyPassword,
  signSession,
  verifySession,
  getCookie,
  setSessionCookie,
  clearSessionCookie,
  requireAuth,
  readJsonBody,
};
