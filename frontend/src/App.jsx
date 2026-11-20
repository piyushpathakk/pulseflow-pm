import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Common Components
import CookieBanner from './components/common/CookieBanner';
import Sidebar from './components/workspace/Sidebar';
import TopHeader from './components/workspace/TopHeader';
import CreateTaskModal from './components/workspace/CreateTaskModal';

// Public Pages
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PricingPage from './pages/PricingPage';
import BlogPage from './pages/BlogPage';
import ArticlePage from './pages/ArticlePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import DisclaimerPage from './pages/DisclaimerPage';
import CookiePolicyPage from './pages/CookiePolicyPage';

// Auth Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// Workspace Pages
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import AnalyticsPage from './pages/AnalyticsPage';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';
import AdminPage from './pages/AdminPage';

// Protected Route Guard
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1020] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Workspace Layout Wrapper
function WorkspaceLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [globalCreateOpen, setGlobalCreateOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 flex">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Workspace Area */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${collapsed ? 'pl-20' : 'pl-64'}`}>
        <TopHeader
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          onOpenCreateTask={() => setGlobalCreateOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/dashboard" element={<DashboardPage onOpenCreateTask={() => setGlobalCreateOpen(true)} />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>

      {/* Global Quick Create Task Modal */}
      <CreateTaskModal
        isOpen={globalCreateOpen}
        onClose={() => setGlobalCreateOpen(false)}
        onTaskCreated={() => {
          // Window reload or state broadcast
          window.location.reload();
        }}
        projects={[]}
      />
    </div>
  );
}

export default function App() {
  return (
    <>
      <Routes>
        {/* Public Website & AdSense Content Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<ArticlePage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/disclaimer" element={<DisclaimerPage />} />
        <Route path="/cookie-policy" element={<CookiePolicyPage />} />

        {/* Authentication Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Workspace Authenticated Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <WorkspaceLayout />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* Floating Cookie Consent Banner */}
      <CookieBanner />
    </>
  );
}
