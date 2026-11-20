import React, { useState, useEffect } from 'react';
import api from '../../api/axiosClient';
import { useToast } from '../../context/ToastContext';
import { X, Bug, Sparkles, CheckSquare, Zap, Plus } from 'lucide-react';

export default function CreateTaskModal({
  isOpen,
  onClose,
  onTaskCreated,
  defaultProjectId,
  defaultStatus = 'todo',
  projects = [],
}) {
  const { showToast } = useToast();

  const [projectId, setProjectId] = useState(defaultProjectId || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('task');
  const [priority, setPriority] = useState('medium');
  const [severity, setSeverity] = useState('minor');
  const [status, setStatus] = useState(defaultStatus);
  const [assigneeId, setAssigneeId] = useState('');
  const [deadline, setDeadline] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (defaultProjectId) setProjectId(defaultProjectId);
    if (defaultStatus) setStatus(defaultStatus);
  }, [defaultProjectId, defaultStatus, isOpen]);

  if (!isOpen) return null;

  const currentProject = projects.find((p) => (p._id || p.id) === projectId);
  const teamMembers = currentProject?.members || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Title is required.', 'error');
      return;
    }
    if (!projectId) {
      showToast('Please select a project.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const tags = tagInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await api.post('/tasks', {
        projectId,
        title,
        description,
        type,
        priority,
        severity,
        status,
        assigneeId: assigneeId || null,
        deadline: deadline || null,
        tags,
      });

      if (res.data.success) {
        showToast(`${type === 'bug' ? 'Bug report' : 'Task'} logged successfully.`, 'success');
        onTaskCreated(res.data.task);
        onClose();
        // Reset
        setTitle('');
        setDescription('');
        setTagInput('');
      }
    } catch (err) {
      showToast('Failed to create ticket.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl border border-purple-500/25 bg-[#0B1020] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-purple-500/15">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-purple-400" />
            Create Issue or Report Bug
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Project Picker (if not single project) */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">Project</label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="glass-input w-full px-3 py-2 text-xs rounded-xl cursor-pointer"
              required
            >
              <option value="">Select Target Project</option>
              {projects.map((p) => (
                <option key={p._id || p.id} value={p._id || p.id}>
                  {p.name} [{p.key}]
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">Issue Summary *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Memory leak in WebSocket heartbeat loop"
              className="glass-input w-full px-3 py-2 text-xs rounded-xl text-white"
              required
            />
          </div>

          {/* Type & Priority Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="glass-input w-full px-3 py-2 text-xs rounded-xl cursor-pointer"
              >
                <option value="task">Task</option>
                <option value="bug">Bug Report</option>
                <option value="feature">Feature Request</option>
                <option value="improvement">Improvement</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="glass-input w-full px-3 py-2 text-xs rounded-xl cursor-pointer"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Severity (if bug) & Status Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">
                {type === 'bug' ? 'Bug Severity *' : 'Severity'}
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="glass-input w-full px-3 py-2 text-xs rounded-xl cursor-pointer"
              >
                <option value="minor">Minor (Cosmetic)</option>
                <option value="major">Major (Degraded)</option>
                <option value="critical">Critical (P1)</option>
                <option value="blocker">Blocker (Emergency P0)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">Initial Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="glass-input w-full px-3 py-2 text-xs rounded-xl cursor-pointer"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="in-review">In Review</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          {/* Assignee & Deadline Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">Assignee</label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="glass-input w-full px-3 py-2 text-xs rounded-xl cursor-pointer"
              >
                <option value="">Unassigned</option>
                {teamMembers.map((m) => {
                  const u = m.user;
                  if (!u) return null;
                  return (
                    <option key={u._id || u.id} value={u._id || u.id}>
                      {u.name}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">Target Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="glass-input w-full px-3 py-2 text-xs rounded-xl cursor-pointer"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Context, repro steps, error logs..."
              className="glass-input w-full px-3 py-2 text-xs rounded-xl font-mono"
            ></textarea>
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">Tags (comma-separated)</label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="e.g. backend, memory, high-priority"
              className="glass-input w-full px-3 py-2 text-xs rounded-xl"
            />
          </div>

          {/* Submit Buttons */}
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
              {submitting ? 'Creating...' : 'Create Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
