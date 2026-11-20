import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-purple-500/15 bg-[#070B16] text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 shadow-md shadow-purple-500/20">
                <Layers className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-extrabold text-white">
                Pulse<span className="gradient-text">Flow</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-400 max-w-sm">
              The next-generation project management & bug tracking SaaS platform combining Linear keyboard velocity with Jira enterprise governance.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg p-2 bg-slate-900 border border-purple-500/15 text-slate-400 hover:text-white hover:border-purple-500/40 transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg p-2 bg-slate-900 border border-purple-500/15 text-slate-400 hover:text-white hover:border-purple-500/40 transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg p-2 bg-slate-900 border border-purple-500/15 text-slate-400 hover:text-white hover:border-purple-500/40 transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Google AdSense & GDPR Ready Compliance</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Product</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link to="/#features" className="hover:text-purple-400 transition-colors">Kanban Board</Link></li>
              <li><Link to="/#features" className="hover:text-purple-400 transition-colors">Bug & Issue Tracker</Link></li>
              <li><Link to="/#features" className="hover:text-purple-400 transition-colors">Velocity Analytics</Link></li>
              <li><Link to="/pricing" className="hover:text-purple-400 transition-colors">Pricing Plans</Link></li>
              <li><a href="/sitemap.xml" className="hover:text-purple-400 transition-colors">XML Sitemap</a></li>
            </ul>
          </div>

          {/* Resources & Blog */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Resources</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link to="/blog" className="hover:text-purple-400 transition-colors">Engineering Blog</Link></li>
              <li><Link to="/blog/modern-agile-sprint-workflows-linear-vs-jira" className="hover:text-purple-400 transition-colors">Agile Workflows</Link></li>
              <li><Link to="/blog/defect-severity-matrix-bug-triage-guide" className="hover:text-purple-400 transition-colors">Defect Severity Guide</Link></li>
              <li><Link to="/blog/mastering-kanban-wip-limits-flow-efficiency" className="hover:text-purple-400 transition-colors">Kanban Best Practices</Link></li>
              <li><a href="/robots.txt" className="hover:text-purple-400 transition-colors">robots.txt</a></li>
            </ul>
          </div>

          {/* Legal & Compliance (Crucial for AdSense approval) */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Compliance & Legal</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link to="/about" className="hover:text-purple-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-purple-400 transition-colors">Contact Us</Link></li>
              <li><Link to="/privacy" className="hover:text-purple-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-purple-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/disclaimer" className="hover:text-purple-400 transition-colors">Disclaimer</Link></li>
              <li><Link to="/cookie-policy" className="hover:text-purple-400 transition-colors">Cookie Policy</Link></li>
              <li><a href="/ads.txt" className="hover:text-purple-400 transition-colors">ads.txt Verification</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-purple-500/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} PulseFlow Systems Inc. All rights reserved. Built for engineering excellence.
          </p>
          <div className="flex items-center gap-1">
            <span>Engineered with precision for modern SaaS teams</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
