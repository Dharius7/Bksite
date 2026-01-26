const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Loan = require('../models/Loan');

// Loan types with rates
const LOAN_TYPES = {
  personal_home: { rate: 8.5, fee: 1.5, maxTerm: 240 },
  automobile: { rate: 7.5, fee: 1.0, maxTerm: 72 },
  business: { rate: 12.0, fee: 2.0, maxTerm: 60 },
  salary: { rate: 15.0, fee: 0.5, maxTerm: 12 },
  secured_overdraft: { rate: 10.0, fee: 0.8, maxTerm: 36 },
  health: { rate: 6.0, fee: 0.5, maxTerm: 24 },
};

// Get all loans for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const loans = await Loan.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get loan types and rates
router.get('/types/list', authMiddleware, async (req, res) => {
  try {
    res.json(LOAN_TYPES);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get loan by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const loan = await Loan.findOne({ _id: req.params.id, userId: req.user._id });
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }
    res.json(loan);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Apply for loan
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { loanType, amount, term, purpose, documents } = req.body;

    if (!loanType || !amount || !term || !LOAN_TYPES[loanType]) {
      return res.status(400).json({ message: 'Invalid loan application' });
    }

    const loanInfo = LOAN_TYPES[loanType];

    // Calculate monthly payment
    const monthlyRate = loanInfo.rate / 100 / 12;
    const monthlyPayment =
      (amount * monthlyRate * Math.pow(1 + monthlyRate, term)) /
      (Math.pow(1 + monthlyRate, term) - 1);

    const loan = new Loan({
      userId: req.user._id,
      loanType: loanType,
      amount: amount,
      interestRate: loanInfo.rate,
      fee: (amount * loanInfo.fee) / 100,
      term: term,
      monthlyPayment: monthlyPayment,
      remainingBalance: amount + (amount * loanInfo.fee) / 100,
      purpose: purpose,
      documents: documents || [],
      status: 'pending',
    });

    await loan.save();
    res.json({
      message: 'Loan application submitted',
      loan,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
