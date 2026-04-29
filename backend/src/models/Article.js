const mongoose = require('mongoose');

const i18n = { uz: { type: String, default: '' }, ru: { type: String, default: '' }, en: { type: String, default: '' } };

const articleSchema = new mongoose.Schema(
  {
    journal: { type: mongoose.Schema.Types.ObjectId, ref: 'Journal', required: true, index: true },
    issue: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue', default: null, index: true },
    title: i18n,
    abstract: i18n,
    keywords: [
      {
        uz: { type: String, default: '' },
        en: { type: String, default: '' },
      },
    ],
    authors: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        order: { type: Number, default: 1 },
        isCorresponding: { type: Boolean, default: false },
      },
    ],
    doi: { type: String, trim: true },
    udk: { type: String, trim: true },
    pages: {
      from: { type: Number },
      to: { type: Number },
    },
    language: { type: String, enum: ['uz', 'ru', 'en'], default: 'uz' },
    fileUrl: { type: String, default: '' },
    coverLetterUrl: { type: String, default: '' },
    status: {
      type: String,
      enum: ['draft', 'submitted', 'under_review', 'revision_needed', 'accepted', 'rejected', 'published'],
      default: 'draft',
      index: true,
    },
    submittedAt: { type: Date },
    publishedAt: { type: Date },
    viewCount: { type: Number, default: 0 },
    downloadCount: { type: Number, default: 0 },
    imradStructure: {
      introduction: { type: String, default: '' },
      methodology: { type: String, default: '' },
      results: { type: String, default: '' },
      discussion: { type: String, default: '' },
      conclusion: { type: String, default: '' },
    },
    assignedReviewers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

articleSchema.index(
  { 'title.uz': 'text', 'title.ru': 'text', 'title.en': 'text', 'abstract.uz': 'text', 'abstract.en': 'text' },
  { default_language: 'none', language_override: '_textLang' }
);

module.exports = mongoose.model('Article', articleSchema);
