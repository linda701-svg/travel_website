const express = require('express');
const {
    createReview,
    getTourReviews
} = require('../controllers/reviewController');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/', protect, createReview);
router.get('/tour/:tourId', getTourReviews);

module.exports = router;
