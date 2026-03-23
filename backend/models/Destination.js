const mongoose = require('mongoose');

const DestinationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  images: [
    {
      type: String,
      required: true,
    },
  ],
  country: {
    type: String,
    required: [true, 'Please provide a country'],
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // For soft delete
  deleted: {
    type: Boolean,
    default: false,
    select: false,
  }
}, { timestamps: true });

module.exports = mongoose.model('Destination', DestinationSchema);
