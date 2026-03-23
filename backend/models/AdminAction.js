const mongoose = require('mongoose');

const AdminActionSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    required: true,
    enum: [
      'USER_MANAGEMENT', // e.g., delete user, change role
      'CONTENT_MODERATION', // e.g., delete review, edit destination
      'SYSTEM_CONFIG', // e.g., change pricing rules
    ]
  },
  targetType: {
    type: String, // e.g., 'User', 'Tour', 'Review'
  },
  targetId: {
    type: mongoose.Schema.ObjectId,
  },
  details: { // To store what was changed
    type: mongoose.Schema.Types.Mixed,
  },
}, { timestamps: true });

AdminActionSchema.index({ adminId: 1 });

module.exports = mongoose.model('AdminAction', AdminActionSchema);
