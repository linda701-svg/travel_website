const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for the expense'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  amount: {
    type: Number,
    required: [true, 'Please provide an amount for the expense'],
    min: [0, 'Amount cannot be negative'],
  },
  currency: {
    type: String,
    required: [true, 'Please provide a currency for the expense'],
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'], // Example currencies
  },
  category: {
    type: String,
    required: [true, 'Please provide a category for the expense'],
    enum: ['Travel', 'Accommodation', 'Food', 'Transport', 'Utilities', 'Salaries', 'Other'],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters'],
  },
  userId: { // Optional: if expenses are tied to a specific user (e.g., admin who entered it)
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true }); // `timestamps: true` adds createdAt and updatedAt fields

module.exports = mongoose.model('Expense', ExpenseSchema);
