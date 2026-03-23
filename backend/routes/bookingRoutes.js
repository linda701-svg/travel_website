const express = require('express');
const { createBooking, getBookings, deleteBooking, getBooking, updateBooking } = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// POST is public — guests can book; controller handles guest user creation via email
router.post('/', createBooking);

// These routes require authentication (admin use)
router.get('/', protect, getBookings);
router.get('/:id', protect, getBooking);
router.put('/:id', protect, updateBooking);
router.delete('/:id', protect, deleteBooking);

module.exports = router;
