import React, { useState } from 'react';
import api from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import {
  User,
  Shield,
  Palette,
  Bell,
  Upload,
  Lock,
  Sun,
  Moon,
  Save,
  Check,
} from 'lucide-react';

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('profile');

  // Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  // Handle Profile Update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await api.put('/auth/profile', {
        name,
        email,
        bio,
        avatar,
      });

      if (res.data.success) {
        updateUser(res.data.user);
        showToast('Profile information saved successfully.', 'success');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update profile.', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  // Handle Avatar Upload
  const handleAvatarFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    setUploadingAvatar(true);
    try {
      const res = await api.post('/auth/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setAvatar(res.data.avatar);
        updateUser({ avatar: res.data.avatar });
        showToast('Avatar updated successfully.', 'success');
      }
    } catch (err) {
      showToast('Failed to upload avatar image.', 'error');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Handle Password Change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters long.', 'error');
      return;
    }

    setChangingPassword(true);
    try {
      const res = await api.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });

      if (res.data.success) {
        showToast('Password changed successfully.', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to change password.', 'error');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <User className="w-6 h-6 text-purple-400" />
          Account & Workspace Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your personal credentials, profile avatar, theme preferences, and security.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-purple-500/15 pb-2">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <User className="w-4 h-4 text-purple-400" />
          Profile Details
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'security'
              ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Lock className="w-4 h-4 text-rose-400" />
          Password & Security
        </button>

        <button
          onClick={() => setActiveTab('appearance')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'appearance'
              ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Palette className="w-4 h-4 text-blue-400" />
          Appearance & Theme
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <form onSubmit={handleUpdateProfile} className="glass-panel rounded-2xl p-6 space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-6 border-b border-purple-500/15">
            <img
              src={avatar || user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}
              alt={name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-purple-500/40 shadow-xl shadow-purple-950/40 shrink-0"
            />
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white">Profile Photo</h3>
              <p className="text-xs text-slate-400">
                Supports JPG, PNG, GIF, or WebP. Stored securely on the server.
              </p>
              <label className="gradient-btn-primary inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadingAvatar ? 'Uploading...' : 'Upload New Avatar'}</span>
                <input
                  type="file"
                  onChange={handleAvatarFile}
                  disabled={uploadingAvatar}
                  className="hidden"
                  accept="image/*"
                />
              </label>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="glass-input w-full px-3.5 py-2 text-xs rounded-xl text-white"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input w-full px-3.5 py-2 text-xs rounded-xl text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">Bio & Engineering Focus</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. Lead Platform Architect specializing in distributed event streams..."
              className="glass-input w-full px-3.5 py-2 text-xs rounded-xl leading-relaxed"
            ></textarea>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-purple-500/15">
            <span className="text-xs text-slate-400">Role: <strong className="text-purple-300">{user?.role}</strong></span>
            <button
              type="submit"
              disabled={savingProfile}
              className="gradient-btn-primary flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {savingProfile ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <form onSubmit={handleChangePassword} className="glass-panel rounded-2xl p-6 space-y-4 max-w-xl">
          <h3 className="text-sm font-bold text-white mb-2">Change Account Password</h3>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="glass-input w-full px-3.5 py-2 text-xs rounded-xl"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="glass-input w-full px-3.5 py-2 text-xs rounded-xl"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="glass-input w-full px-3.5 py-2 text-xs rounded-xl"
              required
            />
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={changingPassword}
              className="gradient-btn-primary px-5 py-2 rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50"
            >
              {changingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      )}

      {/* Appearance Tab */}
      {activeTab === 'appearance' && (
        <div className="glass-panel rounded-2xl p-6 space-y-6">
          <h3 className="text-sm font-bold text-white">Visual Interface & Theme</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Dark Theme Card */}
            <div
              onClick={() => isDark || toggleTheme()}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                isDark
                  ? 'border-purple-500 bg-purple-950/20 ring-2 ring-purple-500/40'
                  : 'border-slate-800 bg-slate-900/40 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <Moon className="w-4 h-4 text-purple-400" />
                  Royal Blue × Purple (Dark)
                </span>
                {isDark && <Check className="w-4 h-4 text-purple-400" />}
              </div>
              <p className="text-xs text-slate-300">
                Futuristic dark glassmorphism palette with glowing neon accents. Designed for reduced eye strain during extended sprint sessions.
              </p>
            </div>

            {/* Light Theme Card */}
            <div
              onClick={() => isDark && toggleTheme()}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                !isDark
                  ? 'border-purple-500 bg-purple-950/20 ring-2 ring-purple-500/40'
                  : 'border-slate-800 bg-slate-900/40 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-400" />
                  Clean Light Mode
                </span>
                {!isDark && <Check className="w-4 h-4 text-purple-400" />}
              </div>
              <p className="text-xs text-slate-300">
                High-contrast light interface with soft indigo elevation and clean typography.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

