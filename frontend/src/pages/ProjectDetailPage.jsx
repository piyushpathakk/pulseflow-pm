import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import api from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import KanbanBoard from '../components/workspace/KanbanBoard';
import TaskModal from '../components/workspace/TaskModal';
import CreateTaskModal from '../components/workspace/CreateTaskModal';
import InviteMemberModal from '../components/workspace/InviteMemberModal';
import {
  FolderKanban,
  Kanban,
  Bug,
  Users,
  BarChart2,
  History,
  Plus,
  Download,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Search,
  Filter,
  Trash2,
} from 'lucide-react';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active Tab: 'kanban' | 'issues' | 'team' | 'analytics' | 'activities'
  const [activeTab, setActiveTab] = useState('kanban');

  // Modals state
  const [activeTaskModal, setActiveTaskModal] = useState(null);
  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);
  const [createTaskDefaultStatus, setCreateTaskDefaultStatus] = useState('todo');
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  // Issues table search and filter
  const [issueSearch, setIssueSearch] = useState('');
  const [issueTypeFilter, setIssueTypeFilter] = useState('all');

  // Load project & tasks
  const loadProjectData = async () => {
    try {
      const [projRes, tasksRes, actRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks?projectId=${id}`),
        api.get(`/activities?projectId=${id}&limit=20`),
      ]);

      if (projRes.data.success) {
        setProject(projRes.data.project);
      }
      if (tasksRes.data.success) {
        setTasks(tasksRes.data.tasks || []);
      }
      if (actRes.data.success) {
        setActivities(actRes.data.activities || []);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load project details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjectData();
  }, [id]);

  // Handle URL query param `?task=ID` to open specific modal directly
  useEffect(() => {
    const taskIdParam = searchParams.get('task');
    if (taskIdParam && tasks.length > 0) {
      const found = tasks.find((t) => (t._id || t.id) === taskIdParam);
      if (found) {
        setActiveTaskModal(found);
      }
    }
  }, [searchParams, tasks]);

  const handleOpenTask = (task) => {
    setActiveTaskModal(task);
    setSearchParams({ task: task._id || task.id });
  };

  const handleCloseTaskModal = () => {
    setActiveTaskModal(null);
    setSearchParams({});
  };

  const handleTaskUpdated = (updated) => {
    setTasks((prev) =>
      prev.map((t) => ((t._id || t.id) === (updated._id || updated.id) ? updated : t))
    );
    if (activeTaskModal && (activeTaskModal._id || activeTaskModal.id) === (updated._id || updated.id)) {
      setActiveTaskModal(updated);
    }
  };

  const handleTaskDeleted = (deletedId) => {
    setTasks((prev) => prev.filter((t) => (t._id || t.id) !== deletedId));
  };

  const handleTaskCreated = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleAddTaskWithStatus = (status) => {
    setCreateTaskDefaultStatus(status);
    setCreateTaskModalOpen(true);
  };

  const handleExportCSV = () => {
    window.open(`/api/analytics/export-csv?projectId=${id}`, '_blank');
  };

  const handleRemoveMember = async (memberUserId) => {
    if (!window.confirm('Remove this collaborator from the project?')) return;
    try {
      const res = await api.delete(`/projects/${id}/members/${memberUserId}`);
      if (res.data.success) {
        setProject(res.data.project);
        showToast('Member removed from project.', 'info');
      }
    } catch (err) {
      showToast('Failed to remove member.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-12 text-center rounded-2xl border border-dashed border-purple-500/20 bg-slate-900/30">
        <h3 className="text-base font-bold text-white">Project not found</h3>
        <Link to="/projects" className="mt-3 inline-block gradient-btn-primary px-4 py-2 rounded-xl text-xs font-semibold">
          Return to Projects
        </Link>
      </div>
    );
  }

  const teamMembers = project.members || [];
  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.status === 'done').length;
  const inProgressCount = tasks.filter((t) => t.status === 'in-progress').length;
  const openBugsCount = tasks.filter((t) => t.type === 'bug' && t.status !== 'done').length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Filtered issues for the Issue Tracker Tab
  const filteredIssues = tasks.filter((t) => {
    if (issueTypeFilter !== 'all' && t.type !== issueTypeFilter) return false;
    if (issueSearch) {
      const q = issueSearch.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.key.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Project Master Header */}
      <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-r from-slate-900/90 via-purple-950/30 to-slate-900/90 p-6 backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-mono text-xs font-extrabold text-purple-300 bg-purple-500/15 px-2.5 py-1 rounded-lg border border-purple-500/30">
                {project.key}
              </span>
              <span className="text-xs uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {project.status}
              </span>
              <span className="text-xs uppercase font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {project.priority} Priority
              </span>
              {project.deadline && (
                <span className="text-xs text-slate-300 flex items-center gap-1 ml-2">
                  <Calendar className="w-3.5 h-3.5 text-purple-400" />
                  Target: {new Date(project.deadline).toLocaleDateString()}
                </span>
              )}
            </div>

            <h1 className="text-2xl font-extrabold text-white tracking-tight">{project.name}</h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {project.description || 'Sprint & issue workspace.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                setCreateTaskDefaultStatus('todo');
                setCreateTaskModalOpen(true);
              }}
              className="gradient-btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              New Issue / Bug
            </button>
            <button
              onClick={() => setInviteModalOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 border border-purple-500/20 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Users className="w-4 h-4 text-purple-400" />
              Invite Team
            </button>
            <button
              onClick={handleExportCSV}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-purple-500/20 transition-colors cursor-pointer"
              title="Export Sprint Tasks (CSV)"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress bar in header */}
        <div className="mt-5 pt-4 border-t border-purple-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-6 text-slate-300">
            <span><strong>{totalCount}</strong> Total Items</span>
            <span className="text-emerald-400"><strong>{completedCount}</strong> Completed</span>
            <span className="text-blue-400"><strong>{inProgressCount}</strong> In Progress</span>
            <span className="text-rose-400"><strong>{openBugsCount}</strong> Open Bugs</span>
          </div>

          <div className="flex items-center gap-3 min-w-[200px]">
            <span className="text-slate-400 text-[11px]">Sprint Completion</span>
            <div className="h-2 flex-1 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <strong className="text-white font-mono text-[11px]">{progressPercent}%</strong>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-purple-500/15 pb-2">
        <button
          onClick={() => setActiveTab('kanban')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'kanban'
              ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Kanban className="w-4 h-4 text-purple-400" />
          Kanban Board
        </button>

        <button
          onClick={() => setActiveTab('issues')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'issues'
              ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Bug className="w-4 h-4 text-rose-400" />
          Issue & Bug Tracker ({tasks.length})
        </button>

        <button
          onClick={() => setActiveTab('team')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'team'
              ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Users className="w-4 h-4 text-blue-400" />
          Team & Access ({teamMembers.length})
        </button>

        <button
          onClick={() => setActiveTab('activities')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'activities'
              ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <History className="w-4 h-4 text-emerald-400" />
          Audit Timeline
        </button>
      </div>

      {/* Tab 1: Kanban Board */}
      {activeTab === 'kanban' && (
        <KanbanBoard
          projectId={id}
          tasks={tasks}
          setTasks={setTasks}
          onOpenTask={handleOpenTask}
          onAddTaskWithStatus={handleAddTaskWithStatus}
          teamMembers={teamMembers}
        />
      )}

      {/* Tab 2: Linear / Jira Table View (Issue & Bug Tracker) */}
      {activeTab === 'issues' && (
        <div className="space-y-4">
          {/* Issue Tracker Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/50 border border-purple-500/15 backdrop-blur-xl">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={issueSearch}
                onChange={(e) => setIssueSearch(e.target.value)}
                placeholder="Search issues..."
                className="glass-input w-full pl-9 pr-3 py-1.5 text-xs rounded-xl"
              />
            </div>

            <div className="flex items-center gap-2">
              {['all', 'bug', 'feature', 'task'].map((t) => (
                <button
                  key={t}
                  onClick={() => setIssueTypeFilter(t)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase transition-colors cursor-pointer ${
                    issueTypeFilter === t
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-800/60 text-slate-400 hover:text-white'
                  }`}
                >
                  {t === 'all' ? 'All Items' : t}
                </button>
              ))}
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-2xl border border-purple-500/15 bg-slate-900/40 backdrop-blur-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-purple-500/15 bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="p-3.5">Key</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5">Severity</th>
                  <th className="p-3.5">Title</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Priority</th>
                  <th className="p-3.5">Assignee</th>
                  <th className="p-3.5">Deadline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-500/10">
                {filteredIssues.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400">
                      No issues match current filters.
                    </td>
                  </tr>
                ) : (
                  filteredIssues.map((item) => (
                    <tr
                      key={item._id || item.id}
                      onClick={() => handleOpenTask(item)}
                      className="hover:bg-purple-900/10 transition-colors cursor-pointer group"
                    >
                      <td className="p-3.5 font-mono font-bold text-purple-300">
                        {item.key}
                      </td>
                      <td className="p-3.5">
                        <span className="capitalize font-medium text-slate-300">{item.type}</span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                            item.severity === 'blocker'
                              ? 'bg-rose-950 text-rose-300 border-rose-500'
                              : item.severity === 'critical'
                              ? 'bg-orange-950 text-orange-300 border-orange-500'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {item.severity || 'minor'}
                        </span>
                      </td>
                      <td className="p-3.5 font-semibold text-slate-100 group-hover:text-purple-300 transition-colors max-w-xs truncate">
                        {item.title}
                      </td>
                      <td className="p-3.5">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {item.status}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="capitalize text-slate-300">{item.priority}</span>
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          {item.assignee ? (
                            <span className="text-slate-300">{item.assignee.name}</span>
                          ) : (
                            <span className="text-slate-400 italic">Unassigned</span>
                          )}
                        </div>
                      </td>
                      <td className="p-3.5 text-slate-400">
                        {item.deadline ? new Date(item.deadline).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Team & Access Management */}
      {activeTab === 'team' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Project Collaborators ({teamMembers.length})</h3>
            <button
              onClick={() => setInviteModalOpen(true)}
              className="gradient-btn-primary flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Invite Member
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map((m, idx) => {
              const u = m.user;
              if (!u) return null;
              const uId = u._id || u.id;
              const isOwner = project.ownerId === uId || project.owner?._id === uId;

              return (
                <div
                  key={idx}
                  className="glass-card rounded-2xl p-4 border border-purple-500/15 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={u.name}
                      className="w-10 h-10 rounded-full object-cover border border-purple-500/30 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{u.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{u.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                        {isOwner ? 'Project Owner (Admin)' : m.role || 'Developer'}
                      </span>
                    </div>
                  </div>

                  {!isOwner && (
                    <button
                      onClick={() => handleRemoveMember(uId)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Remove Collaborator"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Audit Timeline */}
      {activeTab === 'activities' && (
        <div className="glass-panel rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <History className="w-4 h-4 text-purple-400" />
            Project Audit & Change Log
          </h3>

          <div className="space-y-4">
            {activities.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No activity recorded for this workspace yet.</p>
            ) : (
              activities.map((act) => (
                <div key={act._id || act.id} className="flex items-start gap-3 text-xs border-b border-purple-500/10 pb-3">
                  <div className="w-2 h-2 rounded-full bg-purple-400 mt-1.5 shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-slate-200">
                      <strong className="text-white">{act.user?.name || 'Engineer'}</strong>:{' '}
                      {act.details || act.action}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {new Date(act.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Task Inspection & Edit Modal */}
      {activeTaskModal && (
        <TaskModal
          task={activeTaskModal}
          onClose={handleCloseTaskModal}
          onTaskUpdated={handleTaskUpdated}
          onTaskDeleted={handleTaskDeleted}
          teamMembers={teamMembers}
        />
      )}

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={createTaskModalOpen}
        onClose={() => setCreateTaskModalOpen(false)}
        onTaskCreated={handleTaskCreated}
        defaultProjectId={id}
        defaultStatus={createTaskDefaultStatus}
        projects={[project]}
      />

      {/* Invite Member Modal */}
      <InviteMemberModal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        projectId={id}
        onMemberAdded={(updatedProj) => setProject(updatedProj)}
      />
    </div>
  );
}

