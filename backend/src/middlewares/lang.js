const SUPPORTED = ['uz', 'ru', 'en'];

module.exports = function langMiddleware(req, res, next) {
  let lang = req.query.lang || (req.headers['accept-language'] || '').slice(0, 2).toLowerCase();
  if (!SUPPORTED.includes(lang)) lang = 'uz';
  req.lang = lang;
  next();
};
