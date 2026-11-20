import React, { useState, useEffect } from 'react';
import api from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  X,
  Bug,
  Sparkles,
  CheckSquare,
  Zap,
  Calendar,
  User,
  Paperclip,
  Send,
  Trash2,
  Upload,
  AlertCircle,
  FileText,
  ExternalLink,
} from 'lucide-react';

export default function TaskModal({ task, onClose, onTaskUpdated, onTaskDeleted, teamMembers = [] }) {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [status, setStatus] = useState(task?.status || 'todo');
  const [type, setType] = useState(task?.type || 'task');
  const [priority, setPriority] = useState(task?.priority || 'medium');
  const [severity, setSeverity] = useState(task?.severity || 'minor');
  const [assigneeId, setAssigneeId] = useState(task?.assigneeId || (task?.assignee?._id || task?.assignee?.id) || '');
  const [deadline, setDeadline] = useState(task?.deadline ? task.deadline.split('T')[0] : '');

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [attachments, setAttachments] = useState(task?.attachments || []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const taskId = task?._id || task?.id;

  // Load comments
  useEffect(() => {
    if (!taskId) return;
    const fetchComments = async () => {
      try {
        const res = await api.get(`/comments/${taskId}`);
        if (res.data.success) {
          setComments(res.data.comments || []);
        }
      } catch (err) {
        console.error('Failed to load comments:', err);
      }
    };
    fetchComments();
  }, [taskId]);

  // Save changes to task
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put(`/tasks/${taskId}`, {
        title,
        description,
        status,
        type,
        priority,
        severity,
        assigneeId: assigneeId || null,
        deadline: deadline || null,
      });

      if (res.data.success) {
        showToast('Ticket updated successfully.', 'success');
        onTaskUpdated(res.data.task);
      }
    } catch (err) {
      showToast('Failed to save task updates.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Add Comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await api.post('/comments', {
        taskId,
        text: newComment,
      });

      if (res.data.success) {
        setComments((prev) => [...prev, res.data.comment]);
        setNewComment('');
        showToast('Comment posted.', 'success');
      }
    } catch (err) {
      showToast('Failed to post comment.', 'error');
    }
  };

  // Upload Attachment
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('attachment', file);

    setUploading(true);
    try {
      const res = await api.post(`/tasks/${taskId}/attachments`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setAttachments(res.data.task.attachments || []);
        onTaskUpdated(res.data.task);
        showToast('Screenshot / attachment uploaded.', 'success');
      }
    } catch (err) {
      showToast('Failed to upload attachment.', 'error');
    } finally {
      setUploading(false);
    }
  };

  // Delete Task
  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${task.key}? This action cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/tasks/${taskId}`);
      showToast('Task deleted successfully.', 'info');
      onTaskDeleted(taskId);
      onClose();
    } catch (err) {
      showToast('Failed to delete task.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl border border-purple-500/25 bg-[#0B1020] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500/15 bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-sm font-extrabold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20">
              {task.key}
            </span>
            <span className="text-xs text-slate-400">
              Created by <strong className="text-slate-300">{task.reporter?.name || 'Teammate'}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
              title="Delete Issue"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Split View (Main Content & Meta Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {/* Main Left Pane (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="glass-input w-full px-3.5 py-2 text-base font-semibold rounded-xl text-white"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">
                Description & Reproduction Context
              </label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add rich description, stack traces, expected vs actual behavior..."
                className="glass-input w-full p-3.5 text-xs rounded-xl font-mono leading-relaxed"
              ></textarea>
            </div>

            {/* Attachments & Screenshots */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5 text-purple-400" />
                  Attachments & Screenshots ({attachments.length})
                </label>
                <label className="gradient-btn-primary px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploading ? 'Uploading...' : 'Attach File'}</span>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                    accept="image/*,.pdf,.txt,.json"
                  />
                </label>
              </div>

              {attachments.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-purple-500/15 text-center text-xs text-slate-400">
                  No screenshots or log files attached yet.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {attachments.map((att, i) => {
                    const isImg = att.mimetype?.startsWith('image/') || att.url?.match(/\.(jpeg|jpg|png|gif|webp)$/i);
                    return (
                      <div
                        key={i}
                        className="group relative rounded-xl border border-purple-500/20 bg-slate-900/60 p-2 overflow-hidden"
                      >
                        {isImg ? (
                          <a href={att.url} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-lg">
                            <img
                              src={att.url}
                              alt={att.originalName}
                              className="h-20 w-full object-cover rounded-lg group-hover:scale-105 transition-transform"
                            />
                          </a>
                        ) : (
                          <div className="flex h-20 items-center justify-center bg-slate-800/50 rounded-lg">
                            <FileText className="w-8 h-8 text-purple-400" />
                          </div>
                        )}
                        <p className="mt-1.5 text-[10px] font-medium text-slate-300 truncate" title={att.originalName}>
                          {att.originalName}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Threaded Comments Section */}
            <div className="pt-4 border-t border-purple-500/15">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                Activity & Comments ({comments.length})
              </h4>

              {/* Comment Input */}
              <form onSubmit={handleAddComment} className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment or status update..."
                  className="glass-input flex-1 px-3.5 py-2 text-xs rounded-xl"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="gradient-btn-primary px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                >
                  <Send className="w-3.5 h-3.5" />
                  Post
                </button>
              </form>

              {/* Comments Stream */}
              <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                {comments.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No comments yet. Start the discussion!</p>
                ) : (
                  comments.map((c) => (
                    <div key={c._id || c.id} className="flex gap-3 p-3 rounded-xl bg-slate-900/50 border border-purple-500/10">
                      <img
                        src={c.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50'}
                        alt={c.user?.name || 'User'}
                        className="w-7 h-7 rounded-full object-cover border border-purple-500/20 shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-white">{c.user?.name || 'Team Member'}</span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-300 leading-relaxed">{c.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Meta Sidebar (1 col) */}
          <div className="space-y-4 rounded-xl bg-slate-900/60 p-4 border border-purple-500/15">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 pb-2 border-b border-purple-500/15">
              Attributes
            </h4>

            {/* Status */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 mb-1 block">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="glass-input w-full px-3 py-1.5 text-xs rounded-xl cursor-pointer"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="in-review">In Review</option>
                <option value="done">Done</option>
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 mb-1 block">Issue Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="glass-input w-full px-3 py-1.5 text-xs rounded-xl cursor-pointer"
              >
                <option value="task">Task</option>
                <option value="bug">Bug Report</option>
                <option value="feature">Feature</option>
                <option value="improvement">Improvement</option>
              </select>
            </div>

            {/* Severity (crucial for Bug tracking) */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 mb-1 block">Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="glass-input w-full px-3 py-1.5 text-xs rounded-xl cursor-pointer"
              >
                <option value="minor">Minor (Cosmetic)</option>
                <option value="major">Major (Feature Degraded)</option>
                <option value="critical">Critical (Workaround Exists)</option>
                <option value="blocker">Blocker (Emergency / P0)</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 mb-1 block">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="glass-input w-full px-3 py-1.5 text-xs rounded-xl cursor-pointer"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            {/* Assignee */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 mb-1 block">Assignee</label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="glass-input w-full px-3 py-1.5 text-xs rounded-xl cursor-pointer"
              >
                <option value="">Unassigned</option>
                {teamMembers.map((m) => {
                  const u = m.user;
                  if (!u) return null;
                  return (
                    <option key={u._id || u.id} value={u._id || u.id}>
                      {u.name} ({m.role || 'Member'})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Deadline */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 mb-1 block">Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="glass-input w-full px-3 py-1.5 text-xs rounded-xl cursor-pointer"
              />
            </div>

            {/* Save Button */}
            <div className="pt-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="gradient-btn-primary w-full py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
