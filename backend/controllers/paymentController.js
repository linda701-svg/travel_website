const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const User = require('../models/User');

// @desc    Process payment and create a payment record
// @route   POST /api/v1/payments
// @access  Private (or adjust based on security, e.g., only authenticated users can make payments)
exports.processPayment = async (req, res, next) => {
    try {
        const { bookingId, paymentMethod, amount } = req.body;
        // Assuming req.user.id is available from an authentication middleware
        const userId = req.user ? req.user.id : null; 

        if (!bookingId || !paymentMethod || !amount) {
            return res.status(400).json({ success: false, error: 'Please provide bookingId, paymentMethod, and amount' });
        }

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, error: 'Booking not found' });
        }

        if (booking.totalAmount !== amount) {
            return res.status(400).json({ success: false, error: 'Payment amount does not match booking total.' });
        }

        let payment;
        let clientSecret; // For Stripe

        switch (paymentMethod) {
            case 'Stripe':
                // In a real app, you'd integrate with Stripe here
                // 1. Ensure you have stripe package installed: npm install stripe
                // 2. Set your secret key: const stripe = require('stripe')('your_stripe_secret_key');
                // 3. Create a PaymentIntent
                /*
                const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
                const paymentIntent = await stripe.paymentIntents.create({
                    amount: amount * 100, // Stripe expects amount in cents
                    currency: 'usd',
                    metadata: { bookingId: booking._id.toString(), userId: userId ? userId.toString() : 'guest' },
                });
                clientSecret = paymentIntent.client_secret;
                */

                // For simulation:
                payment = await Payment.create({
                    booking: bookingId,
                    user: userId,
                    amount,
                    paymentMethod,
                    status: 'pending', // Status would be updated by a webhook from Stripe
                    transactionId: `sim_stripe_${Date.now()}` // Simulated transaction ID
                });

                // Update booking status to pending payment from gateway
                booking.status = 'pending_payment'; // The webhook will change it to 'confirmed'
                booking.paymentId = payment._id;
                await booking.save();

                res.status(200).json({
                    success: true,
                    paymentMethod,
                    clientSecret, // Send this to the frontend to confirm the payment
                    paymentRecord: payment
                });
                break;

            case 'PayPal':
                // In a real app, you'd integrate with PayPal here (e.g., capture the order previously created by frontend)
                // Assuming PayPal frontend component handles the approval and capture
                // and you just need to verify and save the payment record on backend
                
                // For simulation and linking:
                payment = await Payment.create({
                    booking: bookingId,
                    user: userId,
                    amount,
                    paymentMethod,
                    status: 'completed', // Simulate immediate completion for PayPal
                    transactionId: `sim_paypal_${Date.now()}`
                });

                // Update booking status
                booking.status = 'confirmed';
                booking.paymentId = payment._id;
                await booking.save();

                res.status(200).json({
                    success: true,
                    paymentMethod,
                    paymentRecord: payment
                });
                break;

            case 'Cash on Delivery':
                payment = await Payment.create({
                    booking: bookingId,
                    user: userId,
                    amount,
                    paymentMethod,
                    status: 'pending', // Pending for COD until delivery/pickup
                });

                // Update booking status
                booking.status = 'pending_COD'; // New status for COD, confirmed upon delivery
                booking.paymentId = payment._id;
                await booking.save();

                res.status(200).json({
                    success: true,
                    paymentMethod,
                    data: payment
                });
                break;

            default:
                return res.status(400).json({ success: false, error: 'Invalid payment method' });
        }

    } catch (err) {
        console.error('Payment processing error:', err);
        res.status(500).json({ success: false, error: 'Server Error: ' + err.message });
    }
};

// @desc    Get all payments
// @route   GET /api/v1/payments
// @access  Private (Admin)
exports.getPayments = async (req, res, next) => {
    try {
        // Populate booking and user for full details
        const payments = await Payment.find().populate({
            path: 'booking',
            populate: {
                path: 'items.tourId', // Populate tour details within items
                model: 'Tour'
            }
        }).populate('user');
        res.status(200).json({
            success: true,
            count: payments.length,
            data: payments
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get single payment
// @route   GET /api/v1/payments/:id
// @access  Private
exports.getPayment = async (req, res, next) => {
    try {
        // Populate booking and user for full details
        const payment = await Payment.findById(req.params.id).populate({
            path: 'booking',
            populate: {
                path: 'items.tourId', // Populate tour details within items
                model: 'Tour'
            }
        }).populate('user');
        if (!payment) {
            return res.status(404).json({ success: false, error: 'Payment not found' });
        }
        res.status(200).json({ success: true, data: payment });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
