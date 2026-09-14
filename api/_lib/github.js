// Minimal GitHub Contents API client used by the admin panel's serverless
// functions to commit changes directly to this site's repo. Uses the
// ADMIN_GITHUB_TOKEN environment variable (a fine-grained PAT scoped to this
// one repo with Contents: read/write — the same kind of token already used
// for the daily automated session), set only in Vercel, never in the repo.
'use strict';

const REPO = 'fantasiacod/username-free-tools-site';
const BRANCH = 'main';
const API = 'https://api.github.com';

function authHeaders() {
  const token = process.env.ADMIN_GITHUB_TOKEN;
  if (!token) throw new Error('ADMIN_GITHUB_TOKEN is not configured');
  return {
    Authorization: 'token ' + token,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'code-engineer-admin-panel',
  };
}

function encodePath(path) {
  return path
    .split('/')
    .filter(Boolean)
    .map(encodeURIComponent)
    .join('/');
}

// Returns { content: <utf8 string>, sha } or null if the file doesn't exist.
async function getFile(path) {
  const res = await fetch(API + '/repos/' + REPO + '/contents/' + encodePath(path) + '?ref=' + BRANCH, {
    headers: authHeaders(),
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error('GitHub GET ' + path + ' failed: ' + res.status + ' ' + (await res.text()));
  }
  const data = await res.json();
  return {
    content: Buffer.from(data.content, 'base64').toString('utf8'),
    sha: data.sha,
  };
}

// Creates or updates a text file. Pass the previous `sha` when updating an
// existing file (omit/null when creating a new one).
async function putTextFile(path, content, message, sha) {
  const body = {
    message: message,
    content: Buffer.from(content, 'utf8').toString('base64'),
    branch: BRANCH,
  };
  if (sha) body.sha = sha;
  const res = await fetch(API + '/repos/' + REPO + '/contents/' + encodePath(path), {
    method: 'PUT',
    headers: Object.assign({ 'Content-Type': 'application/json' }, authHeaders()),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error('GitHub PUT ' + path + ' failed: ' + res.status + ' ' + (await res.text()));
  }
  return res.json();
}

// Creates or updates a binary file from a base64 string (e.g. an uploaded logo image).
async function putBinaryFile(path, base64Content, message, sha) {
  const body = {
    message: message,
    content: base64Content,
    branch: BRANCH,
  };
  if (sha) body.sha = sha;
  const res = await fetch(API + '/repos/' + REPO + '/contents/' + encodePath(path), {
    method: 'PUT',
    headers: Object.assign({ 'Content-Type': 'application/json' }, authHeaders()),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error('GitHub PUT ' + path + ' failed: ' + res.status + ' ' + (await res.text()));
  }
  return res.json();
}

module.exports = { getFile, putTextFile, putBinaryFile, REPO, BRANCH };
