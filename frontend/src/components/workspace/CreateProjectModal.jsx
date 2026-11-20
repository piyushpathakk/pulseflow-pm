import React, { useState } from 'react';
import api from '../../api/axiosClient';
import { useToast } from '../../context/ToastContext';
import { X, FolderPlus } from 'lucide-react';

export default function CreateProjectModal({ isOpen, onClose, onProjectCreated }) {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [deadline, setDeadline] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  // Auto-generate key from name
  const handleNameChange = (val) => {
    setName(val);
    if (!key || key.length <= 4) {
      const generated = val
        .replace(/[^a-zA-Z]/g, '')
        .substring(0, 4)
        .toUpperCase();
      if (generated) setKey(generated);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !key.trim()) {
      showToast('Project name and key are required.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/projects', {
        name,
        key: key.toUpperCase().trim(),
        description,
        priority,
        deadline: deadline || null,
      });

      if (res.data.success) {
        showToast('Project initialized successfully.', 'success');
        onProjectCreated(res.data.project);
        onClose();
        setName('');
        setKey('');
        setDescription('');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create project.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl border border-purple-500/25 bg-[#0B1020] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-purple-500/15">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-purple-400" />
            Initialize New Project
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">Project Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. NovaEngine Cloud Gateway"
              className="glass-input w-full px-3.5 py-2 text-xs rounded-xl text-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">Project Key *</label>
              <input
                type="text"
                value={key}
                maxLength={6}
                onChange={(e) => setKey(e.target.value.toUpperCase())}
                placeholder="e.g. NOVA"
                className="glass-input w-full px-3.5 py-2 text-xs font-mono font-bold tracking-wider rounded-xl uppercase text-purple-300"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="glass-input w-full px-3.5 py-2 text-xs rounded-xl cursor-pointer"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">Target Sprint Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="glass-input w-full px-3.5 py-2 text-xs rounded-xl cursor-pointer"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Purpose, core architecture, key stakeholders..."
              className="glass-input w-full px-3.5 py-2 text-xs rounded-xl leading-relaxed"
            ></textarea>
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
              {submitting ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
