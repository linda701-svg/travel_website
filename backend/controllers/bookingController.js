const Booking = require('../models/Booking');
const Tour = require('../models/Tour');
const User = require('../models/User');
const crypto = require('crypto');

// @desc    Create a new booking (order from cart)
// @route   POST /api/v1/bookings
// @access  Public (or Private depending on auth strategy)

exports.createBooking = async (req, res, next) => {
  try {
    const { cartItems, customerDetails, shippingAddress, billingAddress, totalAmount, deliveryFee } = req.body;
    let userId = req.user ? req.user.id : null; // Assuming user is authenticated or null for guest checkout

    // Basic validation
    if (!cartItems || cartItems.length === 0 || !customerDetails || !shippingAddress || totalAmount === undefined) {
      return res.status(400).json({ success: false, error: 'Please provide all required order details (cartItems, customerDetails, shippingAddress, totalAmount)' });
    }

    // Verify tour IDs and fetch current prices to prevent tampering (optional but good practice)
    const tourIds = cartItems.map(item => item.id);
    const toursInDB = await Tour.find({ _id: { $in: tourIds } });

    if (toursInDB.length !== cartItems.length) {
      return res.status(400).json({ success: false, error: 'One or more products in cart are invalid.' });
    }

    const itemsForBooking = cartItems.map(cartItem => {
      const dbTour = toursInDB.find(tour => tour._id.toString() === cartItem.id);
      return {
        tourId: dbTour._id,
        quantity: cartItem.quantity,
        priceAtPurchase: dbTour.price, // Use current price from DB
      };
    });

    // If no user is logged in, you might create a guest user or handle it differently
    // For simplicity, for now, if no userId from auth, try to find by email or create.
    if (!userId && customerDetails.email) {
      let user = await User.findOne({ email: customerDetails.email });
      if (!user) {
        // Create a temporary user or handle as guest order
        // This is a simplified approach, in real app consider more robust guest handling
        const randomPassword = crypto.randomBytes(8).toString('hex'); // Temporary password
        user = await User.create({
          name: customerDetails.name,
          email: customerDetails.email,
          phone: customerDetails.phone,
          password: randomPassword, // Password for temporary guest user
        });
        userId = user._id;
      } else {
        userId = user._id;
      }
    } else if (!userId) { // If still no userId and no email in customerDetails
      return res.status(401).json({ success: false, error: 'User not authenticated and no email provided for guest checkout.' });
    }

    const booking = await Booking.create({
      userId,
      items: itemsForBooking,
      customerDetails: {
        name: customerDetails.firstName + ' ' + customerDetails.lastName,
        email: customerDetails.email,
        phone: customerDetails.phone,
      },
      shippingAddress,
      billingAddress: billingAddress || shippingAddress, // Use shipping as billing if not provided
      totalAmount,
      deliveryFee,
      status: 'pending_payment', // Initial status
    });

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    console.error('Booking creation error:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error: ' + err.message,
    });
  }
};

// @desc    Get all bookings
// @route   GET /api/v1/bookings
// @access  Private (Admin)
exports.getBookings = async (req, res, next) => {
  try {
    // Populate items.tourId for full product details
    const bookings = await Booking.find().populate('items.tourId').populate('userId');
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (err) {
    console.error('Error getting bookings:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// @desc    Delete a booking
// @route   DELETE /api/v1/bookings/:id
// @access  Private (Admin)
exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: `Booking not found with id of ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    console.error('Error deleting booking:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// @desc    Get single booking
// @route   GET /api/v1/bookings/:id
// @access  Private (Admin)
exports.getBooking = async (req, res, next) => {
  try {
    // Populate items.tourId for full product details
    const booking = await Booking.findById(req.params.id).populate('items.tourId').populate('userId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: `Booking not found with id of ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    console.error('Error getting booking:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// @desc    Update a booking
// @route   PUT /api/v1/bookings/:id
// @access  Private (Admin)
exports.updateBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id).populate('items.tourId').populate('userId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: `Booking not found with id of ${req.params.id}`,
      });
    }

    const {
      items, // Expect array of { tourId, quantity }
      status,
      customerDetails,
      shippingAddress,
      billingAddress,
      totalAmount,
      deliveryFee,
    } = req.body;

    // Update customer details if provided
    if (customerDetails) {
      booking.customerDetails = { ...booking.customerDetails, ...customerDetails };
    }
    if (shippingAddress) {
      booking.shippingAddress = { ...booking.shippingAddress, ...shippingAddress };
    }
    if (billingAddress) {
      booking.billingAddress = { ...booking.billingAddress, ...billingAddress };
    }


    // Update items if provided (e.g., changing quantities)
    if (items && Array.isArray(items)) {
      // You might want more sophisticated logic here (e.g., validating tourIds, recalculating prices)
      booking.items = items;
    }

    // Update status and amounts
    booking.status = status || booking.status;
    booking.totalAmount = totalAmount || booking.totalAmount;
    booking.deliveryFee = deliveryFee || booking.deliveryFee;


    await booking.save();

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    console.error('Error updating booking:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};
