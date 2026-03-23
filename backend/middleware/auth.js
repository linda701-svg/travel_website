const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming User model path

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  }
  // else if (req.cookies.token) {
  //   // Set token from cookie
  //   token = req.cookies.token;
  // }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized to access this route (no token)' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'THIS_IS_A_DEFAULT_SECRET_FOR_DEVELOPMENT_ONLY');

    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Not authorized: User not found' });
    }

    next();
  } catch (err) {
    // Handle JWT errors silently (don't flood logs with old browser session errors)
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, error: 'Session expired or invalid. Please login again.' });
    }
    
    console.error('Unexpected Auth Error:', err);
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: `User role ${req.user ? req.user.role : 'none'} is not authorized to access this route` });
    }
    next();
  };
};
