const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const store = require('../models/store');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'pulseflow_jwt_super_secure_secret_key_2026_industry_level_pm_saas', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    const existingUser = await store.User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Initial role selection or fallback
    const validRoles = ['Admin', 'Manager', 'Developer', 'Viewer'];
    const assignedRole = validRoles.includes(role) ? role : 'Developer';

    const user = await store.User.create({
      name,
      email,
      password: hashedPassword,
      role: assignedRole,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
      bio: 'Ready to build high-impact software.',
      settings: {
        theme: 'dark',
        emailNotifications: true,
        desktopNotifications: true,
      },
    });

    const token = generateToken(user._id || user.id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        settings: user.settings,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration.', error: error.message });
  }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }

    const user = await store.User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user._id || user.id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        settings: user.settings,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login.', error: error.message });
  }
});

// @route   GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  const user = req.user;
  res.json({
    success: true,
    user: {
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
      settings: user.settings,
    },
  });
});

// @route   PUT /api/auth/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, bio, settings, avatar, email } = req.body;
    const userId = req.user._id || req.user.id;

    const updateData = {};
    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (settings) updateData.settings = { ...req.user.settings, ...settings };
    if (avatar) updateData.avatar = avatar;

    if (email && email.toLowerCase() !== req.user.email.toLowerCase()) {
      const existing = await store.User.findOne({ email });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Email address is already in use by another account.' });
      }
      updateData.email = email.toLowerCase();
    }

    const updatedUser = await store.User.updateById(userId, updateData);

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: updatedUser._id || updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
        settings: updatedUser.settings,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update profile.', error: error.message });
  }
});

// @route   PUT /api/auth/change-password
router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide both current and new password.' });
    }

    const user = await store.User.findById(req.user._id || req.user.id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password does not match.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await store.User.updateById(user._id || user.id, { password: hashedPassword });

    res.json({
      success: true,
      message: 'Password changed successfully.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to change password.', error: error.message });
  }
});

// @route   POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email address.' });
    }

    const user = await store.User.findOne({ email });
    if (!user) {
      // Return success to avoid email enumeration
      return res.json({
        success: true,
        message: 'If that email is registered, password reset instructions have been generated.',
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpire = Date.now() + 60 * 60 * 1000; // 1 hour

    await store.User.updateById(user._id || user.id, {
      resetPasswordToken: resetToken,
      resetPasswordExpire: resetTokenExpire,
    });

    res.json({
      success: true,
      message: 'Password reset link generated.',
      // Providing resetToken for frictionless testing/demo
      resetToken,
      resetUrl: `/reset-password?token=${resetToken}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate reset token.', error: error.message });
  }
});

// @route   POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide reset token and new password.' });
    }

    const user = await store.User.findOne({ resetPasswordToken: token });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired password reset token.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await store.User.updateById(user._id || user.id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpire: null,
    });

    res.json({
      success: true,
      message: 'Password has been reset successfully. You can now login with your new password.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to reset password.', error: error.message });
  }
});

// @route   POST /api/auth/avatar
router.post('/avatar', protect, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded.' });
    }

    const avatarUrl = `/uploads/${req.file.filename}`;
    const updatedUser = await store.User.updateById(req.user._id || req.user.id, { avatar: avatarUrl });

    res.json({
      success: true,
      message: 'Avatar uploaded successfully.',
      avatar: avatarUrl,
      user: {
        id: updatedUser._id || updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to upload avatar.', error: error.message });
  }
});

// @route   GET /api/auth/users
router.get('/users', protect, async (req, res) => {
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
      })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users.', error: error.message });
  }
});

module.exports = router;
