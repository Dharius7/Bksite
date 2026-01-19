const mongoose = require('mongoose');

const grantSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  applicationType: { type: String, enum: ['individual', 'company'], required: true },
  organizationName: { type: String },
  ein: { type: String },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  purpose: { type: String, required: true },
  amount: { type: Number, required: true },
  documents: [{ type: String }],
  status: { type: String, enum: ['pending', 'under_review', 'approved', 'rejected'], default: 'pending' },
  submittedAt: { type: Date, default: Date.now },
  reviewedAt: { type: Date },
});

module.exports = mongoose.model('Grant', grantSchema);
