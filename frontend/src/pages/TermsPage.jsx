import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import SEOHead from '../components/common/SEOHead';
import { FileCheck, Shield, AlertCircle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white">
      <SEOHead
        title="Terms and Conditions - PulseFlow Systems"
        description="Official terms of service governing usage of PulseFlow project management platform and public resources."
        canonical="https://pulseflow.dev/terms"
      />

      <Navbar />

      <main className="flex-1 py-14 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-3">
            <FileCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Legal Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Terms & Conditions
          </h1>
          <p className="mt-2 text-xs text-slate-400">
            Last modified: November 19, 2026
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-purple-500/15 space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">1. Agreement to Terms</h2>
            <p>
              By accessing or using PulseFlow, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access the service.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">2. User Accounts & Responsibilities</h2>
            <p>
              When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding your password and for any activities or actions under your account.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">3. Acceptable Use Policy</h2>
            <p>
              You agree not to use the service to log malicious software payloads, conduct unauthorized security scans against host infrastructure, or violate applicable intellectual property laws.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">4. Intellectual Property & Code Ownership</h2>
            <p>
              You retain 100% intellectual property ownership of all project data, code snippets, bug reports, and attachments uploaded to your PulseFlow workspaces. PulseFlow claims no rights over your proprietary software.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">5. Limitation of Liability</h2>
            <p>
              In no event shall PulseFlow Systems Inc., its officers, or developers be liable for any indirect, incidental, or consequential damages arising out of your use or inability to use the platform.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">6. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

