const express = require('express');
const router = express.Router();
const store = require('../models/store');
const { protect } = require('../middleware/auth');
const { emitToProject, emitToUser } = require('../socket/socketHandler');

// @route   GET /api/comments/:taskId
router.get('/:taskId', protect, async (req, res) => {
  try {
    const comments = await store.Comment.findByTaskId(req.params.taskId);
    res.json({
      success: true,
      count: comments.length,
      comments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch comments.', error: error.message });
  }
});

// @route   POST /api/comments
router.post('/', protect, async (req, res) => {
  try {
    const { taskId, text, attachments } = req.body;

    if (!taskId || !text) {
      return res.status(400).json({ success: false, message: 'Task ID and comment text are required.' });
    }

    const task = await store.Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Associated task not found.' });
    }

    const userId = req.user._id || req.user.id;

    const comment = await store.Comment.create({
      taskId,
      task: taskId,
      userId,
      user: userId,
      text,
      attachments: attachments || [],
    });

    // Record activity
    const pId = task.projectId || (task.project?._id || task.project?.id);
    await store.Activity.create({
      projectId: pId,
      project: pId,
      taskId,
      task: taskId,
      userId,
      user: userId,
      action: 'COMMENT_ADDED',
      details: `${req.user.name} commented on [${task.key}]: "${text.substring(0, 60)}${text.length > 60 ? '...' : ''}"`,
    });

    // Notify assignee and reporter if they are different from comment author
    const reporterId = (task.reporterId || task.reporter?._id || task.reporter?.id || '').toString();
    const assigneeId = (task.assigneeId || task.assignee?._id || task.assignee?.id || '').toString();

    const recipients = new Set();
    if (reporterId && reporterId !== userId.toString()) recipients.add(reporterId);
    if (assigneeId && assigneeId !== userId.toString()) recipients.add(assigneeId);

    for (const recipientId of recipients) {
      await store.Notification.create({
        recipient: recipientId,
        recipientId,
        sender: userId,
        senderId: userId,
        type: 'comment',
        title: 'New Comment on Ticket',
        message: `${req.user.name} commented on [${task.key}].`,
        link: `/projects/${pId}?task=${taskId}`,
      });

      emitToUser(recipientId, 'new_notification', {
        title: 'New Comment',
        message: `${req.user.name} commented on [${task.key}]`,
      });
    }

    // Live broadcast to project room
    emitToProject(pId, 'comment_added', { taskId, comment });

    res.status(201).json({
      success: true,
      message: 'Comment posted successfully.',
      comment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to post comment.', error: error.message });
  }
});

// @route   DELETE /api/comments/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    await store.Comment.deleteById(req.params.id);
    res.json({
      success: true,
      message: 'Comment removed.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete comment.', error: error.message });
  }
});

module.exports = router;
