const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  planName: { type: String, required: true },
  amount: { type: Number, required: true },
  returnRate: { type: Number, required: true },
  duration: { type: Number, required: true }, // in months
  status: { type: String, enum: ['active', 'matured', 'cancelled', 'pending'], default: 'pending' },
  totalEarnings: { type: Number, default: 0 },
  startDate: { type: Date },
  maturityDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Investment', investmentSchema);
