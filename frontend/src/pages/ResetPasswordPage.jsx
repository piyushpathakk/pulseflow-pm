import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axiosClient';
import { useToast } from '../context/ToastContext';
import { Layers, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      showToast('Missing reset token in URL.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/reset-password', {
        token,
        newPassword,
      });

      if (res.data.success) {
        setSuccess(true);
        showToast('Password has been reset successfully.', 'success');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Invalid or expired token.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#0B1020]">
      <div className="glow-orb-purple -top-20 -right-20 w-96 h-96"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-black text-white">
              Pulse<span className="gradient-text">Flow</span>
            </span>
          </Link>
          <h2 className="mt-3 text-lg font-bold text-white">Create New Password</h2>
          <p className="text-xs text-slate-400 mt-1">
            Choose a strong password to secure your account.
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-7 border border-purple-500/25 shadow-2xl">
          {success ? (
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white">Password Updated</h3>
              <p className="text-xs text-slate-300">
                You can now log in with your updated credentials.
              </p>
              <Link to="/login" className="inline-block gradient-btn-primary px-5 py-2.5 rounded-xl text-xs font-bold mt-2">
                Sign In Now
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="glass-input w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Confirm New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="glass-input w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl text-white"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="gradient-btn-primary w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'Updating...' : 'Set New Password'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

