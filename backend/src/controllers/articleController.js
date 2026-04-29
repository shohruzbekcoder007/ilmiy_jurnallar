const Article = require('../models/Article');
const Submission = require('../models/Submission');
const Review = require('../models/Review');
const User = require('../models/User');
const Journal = require('../models/Journal');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { sendEmail, templates } = require('../utils/email');

exports.listPublished = asyncHandler(async (req, res) => {
  const { journal, keyword, author, year, language, page = 1, limit = 20 } = req.query;
  const filter = { status: 'published' };
  if (journal) filter.journal = journal;
  if (language) filter.language = language;
  if (year) {
    filter.publishedAt = {
      $gte: new Date(`${year}-01-01`),
      $lte: new Date(`${year}-12-31T23:59:59`),
    };
  }
  if (keyword) filter.$text = { $search: keyword };
  if (author) {
    const users = await User.find({ fullName: new RegExp(author, 'i') }).select('_id');
    filter['authors.user'] = { $in: users.map((u) => u._id) };
  }
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Article.find(filter).sort({ publishedAt: -1 }).skip(skip).limit(Number(limit))
      .populate('authors.user', 'fullName orcid affiliation')
      .populate('journal', 'title slug')
      .populate('issue', 'volume number year'),
    Article.countDocuments(filter),
  ]);
  res.json({ success: true, data: { items, total, page: Number(page), limit: Number(limit) } });
});

exports.getById = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id)
    .populate('authors.user', 'fullName orcid affiliation degree')
    .populate('journal', 'title slug issn eissn')
    .populate('issue', 'volume number year');
  if (!article) throw new ApiError(404, 'Article not found');
  if (article.status === 'published') {
    Article.updateOne({ _id: article._id }, { $inc: { viewCount: 1 } }).exec();
  }
  res.json({ success: true, data: { article } });
});

exports.download = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article) throw new ApiError(404, 'Article not found');
  if (article.status !== 'published') throw new ApiError(403, 'Article not published');
  if (!article.fileUrl) throw new ApiError(404, 'No file attached');
  Article.updateOne({ _id: article._id }, { $inc: { downloadCount: 1 } }).exec();
  res.json({ success: true, data: { url: article.fileUrl } });
});

exports.submit = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  const journal = await Journal.findById(data.journal);
  if (!journal || !journal.isActive) throw new ApiError(400, 'Invalid journal');

  if (!data.authors || !data.authors.length) {
    data.authors = [{ user: req.user._id, order: 1, isCorresponding: true }];
  }
  data.status = data.status === 'draft' ? 'draft' : 'submitted';
  if (data.status === 'submitted') data.submittedAt = new Date();
  const article = await Article.create(data);

  await Submission.create({
    article: article._id,
    action: data.status === 'submitted' ? 'submitted' : 'draft_created',
    performedBy: req.user._id,
  });

  if (data.status === 'submitted') {
    const tpl = templates.articleSubmitted(article, req.user);
    sendEmail({ to: req.user.email, ...tpl }).catch(() => {});
    if (journal.chiefEditor) {
      const editor = await User.findById(journal.chiefEditor);
      if (editor) sendEmail({ to: editor.email, ...templates.editorNewSubmission(article) }).catch(() => {});
    }
  }
  res.status(201).json({ success: true, data: { article } });
});

exports.update = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article) throw new ApiError(404, 'Article not found');
  const isAuthor = article.authors.some((a) => a.user?.toString() === req.user._id.toString());
  if (!isAuthor) throw new ApiError(403, 'Not your article');
  if (!['draft', 'revision_needed'].includes(article.status)) {
    throw new ApiError(400, 'Article not editable in current status');
  }
  const allowed = ['title', 'abstract', 'keywords', 'language', 'udk', 'doi', 'fileUrl', 'imradStructure', 'authors', 'pages'];
  for (const k of allowed) if (req.body[k] !== undefined) article[k] = req.body[k];
  if (req.body.status === 'submitted') {
    article.status = 'submitted';
    article.submittedAt = new Date();
    await Submission.create({ article: article._id, action: 'resubmitted', performedBy: req.user._id });
  }
  await article.save();
  res.json({ success: true, data: { article } });
});

exports.remove = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article) throw new ApiError(404, 'Article not found');
  const isAuthor = article.authors.some((a) => a.user?.toString() === req.user._id.toString());
  if (!isAuthor) throw new ApiError(403, 'Not your article');
  if (article.status !== 'draft') throw new ApiError(400, 'Only drafts can be deleted');
  await article.deleteOne();
  res.json({ success: true, message: 'Article deleted' });
});

exports.myArticles = asyncHandler(async (req, res) => {
  const items = await Article.find({ 'authors.user': req.user._id })
    .sort({ updatedAt: -1 })
    .populate('journal', 'title slug')
    .populate('issue', 'volume number year');
  res.json({ success: true, data: { items } });
});

exports.allSubmissions = asyncHandler(async (req, res) => {
  const { status, journal } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (journal) filter.journal = journal;
  if (!status) filter.status = { $ne: 'draft' };
  const items = await Article.find(filter)
    .sort({ submittedAt: -1, createdAt: -1 })
    .populate('authors.user', 'fullName email')
    .populate('journal', 'title slug');
  res.json({ success: true, data: { items } });
});

exports.assignReviewer = asyncHandler(async (req, res) => {
  const { reviewerIds = [] } = req.body;
  const article = await Article.findById(req.params.id);
  if (!article) throw new ApiError(404, 'Article not found');
  const set = new Set([...article.assignedReviewers.map(String), ...reviewerIds.map(String)]);
  article.assignedReviewers = Array.from(set);
  if (article.status === 'submitted') article.status = 'under_review';
  await article.save();
  await Submission.create({
    article: article._id,
    action: 'assigned_reviewer',
    performedBy: req.user._id,
    note: `Assigned: ${reviewerIds.join(', ')}`,
  });
  const reviewers = await User.find({ _id: { $in: reviewerIds } });
  for (const r of reviewers) {
    sendEmail({ to: r.email, ...templates.reviewerAssigned(article, r) }).catch(() => {});
  }
  res.json({ success: true, data: { article } });
});

exports.changeStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  const allowed = ['accepted', 'rejected', 'revision_needed', 'under_review'];
  if (!allowed.includes(status)) throw new ApiError(400, 'Invalid status');
  const article = await Article.findById(req.params.id)
    .populate('authors.user', 'fullName email')
    .populate('journal', 'title');
  if (!article) throw new ApiError(404, 'Article not found');
  article.status = status;
  await article.save();
  await Submission.create({ article: article._id, action: status, performedBy: req.user._id, note });
  const corresponding = article.authors.find((a) => a.isCorresponding) || article.authors[0];
  if (corresponding?.user?.email) {
    if (status === 'accepted') {
      sendEmail({ to: corresponding.user.email, ...templates.articleAccepted(article, corresponding.user) }).catch(() => {});
    } else if (status === 'rejected') {
      sendEmail({ to: corresponding.user.email, ...templates.articleRejected(article, corresponding.user, note) }).catch(() => {});
    } else if (status === 'revision_needed') {
      sendEmail({ to: corresponding.user.email, ...templates.revisionRequested(article, corresponding.user, note) }).catch(() => {});
    }
  }
  res.json({ success: true, data: { article } });
});

exports.publish = asyncHandler(async (req, res) => {
  const { issue, doi, pages } = req.body;
  const article = await Article.findById(req.params.id)
    .populate('authors.user', 'fullName email')
    .populate('journal', 'title');
  if (!article) throw new ApiError(404, 'Article not found');
  if (article.status !== 'accepted') throw new ApiError(400, 'Only accepted articles can be published');
  article.issue = issue;
  if (doi) article.doi = doi;
  if (pages) article.pages = pages;
  article.status = 'published';
  article.publishedAt = new Date();
  await article.save();
  await Submission.create({ article: article._id, action: 'published', performedBy: req.user._id });
  const corresponding = article.authors.find((a) => a.isCorresponding) || article.authors[0];
  if (corresponding?.user?.email) {
    sendEmail({ to: corresponding.user.email, ...templates.articlePublished(article, corresponding.user) }).catch(() => {});
  }
  res.json({ success: true, data: { article } });
});

exports.timeline = asyncHandler(async (req, res) => {
  const items = await Submission.find({ article: req.params.id }).sort({ timestamp: 1 }).populate('performedBy', 'fullName role');
  res.json({ success: true, data: { items } });
});
