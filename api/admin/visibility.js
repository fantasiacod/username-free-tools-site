'use strict';
const { requireAuth, readJsonBody } = require('../_lib/auth');
const { getFile, putTextFile } = require('../_lib/github');
const { toggleCard, listCards } = require('../_lib/cardVisibility');

const FILES = {
  home: 'index.html',
  blog: 'blog/index.html',
};

module.exports = async function handler(req, res) {
  if (!requireAuth(req, res)) return;

  if (req.method === 'GET') {
    // List every card + its current visibility, across both listing pages.
    try {
      const out = {};
      for (const key of Object.keys(FILES)) {
        const file = await getFile(FILES[key]);
        out[key] = file ? listCards(file.content) : [];
      }
      res.status(200).json({ ok: true, cards: out });
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
  const listing = body && body.file;
  const id = body && body.id;
  const hidden = !!(body && body.hidden);

  if (!FILES[listing]) {
    res.status(400).json({ error: 'invalid_file' });
    return;
  }
  if (!id || typeof id !== 'string' || !/^[a-z0-9-]+$/.test(id)) {
    res.status(400).json({ error: 'invalid_id' });
    return;
  }

  const path = FILES[listing];

  try {
    const file = await getFile(path);
    if (!file) {
      res.status(404).json({ error: 'file_not_found' });
      return;
    }
    const result = toggleCard(file.content, id, hidden);
    if (!result.ok) {
      res.status(400).json({ error: result.error });
      return;
    }
    if (!result.changed) {
      res.status(200).json({ ok: true, changed: false });
      return;
    }
    const message = (hidden ? 'Hide ' : 'Show ') + id + ' (via admin panel)';
    await putTextFile(path, result.html, message, file.sha);
    res.status(200).json({ ok: true, changed: true });
  } catch (e) {
    res.status(500).json({ error: 'github_error', message: String((e && e.message) || e) });
  }
};
