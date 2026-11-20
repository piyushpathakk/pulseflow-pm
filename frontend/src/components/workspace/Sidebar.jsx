import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  FolderKanban,
  BarChart3,
  Bell,
  Settings,
  ShieldAlert,
  LogOut,
  Layers,
  ChevronRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export default function Sidebar({ collapsed, setCollapsed }) {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Projects', path: '/projects', icon: FolderKanban },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Notifications', path: '/notifications', icon: Bell },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  if (isAdmin) {
    navItems.push({ label: 'Admin Control', path: '/admin', icon: ShieldAlert, badge: 'Super' });
  }

  const roleColors = {
    Admin: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    Manager: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    Developer: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Viewer: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  };

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-30 flex flex-col border-r border-purple-500/15 bg-[#080D1D]/90 backdrop-blur-2xl transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-purple-500/15">
        <Link to="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 shadow-md shadow-purple-500/25">
            <Layers className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight text-white flex items-center gap-1">
                Pulse<span className="gradient-text">Flow</span>
              </span>
              <span className="text-[9px] font-mono tracking-widest text-purple-400 uppercase font-semibold">
                SaaS Workspace
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto px-3 py-5 space-y-1">
        {!collapsed && (
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Workspace
          </div>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/25 text-purple-200 border border-purple-500/30 shadow-lg shadow-purple-950/20'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
              {!collapsed && (
                <div className="flex flex-1 items-center justify-between">
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}

        {!collapsed && (
          <div className="pt-6 px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Public Website
          </div>
        )}

        <Link
          to="/"
          target="_blank"
          className="group flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors"
          title={collapsed ? 'Public Website' : undefined}
        >
          <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-purple-400 shrink-0" />
          {!collapsed && <span>View Public Site & Blog</span>}
        </Link>
      </div>

      {/* User Profile Card & Signout */}
      <div className="p-3 border-t border-purple-500/15">
        <div className={`flex items-center gap-3 p-2 rounded-xl bg-slate-900/60 border border-purple-500/10 ${collapsed ? 'justify-center' : ''}`}>
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
            alt={user?.name || 'User'}
            className="w-9 h-9 rounded-full object-cover border border-purple-500/30 shrink-0"
          />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
              <span className={`inline-block mt-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${roleColors[user?.role] || roleColors.Developer}`}>
                {user?.role || 'Developer'}
              </span>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={logout}
              className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
