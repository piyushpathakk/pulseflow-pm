import React, { useState, useEffect } from 'react';
import api from '../api/axiosClient';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Download,
  Users,
  CheckCircle2,
  Bug,
  Activity,
  Award,
} from 'lucide-react';

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [teamMetrics, setTeamMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [dashRes, teamRes] = await Promise.all([
          api.get('/analytics/dashboard'),
          api.get('/analytics/team'),
        ]);

        if (dashRes.data.success) {
          setData(dashRes.data);
        }
        if (teamRes.data.success) {
          setTeamMetrics(teamRes.data.teamProductivity || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const handleExportCSV = () => {
    window.open('/api/analytics/export-csv', '_blank');
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const summary = data?.summary || {};
  const velocityTrend = data?.velocityTrend || [];
  const priorityBreakdown = data?.priorityBreakdown || [];
  const severityBreakdown = data?.bugSeverityBreakdown || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-purple-400" />
            Enterprise Velocity & Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time throughput metrics, team velocity benchmarks, and bug resolution rates.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="gradient-btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer shadow-lg shadow-purple-950/40"
        >
          <Download className="w-4 h-4" />
          Export All Tasks (CSV)
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-purple-500/15">
          <span className="text-xs font-semibold text-slate-400">Total Tasks Tracked</span>
          <div className="mt-2 text-2xl font-extrabold text-white">{summary.totalTasks}</div>
          <span className="text-[11px] text-purple-400 font-semibold">{summary.totalProjects} Active Projects</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-purple-500/15">
          <span className="text-xs font-semibold text-slate-400">Resolved Items</span>
          <div className="mt-2 text-2xl font-extrabold text-emerald-400">{summary.completedTasks}</div>
          <span className="text-[11px] text-emerald-400 font-semibold">{summary.overallCompletionRate}% Overall Completion</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-purple-500/15">
          <span className="text-xs font-semibold text-slate-400">Bug Resolution Ratio</span>
          <div className="mt-2 text-2xl font-extrabold text-white">
            {summary.resolvedBugs} / {(summary.resolvedBugs || 0) + (summary.openBugs || 0)}
          </div>
          <span className="text-[11px] text-rose-400 font-semibold">{summary.openBugs} Remaining Open</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-purple-500/15">
          <span className="text-xs font-semibold text-slate-400">Overdue SLA Risk</span>
          <div className="mt-2 text-2xl font-extrabold text-amber-400">{summary.overdueTasks}</div>
          <span className="text-[11px] text-amber-400 font-semibold">Overdue Deadlines</span>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Breakdown Bar Chart */}
        <div className="glass-panel rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            Task Priority Allocation
          </h3>
          <p className="text-xs text-slate-400 mb-4">Volume distribution across urgency tiers</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="priority" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: 'rgba(139, 92, 246, 0.3)',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bug Severity Matrix */}
        <div className="glass-panel rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
            <Bug className="w-4 h-4 text-rose-400" />
            Defect Severity Matrix
          </h3>
          <p className="text-xs text-slate-400 mb-4">Breakdown of reported bugs by architectural severity</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="severity" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: 'rgba(244, 63, 94, 0.3)',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#F43F5E" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Team Productivity Table */}
      <div className="glass-panel rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
          <Users className="w-4 h-4 text-purple-400" />
          Team Velocity & Individual Productivity Leaderboard
        </h3>
        <p className="text-xs text-slate-400 mb-4">Sprint throughput, ticket delivery, and defect triage per engineer</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-purple-500/15 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="pb-3">Engineer</th>
                <th className="pb-3">Role</th>
                <th className="pb-3 text-center">Assigned</th>
                <th className="pb-3 text-center">Completed</th>
                <th className="pb-3 text-center">In Progress</th>
                <th className="pb-3 text-center">Open Bugs</th>
                <th className="pb-3 text-right">Velocity Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-500/10">
              {teamMetrics.map((member) => (
                <tr key={member.id} className="hover:bg-purple-900/10 transition-colors">
                  <td className="py-3 flex items-center gap-2.5">
                    <img
                      src={member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60'}
                      alt={member.name}
                      className="w-7 h-7 rounded-full object-cover border border-purple-500/30"
                    />
                    <div>
                      <span className="font-semibold text-white block">{member.name}</span>
                      <span className="text-[10px] text-slate-400">{member.email}</span>
                    </div>
                  </td>
                  <td className="py-3 text-slate-300 font-medium">{member.role}</td>
                  <td className="py-3 text-center text-slate-300 font-mono font-bold">{member.assignedCount}</td>
                  <td className="py-3 text-center text-emerald-400 font-mono font-bold">{member.completedCount}</td>
                  <td className="py-3 text-center text-blue-400 font-mono font-bold">{member.inProgressCount}</td>
                  <td className="py-3 text-center text-rose-400 font-mono font-bold">{member.openBugsCount}</td>
                  <td className="py-3 text-right">
                    <span className="inline-flex items-center gap-1 font-mono font-bold text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      <Award className="w-3 h-3 text-purple-400" />
                      {member.velocityScore}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

