const express = require('express');
const router = express.Router();
const store = require('../models/store');
const { protect } = require('../middleware/auth');

// @route   GET /api/notifications
router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const notifications = await store.Notification.findByRecipient(userId, 40);
    const unreadCount = await store.Notification.getUnreadCount(userId);

    res.json({
      success: true,
      unreadCount,
      notifications,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch notifications.', error: error.message });
  }
});

// @route   PUT /api/notifications/:id/read
router.put('/:id/read', protect, async (req, res) => {
  try {
    await store.Notification.markAsRead(req.params.id);
    const userId = req.user._id || req.user.id;
    const unreadCount = await store.Notification.getUnreadCount(userId);

    res.json({
      success: true,
      message: 'Marked notification as read.',
      unreadCount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update notification.', error: error.message });
  }
});

// @route   PUT /api/notifications/read-all
router.put('/read-all', protect, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    await store.Notification.markAllAsRead(userId);

    res.json({
      success: true,
      message: 'All notifications marked as read.',
      unreadCount: 0,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to mark all as read.', error: error.message });
  }
});

module.exports = router;
