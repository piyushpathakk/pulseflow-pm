import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import SEOHead from '../components/common/SEOHead';
import AdSenseSlot from '../components/common/AdSenseSlot';
import api from '../api/axiosClient';
import {
  BookOpen,
  Search,
  Clock,
  ArrowRight,
  Tag,
  Sparkles,
  Calendar,
  Share2,
} from 'lucide-react';

export default function BlogPage() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artRes, catRes] = await Promise.all([
          api.get('/articles'),
          api.get('/articles/categories'),
        ]);

        if (artRes.data.success) {
          setArticles(artRes.data.articles || []);
        }
        if (catRes.data.success) {
          setCategories(catRes.data.categories || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = articles.filter((a) => {
    if (selectedCategory !== 'All' && a.category !== selectedCategory) return false;
    if (search) {
      const q = search.toLowerCase();
      const match =
        a.title.toLowerCase().includes(q) ||
        (a.excerpt && a.excerpt.toLowerCase().includes(q)) ||
        (a.tags && a.tags.some((t) => t.toLowerCase().includes(q)));
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white">
      <SEOHead
        title="PulseFlow Engineering & Agile Resources Blog"
        description="In-depth tutorials, architectural deep-dives, defect triage strategies, and Kanban optimization guides by senior software engineers."
        canonical="https://pulseflow.dev/blog"
      />

      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        {/* Blog Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
            <span>Original Educational Publications</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Engineering & Product Insights
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-slate-400">
            Actionable software development tutorials, bug triage frameworks, and agile workflows written by engineers for engineers.
          </p>
        </div>

        {/* Toolbar: Category Filters + Search */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 p-3 rounded-2xl bg-slate-900/50 border border-purple-500/15 backdrop-blur-xl">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              All Topics ({articles.length})
            </button>
            {categories.map((c) => (
              <button
                key={c.name}
                onClick={() => setSelectedCategory(c.name)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === c.name
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white'
                }`}
              >
                {c.name} ({c.count})
              </button>
            ))}
          </div>

          <div className="relative min-w-[200px] max-w-xs flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles & tags..."
              className="glass-input w-full pl-9 pr-3 py-1.5 text-xs rounded-xl"
            />
          </div>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="w-8 h-8 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-purple-500/20 bg-slate-900/30">
            <BookOpen className="w-10 h-10 text-purple-400 mx-auto opacity-50 mb-2" />
            <h3 className="text-sm font-bold text-white">No articles found</h3>
            <p className="text-xs text-slate-400 mt-1">Try another keyword or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {filtered.map((art) => {
              const artId = art._id || art.id;
              return (
                <article
                  key={artId}
                  className="glass-card group flex flex-col justify-between rounded-3xl overflow-hidden border border-purple-500/15 bg-slate-900/50 hover:border-purple-500/40 transition-all duration-300"
                >
                  {/* Article Cover Image */}
                  <Link to={`/blog/${art.slug}`} className="block relative aspect-video overflow-hidden">
                    <img
                      src={art.coverImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800'}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-purple-500/20 text-[10px] font-bold text-purple-300 uppercase tracking-wider">
                      {art.category}
                    </div>
                  </Link>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Reading Time & Date */}
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mb-2.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-purple-400" />
                          {art.readTime || 5} min read
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {new Date(art.publishedAt || art.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      <Link to={`/blog/${art.slug}`}>
                        <h2 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors leading-snug">
                          {art.title}
                        </h2>
                      </Link>

                      <p className="mt-2.5 text-xs text-slate-300 line-clamp-3 leading-relaxed">
                        {art.excerpt}
                      </p>

                      {/* Tags */}
                      {art.tags && art.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {art.tags.map((t, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-purple-950/40 text-purple-300 border border-purple-500/20"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Author Footer */}
                    <div className="mt-6 pt-4 border-t border-purple-500/10 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={art.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60'}
                          alt={art.author?.name || 'Author'}
                          className="w-7 h-7 rounded-full object-cover border border-purple-500/30"
                        />
                        <span className="text-xs font-semibold text-slate-200">
                          {art.author?.name || 'PulseFlow Engineering'}
                        </span>
                      </div>

                      <Link
                        to={`/blog/${art.slug}`}
                        className="flex items-center gap-1 text-xs font-bold text-purple-400 group-hover:text-purple-300 group-hover:translate-x-1 transition-all"
                      >
                        Read Article &rarr;
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Compliant AdSense Banner (in between resource grid and footer) */}
        <AdSenseSlot slotId="4567890123" format="auto" />
      </main>

      <Footer />
    </div>
  );
}

