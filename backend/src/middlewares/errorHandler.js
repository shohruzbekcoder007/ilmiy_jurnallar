const ApiError = require('../utils/ApiError');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: Object.values(err.errors).map((e) => ({ path: e.path, msg: e.message })),
    });
  }
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'Duplicate value',
      errors: [{ keys: Object.keys(err.keyValue || {}), value: err.keyValue }],
    });
  }
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Invalid or expired token', errors: [] });
  }
  console.error('[error]', err);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    errors: [],
  });
}

module.exports = errorHandler;
