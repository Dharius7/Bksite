const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  type: { type: String, enum: ['credit', 'debit', 'transfer', 'deposit', 'withdrawal', 'currency_swap', 'received'], required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  description: { type: String },
  status: { type: String, enum: ['pending', 'completed', 'failed', 'cancelled'], default: 'pending' },
  reference: { type: String, unique: true },
  fromAccount: { type: String },
  toAccount: { type: String },
  fee: { type: Number, default: 0 },
  balanceAfter: { type: Number },
  metadata: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
});

// Generate reference before saving
transactionSchema.pre('save', async function (next) {
  if (!this.reference) {
    this.reference = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema);
