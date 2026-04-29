const crypto = require('crypto');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { signAccess, signRefresh, verifyRefresh } = require('../utils/jwt');
const { sendEmail, templates } = require('../utils/email');
const env = require('../config/env');

const refreshCookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/api/v1/auth',
};

exports.register = asyncHandler(async (req, res) => {
  const { fullName, email, password, phone, orcid, affiliation, position, degree, preferredLanguage } = req.body;
  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) throw new ApiError(409, 'Email is already registered');
  const user = await User.create({
    fullName, email, password, phone, orcid, affiliation, position, degree,
    preferredLanguage: preferredLanguage || 'uz',
    role: 'author',
  });
  const accessToken = signAccess({ id: user._id, role: user.role });
  const refreshToken = signRefresh({ id: user._id });
  res.cookie('refreshToken', refreshToken, refreshCookieOptions);
  const tpl = templates.welcome(user);
  sendEmail({ to: user.email, ...tpl }).catch(() => {});
  res.status(201).json({ success: true, data: { user: user.toSafeJSON(), accessToken } });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !user.isActive) throw new ApiError(401, 'Invalid credentials');
  const ok = await user.comparePassword(password);
  if (!ok) throw new ApiError(401, 'Invalid credentials');
  const accessToken = signAccess({ id: user._id, role: user.role });
  const refreshToken = signRefresh({ id: user._id });
  res.cookie('refreshToken', refreshToken, refreshCookieOptions);
  res.json({ success: true, data: { user: user.toSafeJSON(), accessToken } });
});

exports.refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body.refreshToken;
  if (!token) throw new ApiError(401, 'No refresh token');
  const payload = verifyRefresh(token);
  const user = await User.findById(payload.id);
  if (!user || !user.isActive) throw new ApiError(401, 'User not found');
  const accessToken = signAccess({ id: user._id, role: user.role });
  res.json({ success: true, data: { accessToken } });
});

exports.logout = asyncHandler(async (req, res) => {
  res.clearCookie('refreshToken', { ...refreshCookieOptions, maxAge: 0 });
  res.json({ success: true, message: 'Logged out' });
});

exports.me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { user: req.user.toSafeJSON() } });
});

exports.updateMe = asyncHandler(async (req, res) => {
  const allowed = ['fullName', 'phone', 'orcid', 'affiliation', 'position', 'degree', 'preferredLanguage', 'avatar'];
  const update = {};
  for (const k of allowed) if (req.body[k] !== undefined) update[k] = req.body[k];
  const user = await User.findByIdAndUpdate(req.user._id, update, { new: true, runValidators: true });
  res.json({ success: true, data: { user: user.toSafeJSON() } });
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.json({ success: true, message: 'If account exists, email has been sent' });
  }
  const raw = crypto.randomBytes(32).toString('hex');
  const hash = crypto.createHash('sha256').update(raw).digest('hex');
  user.resetPasswordToken = hash;
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
  await user.save({ validateBeforeSave: false });
  const link = `${env.CLIENT_ORIGIN}/reset-password/${raw}`;
  const tpl = templates.resetPassword(user, link);
  sendEmail({ to: user.email, ...tpl }).catch(() => {});
  res.json({ success: true, message: 'If account exists, email has been sent' });
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hash,
    resetPasswordExpires: { $gt: new Date() },
  }).select('+resetPasswordToken +resetPasswordExpires');
  if (!user) throw new ApiError(400, 'Invalid or expired token');
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  res.json({ success: true, message: 'Password updated' });
});
