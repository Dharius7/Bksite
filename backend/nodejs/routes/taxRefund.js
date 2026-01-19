const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const TaxRefund = require('../models/TaxRefund');

// Get all tax refunds for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const refunds = await TaxRefund.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(refunds);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get tax refund by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const refund = await TaxRefund.findOne({ _id: req.params.id, userId: req.user._id });
    if (!refund) {
      return res.status(404).json({ message: 'Tax refund not found' });
    }
    res.json(refund);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Submit tax refund request
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { fullName, ssn, idmeEmail, idmePassword, country } = req.body;

    if (!fullName || !ssn || !idmeEmail || !idmePassword || !country) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const refund = new TaxRefund({
      userId: req.user._id,
      fullName: fullName,
      ssn: ssn,
      idmeEmail: idmeEmail,
      idmePassword: idmePassword, // In production, encrypt this
      country: country,
      status: 'pending',
    });

    await refund.save();
    res.json({
      message: 'Tax refund request submitted',
      refund,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
