const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Investment = require('../models/Investment');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');

// Get all investments for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const investments = await Investment.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(investments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get investment by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const investment = await Investment.findOne({ _id: req.params.id, userId: req.user._id });
    if (!investment) {
      return res.status(404).json({ message: 'Investment not found' });
    }
    res.json(investment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get investment wallet balance
router.get('/wallet/balance', authMiddleware, async (req, res) => {
  try {
    const investments = await Investment.find({ userId: req.user._id });
    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const totalEarnings = investments.reduce((sum, inv) => sum + inv.totalEarnings, 0);
    const activeInvestments = investments.filter((inv) => inv.status === 'active').length;

    res.json({
      totalInvested,
      totalEarnings,
      activeInvestments,
      balance: totalInvested + totalEarnings,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Deposit to investment wallet
router.post('/deposit', authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid deposit amount' });
    }

    const account = await Account.findOne({ userId: req.user._id, isPrimary: true });
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    if (account.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Create transaction
    const transaction = new Transaction({
      userId: req.user._id,
      accountId: account._id,
      type: 'debit',
      amount: -amount,
      description: 'Deposit to investment wallet',
      status: 'completed',
      balanceAfter: account.balance - amount,
      metadata: { type: 'investment_deposit' },
    });

    account.balance -= amount;

    await Promise.all([transaction.save(), account.save()]);

    res.json({
      message: 'Deposit successful',
      transaction,
      newBalance: account.balance,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create investment
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { planName, amount, returnRate, duration } = req.body;

    if (!planName || !amount || !returnRate || !duration) {
      return res.status(400).json({ message: 'Invalid investment details' });
    }

    const startDate = new Date();
    const maturityDate = new Date();
    maturityDate.setMonth(maturityDate.getMonth() + duration);

    const investment = new Investment({
      userId: req.user._id,
      planName: planName,
      amount: amount,
      returnRate: returnRate,
      duration: duration,
      status: 'active',
      startDate: startDate,
      maturityDate: maturityDate,
    });

    await investment.save();
    res.json({
      message: 'Investment created successfully',
      investment,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
