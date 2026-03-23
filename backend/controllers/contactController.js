const Contact = require('../models/Contact');

// @desc    Create a new contact message
// @route   POST /api/v1/contact
// @access  Public
exports.createContactMessage = async (req, res, next) => {
  try {
    const { fname, lname, phone, email, message } = req.body;

    if (!fname || !email || !message) {
      return res.status(400).json({ success: false, error: 'Please provide first name, email, and message' });
    }

    const contactMessage = await Contact.create({
      firstName: fname,
      lastName: lname,
      phone,
      email,
      message,
    });

    res.status(201).json({
      success: true,
      data: contactMessage,
    });
  } catch (err) {
    console.error('Contact message creation error:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// @desc    Get all contact messages
// @route   GET /api/v1/contact
// @access  Private (Admin)
exports.getContactMessages = async (req, res, next) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (err) {
    console.error('Error fetching contact messages:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};
