const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: [true, 'Please provide the payment amount'],
  },
  paymentMethod: {
    type: String,
    enum: ['Stripe', 'PayPal', 'Cash on Delivery'],
    required: [true, 'Please specify a payment method'],
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  transactionId: {
    type: String, // From Stripe or PayPal
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

PaymentSchema.index({ booking: 1 });

module.exports = mongoose.model('Payment', PaymentSchema);