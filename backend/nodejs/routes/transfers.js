const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const Account = require('../models/Account');

// Create transfer
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { toAccount, amount, description, method } = req.body;
    const numericAmount = Number(amount);

    if (!toAccount || typeof toAccount !== 'string') {
      return res.status(400).json({ message: 'Destination account is required' });
    }
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ message: 'Invalid transfer details' });
    }
    if (method && typeof method !== 'string') {
      return res.status(400).json({ message: 'Invalid transfer method' });
    }

    const fromAccount = await Account.findOne({ userId: req.user._id, isPrimary: true });
    if (!fromAccount) {
      return res.status(404).json({ message: 'Account not found' });
    }

    if (fromAccount.balance < numericAmount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const toAccountDoc = await Account.findOne({ accountNumber: toAccount });
    if (!toAccountDoc) {
      return res.status(404).json({ message: 'Destination account not found' });
    }

    // Create debit transaction
    const debitTransaction = new Transaction({
      userId: req.user._id,
      accountId: fromAccount._id,
      type: 'transfer',
      amount: -numericAmount,
      description: description || `Transfer to ${toAccount}`,
      status: 'completed',
      toAccount: toAccount,
      fromAccount: fromAccount.accountNumber,
      balanceAfter: fromAccount.balance - numericAmount,
      metadata: { method: method || 'wire' },
    });

    // Create credit transaction for recipient
    const creditTransaction = new Transaction({
      userId: toAccountDoc.userId,
      accountId: toAccountDoc._id,
      type: 'transfer',
      amount: numericAmount,
      description: description || `Transfer from ${fromAccount.accountNumber}`,
      status: 'completed',
      fromAccount: fromAccount.accountNumber,
      toAccount: toAccount,
      balanceAfter: toAccountDoc.balance + numericAmount,
      metadata: { method: method || 'wire' },
    });

    // Update balances
    fromAccount.balance -= numericAmount;
    toAccountDoc.balance += numericAmount;

    await Promise.all([
      debitTransaction.save(),
      creditTransaction.save(),
      fromAccount.save(),
      toAccountDoc.save(),
    ]);

    res.json({
      message: 'Transfer successful',
      transaction: debitTransaction,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
