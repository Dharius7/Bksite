const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Grant = require('../models/Grant');

// Get all grants for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const grants = await Grant.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(grants);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get grant by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const grant = await Grant.findOne({ _id: req.params.id, userId: req.user._id });
    if (!grant) {
      return res.status(404).json({ message: 'Grant not found' });
    }
    res.json(grant);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Submit grant application
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { applicationType, organizationName, ein, fullName, email, phone, purpose, amount, documents } = req.body;

    if (!applicationType || !['individual', 'company'].includes(applicationType)) {
      return res.status(400).json({ message: 'Invalid application type' });
    }

    if (applicationType === 'company' && (!organizationName || !ein)) {
      return res.status(400).json({ message: 'Organization name and EIN are required for company applications' });
    }

    if (!fullName || !email || !phone || !purpose || !amount) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const grant = new Grant({
      userId: req.user._id,
      applicationType: applicationType,
      organizationName: organizationName,
      ein: ein,
      fullName: fullName,
      email: email,
      phone: phone,
      purpose: purpose,
      amount: amount,
      documents: documents || [],
      status: 'pending',
    });

    await grant.save();
    res.json({
      message: 'Grant application submitted',
      grant,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
