import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosClient';
import { useToast } from '../context/ToastContext';
import { Layers, Mail, ArrowRight, KeyRound, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetInfo, setResetInfo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.data.success) {
        setResetInfo(res.data);
        showToast('Password reset link generated.', 'success');
      }
    } catch (err) {
      showToast('Failed to process request.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#0B1020]">
      <div className="glow-orb-purple -top-20 -left-20 w-96 h-96"></div>

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
          <h2 className="mt-3 text-lg font-bold text-white">Reset Account Password</h2>
          <p className="text-xs text-slate-400 mt-1">
            Enter your email to receive recovery instructions.
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-7 border border-purple-500/25 shadow-2xl">
          {resetInfo ? (
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white">Reset Link Ready</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {resetInfo.message}
              </p>
              {resetInfo.resetUrl && (
                <div className="p-3 rounded-xl bg-slate-900 border border-purple-500/20 text-xs">
                  <p className="text-slate-400 text-[10px] uppercase font-bold mb-1">Direct Reset Link:</p>
                  <Link to={resetInfo.resetUrl} className="text-purple-400 font-mono underline break-all">
                    Click here to reset your password now &rarr;
                  </Link>
                </div>
              )}
              <Link to="/login" className="block text-xs font-semibold text-purple-400 hover:text-purple-300 mt-3">
                &larr; Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Your Email</label>
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

              <button
                type="submit"
                disabled={loading}
                className="gradient-btn-primary w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'Generating...' : 'Send Recovery Link'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center mt-3">
                <Link to="/login" className="text-xs text-slate-400 hover:text-white">
                  &larr; Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

