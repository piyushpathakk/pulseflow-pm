import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Layers, ArrowRight, Lock, Mail, User, ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Developer');
  const [agree, setAgree] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      showToast('Please fill out all fields.', 'error');
      return;
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }
    if (!agree) {
      showToast('Please accept the Terms of Service to proceed.', 'error');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, role);
      showToast('Account created successfully! Welcome to PulseFlow.', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create account.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#0B1020]">
      {/* Background Neon Orbs */}
      <div className="glow-orb-purple -top-20 -right-20 w-96 h-96"></div>
      <div className="glow-orb-blue -bottom-20 -left-20 w-96 h-96"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 shadow-lg shadow-purple-500/30">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">
              Pulse<span className="gradient-text">Flow</span>
            </span>
          </Link>
          <h2 className="mt-3 text-lg font-bold text-white">Initialize Your Team Account</h2>
          <p className="text-xs text-slate-400 mt-1">
            Experience next-generation project and bug tracking in minutes.
          </p>
        </div>

        {/* Card */}
        <div className="glass-panel rounded-3xl p-7 border border-purple-500/25 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jordan Hayes"
                  className="glass-input w-full pl-10 pr-3.5 py-2 text-xs rounded-xl text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jordan@company.com"
                  className="glass-input w-full pl-10 pr-3.5 py-2 text-xs rounded-xl text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="glass-input w-full pl-10 pr-3.5 py-2 text-xs rounded-xl text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">Primary Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="glass-input w-full px-3.5 py-2 text-xs rounded-xl cursor-pointer"
              >
                <option value="Developer">Developer (Standard member)</option>
                <option value="Manager">Engineering Manager</option>
                <option value="Admin">Platform Administrator</option>
                <option value="Viewer">Stakeholder / Viewer</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
              />
              <label htmlFor="terms" className="text-[11px] text-slate-300">
                I agree to the{' '}
                <Link to="/terms" className="text-purple-400 underline">Terms</Link> and{' '}
                <Link to="/privacy" className="text-purple-400 underline">Privacy Policy</Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="gradient-btn-primary w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-lg shadow-purple-950/40"
            >
              <span>{loading ? 'Creating Account...' : 'Get Started Free'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-5 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-purple-400 hover:text-purple-300 underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

