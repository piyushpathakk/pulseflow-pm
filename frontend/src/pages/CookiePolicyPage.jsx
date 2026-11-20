import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import SEOHead from '../components/common/SEOHead';
import { Cookie, Shield, CheckCircle } from 'lucide-react';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white">
      <SEOHead
        title="Cookie Policy - PulseFlow Systems"
        description="Comprehensive Cookie Policy explaining how PulseFlow and Google AdSense utilize cookies and how you can manage your preferences."
        canonical="https://pulseflow.dev/cookie-policy"
      />

      <Navbar />

      <main className="flex-1 py-14 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-3">
            <Cookie className="w-3.5 h-3.5 text-purple-400" />
            <span>Transparency & Choice</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Cookie Policy
          </h1>
          <p className="mt-2 text-xs text-slate-400">
            Last updated: November 19, 2026
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-purple-500/15 space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">1. What Are Cookies?</h2>
            <p>
              Cookies are small text files stored on your browser or device when you visit websites. They help websites remember your actions and preferences (such as authentication tokens, dark mode settings, and session status) over a period of time.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">2. Categories of Cookies We Use</h2>

            <div className="p-4 rounded-xl bg-slate-900 border border-purple-500/15 space-y-1">
              <h3 className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                A. Strictly Essential Cookies (First-Party)
              </h3>
              <p className="text-xs text-slate-400">
                These cookies are necessary for the platform to function. They store your JWT session token (<code className="text-purple-300">pulseflow_token</code>), user preferences, and theme state. You cannot disable these without breaking login functionality.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-purple-500/15 space-y-1">
              <h3 className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                B. Google AdSense Advertising & Partner Cookies
              </h3>
              <p className="text-xs text-slate-400">
                Google uses cookies (including the DoubleClick DART cookie) to serve relevant advertisements to visitors based on visits to <code className="text-purple-300">pulseflow.dev/blog</code> and other sites on the web. These cookies collect anonymized browsing behavior to measure ad effectiveness.
              </p>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">3. How to Manage and Opt Out of Cookies</h2>
            <p>
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li>
                To opt out of Google AdSense personalized advertising, visit Google's Ad Settings:{' '}
                <a href="https://adssettings.google.com" target="_blank" rel="noreferrer" className="text-purple-400 underline">
                  https://adssettings.google.com
                </a>.
              </li>
              <li>
                You may also opt out of third-party vendor cookies for personalized advertising by visiting{' '}
                <a href="https://www.aboutads.info/choices/" target="_blank" rel="noreferrer" className="text-purple-400 underline">
                  www.aboutads.info
                </a>.
              </li>
            </ul>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

