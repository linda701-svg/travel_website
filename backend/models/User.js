const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  phone: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },

  isBlocked: {
    type: Boolean,
    default: false,
  },
  preferences: {
    destinationType: [String],
    interests: [String],
    budget: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  const secret = process.env.JWT_SECRET;
  const expire = process.env.JWT_EXPIRE || '30d';

  // if (!secret) {
  //   console.warn(
  //     '\n****************************************************************\n' +
  //     '** WARNING: JWT_SECRET is not set in your environment.        **\n' +
  //     '** Using a default, insecure secret for development only.     **\n' +
  //     '** Please create a .env file with a secure JWT_SECRET.        **\n' +
  //     '****************************************************************\n'
  //   );
  // }

  const tempSecret = secret || 'THIS_IS_A_DEFAULT_SECRET_FOR_DEVELOPMENT_ONLY';

  return jwt.sign({ id: this._id }, tempSecret, {
    expiresIn: expire,
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
