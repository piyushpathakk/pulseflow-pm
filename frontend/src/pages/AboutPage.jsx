import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import SEOHead from '../components/common/SEOHead';
import AdSenseSlot from '../components/common/AdSenseSlot';
import { Layers, ShieldCheck, Cpu, Terminal, Users, Heart, Sparkles } from 'lucide-react';

export default function AboutPage() {
  const team = [
    {
      name: 'Alexander Pierce',
      role: 'Chief Technology Officer & Architect',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      bio: 'Former principal distributed systems architect. Obsessed with sub-50ms UI response loops.',
    },
    {
      name: 'Sarah Chen',
      role: 'VP of Engineering',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
      bio: 'Agile transformation leader. Pioneered WIP-limit flow metrics in cloud platforms.',
    },
    {
      name: 'Alex Rivera',
      role: 'Lead Full-Stack Systems Engineer',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      bio: 'React 19, WebSockets, and database engine tuning specialist.',
    },
    {
      name: 'Elena Rostova',
      role: 'Director of QA & Reliability',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
      bio: 'Defect triage strategist. Passionate about automated regression and zero-downtime hotfixes.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white">
      <SEOHead
        title="About Us - PulseFlow Systems"
        description="Learn about the engineering mission, architecture, and team behind PulseFlow, the next-generation project management platform."
        canonical="https://pulseflow.dev/about"
      />

      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-4">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>Our Origin & Engineering Philosophy</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Engineering Tools Built for Engineers, Not Bureaucracy
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
            PulseFlow was founded on a simple realization: enterprise software teams shouldn’t have to choose between the lightning speed of modern developer tools and the rigorous compliance governance demanded by commercial stakeholders.
          </p>
        </div>

        {/* Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="glass-panel rounded-2xl p-6 border border-purple-500/15">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Sub-50ms Reactive State</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Every status move, card re-order, and triage decision is processed optimistically in the client, while syncing synchronously via persistent WebSockets.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-purple-500/15">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Enterprise Defect Matrix</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              We separate severity from priority. Blocker bugs trigger instant alerts to responsible engineers, while cosmetic polish items sit cleanly in sprint queues.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-purple-500/15">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-4">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Zero Monolithic Bloat</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              No 40-step wizard configurations or slow page loads. Keyboard shortcuts, transparent glassmorphism, and instant search keep developers in their flow state.
            </p>
          </div>
        </div>

        {/* AdSense Unit on Public Content */}
        <AdSenseSlot slotId="1234567890" format="horizontal" />

        {/* Leadership Team */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400">Leadership Team</span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white">
              The Architects Behind PulseFlow
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <div key={i} className="glass-card rounded-2xl p-5 border border-purple-500/15 text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-20 h-20 rounded-2xl object-cover mx-auto border-2 border-purple-500/30 mb-3 shadow-md"
                />
                <h4 className="text-sm font-bold text-white">{member.name}</h4>
                <p className="text-[11px] text-purple-400 font-medium mt-0.5">{member.role}</p>
                <p className="text-[11px] text-slate-400 mt-2.5 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

