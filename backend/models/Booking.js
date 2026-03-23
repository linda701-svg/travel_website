const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      tourId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      priceAtPurchase: { // Store the price at the time of purchase
        type: Number,
        required: true,
      },
    },
  ],
  customerDetails: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
  },
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
  },
  // Optionally add billing address if different from shipping
  billingAddress: {
    address: String,
    city: String,
    zip: String,
    country: String,
  },
  bookingDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending_payment', 'confirmed', 'cancelled', 'completed', 'refunded'],
    default: 'pending_payment',
  },
  paymentId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Payment',
  },
  totalAmount: { // This will be the total of all items + delivery fee
    type: Number,
    required: true,
  },
  deliveryFee: {
    type: Number,
    default: 0,
  },
  // For soft delete
  deleted: {
    type: Boolean,
    default: false,
    select: false,
  }
}, { timestamps: true });

BookingSchema.index({ userId: 1 });

module.exports = mongoose.model('Booking', BookingSchema);
