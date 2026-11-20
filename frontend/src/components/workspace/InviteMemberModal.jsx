import React, { useState, useEffect } from 'react';
import api from '../../api/axiosClient';
import { useToast } from '../../context/ToastContext';
import { X, UserPlus, Users } from 'lucide-react';

export default function InviteMemberModal({ isOpen, onClose, projectId, onMemberAdded }) {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Developer');
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const fetchUsers = async () => {
      try {
        const res = await api.get('/auth/users');
        if (res.data.success) {
          setAvailableUsers(res.data.users || []);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email && !selectedUserId) {
      showToast('Please enter an email or select a team member.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post(`/projects/${projectId}/members`, {
        email: email || undefined,
        userId: selectedUserId || undefined,
        role,
      });

      if (res.data.success) {
        showToast('Collaborator added to project.', 'success');
        onMemberAdded(res.data.project);
        onClose();
        setEmail('');
        setSelectedUserId('');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add collaborator.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-2xl border border-purple-500/25 bg-[#0B1020] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-purple-500/15">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-purple-400" />
            Invite Project Collaborator
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Quick select existing user */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">Pick from Organization</label>
            <select
              value={selectedUserId}
              onChange={(e) => {
                setSelectedUserId(e.target.value);
                setEmail('');
              }}
              className="glass-input w-full px-3 py-2 text-xs rounded-xl cursor-pointer"
            >
              <option value="">Select Team Member</option>
              {availableUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.email}) — {u.role}
                </option>
              ))}
            </select>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-purple-500/15"></div>
            <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-slate-400">or invite by email</span>
            <div className="flex-grow border-t border-purple-500/15"></div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">Collaborator Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setSelectedUserId('');
              }}
              placeholder="e.g. dev@company.com"
              className="glass-input w-full px-3.5 py-2 text-xs rounded-xl"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">Role & Permissions</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="glass-input w-full px-3 py-2 text-xs rounded-xl cursor-pointer"
            >
              <option value="Admin">Admin (Full project configuration & delete)</option>
              <option value="Manager">Manager (Edit sprints, assign, manage members)</option>
              <option value="Developer">Developer (Create tickets, update status, comment)</option>
              <option value="Viewer">Viewer (Read-only access to board & metrics)</option>
            </select>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="gradient-btn-primary px-5 py-2 text-xs font-semibold rounded-xl cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Adding...' : 'Add to Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
