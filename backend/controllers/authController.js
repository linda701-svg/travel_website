const User = require('../models/User');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  try {
    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role
    });

    // Create token
    const token = user.getSignedJwtToken();

    res.status(200).json({ success: true, token, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
    // next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Please provide an email and password' });
  }

  try {
    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Create token
    const token = user.getSignedJwtToken();

    // Ensure token was created
    if (!token) {
        return res.status(500).json({ success: false, error: 'Error creating token. Check backend configuration.' });
    }

    res.status(200).json({ success: true, token, data: user });

  } catch (error) {
      console.error('Login controller error:', error);
      res.status(500).json({ success: false, error: 'Server error during login.' });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  // This would be populated by a middleware
  // const user = await User.findById(req.user.id);
  // res.status(200).json({ success: true, data: user });
  res.status(200).json({ success: true, data: "placeholder for user data" });
};

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Public
exports.logout = async (req, res, next) => {
    // This would typically involve client-side token removal
    res.status(200).json({ success: true, data: {} });
};
