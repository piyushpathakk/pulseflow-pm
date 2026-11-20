import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import SEOHead from '../components/common/SEOHead';
import AdSenseSlot from '../components/common/AdSenseSlot';
import {
  Sparkles,
  ArrowRight,
  Kanban,
  Bug,
  BarChart3,
  Users,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ChevronDown,
  Layers,
  Terminal,
  Activity,
  Cpu,
  Clock,
  Lock,
} from 'lucide-react';

export default function LandingPage() {
  const [billingPeriod, setBillingPeriod] = useState('monthly'); // 'monthly' | 'yearly'
  const [openFaq, setOpenFaq] = useState(null);

  // Live interactive preview board state inside hero
  const [previewCards, setPreviewCards] = useState([
    { id: 1, title: 'Fix WebSocket heartbeat timeout memory leak', status: 'In Progress', type: 'bug', sev: 'Blocker' },
    { id: 2, title: 'Implement biometric multi-factor key auth', status: 'To Do', type: 'feature', sev: 'Major' },
    { id: 3, title: 'Deploy telemetry collector to staging cluster', status: 'Done', type: 'task', sev: 'Minor' },
  ]);

  const faqs = [
    {
      q: 'How does PulseFlow compare to Jira and Linear?',
      a: 'PulseFlow merges the keyboard-first speed and luxury dark-mode aesthetics of Linear with the enterprise-grade audit governance, custom defect severity matrices, and deep reporting traditionally found in Jira.',
    },
    {
      q: 'Can our engineering team migrate existing issues from Jira or GitHub?',
      a: 'Yes! PulseFlow supports seamless one-click CSV issue imports and provides REST APIs for automated sync pipelines with GitHub Issues, GitLab, and Jira Cloud.',
    },
    {
      q: 'Does PulseFlow support real-time team collaboration?',
      a: 'Absolutely. Built on WebSockets via Socket.io, every task move, comment post, and ticket status update broadcasts to all connected project teammates in sub-50 milliseconds.',
    },
    {
      q: 'What are the hosting and deployment options?',
      a: 'PulseFlow is production-ready for deployment on Render, Railway, Vercel, or custom Docker containers with MongoDB Atlas or self-hosted PostgreSQL/MongoDB.',
    },
    {
      q: 'Is PulseFlow compliant with Google AdSense and privacy policies?',
      a: 'Yes. PulseFlow strictly segregates public educational content (where ads are policy-complaint and clearly labeled) from authenticated private workspace dashboards, which remain 100% ad-free and distraction-free.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white">
      <SEOHead
        title="PulseFlow - Futuristic Enterprise Project Management & Issue Tracker"
        description="Next-generation project management, bug tracking, and agile sprint collaboration platform combining Linear speed with Jira enterprise governance."
        canonical="https://pulseflow.dev/"
      />

      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32 px-4 sm:px-6 lg:px-8">
          {/* Glowing Background Orbs */}
          <div className="glow-orb-purple top-10 left-1/2 -translate-x-1/2 w-[700px] h-[400px]"></div>
          <div className="glow-orb-blue -top-20 left-1/4 w-[500px] h-[350px]"></div>

          <div className="relative z-10 max-w-5xl mx-auto text-center">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-semibold mb-6 shadow-lg shadow-purple-950/40">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Next-Generation Linear × Jira Hybrid Platform</span>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
              <span className="text-slate-400">v1.0 Live</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
              High-Velocity Agile Tracking for{' '}
              <span className="gradient-text block mt-1">Elite Software Teams</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Track bugs with surgical precision, manage agile sprint kanbans in real-time, and eliminate developer friction with futuristic glassmorphism performance.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                to="/register"
                className="gradient-btn-primary flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3 rounded-xl text-sm font-bold shadow-xl shadow-purple-950/50 hover:scale-105 transition-all"
              >
                <span>Start Free Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-semibold bg-slate-900/90 text-slate-200 hover:text-white hover:bg-slate-800 border border-purple-500/25 transition-all"
              >
                Sign In to Demo
              </Link>
            </div>

            {/* Hero Interactive Preview Board (Mini Linear/Jira widget right in the hero!) */}
            <div className="mt-14 max-w-4xl mx-auto rounded-3xl border border-purple-500/25 bg-slate-950/70 p-4 sm:p-6 shadow-2xl backdrop-blur-2xl ring-1 ring-purple-500/20 text-left">
              <div className="flex items-center justify-between pb-4 border-b border-purple-500/15">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                  <span className="ml-2 font-mono text-xs text-slate-400">NOVA-Engine / Sprint 42 / Kanban Flow</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-purple-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Live WebSocket Sync</span>
                </div>
              </div>

              {/* Interactive columns preview */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {['To Do', 'In Progress', 'Done'].map((colName) => (
                  <div key={colName} className="rounded-xl bg-slate-900/60 p-3 border border-purple-500/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{colName}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                        {previewCards.filter(c => c.status === colName).length}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {previewCards
                        .filter(c => c.status === colName)
                        .map(card => (
                          <div
                            key={card.id}
                            className="p-3 rounded-lg bg-slate-800/70 border border-purple-500/15 hover:border-purple-500/40 transition-colors shadow-sm"
                          >
                            <div className="flex items-center justify-between text-[10px] mb-1">
                              <span className="font-mono text-purple-300 font-bold">NOVA-10{card.id}</span>
                              <span className="text-rose-400 font-bold uppercase">{card.sev}</span>
                            </div>
                            <p className="text-xs font-medium text-slate-200">{card.title}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Proof Stats */}
            <div className="mt-12 pt-8 border-t border-purple-500/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">&lt; 40ms</span>
                <p className="text-xs text-slate-400 mt-1">Socket Drag Latency</p>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono">10,000+</span>
                <p className="text-xs text-slate-400 mt-1">Sprints Delivered</p>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-blue-400 font-mono">99.99%</span>
                <p className="text-xs text-slate-400 mt-1">Uptime Availability</p>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">Zero</span>
                <p className="text-xs text-slate-400 mt-1">Workspace Distraction</p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section id="features" className="py-20 border-t border-purple-500/15 bg-slate-950/50 px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-purple-400">Core Architecture</span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Built from First Principles for Engineering Velocity
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-slate-400">
                Everything software developers, QA engineers, and engineering managers need to eliminate bottlenecks and ship on time.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="glass-card rounded-2xl p-6 border border-purple-500/15 hover:border-purple-500/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mb-4">
                  <Kanban className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Instant Drag-and-Drop Kanban</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Smooth HTML5 drag-and-drop workflow across To Do, In Progress, In Review, and Done. Auto-saves status changes with optimistic client state.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="glass-card rounded-2xl p-6 border border-purple-500/15 hover:border-purple-500/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mb-4">
                  <Bug className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Defect Severity & Bug Tracker</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Dedicated bug reporting with Blocker, Critical, Major, and Minor tiers. Direct screenshot uploads and reproduction stack trace attachments.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="glass-card rounded-2xl p-6 border border-purple-500/15 hover:border-purple-500/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center mb-4">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Deep Velocity & Sprint Analytics</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Interactive Recharts dashboards showing weekly completion trends, engineer velocity leaderboards, bug resolution ratios, and one-click CSV report exports.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="glass-card rounded-2xl p-6 border border-purple-500/15 hover:border-purple-500/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-4">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Real-Time WebSockets Collaboration</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Full Socket.io bidirectional sync. Team members see ticket cards move across boards instantaneously without refreshing their browsers.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="glass-card rounded-2xl p-6 border border-purple-500/15 hover:border-purple-500/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Granular Role-Based Access (RBAC)</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Enterprise-grade roles: Admin, Manager, Developer, and Viewer. Protect project settings, delete privileges, and member governance.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="glass-card rounded-2xl p-6 border border-purple-500/15 hover:border-purple-500/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mb-4">
                  <Terminal className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">RESTful API & Audit History</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Comprehensive REST API endpoints, JWT token authentication, threaded comment discussions, and permanent chronological audit event streams.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400">Streamlined Workflow</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              From Backlog to Production in 4 Simple Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-panel rounded-2xl p-6 relative">
              <span className="font-mono text-2xl font-black text-purple-400/40 mb-3 block">01</span>
              <h4 className="text-sm font-bold text-white">Initialize Project & Sprint</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Define your project key (e.g. CORE), set milestones, and invite team members with specific roles.
              </p>
            </div>

            <div className="glass-panel rounded-2xl p-6 relative">
              <span className="font-mono text-2xl font-black text-purple-400/40 mb-3 block">02</span>
              <h4 className="text-sm font-bold text-white">Log & Triage Defects</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                File bug tickets with automated severity tags, attach console screenshots, and assign responsible engineers.
              </p>
            </div>

            <div className="glass-panel rounded-2xl p-6 relative">
              <span className="font-mono text-2xl font-black text-purple-400/40 mb-3 block">03</span>
              <h4 className="text-sm font-bold text-white">Execute on Kanban Board</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Move work smoothly across columns with real-time drag-and-drop. Discuss blockers in threaded comments.
              </p>
            </div>

            <div className="glass-panel rounded-2xl p-6 relative">
              <span className="font-mono text-2xl font-black text-purple-400/40 mb-3 block">04</span>
              <h4 className="text-sm font-bold text-white">Analyze Velocity & Ship</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Review automated burn-down velocity charts, export CSV reports, and deploy verified releases with confidence.
              </p>
            </div>
          </div>
        </section>

        {/* PRICING PLANS */}
        <section id="pricing" className="py-20 border-t border-purple-500/15 bg-slate-950/60 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-purple-400">Transparent Pricing</span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Predictable Plans for Teams of Any Size
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-slate-400">
                Start with our fully featured free tier. Upgrade as your engineering organization scales.
              </p>

              {/* Billing Toggle */}
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
                  <span>Yearly Billing</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                    Save 20%
                  </span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Plan 1: Starter */}
              <div className="glass-card rounded-2xl p-6 border border-purple-500/15 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Starter</h3>
                  <p className="text-xs text-slate-400 mt-1">For independent engineers and early-stage prototypes.</p>
                  <div className="mt-5 text-3xl font-black text-white">
                    $0 <span className="text-xs font-medium text-slate-400">/ forever free</span>
                  </div>
                  <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Up to 3 active projects</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Real-time Kanban board</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Bug defect triage matrix</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Unlimited tasks & issues</li>
                  </ul>
                </div>
                <Link
                  to="/register"
                  className="mt-8 block text-center py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-purple-500/20 transition-colors"
                >
                  Get Started Free
                </Link>
              </div>

              {/* Plan 2: Pro (Highlighted) */}
              <div className="glass-card rounded-2xl p-6 border-2 border-purple-500 bg-purple-950/20 flex flex-col justify-between relative shadow-2xl shadow-purple-950/50">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
                  Most Popular
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Professional</h3>
                  <p className="text-xs text-slate-300 mt-1">For growing teams building commercial SaaS products.</p>
                  <div className="mt-5 text-3xl font-black text-white">
                    {billingPeriod === 'monthly' ? '$19' : '$15'}
                    <span className="text-xs font-medium text-slate-400"> / user / month</span>
                  </div>
                  <ul className="mt-6 space-y-2.5 text-xs text-slate-200">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Unlimited projects & workspaces</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> WebSocket real-time collaboration</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Deep velocity Recharts reporting</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> CSV sprint data export</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Full RBAC (Admin, Manager, Dev, Viewer)</li>
                  </ul>
                </div>
                <Link
                  to="/register"
                  className="mt-8 gradient-btn-primary block text-center py-2.5 rounded-xl text-xs font-bold shadow-lg"
                >
                  Start 14-Day Free Trial
                </Link>
              </div>

              {/* Plan 3: Enterprise */}
              <div className="glass-card rounded-2xl p-6 border border-purple-500/15 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Enterprise</h3>
                  <p className="text-xs text-slate-400 mt-1">For large organizations requiring bespoke SLA and audit.</p>
                  <div className="mt-5 text-3xl font-black text-white">
                    {billingPeriod === 'monthly' ? '$49' : '$39'}
                    <span className="text-xs font-medium text-slate-400"> / user / month</span>
                  </div>
                  <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Dedicated database clustering (MongoDB Atlas)</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Custom SSO & SAML enforcement</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 99.99% uptime SLA guarantee</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 24/7 dedicated engineering support</li>
                  </ul>
                </div>
                <Link
                  to="/contact"
                  className="mt-8 block text-center py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-purple-500/20 transition-colors"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* POLICY-COMPLIANT ADSENSE PROMO BANNER (ONLY on public content) */}
        <section className="py-6">
          <AdSenseSlot slotId="3456789012" format="horizontal" />
        </section>

        {/* FAQ ACCORDION */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400">Common Questions</span>
            <h2 className="mt-2 text-3xl font-extrabold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl border border-purple-500/15 bg-slate-900/50 backdrop-blur-md overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-sm font-bold text-white hover:text-purple-300 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-purple-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-purple-500/10 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* BOTTOM CALL TO ACTION */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="max-w-5xl mx-auto rounded-3xl border border-purple-500/30 bg-gradient-to-r from-blue-900/50 via-purple-900/40 to-slate-900/80 p-8 sm:p-14 text-center backdrop-blur-2xl relative shadow-2xl">
            <div className="glow-orb-purple -top-10 -right-10 w-80 h-80"></div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Ready to Accelerate Your Team’s Engineering Velocity?
            </h2>
            <p className="mt-4 text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
              Join forward-thinking software organizations tracking defects and delivering sprints with zero friction.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/register"
                className="gradient-btn-primary px-8 py-3 rounded-xl text-xs font-bold shadow-xl shadow-purple-950/50"
              >
                Create Free Workspace Now
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3 rounded-xl text-xs font-semibold bg-slate-900 text-slate-300 hover:text-white border border-purple-500/25"
              >
                Talk with an Architect
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

