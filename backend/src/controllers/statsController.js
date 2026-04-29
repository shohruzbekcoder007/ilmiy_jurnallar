const User = require('../models/User');
const Journal = require('../models/Journal');
const Article = require('../models/Article');
const asyncHandler = require('../utils/asyncHandler');

exports.summary = asyncHandler(async (req, res) => {
  const [totalJournals, totalArticles, totalAuthors, downloadAgg] = await Promise.all([
    Journal.countDocuments({ isActive: true }),
    Article.countDocuments({ status: 'published' }),
    User.countDocuments({ role: 'author', isActive: true }),
    Article.aggregate([{ $group: { _id: null, total: { $sum: '$downloadCount' } } }]),
  ]);
  res.json({
    success: true,
    data: {
      totalJournals,
      totalArticles,
      totalAuthors,
      totalDownloads: downloadAgg[0]?.total || 0,
    },
  });
});

exports.adminCharts = asyncHandler(async (req, res) => {
  const monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth() - 11);
  const submissionsPerMonth = await Article.aggregate([
    { $match: { submittedAt: { $gte: monthAgo } } },
    {
      $group: {
        _id: { y: { $year: '$submittedAt' }, m: { $month: '$submittedAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.y': 1, '_id.m': 1 } },
  ]);
  const topArticles = await Article.find({ status: 'published' })
    .sort({ downloadCount: -1 })
    .limit(10)
    .select('title downloadCount viewCount');
  res.json({ success: true, data: { submissionsPerMonth, topArticles } });
});

exports.search = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 2) return res.json({ success: true, data: { articles: [], journals: [] } });
  const [articles, journals] = await Promise.all([
    Article.find({ status: 'published', $text: { $search: q } })
      .limit(10)
      .populate('journal', 'title slug')
      .populate('authors.user', 'fullName'),
    Journal.find({ isActive: true, $or: [
      { 'title.uz': new RegExp(q, 'i') },
      { 'title.ru': new RegExp(q, 'i') },
      { 'title.en': new RegExp(q, 'i') },
    ]}).limit(10),
  ]);
  res.json({ success: true, data: { articles, journals } });
});
