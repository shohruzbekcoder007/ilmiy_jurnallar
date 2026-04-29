const mongoose = require('mongoose');

const i18n = { uz: { type: String, default: '' }, ru: { type: String, default: '' }, en: { type: String, default: '' } };

const announcementSchema = new mongoose.Schema(
  {
    title: i18n,
    body: i18n,
    type: { type: String, enum: ['news', 'call_for_papers', 'conference'], default: 'news', index: true },
    attachmentUrl: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Announcement', announcementSchema);
