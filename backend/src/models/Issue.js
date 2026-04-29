const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema(
  {
    journal: { type: mongoose.Schema.Types.ObjectId, ref: 'Journal', required: true, index: true },
    volume: { type: Number, required: true },
    number: { type: Number, required: true },
    year: { type: Number, required: true, index: true },
    publishedAt: { type: Date },
    coverImage: { type: String, default: '' },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

issueSchema.index({ journal: 1, year: 1, volume: 1, number: 1 }, { unique: true });

module.exports = mongoose.model('Issue', issueSchema);
