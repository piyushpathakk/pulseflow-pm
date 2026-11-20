import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import SEOHead from '../components/common/SEOHead';
import { AlertCircle, HelpCircle } from 'lucide-react';

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white">
      <SEOHead
        title="Disclaimer - PulseFlow Systems"
        description="Official disclaimer regarding software metrics, external resources, and monetization transparency on PulseFlow."
        canonical="https://pulseflow.dev/disclaimer"
      />

      <Navbar />

      <main className="flex-1 py-14 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-3">
            <AlertCircle className="w-3.5 h-3.5 text-purple-400" />
            <span>Operational Disclosure</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Legal Disclaimer
          </h1>
          <p className="mt-2 text-xs text-slate-400">
            Last modified: November 19, 2026
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-purple-500/15 space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">1. General Information Disclaimer</h2>
            <p>
              The information provided by PulseFlow Systems Inc. on <strong className="text-white">pulseflow.dev</strong> and through our project management applications is for general informational and productivity tracking purposes only. All information is provided in good faith; however, we make no representation or warranty of any kind regarding accuracy or completeness.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">2. Engineering & Code Execution Disclaimer</h2>
            <p>
              Tutorials, architectural guides, and code examples published on the PulseFlow Engineering Blog are educational. Teams should conduct their own independent code reviews, security tests, and performance benchmarks before implementing patterns into mission-critical production environments.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">3. Advertising & Monetization Transparency</h2>
            <p>
              PulseFlow may display third-party advertisements via Google AdSense on public informational web pages. These ads are intended to help subsidize the hosting of free educational publications. We strictly enforce that advertisements:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Are clearly marked as "SPONSORED / ADVERTISEMENT".</li>
              <li>Are never embedded within private workspaces, dashboards, or login flows.</li>
              <li>Do not influence the editorial integrity of our engineering publications.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">4. External Links Disclaimer</h2>
            <p>
              Our website may contain links to external third-party websites or services. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

