const Review = require('../models/Review');
const Tour = require('../models/Tour');

// @desc    Create new review
// @route   POST /api/v1/reviews
// @access  Private
exports.createReview = async (req, res, next) => {
    try {
        req.body.userId = req.user.id;
        const tourId = req.body.tourId;

        const tour = await Tour.findById(tourId);
        if (!tour) {
            return res.status(404).json({
                success: false,
                error: `Tour not found with id of ${tourId}`
            });
        }

        // Check if user already reviewed this tour
        const existingReview = await Review.findOne({ tourId, userId: req.user.id });
        if (existingReview) {
            return res.status(400).json({
                success: false,
                error: 'You have already reviewed this tour'
            });
        }

        const review = await Review.create(req.body);

        res.status(201).json({
            success: true,
            data: review
        });
    } catch (err) {
        console.error('Error creating review:', err);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Get reviews for a tour
// @route   GET /api/v1/reviews/tour/:tourId
// @access  Public
exports.getTourReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find({ tourId: req.params.tourId }).populate({
            path: 'userId',
            select: 'name'
        });

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (err) {
        console.error('Error getting reviews:', err);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};
