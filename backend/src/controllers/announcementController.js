const Announcement = require('../models/Announcement');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

exports.list = asyncHandler(async (req, res) => {
  const { type, page = 1, limit = 10 } = req.query;
  const filter = {};
  if (type) filter.type = type;
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Announcement.find(filter).sort({ publishedAt: -1 }).skip(skip).limit(Number(limit)),
    Announcement.countDocuments(filter),
  ]);
  res.json({ success: true, data: { items, total, page: Number(page), limit: Number(limit) } });
});

exports.getById = asyncHandler(async (req, res) => {
  const item = await Announcement.findById(req.params.id).populate('createdBy', 'fullName');
  if (!item) throw new ApiError(404, 'Announcement not found');
  res.json({ success: true, data: { item } });
});

exports.create = asyncHandler(async (req, res) => {
  const item = await Announcement.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json({ success: true, data: { item } });
});

exports.update = asyncHandler(async (req, res) => {
  const item = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) throw new ApiError(404, 'Announcement not found');
  res.json({ success: true, data: { item } });
});

exports.remove = asyncHandler(async (req, res) => {
  const item = await Announcement.findByIdAndDelete(req.params.id);
  if (!item) throw new ApiError(404, 'Announcement not found');
  res.json({ success: true, message: 'Deleted' });
});
