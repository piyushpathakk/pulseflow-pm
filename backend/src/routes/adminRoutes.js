const express = require('express');
const router = express.Router();
const store = require('../models/store');
const { dbState } = require('../config/db');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

// All routes require Admin role
router.use(protect, authorize('Admin'));

// @route   GET /api/admin/metrics
router.get('/metrics', async (req, res) => {
  try {
    const [userCount, projectCount, taskCount, articleCount, criticalBugs] = await Promise.all([
      store.User.count(),
      store.Project.count(),
      store.Task.count(),
      store.Article.find({}),
      store.Task.find({ type: 'bug' }),
    ]);

    const mem = process.memoryUsage();

    res.json({
      success: true,
      metrics: {
        totalUsers: userCount,
        totalProjects: projectCount,
        totalTasks: taskCount,
        totalArticles: articleCount.length,
        criticalBugsCount: criticalBugs.filter(b => b.severity === 'critical' || b.severity === 'blocker').length,
        databaseMode: dbState.type,
        dbConnected: dbState.connected,
        uptimeSeconds: Math.floor(process.uptime()),
        memoryUsageMB: Math.round(mem.rss / 1024 / 1024),
        nodeVersion: process.version,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch admin metrics.', error: error.message });
  }
});

// @route   GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const users = await store.User.find();
    res.json({
      success: true,
      users: users.map(u => ({
        id: u._id || u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        avatar: u.avatar,
        bio: u.bio,
        createdAt: u.createdAt,
      })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users.', error: error.message });
  }
});

// @route   PUT /api/admin/users/:id/role
router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    const validRoles = ['Admin', 'Manager', 'Developer', 'Viewer'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role.' });
    }

    const updated = await store.User.updateById(req.params.id, { role });
    res.json({
      success: true,
      message: `User role updated to ${role}.`,
      user: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update user role.', error: error.message });
  }
});

// @route   DELETE /api/admin/users/:id
router.delete('/users/:id', async (req, res) => {
  try {
    if (req.params.id === (req.user._id || req.user.id).toString()) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own admin account.' });
    }

    await store.User.deleteById(req.params.id);
    res.json({
      success: true,
      message: 'User removed from system.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete user.', error: error.message });
  }
});

module.exports = router;
