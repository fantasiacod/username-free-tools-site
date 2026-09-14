'use strict';
const { verifyPassword, signSession, setSessionCookie, readJsonBody } = require('../_lib/auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  const body = await readJsonBody(req);
  const password = body && body.password;

  if (!password || typeof password !== 'string') {
    res.status(400).json({ error: 'missing_password' });
    return;
  }

  // Small fixed delay on every attempt (success or failure) so the endpoint
  // can't be used to brute-force passwords at network speed. Not a substitute
  // for a strong password, just friction.
  await new Promise((resolve) => setTimeout(resolve, 400));

  if (!verifyPassword(password)) {
    res.status(401).json({ error: 'invalid_password' });
    return;
  }

  const token = signSession();
  setSessionCookie(res, token);
  res.status(200).json({ ok: true });
};
