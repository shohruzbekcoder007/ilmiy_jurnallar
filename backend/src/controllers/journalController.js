const Journal = require('../models/Journal');
const Issue = require('../models/Issue');
const Article = require('../models/Article');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

exports.list = asyncHandler(async (req, res) => {
  const { indexedIn, year, page = 1, limit = 20 } = req.query;
  const filter = { isActive: true };
  if (indexedIn) filter.indexedIn = indexedIn;
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Journal.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).populate('chiefEditor', 'fullName email'),
    Journal.countDocuments(filter),
  ]);
  res.json({ success: true, data: { items, total, page: Number(page), limit: Number(limit) } });
});

exports.getBySlug = asyncHandler(async (req, res) => {
  const journal = await Journal.findOne({ slug: req.params.slug, isActive: true })
    .populate('chiefEditor', 'fullName email affiliation')
    .populate('editorialBoard.user', 'fullName affiliation degree');
  if (!journal) throw new ApiError(404, 'Journal not found');
  res.json({ success: true, data: { journal } });
});

exports.create = asyncHandler(async (req, res) => {
  const journal = await Journal.create(req.body);
  res.status(201).json({ success: true, data: { journal } });
});

exports.update = asyncHandler(async (req, res) => {
  const journal = await Journal.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!journal) throw new ApiError(404, 'Journal not found');
  res.json({ success: true, data: { journal } });
});

exports.remove = asyncHandler(async (req, res) => {
  const journal = await Journal.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!journal) throw new ApiError(404, 'Journal not found');
  res.json({ success: true, message: 'Journal deactivated' });
});

exports.issuesOfJournal = asyncHandler(async (req, res) => {
  const journal = await Journal.findOne({ slug: req.params.slug });
  if (!journal) throw new ApiError(404, 'Journal not found');
  const issues = await Issue.find({ journal: journal._id, isPublished: true }).sort({ year: -1, volume: -1, number: -1 });
  res.json({ success: true, data: { issues } });
});

exports.articlesOfJournal = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, year, keyword } = req.query;
  const journal = await Journal.findOne({ slug: req.params.slug });
  if (!journal) throw new ApiError(404, 'Journal not found');
  const filter = { journal: journal._id, status: 'published' };
  if (year) {
    filter.publishedAt = {
      $gte: new Date(`${year}-01-01`),
      $lte: new Date(`${year}-12-31T23:59:59`),
    };
  }
  if (keyword) filter.$text = { $search: keyword };
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Article.find(filter).sort({ publishedAt: -1 }).skip(skip).limit(Number(limit))
      .populate('authors.user', 'fullName orcid affiliation')
      .populate('issue', 'volume number year'),
    Article.countDocuments(filter),
  ]);
  res.json({ success: true, data: { items, total, page: Number(page), limit: Number(limit) } });
});
