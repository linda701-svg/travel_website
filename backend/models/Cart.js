const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
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
                default: 1,
            },
            priceAtAdded: {
                type: Number,
                required: true,
            },
        },
    ],
}, { timestamps: true });

CartSchema.index({ userId: 1 });

module.exports = mongoose.model('Cart', CartSchema);
