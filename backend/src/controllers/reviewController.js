const Review = require('../models/Review');
const Article = require('../models/Article');
const Submission = require('../models/Submission');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { sendEmail, templates } = require('../utils/email');

exports.submitReview = asyncHandler(async (req, res) => {
  const { article: articleId, recommendation, comments } = req.body;
  const article = await Article.findById(articleId).populate('journal', 'chiefEditor');
  if (!article) throw new ApiError(404, 'Article not found');
  const isAssigned = article.assignedReviewers.some((r) => r.toString() === req.user._id.toString());
  if (!isAssigned) throw new ApiError(403, 'Not assigned to this article');
  const review = await Review.create({
    article: article._id,
    reviewer: req.user._id,
    recommendation,
    comments,
    isBlind: true,
  });
  await Submission.create({
    article: article._id,
    action: 'review_submitted',
    performedBy: req.user._id,
    note: recommendation,
  });
  if (article.journal?.chiefEditor) {
    const editor = await User.findById(article.journal.chiefEditor);
    if (editor) sendEmail({ to: editor.email, ...templates.reviewSubmitted(article) }).catch(() => {});
  }
  res.status(201).json({ success: true, data: { review } });
});

exports.myReviews = asyncHandler(async (req, res) => {
  const items = await Review.find({ reviewer: req.user._id })
    .sort({ createdAt: -1 })
    .populate('article', 'title status journal');
  res.json({ success: true, data: { items } });
});

exports.assignedToMe = asyncHandler(async (req, res) => {
  const items = await Article.find({ assignedReviewers: req.user._id })
    .sort({ updatedAt: -1 })
    .populate('journal', 'title')
    .select('-authors');
  res.json({ success: true, data: { items } });
});

exports.reviewsOfArticle = asyncHandler(async (req, res) => {
  const items = await Review.find({ article: req.params.articleId })
    .sort({ createdAt: -1 })
    .populate('reviewer', 'fullName email');
  res.json({ success: true, data: { items } });
});
