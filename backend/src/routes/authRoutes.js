const express = require('express');
const { body, param } = require('express-validator');
const validate = require('../middlewares/validate');
const { authMiddleware } = require('../middlewares/auth');
const { auth: authLimiter } = require('../middlewares/rateLimiter');
const c = require('../controllers/authController');

const router = express.Router();

router.post(
  '/register',
  authLimiter,
  [
    body('fullName').isString().trim().isLength({ min: 2 }),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
  ],
  validate,
  c.register
);

router.post(
  '/login',
  authLimiter,
  [body('email').isEmail().normalizeEmail(), body('password').isString().notEmpty()],
  validate,
  c.login
);

router.post('/refresh', c.refresh);
router.post('/logout', c.logout);

router.get('/me', authMiddleware, c.me);
router.patch('/me', authMiddleware, c.updateMe);

router.post(
  '/forgot-password',
  authLimiter,
  [body('email').isEmail().normalizeEmail()],
  validate,
  c.forgotPassword
);

router.post(
  '/reset-password/:token',
  authLimiter,
  [param('token').isString().isLength({ min: 10 }), body('password').isLength({ min: 8 })],
  validate,
  c.resetPassword
);

module.exports = router;
