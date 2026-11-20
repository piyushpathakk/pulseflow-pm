import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, Shield } from 'lucide-react';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('pulseflow_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('pulseflow_cookie_consent', 'all');
    setVisible(false);
  };

  const handleAcceptEssential = () => {
    localStorage.setItem('pulseflow_cookie_consent', 'essential');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-lg z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="rounded-2xl border border-purple-500/30 bg-slate-900/95 p-5 shadow-2xl backdrop-blur-2xl ring-1 ring-purple-500/20">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-purple-500/10 p-2.5 text-purple-400 border border-purple-500/20">
            <Cookie className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
              Cookie & Privacy Consent
              <Shield className="w-3.5 h-3.5 text-purple-400" />
            </h4>
            <p className="mt-1 text-xs leading-relaxed text-slate-300">
              We use essential cookies to keep you signed in, performance cookies to optimize velocity, and Google AdSense partner tags on public resources to support open engineering tutorials.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                onClick={handleAcceptAll}
                className="gradient-btn-primary px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Accept All
              </button>
              <button
                onClick={handleAcceptEssential}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors border border-slate-700 cursor-pointer"
              >
                Essential Only
              </button>
              <Link
                to="/cookie-policy"
                className="text-xs text-purple-400 hover:text-purple-300 transition-colors underline ml-1"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
