// const express = require('express');
// const { getTours, getTour, createTour, upload } = require('../controllers/tourController'); // Import the controller methods

// const router = express.Router();

// router.route('/')
//     .get(getTours) // Define a GET route for /api/v1/tours
//     .post(upload.fields([{ name: 'image', maxCount: 1 }, { name: 'gallery', maxCount: 10 }]), createTour); // Define a POST route for /api/v1/tours with file upload middleware

// router.route('/:id').get(getTour); // Define a GET route for /api/v1/tours/:id

// module.exports = router;
const express = require('express');
const { getTours, getTour, createTour, updateTour, deleteTour, uploadTourImages, getPopularTours, getSimilarTours } = require('../controllers/tourController');

const router = express.Router();

router.route('/')
  .get(getTours)
  .post(uploadTourImages, createTour);

router.get('/popular', getPopularTours);
router.get('/similar/:id', getSimilarTours);

router.route('/:id')
  .get(getTour)
  .put(uploadTourImages, updateTour)
  .delete(deleteTour);

module.exports = router;
