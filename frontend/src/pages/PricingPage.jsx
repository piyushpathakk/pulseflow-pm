import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import SEOHead from '../components/common/SEOHead';
import AdSenseSlot from '../components/common/AdSenseSlot';
import { Check, X, Sparkles, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState('yearly'); // 'monthly' | 'yearly'

  const comparison = [
    { feature: 'Active Projects', starter: '3 Projects', pro: 'Unlimited', enterprise: 'Unlimited' },
    { feature: 'Kanban Drag & Drop Board', starter: true, pro: true, enterprise: true },
    { feature: 'Defect Severity Matrix (Blocker/P0)', starter: true, pro: true, enterprise: true },
    { feature: 'Real-time WebSocket Synchronization', starter: 'Basic', pro: 'Full (<40ms)', enterprise: 'Dedicated Cluster' },
    { feature: 'Screenshot & Log Attachments', starter: '100 MB', pro: '25 GB', enterprise: 'Unlimited' },
    { feature: 'Threaded Ticket Comments', starter: true, pro: true, enterprise: true },
    { feature: 'Recharts Velocity & Trend Analytics', starter: false, pro: true, enterprise: true },
    { feature: 'One-Click CSV Sprint Export', starter: false, pro: true, enterprise: true },
    { feature: 'Granular RBAC (Admin, Manager, Dev, Viewer)', starter: false, pro: true, enterprise: true },
    { feature: 'Dedicated MongoDB Atlas DB Node', starter: false, pro: false, enterprise: true },
    { feature: 'Guaranteed 99.99% Uptime SLA', starter: false, pro: false, enterprise: true },
    { feature: '24/7 Dedicated Support Engineer', starter: false, pro: false, enterprise: true },
  ];

  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white">
      <SEOHead
        title="Pricing Plans & ROI - PulseFlow Enterprise"
        description="Explore PulseFlow transparent pricing tiers. Free tier for solo developers, Pro for scaling agile teams, and Enterprise with dedicated SLAs."
        canonical="https://pulseflow.dev/pricing"
      />

      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Honest, Predictable Pricing</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Plans Engineered for Every Stage
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-slate-400">
            No surprise add-on fees or hidden seat minimums. Cancel or switch anytime.
          </p>

          {/* Toggle */}
          <div className="mt-6 inline-flex items-center gap-2 p-1 rounded-xl bg-slate-900 border border-purple-500/20">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                billingPeriod === 'monthly' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                billingPeriod === 'yearly' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Starter */}
          <div className="glass-card rounded-2xl p-6 border border-purple-500/15 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Starter</h3>
              <p className="text-xs text-slate-400 mt-1">For hobbyists and early projects.</p>
              <div className="mt-5 text-3xl font-black text-white">
                $0 <span className="text-xs font-medium text-slate-400">/ forever</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-3">Essential boards for getting things shipped.</p>
            </div>
            <Link
              to="/register"
              className="mt-8 block text-center py-2.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-200 hover:bg-slate-700 border border-purple-500/20 transition-colors"
            >
              Create Free Workspace
            </Link>
          </div>

          {/* Pro */}
          <div className="glass-card rounded-2xl p-6 border-2 border-purple-500 bg-purple-950/20 flex flex-col justify-between relative shadow-2xl shadow-purple-950/50">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
              Most Popular
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Professional</h3>
              <p className="text-xs text-slate-300 mt-1">For growing teams building production software.</p>
              <div className="mt-5 text-3xl font-black text-white">
                {billingPeriod === 'yearly' ? '$15' : '$19'}
                <span className="text-xs font-medium text-slate-400"> / user / month</span>
              </div>
              <p className="text-[11px] text-purple-300 mt-3">Full real-time collaboration & velocity analytics.</p>
            </div>
            <Link
              to="/register"
              className="mt-8 gradient-btn-primary block text-center py-2.5 rounded-xl text-xs font-bold shadow-lg"
            >
              Start 14-Day Free Trial
            </Link>
          </div>

          {/* Enterprise */}
          <div className="glass-card rounded-2xl p-6 border border-purple-500/15 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Enterprise</h3>
              <p className="text-xs text-slate-400 mt-1">For large tech companies with custom SLAs.</p>
              <div className="mt-5 text-3xl font-black text-white">
                {billingPeriod === 'yearly' ? '$39' : '$49'}
                <span className="text-xs font-medium text-slate-400"> / user / month</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-3">Dedicated infrastructure, SSO, and 24/7 support.</p>
            </div>
            <Link
              to="/contact"
              className="mt-8 block text-center py-2.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-200 hover:bg-slate-700 border border-purple-500/20 transition-colors"
            >
              Contact Solutions Architect
            </Link>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-purple-500/20 mb-16 overflow-x-auto">
          <h3 className="text-lg font-bold text-white mb-6">Complete Feature Matrix</h3>
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-purple-500/15 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="pb-4 font-semibold">Capability</th>
                <th className="pb-4 text-center font-semibold">Starter ($0)</th>
                <th className="pb-4 text-center font-semibold text-purple-300">Pro ($15)</th>
                <th className="pb-4 text-center font-semibold text-blue-300">Enterprise ($39)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-500/10">
              {comparison.map((item, idx) => (
                <tr key={idx} className="hover:bg-purple-900/10 transition-colors">
                  <td className="py-3.5 font-medium text-slate-200">{item.feature}</td>
                  <td className="py-3.5 text-center text-slate-300">
                    {typeof item.starter === 'boolean' ? (
                      item.starter ? (
                        <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-slate-400 mx-auto" />
                      )
                    ) : (
                      item.starter
                    )}
                  </td>
                  <td className="py-3.5 text-center text-purple-300 font-semibold">
                    {typeof item.pro === 'boolean' ? (
                      item.pro ? (
                        <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-slate-400 mx-auto" />
                      )
                    ) : (
                      item.pro
                    )}
                  </td>
                  <td className="py-3.5 text-center text-blue-300 font-semibold">
                    {typeof item.enterprise === 'boolean' ? (
                      item.enterprise ? (
                        <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-slate-400 mx-auto" />
                      )
                    ) : (
                      item.enterprise
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Compliant AdSense Banner */}
        <AdSenseSlot slotId="2345678901" format="horizontal" />
      </main>

      <Footer />
    </div>
  );
}

