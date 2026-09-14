// Pure string-transformation logic for hiding/showing a tool or blog-post
// card on index.html / blog/index.html. Kept as a pure function (HTML in,
// HTML out) deliberately so it can be unit-tested against the site's real
// files without touching the network or GitHub.
//
// Every card in the grid is wrapped with `<!-- card:ID -->` / `<!-- /card:ID -->`
// markers. "Hiding" never deletes the card's markup — it wraps it in an HTML
// comment (`<!-- HIDDEN ... HIDDEN -->`) so the exact original markup can
// always be restored byte-for-byte later. This keeps the operation reversible
// and low-risk: worst case, a bug here just fails to find the marker (a no-op,
// caught and reported) rather than corrupting the file.
'use strict';

const HIDE_OPEN = '<!-- HIDDEN\n';
const HIDE_CLOSE = '\nHIDDEN -->';

function splitWhitespace(str) {
  const leading = str.match(/^\s*/)[0];
  const trailing = str.slice(leading.length).match(/\s*$/)[0];
  const core = str.slice(leading.length, str.length - trailing.length);
  return { leading, core, trailing };
}

function isHidden(inner) {
  return inner.trim().indexOf('<!-- HIDDEN') === 0;
}

function stripHiddenWrapper(core) {
  let s = core;
  s = s.replace(/^<!--\s*HIDDEN\r?\n?/, '');
  s = s.replace(/\r?\n?HIDDEN\s*-->$/, '');
  return s;
}

// Returns { ok, changed, html } or { ok: false, error }. Preserves the exact
// original whitespace around each card so hide+show is always a perfect,
// byte-identical round trip, regardless of how that card happens to be
// indented in the file (top-level tool cards and nested blog-teaser cards
// use different indentation, so this must not be hardcoded).
function toggleCard(html, id, hide) {
  const startMarker = '<!-- card:' + id + ' -->';
  const endMarker = '<!-- /card:' + id + ' -->';
  const startIdx = html.indexOf(startMarker);
  const endIdx = html.indexOf(endMarker);

  if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
    return { ok: false, error: 'card_not_found' };
  }

  const innerStart = startIdx + startMarker.length;
  const inner = html.slice(innerStart, endIdx);
  const { leading, core, trailing } = splitWhitespace(inner);
  const currentlyHidden = isHidden(core);

  let newCore;
  if (hide) {
    if (currentlyHidden) {
      newCore = core;
    } else {
      if (core.indexOf('-->') !== -1) {
        // Refuse rather than emit a broken/nested HTML comment.
        return { ok: false, error: 'unsafe_content' };
      }
      newCore = HIDE_OPEN + core + HIDE_CLOSE;
    }
  } else {
    if (currentlyHidden) {
      newCore = stripHiddenWrapper(core);
    } else {
      newCore = core;
    }
  }

  const newInner = leading + newCore + trailing;
  const newHtml = html.slice(0, innerStart) + newInner + html.slice(endIdx);
  return { ok: true, changed: newInner !== inner, html: newHtml, wasHidden: currentlyHidden };
}

// Lists every card id found in the file, with its current visibility.
function listCards(html) {
  const re = /<!-- card:([a-z0-9-]+) -->([\s\S]*?)<!-- \/card:\1 -->/g;
  const out = [];
  let m;
  while ((m = re.exec(html))) {
    out.push({ id: m[1], hidden: isHidden(m[2]) });
  }
  return out;
}

module.exports = { toggleCard, listCards, isHidden };
