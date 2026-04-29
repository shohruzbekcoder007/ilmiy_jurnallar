const jwt = require('jsonwebtoken');
const env = require('../config/env');

function signAccess(payload) {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_TTL });
}

function signRefresh(payload) {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_TTL });
}

function verifyAccess(token) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET);
}

function verifyRefresh(token) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
}

module.exports = { signAccess, signRefresh, verifyAccess, verifyRefresh };
