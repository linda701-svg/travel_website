const express = require('express');
const {
    processPayment,
    getPayments,
    getPayment,
} = require('../controllers/paymentController');

const router = express.Router();

// You would typically have authentication middleware here
const { protect, authorize } = require('../middleware/auth');

// Apply protection to all cart routes for authenticated users
router.use(protect); // Uncomment this in a real app

router.route('/')
    .post(processPayment) // A user processes a payment
    .get(getPayments);     // An admin gets all payments

router.route('/:id')
    .get(getPayment);      // A user or admin gets a specific payment

module.exports = router;
