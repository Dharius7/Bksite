const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const Account = require('../models/Account');

// Create deposit
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { amount, method, currency = 'USD' } = req.body;
    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ message: 'Invalid deposit amount' });
    }
    if (!method || typeof method !== 'string') {
      return res.status(400).json({ message: 'Deposit method is required' });
    }

    const account = await Account.findOne({ userId: req.user._id, isPrimary: true });
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // Create pending transaction (do not update balance here)
    const transaction = new Transaction({
      userId: req.user._id,
      accountId: account._id,
      type: 'deposit',
      amount: numericAmount,
      currency: String(currency || 'USD').toUpperCase(),
      description: `Deposit via ${method || 'bank transfer'}`,
      status: 'pending',
      balanceAfter: account.balance,
      metadata: { method: method || 'bitcoin' },
    });

    await transaction.save();

    res.json({
      message: 'Deposit initiated',
      transaction,
      depositId: transaction._id,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
