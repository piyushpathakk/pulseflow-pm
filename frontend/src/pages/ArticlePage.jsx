import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import SEOHead from '../components/common/SEOHead';
import AdSenseSlot from '../components/common/AdSenseSlot';
import api from '../api/axiosClient';
import { useToast } from '../context/ToastContext';
import {
  Clock,
  Calendar,
  Eye,
  Share2,
  Copy,
  ArrowLeft,
  BookOpen,
  User,
  Sparkles,
} from 'lucide-react';

export default function ArticlePage() {
  const { slug } = useParams();
  const { showToast } = useToast();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/articles/slug/${slug}`);
        if (res.data.success) {
          setArticle(res.data.article);
          setRelated(res.data.related || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Article link copied to clipboard!', 'success');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1020] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[#0B1020] text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <BookOpen className="w-12 h-12 text-purple-400 opacity-50 mb-3" />
          <h2 className="text-xl font-bold text-white">Article Not Found</h2>
          <p className="text-xs text-slate-400 mt-1">The requested publication might have been renamed or moved.</p>
          <Link to="/blog" className="mt-4 gradient-btn-primary px-4 py-2 rounded-xl text-xs font-semibold">
            Return to Engineering Blog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white">
      <SEOHead
        title={article.metaTitle || article.title}
        description={article.metaDescription || article.excerpt}
        canonical={`https://pulseflow.dev/blog/${article.slug}`}
      />

      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {/* Back Link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Publications
        </Link>

        {/* Article Header */}
        <header className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-[11px] font-bold text-purple-300 uppercase tracking-wider">
              {article.category}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {article.views || 1} views
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {article.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {article.excerpt}
          </p>

          {/* Author & Timestamp Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-purple-500/15">
            <div className="flex items-center gap-3">
              <img
                src={article.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={article.author?.name || 'Author'}
                className="w-10 h-10 rounded-full object-cover border border-purple-500/30"
              />
              <div>
                <p className="text-xs font-bold text-white">{article.author?.name || 'PulseFlow Engineering'}</p>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {new Date(article.publishedAt || article.createdAt).toLocaleDateString(undefined, {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-purple-400" />
                    {article.readTime || 5} min read
                  </span>
                </div>
              </div>
            </div>

            {/* Social Share Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="p-2 rounded-xl bg-slate-900 border border-purple-500/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Copy Article Link"
              >
                <Copy className="w-4 h-4" />
              </button>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-slate-900 border border-purple-500/15 text-slate-300 hover:text-white transition-colors"
                title="Share on Twitter"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-slate-900 border border-purple-500/15 text-slate-300 hover:text-white transition-colors"
                title="Share on LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>
          </div>
        </header>

        {/* Featured Cover Banner */}
        {article.coverImage && (
          <div className="my-8 rounded-3xl overflow-hidden border border-purple-500/20 shadow-2xl">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full max-h-[420px] object-cover"
            />
          </div>
        )}

        {/* AdSense Unit In-Article Top */}
        <AdSenseSlot slotId="3456789012" format="horizontal" />

        {/* Article Body Content */}
        <div className="prose prose-invert prose-purple max-w-none text-slate-200 text-sm leading-relaxed space-y-5 my-8">
          {article.content.split('\n\n').map((paragraph, index) => {
            const trimmed = paragraph.trim();
            if (!trimmed) return null;

            if (trimmed.startsWith('# ')) {
              return (
                <h1 key={index} className="text-2xl sm:text-3xl font-extrabold text-white mt-8 mb-4">
                  {trimmed.replace('# ', '')}
                </h1>
              );
            }
            if (trimmed.startsWith('## ')) {
              return (
                <h2 key={index} className="text-xl sm:text-2xl font-bold text-white mt-7 mb-3 border-b border-purple-500/15 pb-2">
                  {trimmed.replace('## ', '')}
                </h2>
              );
            }
            if (trimmed.startsWith('### ')) {
              return (
                <h3 key={index} className="text-base sm:text-lg font-bold text-purple-300 mt-5 mb-2">
                  {trimmed.replace('### ', '')}
                </h3>
              );
            }
            if (trimmed.startsWith('---')) {
              return <hr key={index} className="border-purple-500/20 my-6" />;
            }

            return (
              <p key={index} className="text-slate-300 leading-relaxed text-sm">
                {trimmed}
              </p>
            );
          })}
        </div>

        {/* AdSense Unit Bottom */}
        <AdSenseSlot slotId="4567890123" format="auto" />

        {/* Author Bio Box */}
        <div className="my-10 p-6 rounded-2xl border border-purple-500/20 bg-slate-900/60 backdrop-blur-xl flex flex-col sm:flex-row items-center gap-5">
          <img
            src={article.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}
            alt={article.author?.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-500/30 shrink-0"
          />
          <div className="text-center sm:text-left">
            <h4 className="text-sm font-bold text-white">Written by {article.author?.name || 'PulseFlow Systems'}</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {article.author?.bio || 'Architectural engineer and agile practitioner focused on low-latency reactive applications and defect management frameworks.'}
            </p>
          </div>
        </div>

        {/* Related Articles */}
        {related.length > 0 && (
          <div className="mt-14 pt-8 border-t border-purple-500/15">
            <h3 className="text-base font-bold text-white mb-6">Related Publications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.map((rel) => (
                <Link
                  key={rel._id || rel.id}
                  to={`/blog/${rel.slug}`}
                  className="glass-card rounded-2xl p-4 border border-purple-500/15 hover:border-purple-500/40 transition-all group block"
                >
                  <span className="text-[10px] uppercase font-bold text-purple-400">{rel.category}</span>
                  <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors mt-1 line-clamp-2">
                    {rel.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 mt-2 block">{rel.readTime || 5} min read</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

