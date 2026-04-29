const ApiError = require('../utils/ApiError');
const { verifyAccess } = require('../utils/jwt');
const User = require('../models/User');

async function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) throw new ApiError(401, 'Authentication required');
    const payload = verifyAccess(token);
    const user = await User.findById(payload.id);
    if (!user || !user.isActive) throw new ApiError(401, 'User not found or inactive');
    req.user = user;
    next();
  } catch (err) {
    next(err instanceof ApiError ? err : new ApiError(401, 'Invalid token'));
  }
}

function optionalAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next();
  try {
    const payload = verifyAccess(token);
    User.findById(payload.id).then((u) => {
      if (u && u.isActive) req.user = u;
      next();
    }).catch(() => next());
  } catch {
    next();
  }
}

module.exports = { authMiddleware, optionalAuth };
