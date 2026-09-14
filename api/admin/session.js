'use strict';
const { getCookie, verifySession, SESSION_COOKIE_NAME } = require('../_lib/auth');

module.exports = async function handler(req, res) {
  const token = getCookie(req, SESSION_COOKIE_NAME);
  res.status(200).json({ authenticated: verifySession(token) });
};
