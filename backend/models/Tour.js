const mongoose = require('mongoose');

const TourSchema = new mongoose.Schema({
  destinationId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Destination',
    required: false, // Changed from true to false
  },
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  itinerary: [
    {
      day: {
        type: Number,
        required: true
      },
      description: {
        type: String,
        required: true
      }
    }
  ],
  gallery: [
    {
      image: {
        type: String,
        required: true
      },
      altText: {
        type: String,
        default: ""
      }
    }
  ],
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },

  price: {
    type: Number,
    required: [true, 'Please provide a price'],
  },
  oldPrice: {
    type: Number,
  },
  duration: { // in days
    type: Number,
    required: [true, 'Please provide a duration'],
  },
  image: {
    type: String,
    required: true,
  },
  banner: { type: String, required: false },
  availability: {
    startDate: Date,
    endDate: Date,
    maxGroupSize: Number,
  },
  services: {
    included: [String],
    excluded: [String],
  },
  // For soft delete
  deleted: {
    type: Boolean,
    default: false,
    select: false,
  }
}, { timestamps: true });

// Indexes
TourSchema.index({ price: 1 });
TourSchema.index({ duration: 1 });

module.exports = mongoose.model('Tour', TourSchema);
