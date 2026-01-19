const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  cardNumber: { type: String, required: true, unique: true },
  cardType: { type: String, enum: ['virtual', 'physical'], required: true },
  cardName: { type: String, required: true },
  expiryDate: { type: String, required: true },
  cvv: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive', 'blocked', 'expired', 'pending'], default: 'pending' },
  spendingLimit: { type: Number, default: 0 },
  dailyLimit: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Card', cardSchema);
