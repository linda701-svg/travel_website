const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  tourId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Please provide a rating between 1 and 5'],
  },
  comment: {
    type: String,
    required: [true, 'Please provide a comment'],
  },
}, { timestamps: true });

// Prevent user from submitting more than one review per tour
ReviewSchema.index({ tourId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Review', ReviewSchema);
