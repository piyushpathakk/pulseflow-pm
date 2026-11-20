import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sparkles, Sun, Moon, Menu, X, ArrowRight, Layers } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Features', path: '/#features' },
    { name: 'How It Works', path: '/#how-it-works' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-purple-500/15 bg-[#0B1020]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/50 transition-all duration-300">
            <Layers className="h-5 w-5 text-white transform group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5">
              Pulse<span className="gradient-text">Flow</span>
            </span>
            <span className="text-[9px] font-mono tracking-widest text-purple-400 uppercase -mt-1 font-semibold">
              Enterprise PM
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-purple-400 ${
                location.pathname === link.path ? 'text-purple-400 font-semibold' : 'text-slate-300'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors border border-purple-500/10"
            title="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-400" />}
          </button>

          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="gradient-btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Open Workspace
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800/50 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="gradient-btn-primary flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              >
                Start Free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-slate-400 hover:text-white"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-400" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-purple-500/20 bg-[#0B1020]/95 px-4 pt-2 pb-6 backdrop-blur-2xl">
          <div className="space-y-2 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-base font-medium text-slate-200 hover:bg-purple-900/20 hover:text-purple-300"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-purple-500/15 flex flex-col gap-2">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="gradient-btn-primary flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold"
              >
                <Sparkles className="w-4 h-4" />
                Go to Workspace
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-medium text-slate-300 border border-purple-500/20 rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="gradient-btn-primary w-full text-center py-2.5 rounded-xl text-sm font-semibold"
                >
                  Create Free Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
