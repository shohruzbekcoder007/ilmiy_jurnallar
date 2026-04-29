const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

exports.list = asyncHandler(async (req, res) => {
  const { role, q, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (q) filter.$or = [
    { fullName: new RegExp(q, 'i') },
    { email: new RegExp(q, 'i') },
  ];
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    User.countDocuments(filter),
  ]);
  res.json({ success: true, data: { items, total, page: Number(page), limit: Number(limit) } });
});

exports.getById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  res.json({ success: true, data: { user } });
});

exports.changeRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!['author', 'reviewer', 'editor', 'admin'].includes(role)) throw new ApiError(400, 'Invalid role');
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
  if (!user) throw new ApiError(404, 'User not found');
  res.json({ success: true, data: { user } });
});

exports.remove = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!user) throw new ApiError(404, 'User not found');
  res.json({ success: true, message: 'User deactivated' });
});

exports.searchAuthors = asyncHandler(async (req, res) => {
  const { q = '' } = req.query;
  if (q.length < 2) return res.json({ success: true, data: { items: [] } });
  const items = await User.find({
    $or: [
      { email: new RegExp(q, 'i') },
      { fullName: new RegExp(q, 'i') },
      { orcid: new RegExp(q, 'i') },
    ],
  }).limit(10).select('fullName email orcid affiliation');
  res.json({ success: true, data: { items } });
});
