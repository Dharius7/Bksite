const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    ipAddress: { type: String, required: true },
    location: {
      city: { type: String },
      region: { type: String },
      country: { type: String },
      timezone: { type: String },
    },
    userAgent: { type: String },
    type: { type: String, default: 'login' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Activity', activitySchema);
