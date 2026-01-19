const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  accountNumber: { type: String, required: true, unique: true },
  accountType: { type: String, enum: ['checking', 'savings', 'high-yield'], required: true },
  balance: { type: Number, default: 0 },
  currency: { type: String, default: 'USD' },
  bitcoinBalance: { type: Number, default: 0 },
  isPrimary: { type: Boolean, default: true },
  status: { type: String, enum: ['active', 'closed', 'frozen'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Account', accountSchema);
