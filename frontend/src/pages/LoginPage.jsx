import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Layers, ArrowRight, Lock, Mail, Sparkles, Shield, UserCheck } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password.', 'error');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      showToast('Authenticated successfully. Welcome back!', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.response?.data?.message || 'Invalid email or password.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setLoading(true);
    try {
      await login(demoEmail, demoPassword);
      showToast(`Signed in as demo account: ${demoEmail}`, 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast('Demo login failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#0B1020]">
      {/* Background Neon Orbs */}
      <div className="glow-orb-purple -top-20 -left-20 w-96 h-96"></div>
      <div className="glow-orb-blue -bottom-20 -right-20 w-96 h-96"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">
              Pulse<span className="gradient-text">Flow</span>
            </span>
          </Link>
          <h2 className="mt-3 text-lg font-bold text-white">Sign In to Your Workspace</h2>
          <p className="text-xs text-slate-400 mt-1">
            Access your projects, sprint kanbans, and bug tracking dashboard.
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-panel rounded-3xl p-7 border border-purple-500/25 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="glass-input w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl text-white"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] font-semibold text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="glass-input w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl text-white"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="gradient-btn-primary w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 mt-2 shadow-lg shadow-purple-950/40"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Logins Section */}
          <div className="mt-6 pt-5 border-t border-purple-500/15">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block text-center mb-2.5">
              One-Click Quick Demo Accounts
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('admin@pulseflow.dev', 'Admin@123456')}
                className="p-2 rounded-xl bg-slate-900/90 border border-purple-500/20 hover:border-purple-500/50 text-[11px] font-semibold text-purple-300 text-left transition-colors cursor-pointer"
              >
                👑 Super Admin
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('sarah.chen@pulseflow.dev', 'Demo@123456')}
                className="p-2 rounded-xl bg-slate-900/90 border border-purple-500/20 hover:border-purple-500/50 text-[11px] font-semibold text-blue-300 text-left transition-colors cursor-pointer"
              >
                💼 Manager
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('alex.rivera@pulseflow.dev', 'Demo@123456')}
                className="p-2 rounded-xl bg-slate-900/90 border border-purple-500/20 hover:border-purple-500/50 text-[11px] font-semibold text-emerald-300 text-left transition-colors cursor-pointer"
              >
                💻 Senior Dev
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('elena.rostova@pulseflow.dev', 'Demo@123456')}
                className="p-2 rounded-xl bg-slate-900/90 border border-purple-500/20 hover:border-purple-500/50 text-[11px] font-semibold text-rose-300 text-left transition-colors cursor-pointer"
              >
                🐞 QA Lead
              </button>
            </div>
          </div>

          {/* Switch to Register */}
          <div className="mt-5 text-center text-xs text-slate-400">
            Don’t have an account?{' '}
            <Link to="/register" className="font-semibold text-purple-400 hover:text-purple-300 underline">
              Create free account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

