import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import api from '../../api/axiosClient';
import {
  Menu,
  Bell,
  Plus,
  Search,
  Sun,
  Moon,
  CheckCircle,
  ExternalLink,
  ChevronDown,
  X,
  Bug,
  Sparkles,
} from 'lucide-react';

export default function TopHeader({ collapsed, setCollapsed, onOpenCreateTask }) {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications');
        if (res.data.success) {
          setUnreadCount(res.data.unreadCount || 0);
          setNotifications(res.data.notifications || []);
        }
      } catch (e) {
        // quiet fail
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-purple-500/15 bg-[#080D1D]/80 px-4 sm:px-6 backdrop-blur-xl">
      {/* Left: Collapse Button & Quick Action */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-800/60 hover:text-white transition-colors"
          title="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400">
          <span className="font-semibold text-slate-200">Workspace</span>
          <span>/</span>
          <span className="text-purple-400 font-medium">Enterprise Pulse</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Quick Create Task / Bug CTA Button */}
        <button
          onClick={onOpenCreateTask}
          className="gradient-btn-primary flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-md shadow-purple-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Issue</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="rounded-xl p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors border border-purple-500/10"
          title="Toggle Theme"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-400" />}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-xl p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors border border-purple-500/10"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-lg shadow-rose-500/50">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Popover */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border border-purple-500/25 bg-[#0B1020]/95 p-4 shadow-2xl backdrop-blur-2xl ring-1 ring-purple-500/20 z-50 animate-in fade-in slide-in-from-top-3">
              <div className="flex items-center justify-between pb-3 border-b border-purple-500/15">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {unreadCount} unread
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] font-semibold text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="mt-2 max-h-72 overflow-y-auto space-y-2 py-1">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">
                    No new notifications. You are all caught up!
                  </div>
                ) : (
                  notifications.slice(0, 8).map((n) => (
                    <div
                      key={n._id || n.id}
                      className={`p-2.5 rounded-xl border text-xs transition-colors ${
                        !n.read
                          ? 'bg-purple-950/20 border-purple-500/30 text-slate-200'
                          : 'bg-slate-900/40 border-purple-500/10 text-slate-400'
                      }`}
                    >
                      <div className="font-semibold text-white flex items-center justify-between">
                        <span>{n.title}</span>
                        {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>}
                      </div>
                      <p className="mt-1 text-slate-300 line-clamp-2">{n.message}</p>
                      <div className="mt-1.5 text-[10px] text-slate-400">
                        {new Date(n.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-3 pt-2 border-t border-purple-500/15 text-center">
                <Link
                  to="/notifications"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
                >
                  View All Notifications &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Mini Card */}
        <Link
          to="/settings"
          className="flex items-center gap-2 pl-2 text-slate-300 hover:text-white transition-colors"
          title="Account Settings"
        >
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
            alt={user?.name || 'User'}
            className="w-8 h-8 rounded-full object-cover border border-purple-500/40"
          />
        </Link>
      </div>
    </header>
  );
}
