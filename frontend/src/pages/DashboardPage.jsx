import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  AlertOctagon,
  Users,
  TrendingUp,
  Activity,
  ArrowRight,
  Plus,
  Bug,
  Sparkles,
} from 'lucide-react';

export default function DashboardPage({ onOpenCreateTask }) {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [activities, setActivities] = useState([]);
  const [criticalBugs, setCriticalBugs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [analyticsRes, activitiesRes, tasksRes] = await Promise.all([
          api.get('/analytics/dashboard'),
          api.get('/activities?limit=8'),
          api.get('/tasks?type=bug'),
        ]);

        if (analyticsRes.data.success) {
          setData(analyticsRes.data);
        }
        if (activitiesRes.data.success) {
          setActivities(activitiesRes.data.activities || []);
        }
        if (tasksRes.data.success) {
          // Filter critical & blocker bugs
          const bugs = (tasksRes.data.tasks || []).filter(
            (b) => (b.severity === 'blocker' || b.severity === 'critical') && b.status !== 'done'
          );
          setCriticalBugs(bugs.slice(0, 5));
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
          <p className="text-xs font-mono text-purple-300">Synchronizing PulseFlow Telemetry...</p>
        </div>
      </div>
    );
  }

  const summary = data?.summary || {};
  const statusDist = data?.statusDistribution || [];
  const velocityTrend = data?.velocityTrend || [];
  const severityBreakdown = data?.bugSeverityBreakdown || [];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-r from-blue-900/30 via-purple-900/20 to-slate-900/60 p-6 backdrop-blur-xl">
        <div className="glow-orb-purple -top-10 -right-10 w-72 h-72"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Sprint Velocity: <strong>{summary.overallCompletionRate}%</strong></span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Here is your engineering team’s real-time productivity overview across all active projects and sprint cycles.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenCreateTask}
              className="gradient-btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Log Issue or Bug
            </button>
            <Link
              to="/projects"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800/80 text-slate-200 hover:bg-slate-700 border border-purple-500/20 transition-colors"
            >
              View Projects
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Counter Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Projects */}
        <div className="glass-card rounded-2xl p-4 border border-purple-500/15">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Projects</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">{summary.totalProjects}</span>
            <span className="text-[11px] text-blue-400 font-semibold">Active Workspaces</span>
          </div>
        </div>

        {/* Total Tasks / Completed */}
        <div className="glass-card rounded-2xl p-4 border border-purple-500/15">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Tasks Completed</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">{summary.completedTasks}</span>
            <span className="text-[11px] text-emerald-400 font-semibold">
              of {summary.totalTasks} total
            </span>
          </div>
        </div>

        {/* Open Bugs */}
        <div className="glass-card rounded-2xl p-4 border border-purple-500/15">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Open Bugs</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Bug className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">{summary.openBugs}</span>
            <span className="text-[11px] text-rose-400 font-semibold">
              {criticalBugs.length} Critical/Blocker
            </span>
          </div>
        </div>

        {/* Team Members */}
        <div className="glass-card rounded-2xl p-4 border border-purple-500/15">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Engineering Team</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">{summary.teamMembersCount}</span>
            <span className="text-[11px] text-purple-400 font-semibold">Collaborators</span>
          </div>
        </div>
      </div>

      {/* Interactive Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Velocity Trend Area Chart (2 cols) */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                7-Day Velocity & Task Completion Trend
              </h3>
              <p className="text-xs text-slate-400">Throughput of created vs resolved user stories & bug tickets</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-blue-400">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Created
              </span>
              <span className="flex items-center gap-1.5 text-purple-400">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Completed
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={velocityTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCreated" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorCompleted" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: 'rgba(139, 92, 246, 0.3)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#F8FAFC',
                  }}
                />
                <Area type="monotone" dataKey="created" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCreated)" />
                <Area type="monotone" dataKey="completed" stroke="#8B5CF6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCompleted)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Status Distribution (1 col) */}
        <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-400" />
              Task Status Distribution
            </h3>
            <p className="text-xs text-slate-400">Active sprint workflow allocation</p>
          </div>

          <div className="h-48 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDist}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                >
                  {statusDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: 'rgba(139, 92, 246, 0.3)',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-purple-500/10">
            {statusDist.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5 text-xs text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }}></span>
                <span className="truncate">{s.name}:</span>
                <strong className="text-white ml-auto">{s.count}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lower Split: Blocker Bugs Watchlist & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Blocker & Critical Bugs Watchlist */}
        <div className="glass-panel rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-rose-400" />
                Blocker & Critical Bug Triage
              </h3>
              <p className="text-xs text-slate-400">High-severity defects requiring immediate resolution</p>
            </div>
            <Link
              to="/projects"
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              View Board <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {criticalBugs.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-purple-500/15 rounded-xl">
                No active blocker or critical bugs. Great job!
              </div>
            ) : (
              criticalBugs.map((bug) => (
                <Link
                  key={bug._id || bug.id}
                  to={`/projects/${bug.projectId || bug.project?._id}?task=${bug._id || bug.id}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-rose-500/25 hover:border-rose-500/60 transition-colors group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-950/80 text-rose-300 border border-rose-500/40 shrink-0">
                      {bug.severity}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-200 group-hover:text-rose-300 transition-colors truncate">
                        {bug.title}
                      </p>
                      <span className="text-[10px] text-purple-300 font-mono">{bug.key}</span>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-slate-400 uppercase shrink-0 ml-3">
                    {bug.status}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Live Team Activity Feed */}
        <div className="glass-panel rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" />
                Recent Engineering Activity
              </h3>
              <p className="text-xs text-slate-400">Live audit timeline across all workspaces</p>
            </div>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {activities.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No recent activity recorded.</p>
            ) : (
              activities.map((act) => (
                <div key={act._id || act.id} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <div className="w-2 h-2 rounded-full bg-purple-400 mt-1.5 shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="leading-relaxed">
                      <strong className="text-white">{act.user?.name || 'Engineer'}</strong>{' '}
                      <span className="text-slate-300">{act.details || act.action}</span>
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

