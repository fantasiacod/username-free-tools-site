// Pure validation helpers for the admin panel's "upload a new logo"
// capability. The browser does the format conversion (any uploaded image is
// drawn to a <canvas> and re-exported as PNG client-side, same "everything
// client-side" pattern as the Image Converter tool) — this module just
// makes sure what arrives at the server is actually a small, valid PNG
// before it's ever committed to the repo.
'use strict';

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB safety cap for a small logo/favicon source image
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

// Accepts only "data:image/png;base64,...." — anything else (wrong mime,
// missing prefix, svg, etc.) is rejected rather than guessed at.
function parseDataUrl(dataUrl) {
  const m = /^data:image\/png;base64,([A-Za-z0-9+/]+=*)$/.exec(String(dataUrl || '').trim());
  if (!m) return null;
  return { base64: m[1] };
}

function validatePngBase64(base64) {
  let buf;
  try {
    buf = Buffer.from(base64, 'base64');
  } catch (e) {
    return { ok: false, error: 'invalid_base64' };
  }
  if (!buf.length) return { ok: false, error: 'empty_file' };
  if (buf.length > MAX_BYTES) return { ok: false, error: 'file_too_large' };
  if (buf.length < PNG_SIGNATURE.length || !buf.slice(0, 8).equals(PNG_SIGNATURE)) {
    return { ok: false, error: 'not_a_png' };
  }
  return { ok: true, bytes: buf.length };
}

module.exports = { parseDataUrl, validatePngBase64, MAX_BYTES };
