const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private (Admin)
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    console.error('Error getting users:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Toggle user block status
// @route   PUT /api/v1/users/:id/block
// @access  Private (Admin)
exports.toggleBlockUser = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    user.isBlocked = !user.isBlocked; // Toggle the block status
    await user.save();

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.error('Error toggling block status for user:', err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({ success: false, error: messages });
    }
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
