const express = require('express');
const router = express.Router();
const store = require('../models/store');
const { protect } = require('../middleware/auth');

// @route   GET /api/activities
router.get('/', protect, async (req, res) => {
  try {
    const { projectId, limit } = req.query;
    const filter = {};
    if (projectId) filter.projectId = projectId;

    const activities = await store.Activity.find(filter, parseInt(limit) || 25);

    res.json({
      success: true,
      count: activities.length,
      activities,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch activities.', error: error.message });
  }
});

module.exports = router;
