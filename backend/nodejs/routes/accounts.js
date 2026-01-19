const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Account = require('../models/Account');

// Get user's accounts
router.get('/', authMiddleware, async (req, res) => {
  try {
    const accounts = await Account.find({ userId: req.user._id });
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get account by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const account = await Account.findOne({ _id: req.params.id, userId: req.user._id });
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }
    res.json(account);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
