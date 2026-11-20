import React, { useState, useEffect } from 'react';
import api from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  ShieldAlert,
  Users,
  FolderKanban,
  FileText,
  DollarSign,
  Server,
  Activity,
  CheckCircle2,
  Trash2,
  Edit3,
  ExternalLink,
  Save,
  RefreshCw,
  Eye,
  AlertTriangle,
} from 'lucide-react';

export default function AdminPage() {
  const { user, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('metrics'); // 'metrics' | 'users' | 'articles' | 'adsense'
  const [metrics, setMetrics] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [articlesList, setArticlesList] = useState([]);
  const [adsenseConfig, setAdsenseConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form states for AdSense config editor
  const [publisherId, setPublisherId] = useState('');
  const [autoAdsEnabled, setAutoAdsEnabled] = useState(false);
  const [clientSideEnabled, setClientSideEnabled] = useState(true);
  const [testMode, setTestMode] = useState(true);
  const [adsTxtContent, setAdsTxtContent] = useState('');
  const [savingAdsense, setSavingAdsense] = useState(false);

  const fetchAdminData = async () => {
    try {
      const [mRes, uRes, aRes, adRes] = await Promise.all([
        api.get('/admin/metrics'),
        api.get('/admin/users'),
        api.get('/articles?all=true'),
        api.get('/adsense/config'),
      ]);

      if (mRes.data.success) setMetrics(mRes.data.metrics);
      if (uRes.data.success) setUsersList(uRes.data.users);
      if (aRes.data.success) setArticlesList(aRes.data.articles);
      if (adRes.data.success) {
        const cfg = adRes.data.config;
        setAdsenseConfig(cfg);
        setPublisherId(cfg.publisherId || 'ca-pub-9876543210987654');
        setAutoAdsEnabled(cfg.autoAdsEnabled || false);
        setClientSideEnabled(cfg.clientSideEnabled !== false);
        setTestMode(cfg.testMode !== false);
        setAdsTxtContent(`google.com, ${cfg.publisherId || 'pub-9876543210987654'}, DIRECT, f08c47fec0942fa0`);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load admin telemetry.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="p-12 text-center rounded-2xl border border-rose-500/20 bg-rose-950/20 max-w-lg mx-auto mt-10">
        <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-white">Access Restricted</h2>
        <p className="text-xs text-slate-300 mt-1">
          This area requires Super-Admin authorization. Your current role is <strong>{user?.role}</strong>.
        </p>
      </div>
    );
  }

  // User Role Change
  const handleRoleChange = async (targetUserId, newRole) => {
    try {
      const res = await api.put(`/admin/users/${targetUserId}/role`, { role: newRole });
      if (res.data.success) {
        setUsersList((prev) =>
          prev.map((u) => (u.id === targetUserId ? { ...u, role: newRole } : u))
        );
        showToast(`User role updated to ${newRole}.`, 'success');
      }
    } catch (err) {
      showToast('Failed to update user role.', 'error');
    }
  };

  // User Deletion
  const handleDeleteUser = async (targetUserId, userName) => {
    if (!window.confirm(`Permanently delete account for ${userName}?`)) return;
    try {
      const res = await api.delete(`/admin/users/${targetUserId}`);
      if (res.data.success) {
        setUsersList((prev) => prev.filter((u) => u.id !== targetUserId));
        showToast('User account removed.', 'info');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete user.', 'error');
    }
  };

  // Toggle Article Publish
  const handleTogglePublish = async (art) => {
    try {
      const res = await api.put(`/articles/${art._id || art.id}`, {
        published: !art.published,
      });
      if (res.data.success) {
        setArticlesList((prev) =>
          prev.map((a) => ((a._id || a.id) === (art._id || art.id) ? { ...a, published: !art.published } : a))
        );
        showToast(`Article ${!art.published ? 'published' : 'drafted'}.`, 'success');
      }
    } catch (err) {
      showToast('Failed to toggle publish status.', 'error');
    }
  };

  // Delete Article
  const handleDeleteArticle = async (artId) => {
    if (!window.confirm('Delete this article permanently?')) return;
    try {
      const res = await api.delete(`/articles/${artId}`);
      if (res.data.success) {
        setArticlesList((prev) => prev.filter((a) => (a._id || a.id) !== artId));
        showToast('Article deleted.', 'info');
      }
    } catch (err) {
      showToast('Failed to delete article.', 'error');
    }
  };

  // Save AdSense Config
  const handleSaveAdsense = async (e) => {
    e.preventDefault();
    setSavingAdsense(true);
    try {
      const res = await api.put('/adsense/config', {
        publisherId,
        autoAdsEnabled,
        clientSideEnabled,
        testMode,
        adsTxtContent,
      });

      if (res.data.success) {
        showToast('AdSense & ads.txt settings updated successfully.', 'success');
      }
    } catch (err) {
      showToast('Failed to update AdSense configuration.', 'error');
    } finally {
      setSavingAdsense(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[10px] font-bold uppercase tracking-wider mb-2">
            Superuser Control Panel
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-purple-400" />
            Administration & Google Monetization Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Global system telemetry, user role governance, editorial blog curation, and Google AdSense compliance.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-purple-500/20 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Telemetry
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-purple-500/15 pb-2">
        <button
          onClick={() => setActiveTab('metrics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'metrics'
              ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Server className="w-4 h-4 text-purple-400" />
          System Telemetry
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'users'
              ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4 text-blue-400" />
          Manage Users ({usersList.length})
        </button>

        <button
          onClick={() => setActiveTab('articles')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'articles'
              ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4 text-emerald-400" />
          Blog Articles & SEO ({articlesList.length})
        </button>

        <button
          onClick={() => setActiveTab('adsense')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'adsense'
              ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <DollarSign className="w-4 h-4 text-amber-400" />
          Google AdSense & ads.txt
        </button>
      </div>

      {/* Tab 1: System Telemetry */}
      {activeTab === 'metrics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="glass-card rounded-2xl p-4 border border-purple-500/15">
              <span className="text-[11px] font-semibold text-slate-400">Total Users</span>
              <div className="mt-1 text-2xl font-extrabold text-white">{metrics?.totalUsers || 0}</div>
            </div>
            <div className="glass-card rounded-2xl p-4 border border-purple-500/15">
              <span className="text-[11px] font-semibold text-slate-400">Total Projects</span>
              <div className="mt-1 text-2xl font-extrabold text-blue-400">{metrics?.totalProjects || 0}</div>
            </div>
            <div className="glass-card rounded-2xl p-4 border border-purple-500/15">
              <span className="text-[11px] font-semibold text-slate-400">Total Tickets</span>
              <div className="mt-1 text-2xl font-extrabold text-purple-400">{metrics?.totalTasks || 0}</div>
            </div>
            <div className="glass-card rounded-2xl p-4 border border-purple-500/15">
              <span className="text-[11px] font-semibold text-slate-400">Critical Bugs</span>
              <div className="mt-1 text-2xl font-extrabold text-rose-400">{metrics?.criticalBugsCount || 0}</div>
            </div>
            <div className="glass-card rounded-2xl p-4 border border-purple-500/15">
              <span className="text-[11px] font-semibold text-slate-400">Blog Articles</span>
              <div className="mt-1 text-2xl font-extrabold text-emerald-400">{metrics?.totalArticles || 0}</div>
            </div>
            <div className="glass-card rounded-2xl p-4 border border-purple-500/15">
              <span className="text-[11px] font-semibold text-slate-400">Memory RSS</span>
              <div className="mt-1 text-2xl font-extrabold text-amber-400">{metrics?.memoryUsageMB || 0} MB</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-white">Database & Infrastructure Status</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-purple-500/10">
                  <span className="text-slate-400">Active Storage Engine:</span>
                  <span className="font-mono font-bold text-purple-300 uppercase">
                    {metrics?.databaseMode === 'mongodb' ? 'MongoDB Atlas' : 'PulseFlow Embedded SQLite WAL'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-purple-500/10">
                  <span className="text-slate-400">Connection State:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Healthy
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-purple-500/10">
                  <span className="text-slate-400">Server Uptime:</span>
                  <span className="font-mono text-slate-200">{metrics?.uptimeSeconds || 0} seconds</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Node Runtime:</span>
                  <span className="font-mono text-slate-200">{metrics?.nodeVersion}</span>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-white">SEO & Web Crawler Endpoints</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                PulseFlow dynamically generates live crawler files compliant with Google Search Console and Google AdSense bot guidelines:
              </p>
              <div className="flex flex-col gap-2 pt-2">
                <a
                  href="/ads.txt"
                  target="_blank"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-purple-500/20 text-xs text-purple-300 hover:text-white hover:border-purple-500/40"
                >
                  <span className="font-mono font-semibold">/ads.txt</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-purple-500/20 text-xs text-purple-300 hover:text-white hover:border-purple-500/40"
                >
                  <span className="font-mono font-semibold">/sitemap.xml</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
                <a
                  href="/robots.txt"
                  target="_blank"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-purple-500/20 text-xs text-purple-300 hover:text-white hover:border-purple-500/40"
                >
                  <span className="font-mono font-semibold">/robots.txt</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: User Governance */}
      {activeTab === 'users' && (
        <div className="glass-panel rounded-2xl p-6 overflow-x-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">Registered Users & Role Management</h3>
            <span className="text-xs text-slate-400">{usersList.length} Accounts in System</span>
          </div>

          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-purple-500/15 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="pb-3">User</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Assigned Role</th>
                <th className="pb-3">Registered Date</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-500/10">
              {usersList.map((u) => {
                const isCurrent = u.id === (user?._id || user?.id);
                return (
                  <tr key={u.id} className="hover:bg-purple-900/10 transition-colors">
                    <td className="py-3 flex items-center gap-2.5">
                      <img
                        src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60'}
                        alt={u.name}
                        className="w-7 h-7 rounded-full object-cover border border-purple-500/30"
                      />
                      <span className="font-semibold text-white">
                        {u.name} {isCurrent && <span className="text-[10px] text-purple-400">(You)</span>}
                      </span>
                    </td>
                    <td className="py-3 text-slate-300 font-mono text-[11px]">{u.email}</td>
                    <td className="py-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        disabled={isCurrent}
                        className="glass-input px-2.5 py-1 text-xs rounded-lg cursor-pointer disabled:opacity-50"
                      >
                        <option value="Admin">Admin</option>
                        <option value="Manager">Manager</option>
                        <option value="Developer">Developer</option>
                        <option value="Viewer">Viewer</option>
                      </select>
                    </td>
                    <td className="py-3 text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-right">
                      {!isCurrent && (
                        <button
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Delete User Account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Blog Articles & SEO */}
      {activeTab === 'articles' && (
        <div className="glass-panel rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Editorial Blog Management</h3>
              <p className="text-xs text-slate-400">Original high-value engineering tutorials for Google AdSense compliance</p>
            </div>
            <a
              href="/blog"
              target="_blank"
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              View Public Blog <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-purple-500/15 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="pb-3">Title & SEO Slug</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Views</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-500/10">
                {articlesList.map((art) => (
                  <tr key={art._id || art.id} className="hover:bg-purple-900/10 transition-colors">
                    <td className="py-3 max-w-sm">
                      <p className="font-bold text-white truncate">{art.title}</p>
                      <span className="text-[10px] text-purple-300 font-mono">/blog/{art.slug}</span>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[10px]">
                        {art.category}
                      </span>
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => handleTogglePublish(art)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer border ${
                          art.published
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {art.published ? 'Live / Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="py-3 font-mono text-slate-300">{art.views || 0}</td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/blog/${art.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
                          title="Preview Article"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDeleteArticle(art._id || art.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                          title="Delete Article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Google AdSense & ads.txt */}
      {activeTab === 'adsense' && (
        <form onSubmit={handleSaveAdsense} className="glass-panel rounded-2xl p-6 space-y-6 max-w-2xl">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-amber-400" />
              Google AdSense Monetization Configuration
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Configure publisher IDs, test ad preview mode, and crawler ads.txt verification.
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">
              AdSense Publisher ID
            </label>
            <input
              type="text"
              value={publisherId}
              onChange={(e) => setPublisherId(e.target.value)}
              placeholder="ca-pub-XXXXXXXXXXXXXXXX"
              className="glass-input w-full px-3.5 py-2 text-xs rounded-xl font-mono text-purple-300"
              required
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Found in your Google AdSense Account &rarr; Account Information &rarr; Publisher ID.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-purple-500/15">
              <div>
                <span className="text-xs font-semibold text-white block">Test Preview Mode</span>
                <span className="text-[10px] text-slate-400">Shows stylized placeholder banner</span>
              </div>
              <input
                type="checkbox"
                checked={testMode}
                onChange={(e) => setTestMode(e.target.checked)}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-purple-500/15">
              <div>
                <span className="text-xs font-semibold text-white block">Client-Side Ad Units</span>
                <span className="text-[10px] text-slate-400">Enable banner slots on blog</span>
              </div>
              <input
                type="checkbox"
                checked={clientSideEnabled}
                onChange={(e) => setClientSideEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">
              Official ads.txt Crawler Content
            </label>
            <textarea
              rows={3}
              value={adsTxtContent}
              onChange={(e) => setAdsTxtContent(e.target.value)}
              className="glass-input w-full px-3.5 py-2 text-xs font-mono rounded-xl leading-relaxed"
            ></textarea>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Directly served at <a href="/ads.txt" target="_blank" className="text-purple-400 underline">/ads.txt</a> for automated crawler verification.
            </span>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={savingAdsense}
              className="gradient-btn-primary flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {savingAdsense ? 'Saving...' : 'Save AdSense Settings'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

