'use strict';
const { requireAuth, readJsonBody } = require('../_lib/auth');
const { getFile, putBinaryFile } = require('../_lib/github');
const { parseDataUrl, validatePngBase64 } = require('../_lib/imageUpload');

const LOGO_PATH = 'assets/logo-icon.png';

module.exports = async function handler(req, res) {
  if (!requireAuth(req, res)) return;
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  const body = await readJsonBody(req);
  const dataUrl = body && body.imageBase64;

  const parsed = parseDataUrl(dataUrl);
  if (!parsed) {
    res.status(400).json({ error: 'expected_png_data_url' });
    return;
  }

  const check = validatePngBase64(parsed.base64);
  if (!check.ok) {
    res.status(400).json({ error: check.error });
    return;
  }

  try {
    // getFile decodes content as UTF-8 text, which is meaningless for a
    // binary PNG — we only need its `sha` here, to update the file in place
    // rather than accidentally trying (and failing) to create a duplicate.
    const existing = await getFile(LOGO_PATH);
    const sha = existing ? existing.sha : null;
    await putBinaryFile(LOGO_PATH, parsed.base64, 'Update logo (via admin panel)', sha);
    res.status(200).json({ ok: true, bytes: check.bytes });
  } catch (e) {
    res.status(500).json({ error: 'github_error', message: String((e && e.message) || e) });
  }
};
