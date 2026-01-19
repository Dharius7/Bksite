const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  loanType: { type: String, enum: ['personal', 'home', 'auto', 'business', 'salary', 'secured_overdraft', 'health'], required: true },
  amount: { type: Number, required: true },
  interestRate: { type: Number, required: true },
  fee: { type: Number, default: 0 },
  term: { type: Number, required: true }, // in months
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'active', 'paid', 'defaulted'], default: 'pending' },
  monthlyPayment: { type: Number },
  remainingBalance: { type: Number },
  purpose: { type: String },
  documents: [{ type: String }],
  approvedAt: { type: Date },
  disbursedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Loan', loanSchema);
