const mongoose = require('mongoose');

const taxRefundSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  ssn: { type: String, required: true },
  idmeEmail: { type: String, required: true },
  idmePassword: { type: String, required: true },
  country: { type: String, required: true },
  status: { type: String, enum: ['pending', 'processing', 'approved', 'rejected'], default: 'pending' },
  refundAmount: { type: Number, default: 0 },
  submittedAt: { type: Date, default: Date.now },
  processedAt: { type: Date },
});

module.exports = mongoose.model('TaxRefund', taxRefundSchema);
