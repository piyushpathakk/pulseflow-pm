const express = require('express');
const router = express.Router();
const store = require('../models/store');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { emitToProject, emitToUser } = require('../socket/socketHandler');

// @route   GET /api/tasks
router.get('/', protect, async (req, res) => {
  try {
    const { projectId, status, type, priority, severity, assigneeId, search } = req.query;

    const filter = {};
    if (projectId) filter.projectId = projectId;
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (priority) filter.priority = priority;
    if (assigneeId) filter.assigneeId = assigneeId;

    let tasks = await store.Task.find(filter);

    // If severity is requested (bug tracking)
    if (severity) {
      tasks = tasks.filter(t => t.severity === severity);
    }

    // Text search in title or description or key
    if (search) {
      const q = search.toLowerCase();
      tasks = tasks.filter(t =>
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        t.key.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch tasks.', error: error.message });
  }
});

// @route   POST /api/tasks
router.post('/', protect, async (req, res) => {
  try {
    const {
      projectId,
      title,
      description,
      type,
      priority,
      severity,
      status,
      assigneeId,
      deadline,
      tags,
    } = req.body;

    if (!projectId || !title) {
      return res.status(400).json({ success: false, message: 'Project ID and task title are required.' });
    }

    const project = await store.Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Target project not found.' });
    }

    // Count existing tasks in this project to generate incremental key (e.g. CORE-101)
    const existingTasks = await store.Task.find({ projectId });
    const nextNum = existingTasks.length + 101;
    const taskKey = `${project.key}-${nextNum}`;

    const userId = req.user._id || req.user.id;

    const task = await store.Task.create({
      key: taskKey,
      title,
      description: description || '',
      type: type || 'task',
      status: status || 'todo',
      priority: priority || 'medium',
      severity: severity || 'minor',
      projectId,
      project: projectId,
      assigneeId: assigneeId || null,
      assignee: assigneeId || null,
      reporterId: userId,
      reporter: userId,
      deadline: deadline || null,
      tags: tags || [],
      attachments: [],
      orderIndex: existingTasks.length,
    });

    // Record audit activity
    await store.Activity.create({
      projectId,
      project: projectId,
      taskId: task._id || task.id,
      task: task._id || task.id,
      userId,
      user: userId,
      action: type === 'bug' ? 'REPORTED_BUG' : 'CREATED_TASK',
      details: `${req.user.name} logged [${taskKey}]: "${title}".`,
    });

    // Notify assignee if someone else was assigned
    if (assigneeId && assigneeId !== userId) {
      await store.Notification.create({
        recipient: assigneeId,
        recipientId: assigneeId,
        sender: userId,
        senderId: userId,
        type: 'assignment',
        title: type === 'bug' ? 'Bug Assigned to You' : 'Task Assigned to You',
        message: `${req.user.name} assigned you to [${taskKey}]: ${title}`,
        link: `/projects/${projectId}?task=${task._id || task.id}`,
      });

      emitToUser(assigneeId, 'new_notification', {
        title: 'New Assignment',
        message: `Assigned to [${taskKey}]: ${title}`,
      });
    }

    // Real-time broadcast to project board
    emitToProject(projectId, 'task_created', task);

    res.status(201).json({
      success: true,
      message: `${type === 'bug' ? 'Bug report' : 'Task'} created successfully.`,
      task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create task.', error: error.message });
  }
});

// @route   GET /api/tasks/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const task = await store.Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task/Bug ticket not found.' });
    }

    const comments = await store.Comment.findByTaskId(req.params.id);

    res.json({
      success: true,
      task,
      comments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch task details.', error: error.message });
  }
});

// @route   PUT /api/tasks/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const task = await store.Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    const userId = req.user._id || req.user.id;
    const oldAssigneeId = task.assigneeId || (task.assignee?._id || task.assignee?.id);
    const updated = await store.Task.updateById(req.params.id, req.body);

    // If assignee changed, notify new assignee
    if (req.body.assigneeId && req.body.assigneeId !== oldAssigneeId && req.body.assigneeId !== userId) {
      await store.Notification.create({
        recipient: req.body.assigneeId,
        recipientId: req.body.assigneeId,
        sender: userId,
        senderId: userId,
        type: 'assignment',
        title: 'Assigned to Ticket',
        message: `${req.user.name} reassigned [${task.key}] to you.`,
        link: `/projects/${task.projectId || task.project?._id || task.project?.id}?task=${task._id || task.id}`,
      });

      emitToUser(req.body.assigneeId, 'new_notification', {
        title: 'New Assignment',
        message: `Assigned to [${task.key}]`,
      });
    }

    // Broadcast update to project room
    const pId = task.projectId || (task.project?._id || task.project?.id);
    emitToProject(pId, 'task_updated', updated);

    res.json({
      success: true,
      message: 'Task updated successfully.',
      task: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update task.', error: error.message });
  }
});

// @route   PUT /api/tasks/:id/status (Kanban drag-and-drop instant status sync)
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status, orderIndex } = req.body;
    const validStatuses = ['todo', 'in-progress', 'in-review', 'done'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const task = await store.Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    const oldStatus = task.status;
    const updateData = { status };
    if (orderIndex !== undefined) updateData.orderIndex = orderIndex;

    const updated = await store.Task.updateById(req.params.id, updateData);
    const pId = task.projectId || (task.project?._id || task.project?.id);
    const userId = req.user._id || req.user.id;

    // Log activity if status actually shifted
    if (oldStatus !== status) {
      await store.Activity.create({
        projectId: pId,
        project: pId,
        taskId: task._id || task.id,
        task: task._id || task.id,
        userId,
        user: userId,
        action: 'STATUS_CHANGED',
        details: `${req.user.name} moved [${task.key}] from "${oldStatus}" to "${status}".`,
      });

      // Notify assignee if moved by someone else
      const assigneeId = task.assigneeId || (task.assignee?._id || task.assignee?.id);
      if (assigneeId && assigneeId.toString() !== userId.toString()) {
        await store.Notification.create({
          recipient: assigneeId,
          recipientId: assigneeId,
          sender: userId,
          senderId: userId,
          type: 'status_change',
          title: 'Ticket Status Updated',
          message: `${req.user.name} updated [${task.key}] to "${status.toUpperCase()}".`,
          link: `/projects/${pId}?task=${task._id || task.id}`,
        });
      }
    }

    // Broadcast drag event to other users viewing this board
    emitToProject(pId, 'board_task_moved', {
      taskId: task._id || task.id,
      status,
      orderIndex,
      updatedBy: req.user.name,
    });

    res.json({
      success: true,
      message: 'Status updated.',
      task: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update task status.', error: error.message });
  }
});

// @route   POST /api/tasks/:id/attachments (Upload bug screenshots, logs, files)
router.post('/:id/attachments', protect, upload.single('attachment'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file was uploaded.' });
    }

    const task = await store.Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    const newAttachment = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      url: `/uploads/${req.file.filename}`,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadedAt: new Date().toISOString(),
    };

    const currentAttachments = task.attachments || [];
    currentAttachments.push(newAttachment);

    const updated = await store.Task.updateById(req.params.id, { attachments: currentAttachments });

    // Activity log
    const pId = task.projectId || (task.project?._id || task.project?.id);
    await store.Activity.create({
      projectId: pId,
      project: pId,
      taskId: task._id || task.id,
      task: task._id || task.id,
      userId: req.user._id || req.user.id,
      user: req.user._id || req.user.id,
      action: 'ATTACHMENT_ADDED',
      details: `${req.user.name} attached file "${req.file.originalname}" to [${task.key}].`,
    });

    res.status(201).json({
      success: true,
      message: 'Attachment uploaded successfully.',
      attachment: newAttachment,
      task: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to upload attachment.', error: error.message });
  }
});

// @route   DELETE /api/tasks/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const task = await store.Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    const pId = task.projectId || (task.project?._id || task.project?.id);
    await store.Task.deleteById(req.params.id);

    // Broadcast deletion
    emitToProject(pId, 'task_deleted', { taskId: req.params.id });

    res.json({
      success: true,
      message: `Task [${task.key}] deleted successfully.`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete task.', error: error.message });
  }
});

module.exports = router;
