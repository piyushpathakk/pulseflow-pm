import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import SEOHead from '../components/common/SEOHead';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white">
      <SEOHead
        title="Privacy Policy - PulseFlow Systems"
        description="Read the official Privacy Policy for PulseFlow Systems, including Google AdSense disclosures, GDPR compliance, and cookie terms."
        canonical="https://pulseflow.dev/privacy"
      />

      <Navbar />

      <main className="flex-1 py-14 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Compliance & Data Protection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-2 text-xs text-slate-400">
            Last updated: November 19, 2026 • Effective immediately
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-purple-500/15 space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-400" />
              1. Introduction & Overview
            </h2>
            <p>
              PulseFlow Systems Inc. ("PulseFlow", "we", "our", or "us") operates the website and enterprise SaaS application at <strong className="text-white">pulseflow.dev</strong>. This Privacy Policy informs you of our policies regarding the collection, use, and disclosure of personal data when you use our service and the choices you have associated with that data.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-purple-400" />
              2. Information We Collect
            </h2>
            <p>
              We collect information to deliver high-velocity project management services to your engineering team:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
              <li><strong className="text-white">Account Information:</strong> Name, work email address, hashed passwords (via bcrypt), profile pictures, and organization role.</li>
              <li><strong className="text-white">Workspace Data:</strong> Projects, tasks, bug tickets, severity ratings, screenshots, and threaded comments created within authenticated sessions.</li>
              <li><strong className="text-white">Log Files & Telemetry:</strong> IP addresses, browser types, internet service provider (ISP), referring/exit pages, date/time stamps, and click metrics.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" />
              3. Google AdSense & Third-Party Advertising Disclosures
            </h2>
            <p>
              We may partner with Google AdSense to display non-intrusive advertisements strictly on public educational resources (such as our engineering blog).
            </p>
            <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs space-y-2">
              <p>
                <strong className="text-purple-300">Google DoubleClick DART Cookies:</strong> Google is a third-party vendor on our public website. It uses cookies (known as DART cookies) to serve ads based on users’ prior visits to our site and other internet properties.
              </p>
              <p>
                Users may opt out of the use of DART cookies by visiting the Google Ad and Content Network Privacy Policy at: <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noreferrer" className="text-purple-400 underline">https://policies.google.com/technologies/ads</a>.
              </p>
              <p>
                <strong className="text-white">Workspace Exemption:</strong> Advertisements are NEVER displayed inside authenticated dashboards, Kanban workspaces, or private project repositories.
              </p>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">4. GDPR & CCPA Rights</h2>
            <p>
              Under the European Union General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA), you possess:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li>The right to access and receive a copy of your personal data.</li>
              <li>The right to rectify inaccurate personal information.</li>
              <li>The right to request permanent deletion of your user account and data.</li>
              <li>The right to withdraw consent at any time.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">5. Security of Personal Data</h2>
            <p>
              We implement industry-standard cryptographic practices, including bcrypt password hashing, JSON Web Tokens (JWT), and Helmet HTTP security headers. However, no transmission method over the internet or method of electronic storage is 100% impenetrable.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">6. Contact Our Data Protection Officer</h2>
            <p>
              If you have inquiries regarding this Privacy Policy or wish to exercise your data rights, please contact our privacy compliance team at <strong className="text-purple-300 font-mono">privacy@pulseflow.dev</strong>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

