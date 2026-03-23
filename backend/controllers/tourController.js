// travel-website/backend/controllers/tourController.js
const Tour = require('../models/Tour'); // Import the Tour model
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Node.js file system module

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Files will be saved in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

exports.upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // 10MB file size limit
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

// Check File Type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// @desc    Create new tour
// @route   POST /api/v1/tours
// @access  Private (Admin only)
exports.createTour = async (req, res, next) => {
  try {
    const {
      title, description, price, duration,
      services_included, services_excluded
    } = req.body;

    // Services handling for services[included] format
    const servicesIncludedInput = req.body['services[included]'] || services_included;
    const servicesExcludedInput = req.body['services[excluded]'] || services_excluded;

    // Reconstruct nested objects from flattened FormData keys
    const location = {
      address: req.body['location.address'],
      city: req.body['location.city'],
      country: req.body['location.country'],
      latitude: req.body['location.latitude'] ? parseFloat(req.body['location.latitude']) : 0,
      longitude: req.body['location.longitude'] ? parseFloat(req.body['location.longitude']) : 0,
    };

    const availability = {
      startDate: req.body['availability.startDate'] ? new Date(req.body['availability.startDate']) : null,
      endDate: req.body['availability.endDate'] ? new Date(req.body['availability.endDate']) : null,
      maxGroupSize: req.body['availability.maxGroupSize'] ? parseInt(req.body['availability.maxGroupSize'], 10) : 10,
    };

    const banner = req.files && req.files['banner'] ? `/uploads/${req.files['banner'][0].filename}` : null;
    const image = req.files && req.files['image'] ? `/uploads/${req.files['image'][0].filename}` : null;
    const gallery = req.files && req.files['gallery'] ? req.files['gallery'].map(file => ({ image: `/uploads/${file.filename}` })) : [];

    // Parse itinerary if provided
    let itinerary = [];
    if (req.body.itinerary) {
      try {
        itinerary = JSON.parse(req.body.itinerary);
      } catch (e) {
        console.error('Error parsing itinerary:', e);
      }
    }

    const newTour = await Tour.create({
      title,
      description,
      price,
      duration,
      image,
      banner,
      gallery,
      itinerary,
      location,
      availability,
      services: {
        included: servicesIncludedInput && typeof servicesIncludedInput === 'string' ? servicesIncludedInput.split(',') : (Array.isArray(servicesIncludedInput) ? servicesIncludedInput : []),
        excluded: servicesExcludedInput && typeof servicesExcludedInput === 'string' ? servicesExcludedInput.split(',') : (Array.isArray(servicesExcludedInput) ? servicesExcludedInput : []),
      },
    });

    res.status(201).json({
      success: true,
      data: newTour,
    });
  } catch (err) {
    console.error('Error creating tour:', err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    }
    // Handle CastError (e.g., invalid ObjectID or type mismatch)
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: `Invalid value for ${err.path}: ${err.value}`
      });
    }
    // Handle MulterError
    if (err.name === 'MulterError') {
      return res.status(400).json({
        success: false,
        error: err.message
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server Error: ' + err.message,
    });
  }
};

// @desc    Get all tours
// @route   GET /api/v1/tours
// @access  Public
exports.getTours = async (req, res, next) => {
  try {
    const tours = await Tour.find(); // Add query handling if needed
    res.status(200).json({
      success: true,
      count: tours.length,
      data: tours,
    });
  } catch (err) {
    console.error('Error getting tours:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// @desc    Get single tour
// @route   GET /api/v1/tours/:id
// @access  Public
exports.getTour = async (req, res, next) => {
  try {
    const tour = await Tour.findById(req.params.id);

    if (!tour) {
      return res.status(404).json({
        success: false,
        error: `Tour not found with id of ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: tour,
    });
  } catch (err) {
    console.error('Error getting tour:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// @desc    Update tour
// @route   PUT /api/v1/tours/:id
// @access  Private (Admin)
exports.updateTour = async (req, res, next) => {
  try {
    let tour = await Tour.findById(req.params.id);

    if (!tour) {
      return res.status(404).json({
        success: false,
        error: `Tour not found with id of ${req.params.id}`,
      });
    }

    const {
      title, description, price, duration,
      services_included, services_excluded
    } = req.body;

    // Handle updates
    // Since this uses FormData, we need to reconstruct objects again if they are present

    // Note: If only partial updates are sent, this logic might need refinement. 
    // Assuming full update or handled by frontend sending existing data.

    const updateData = {
      title, description, price, duration
    };

    if (req.body['location.city']) {
      updateData.location = {
        address: req.body['location.address'],
        city: req.body['location.city'],
        country: req.body['location.country'],
        latitude: req.body['location.latitude'] ? parseFloat(req.body['location.latitude']) : tour.location.latitude,
        longitude: req.body['location.longitude'] ? parseFloat(req.body['location.longitude']) : tour.location.longitude,
      };
    }

    if (req.body['availability.startDate']) {
      updateData.availability = {
        startDate: new Date(req.body['availability.startDate']),
        endDate: new Date(req.body['availability.endDate']),
        maxGroupSize: parseInt(req.body['availability.maxGroupSize'], 10),
      };
    }

    // Handle Images Updates
    if (req.files && req.files['image']) {
      updateData.image = `/uploads/${req.files['image'][0].filename}`;
    }
    if (req.files && req.files['banner']) {
      updateData.banner = `/uploads/${req.files['banner'][0].filename}`;
    }
    // Gallery Sync Logic: Combine existing image URLs with newly uploaded files
    const existingGalleryInput = req.body.existingGallery;
    let finalGallery = [];
    let galleryUpdated = false;

    if (existingGalleryInput) {
      galleryUpdated = true;
      try {
        const existingUrls = JSON.parse(existingGalleryInput);
        finalGallery = existingUrls.map(url => ({ image: url }));
      } catch (e) {
        console.error('Error parsing existingGallery:', e);
      }
    }

    if (req.files && req.files['gallery']) {
      galleryUpdated = true;
      const newGalleryImages = req.files['gallery'].map(file => ({ image: `/uploads/${file.filename}` }));
      finalGallery = [...finalGallery, ...newGalleryImages];
    }

    if (galleryUpdated) {
      // Ensure only unique image paths are saved
      const seen = new Set();
      updateData.gallery = finalGallery.filter(item => {
        if (!item.image || seen.has(item.image)) return false;
        seen.add(item.image);
        return true;
      });
    }

    if (req.body.itinerary) {
      try {
        updateData.itinerary = JSON.parse(req.body.itinerary);
      } catch (e) { console.error(e); }
    }

    // Services update handling
    const servicesIncludedInput = req.body['services[included]'] || services_included;
    const servicesExcludedInput = req.body['services[excluded]'] || services_excluded;

    if (servicesIncludedInput || servicesExcludedInput) {
      updateData.services = {
        included: servicesIncludedInput && typeof servicesIncludedInput === 'string'
          ? servicesIncludedInput.split(',').map(s => s.trim()).filter(s => s !== '')
          : (Array.isArray(servicesIncludedInput) ? servicesIncludedInput : tour.services.included),
        excluded: servicesExcludedInput && typeof servicesExcludedInput === 'string'
          ? servicesExcludedInput.split(',').map(s => s.trim()).filter(s => s !== '')
          : (Array.isArray(servicesExcludedInput) ? servicesExcludedInput : tour.services.excluded),
      };
    }

    tour = await Tour.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: tour,
    });
  } catch (err) {
    console.error('Error updating tour:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// @desc    Delete tour
// @route   DELETE /api/v1/tours/:id
// @access  Private (Admin)
// @desc    Get popular tours
// @route   GET /api/v1/tours/popular
// @access  Public
exports.getPopularTours = async (req, res, next) => {
  try {
    // Mock popularity by taking first 3 tours
    // In a real app, this could be based on booking count or ratings
    const tours = await Tour.find().limit(3);
    res.status(200).json({
      success: true,
      count: tours.length,
      data: tours,
    });
  } catch (err) {
    console.error('Error getting popular tours:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// @desc    Get similar tours
// @route   GET /api/v1/tours/similar/:id
// @access  Public
exports.getSimilarTours = async (req, res, next) => {
  try {
    const tour = await Tour.findById(req.params.id);

    if (!tour) {
      return res.status(404).json({
        success: false,
        error: `Tour not found with id of ${req.params.id}`,
      });
    }

    // Find tours in the same country or city, excluding the current tour
    const similarTours = await Tour.find({
      _id: { $ne: req.params.id },
      $or: [
        { 'location.country': tour.location.country },
        { 'location.city': tour.location.city }
      ]
    }).limit(3);

    res.status(200).json({
      success: true,
      count: similarTours.length,
      data: similarTours,
    });
  } catch (err) {
    console.error('Error getting similar tours:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

exports.deleteTour = async (req, res, next) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    if (!tour) {
      return res.status(404).json({
        success: false,
        error: `Tour not found with id of ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });

  } catch (err) {
    console.error('Error deleting tour:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

exports.uploadTourImages = (req, res, next) => {
  const uploadFields = exports.upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'banner', maxCount: 1 },
    { name: 'gallery', maxCount: 10 }
  ]);

  uploadFields(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ success: false, error: `Unexpected field: ${err.field}` });
      }
      return res.status(400).json({ success: false, error: `Multer error: ${err.message}` });
    } else if (err) {
      return res.status(500).json({ success: false, error: `Upload error: ${err.message}` });
    }
    next();
  });
};
