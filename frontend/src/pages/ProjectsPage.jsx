import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosClient';
import CreateProjectModal from '../components/workspace/CreateProjectModal';
import {
  FolderKanban,
  Plus,
  Search,
  CheckCircle2,
  Bug,
  Users,
  Calendar,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      if (res.data.success) {
        setProjects(res.data.projects || []);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleProjectCreated = (newProj) => {
    setProjects((prev) => [newProj, ...prev]);
  };

  const filtered = projects.filter((p) => {
    if (search) {
      const q = search.toLowerCase();
      const match =
        p.name.toLowerCase().includes(q) ||
        p.key.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <FolderKanban className="w-6 h-6 text-purple-400" />
            Projects & Workspaces
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your engineering initiatives, agile sprint backlogs, and bug repositories.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="gradient-btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer shadow-lg shadow-purple-950/40"
        >
          <Plus className="w-4 h-4" />
          Create New Project
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/50 border border-purple-500/15 backdrop-blur-xl">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by name, key, or tags..."
            className="glass-input w-full pl-9 pr-3 py-1.5 text-xs rounded-xl"
          />
        </div>

        <div className="flex items-center gap-2">
          {['all', 'Active', 'Paused', 'Completed'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                statusFilter === s
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              {s === 'all' ? 'All Workspaces' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="w-8 h-8 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-purple-500/20 bg-slate-900/30">
          <FolderKanban className="w-12 h-12 text-purple-400 mx-auto opacity-50 mb-3" />
          <h3 className="text-sm font-bold text-white">No projects found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {search ? 'Try adjusting your search query or status filter.' : 'Get started by creating your first agile project.'}
          </p>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="mt-4 gradient-btn-primary px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
          >
            + Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((proj) => {
            const pId = proj._id || proj.id;
            return (
              <div
                key={pId}
                className="glass-card group flex flex-col justify-between rounded-2xl p-5 border border-purple-500/15 bg-slate-900/50 hover:border-purple-500/40 transition-all duration-300"
              >
                <div>
                  {/* Top Bar: Key + Status */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-xs font-extrabold text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20">
                      {proj.key}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                        proj.status === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                      }`}
                    >
                      {proj.status}
                    </span>
                  </div>

                  {/* Project Name */}
                  <Link
                    to={`/projects/${pId}`}
                    className="text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1"
                  >
                    {proj.name}
                  </Link>

                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {proj.description || 'No description provided.'}
                  </p>

                  {/* Tags */}
                  {proj.tags && proj.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {proj.tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-purple-500/10"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Progress Bar */}
                  <div className="mt-5">
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <span className="text-slate-400">Sprint Progress</span>
                      <strong className="text-purple-300 font-semibold">{proj.progressPercent || 0}%</strong>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${proj.progressPercent || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Footer: Metrics + Open Button */}
                <div className="mt-5 pt-4 border-t border-purple-500/10 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1" title="Completed tasks">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      {proj.completedTasks || 0}
                    </span>
                    <span className="flex items-center gap-1" title="Open bugs">
                      <Bug className="w-3.5 h-3.5 text-rose-400" />
                      {proj.bugCount || 0}
                    </span>
                    <span className="flex items-center gap-1" title="Team members">
                      <Users className="w-3.5 h-3.5 text-blue-400" />
                      {proj.members?.length || 1}
                    </span>
                  </div>

                  <Link
                    to={`/projects/${pId}`}
                    className="flex items-center gap-1 text-xs font-semibold text-purple-400 group-hover:text-purple-300 group-hover:translate-x-0.5 transition-all"
                  >
                    Open Board
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
}

