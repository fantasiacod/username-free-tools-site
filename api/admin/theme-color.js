'use strict';
const { requireAuth, readJsonBody } = require('../_lib/auth');
const { getFile, putTextFile } = require('../_lib/github');
const { getAccentColor, setAccentColor } = require('../_lib/themeColor');

const STYLE_PATH = 'assets/style.css';

module.exports = async function handler(req, res) {
  if (!requireAuth(req, res)) return;

  if (req.method === 'GET') {
    try {
      const file = await getFile(STYLE_PATH);
      if (!file) {
        res.status(404).json({ error: 'file_not_found' });
        return;
      }
      res.status(200).json({ ok: true, color: getAccentColor(file.content) });
    } catch (e) {
      res.status(500).json({ error: 'github_error', message: String((e && e.message) || e) });
    }
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  const body = await readJsonBody(req);
  const color = body && body.color;

  try {
    const file = await getFile(STYLE_PATH);
    if (!file) {
      res.status(404).json({ error: 'file_not_found' });
      return;
    }
    const result = setAccentColor(file.content, color);
    if (!result.ok) {
      res.status(400).json({ error: result.error });
      return;
    }
    await putTextFile(STYLE_PATH, result.css, 'Change accent color to ' + color + ' (via admin panel)', file.sha);
    res.status(200).json({ ok: true, color: color });
  } catch (e) {
    res.status(500).json({ error: 'github_error', message: String((e && e.message) || e) });
  }
};
