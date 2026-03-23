const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  destinations: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Destination',
    },
  ],
  tours: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Wishlist', WishlistSchema);
