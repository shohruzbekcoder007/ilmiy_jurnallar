const Issue = require('../models/Issue');
const Article = require('../models/Article');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

exports.create = asyncHandler(async (req, res) => {
  const issue = await Issue.create(req.body);
  res.status(201).json({ success: true, data: { issue } });
});

exports.update = asyncHandler(async (req, res) => {
  const issue = await Issue.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!issue) throw new ApiError(404, 'Issue not found');
  res.json({ success: true, data: { issue } });
});

exports.remove = asyncHandler(async (req, res) => {
  const issue = await Issue.findByIdAndDelete(req.params.id);
  if (!issue) throw new ApiError(404, 'Issue not found');
  res.json({ success: true, message: 'Issue deleted' });
});

exports.articlesOfIssue = asyncHandler(async (req, res) => {
  const articles = await Article.find({ issue: req.params.id, status: 'published' })
    .sort({ 'pages.from': 1 })
    .populate('authors.user', 'fullName orcid affiliation');
  res.json({ success: true, data: { items: articles } });
});
