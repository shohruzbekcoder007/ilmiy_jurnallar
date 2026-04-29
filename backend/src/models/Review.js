const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true, index: true },
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    recommendation: {
      type: String,
      enum: ['accept', 'minor_revision', 'major_revision', 'reject'],
      required: true,
    },
    comments: { type: String, required: true },
    isBlind: { type: Boolean, default: true },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
