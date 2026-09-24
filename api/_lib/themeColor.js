// Pure functions for the admin panel's "change accent color" capability.
// A simple regex replace of the --accent custom property inside
// assets/style.css's :root{} block — the same GitHub-commit pattern as the
// visibility toggle, deliberately narrow in scope (touches one declaration,
// nothing else in the file).
'use strict';

const ACCENT_RE = /(--accent:\s*)#[0-9a-fA-F]{3,8}(\s*;)/;
const HEX_RE = /^#[0-9a-fA-F]{6}$/;

function getAccentColor(css) {
  const m = ACCENT_RE.exec(css);
  return m ? css.slice(m.index + m[1].length, m.index + m[0].length - m[2].length) : null;
}

function setAccentColor(css, hexColor) {
  if (typeof hexColor !== 'string' || !HEX_RE.test(hexColor)) {
    return { ok: false, error: 'invalid_color' };
  }
  if (!ACCENT_RE.test(css)) {
    return { ok: false, error: 'accent_not_found' };
  }
  const newCss = css.replace(ACCENT_RE, '$1' + hexColor + '$2');
  return { ok: true, css: newCss };
}

module.exports = { getAccentColor, setAccentColor, HEX_RE };
