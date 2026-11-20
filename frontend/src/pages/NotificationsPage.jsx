import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosClient';
import { useToast } from '../context/ToastContext';
import { Bell, CheckCheck, CheckCircle2, MessageSquare, AlertCircle, UserPlus, ArrowRight } from 'lucide-react';

export default function NotificationsPage() {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' or 'unread'

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => ((n._id || n.id) === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      showToast('All notifications marked as read.', 'success');
    } catch (err) {
      showToast('Failed to mark all as read.', 'error');
    }
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'assignment':
        return <CheckCircle2 className="w-4 h-4 text-purple-400" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-blue-400" />;
      case 'invite':
        return <UserPlus className="w-4 h-4 text-emerald-400" />;
      case 'status_change':
        return <AlertCircle className="w-4 h-4 text-amber-400" />;
      default:
        return <Bell className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-purple-400" />
            Notification Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time alerts for ticket assignments, code review mentions, and sprint changes.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="gradient-btn-primary flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer shadow-md"
          >
            <CheckCheck className="w-4 h-4" />
            Mark All Read ({unreadCount})
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-purple-500/15 pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'all'
              ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          All Alerts ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'unread'
              ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Unread Only ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="w-8 h-8 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-purple-500/20 bg-slate-900/30">
            <Bell className="w-10 h-10 text-purple-400 mx-auto opacity-50 mb-2" />
            <h3 className="text-sm font-bold text-white">No notifications</h3>
            <p className="text-xs text-slate-400 mt-1">
              You are completely caught up on all project activities.
            </p>
          </div>
        ) : (
          filtered.map((item) => {
            const notifId = item._id || item.id;
            return (
              <div
                key={notifId}
                className={`glass-card flex items-start justify-between gap-4 rounded-2xl p-4 border transition-all ${
                  !item.read
                    ? 'border-purple-500/40 bg-purple-950/20 ring-1 ring-purple-500/20 shadow-md'
                    : 'border-purple-500/10 bg-slate-900/50'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-2 rounded-xl bg-slate-800 border border-purple-500/15 shrink-0 mt-0.5">
                    {getIcon(item.type)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-purple-400 shrink-0"></span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.message}</p>
                    <span className="text-[10px] text-slate-400 mt-2 block font-mono">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!item.read && (
                    <button
                      onClick={() => handleMarkAsRead(notifId)}
                      className="text-[11px] font-semibold text-purple-400 hover:text-purple-300 px-2 py-1 rounded-lg hover:bg-purple-900/20 transition-colors cursor-pointer"
                    >
                      Mark Read
                    </button>
                  )}
                  {item.link && (
                    <Link
                      to={item.link}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                      title="Open Ticket"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

