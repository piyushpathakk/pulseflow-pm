import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import SEOHead from '../components/common/SEOHead';
import { useToast } from '../context/ToastContext';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Clock } from 'lucide-react';

export default function ContactPage() {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    setLoading(true);
    // Simulate inquiry submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      showToast('Your message has been received! Our engineering lead will respond within 24 hours.', 'success');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white">
      <SEOHead
        title="Contact Us - PulseFlow Enterprise Support"
        description="Get in touch with PulseFlow platform architects for enterprise inquiries, migration assistance, or platform feedback."
        canonical="https://pulseflow.dev/contact"
      />

      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-3">
            <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
            <span>Direct Engineering Line</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Connect with PulseFlow Systems
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            Have questions about scaling our agile stack, deploying private clusters, or migrating from Jira? Our engineering team is here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Office & SLA Info */}
          <div className="space-y-4">
            <div className="glass-panel rounded-2xl p-5 border border-purple-500/15">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center mb-3">
                <Mail className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Engineering Inquiries</h4>
              <p className="text-xs text-purple-300 font-mono mt-1">support@pulseflow.dev</p>
              <p className="text-[11px] text-slate-400 mt-1">24/7 coverage for Critical/Blocker alerts.</p>
            </div>

            <div className="glass-panel rounded-2xl p-5 border border-purple-500/15">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mb-3">
                <Clock className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Guaranteed Response SLA</h4>
              <p className="text-xs text-slate-300 mt-1 font-semibold">Sub-4 Hour Initial Triage</p>
              <p className="text-[11px] text-slate-400 mt-1">All enterprise inquiries reviewed by staff engineers.</p>
            </div>

            <div className="glass-panel rounded-2xl p-5 border border-purple-500/15">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-3">
                <MapPin className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Headquarters</h4>
              <p className="text-xs text-slate-300 mt-1">540 Market Street, Suite 900</p>
              <p className="text-[11px] text-slate-400">San Francisco, CA 94104</p>
            </div>
          </div>

          {/* Right Column: Contact Form (2 cols) */}
          <div className="md:col-span-2 glass-panel rounded-3xl p-7 border border-purple-500/25 shadow-2xl">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">Inquiry Dispatched Successfully</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{name}</strong>. A staff systems architect has been notified and will follow up with you at <strong className="text-purple-300 font-mono">{email}</strong> shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                  }}
                  className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Your Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Jordan Hayes"
                      className="glass-input w-full px-3.5 py-2.5 text-xs rounded-xl text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Work Email *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="glass-input w-full px-3.5 py-2.5 text-xs rounded-xl text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Inquiry Type</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="glass-input w-full px-3.5 py-2.5 text-xs rounded-xl cursor-pointer"
                  >
                    <option value="Enterprise Migration">Enterprise Migration from Jira / Asana</option>
                    <option value="Dedicated Cluster">Dedicated MongoDB Atlas Clustering</option>
                    <option value="General Inquiry">General Product Inquiry</option>
                    <option value="Security & Compliance">Security, SOC-2 & GDPR Compliance</option>
                    <option value="Partnership">Technology Partnership / AdSense Compliance</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Message Context *</label>
                  <textarea
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your team size, current bottlenecks, and deployment requirements..."
                    className="glass-input w-full p-3.5 text-xs rounded-xl leading-relaxed font-mono"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="gradient-btn-primary px-6 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-lg shadow-purple-950/40"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Transmitting...' : 'Send Inquiry to Architecture Team'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

