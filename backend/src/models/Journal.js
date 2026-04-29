const mongoose = require('mongoose');
const slugify = require('slugify');

const i18n = { uz: { type: String, default: '' }, ru: { type: String, default: '' }, en: { type: String, default: '' } };

const journalSchema = new mongoose.Schema(
  {
    slug: { type: String, unique: true, index: true },
    title: i18n,
    description: i18n,
    coverImage: { type: String, default: '' },
    issn: { type: String, trim: true },
    eissn: { type: String, trim: true },
    frequency: {
      type: String,
      enum: ['monthly', 'quarterly', 'biannual', 'annual'],
      default: 'quarterly',
    },
    indexedIn: [{ type: String, trim: true }],
    chiefEditor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    editorialBoard: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: { type: String, default: 'member' },
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

journalSchema.pre('validate', function (next) {
  if (!this.slug && this.title?.uz) {
    this.slug = slugify(this.title.uz, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Journal', journalSchema);
