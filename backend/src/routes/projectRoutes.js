const express = require('express');
const router = express.Router();
const store = require('../models/store');
const { protect } = require('../middleware/auth');
const { emitToProject, emitToUser } = require('../socket/socketHandler');

// @route   GET /api/projects
router.get('/', protect, async (req, res) => {
  try {
    const projects = await store.Project.find();

    // Enrich each project with live task counts & progress
    const enriched = await Promise.all(projects.map(async (p) => {
      const pId = p._id || p.id;
      const tasks = await store.Task.find({ projectId: pId });
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(t => t.status === 'done').length;
      const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
      const bugCount = tasks.filter(t => t.type === 'bug' && t.status !== 'done').length;
      const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      return {
        ...p,
        totalTasks,
        completedTasks,
        inProgressTasks,
        bugCount,
        progressPercent,
      };
    }));

    res.json({
      success: true,
      projects: enriched,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch projects.', error: error.message });
  }
});

// @route   POST /api/projects
router.post('/', protect, async (req, res) => {
  try {
    const { name, key, description, status, priority, deadline, tags } = req.body;

    if (!name || !key) {
      return res.status(400).json({ success: false, message: 'Project name and unique key (e.g. CORE, PLS) are required.' });
    }

    const userId = req.user._id || req.user.id;
    const formattedKey = key.toUpperCase().trim();

    // Check if key exists
    const all = await store.Project.find();
    if (all.some(p => p.key === formattedKey)) {
      return res.status(400).json({ success: false, message: `Project key '${formattedKey}' is already taken.` });
    }

    const project = await store.Project.create({
      name,
      key: formattedKey,
      description: description || '',
      status: status || 'Active',
      priority: priority || 'Medium',
      deadline: deadline || null,
      owner: userId,
      ownerId: userId,
      members: [
        { user: userId, userId, role: 'Admin', joinedAt: new Date().toISOString() },
      ],
      tags: tags || ['Core', 'Sprint-1'],
    });

    // Record activity
    await store.Activity.create({
      project: project._id || project.id,
      projectId: project._id || project.id,
      user: userId,
      userId,
      action: 'PROJECT_CREATED',
      details: `Project "${name}" [${formattedKey}] was initialized by ${req.user.name}.`,
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully.',
      project,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create project.', error: error.message });
  }
});

// @route   GET /api/projects/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const project = await store.Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    const tasks = await store.Task.find({ projectId: project._id || project.id });
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
    const openBugs = tasks.filter(t => t.type === 'bug' && t.status !== 'done').length;
    const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.json({
      success: true,
      project: {
        ...project,
        totalTasks,
        completedTasks,
        inProgressTasks,
        openBugs,
        progressPercent,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch project details.', error: error.message });
  }
});

// @route   PUT /api/projects/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const project = await store.Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    // Role check: Only Admin, Manager, or Project Owner can update
    const userId = (req.user._id || req.user.id).toString();
    const isOwner = project.owner && (project.owner._id || project.owner.id || project.ownerId || '').toString() === userId;
    const isMemberManager = project.members && project.members.some(m => {
      const mId = (m.user?._id || m.user?.id || m.userId || '').toString();
      return mId === userId && (m.role === 'Admin' || m.role === 'Manager');
    });

    if (req.user.role !== 'Admin' && !isOwner && !isMemberManager) {
      return res.status(403).json({ success: false, message: 'Forbidden: Insufficient privileges to update project settings.' });
    }

    const updated = await store.Project.updateById(req.params.id, req.body);

    // Audit log
    await store.Activity.create({
      project: project._id || project.id,
      projectId: project._id || project.id,
      user: userId,
      userId,
      action: 'PROJECT_UPDATED',
      details: `${req.user.name} updated project metadata.`,
    });

    res.json({
      success: true,
      message: 'Project updated successfully.',
      project: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update project.', error: error.message });
  }
});

// @route   DELETE /api/projects/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const project = await store.Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    const userId = (req.user._id || req.user.id).toString();
    const isOwner = project.owner && (project.owner._id || project.owner.id || project.ownerId || '').toString() === userId;

    if (req.user.role !== 'Admin' && !isOwner) {
      return res.status(403).json({ success: false, message: 'Forbidden: Only an Admin or Project Owner can delete this project.' });
    }

    await store.Project.deleteById(req.params.id);

    res.json({
      success: true,
      message: `Project "${project.name}" and all related tickets deleted successfully.`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete project.', error: error.message });
  }
});

// @route   POST /api/projects/:id/members
router.post('/:id/members', protect, async (req, res) => {
  try {
    const { email, userId, role } = req.body;
    const project = await store.Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    let targetUser = null;
    if (email) {
      targetUser = await store.User.findOne({ email });
    } else if (userId) {
      targetUser = await store.User.findById(userId);
    }

    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found with the provided email or ID.' });
    }

    const targetUserId = (targetUser._id || targetUser.id).toString();
    const currentMembers = project.members || [];

    // Check if already in project
    const alreadyMember = currentMembers.some(m => {
      const mId = (m.user?._id || m.user?.id || m.userId || '').toString();
      return mId === targetUserId;
    });

    if (alreadyMember) {
      return res.status(400).json({ success: false, message: 'User is already a collaborator on this project.' });
    }

    const newMemberEntry = {
      userId: targetUserId,
      user: targetUserId,
      role: role || 'Developer',
      joinedAt: new Date().toISOString(),
    };

    const updatedMembers = [...currentMembers.map(m => ({
      userId: m.user?._id || m.user?.id || m.userId,
      role: m.role,
      joinedAt: m.joinedAt,
    })), newMemberEntry];

    const updated = await store.Project.updateById(req.params.id, { members: updatedMembers });

    // Send notification to invited user
    await store.Notification.create({
      recipient: targetUserId,
      recipientId: targetUserId,
      sender: req.user._id || req.user.id,
      senderId: req.user._id || req.user.id,
      type: 'invite',
      title: 'Project Invitation',
      message: `${req.user.name} added you to "${project.name}" as ${role || 'Developer'}.`,
      link: `/projects/${project._id || project.id}`,
    });

    emitToUser(targetUserId, 'new_notification', {
      type: 'invite',
      message: `You were invited to project "${project.name}"`,
    });

    res.json({
      success: true,
      message: `User ${targetUser.name} added to project as ${role || 'Developer'}.`,
      project: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add project member.', error: error.message });
  }
});

// @route   DELETE /api/projects/:id/members/:userId
router.delete('/:id/members/:userId', protect, async (req, res) => {
  try {
    const project = await store.Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    const targetUserId = req.params.userId;
    const updatedMembers = (project.members || [])
      .filter(m => (m.user?._id || m.user?.id || m.userId || '').toString() !== targetUserId)
      .map(m => ({
        userId: m.user?._id || m.user?.id || m.userId,
        role: m.role,
        joinedAt: m.joinedAt,
      }));

    const updated = await store.Project.updateById(req.params.id, { members: updatedMembers });

    res.json({
      success: true,
      message: 'Member removed from project successfully.',
      project: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to remove member.', error: error.message });
  }
});

module.exports = router;
