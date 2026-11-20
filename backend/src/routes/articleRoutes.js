const express = require('express');
const router = express.Router();
const store = require('../models/store');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

// Helper to generate SEO slug
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

// @route   GET /api/articles (Public)
router.get('/', async (req, res) => {
  try {
    const { category, tag, search, all } = req.query;

    const filter = {};
    if (!all || all !== 'true') {
      filter.published = true;
    }
    if (category && category !== 'All') {
      filter.category = category;
    }

    let articles = await store.Article.find(filter);

    if (tag) {
      articles = articles.filter(a => a.tags && a.tags.includes(tag));
    }

    if (search) {
      const q = search.toLowerCase();
      articles = articles.filter(a =>
        a.title.toLowerCase().includes(q) ||
        (a.excerpt && a.excerpt.toLowerCase().includes(q)) ||
        (a.content && a.content.toLowerCase().includes(q))
      );
    }

    res.json({
      success: true,
      count: articles.length,
      articles,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch articles.', error: error.message });
  }
});

// @route   GET /api/articles/categories
router.get('/categories', async (req, res) => {
  try {
    const articles = await store.Article.find({ published: true });
    const categoryCounts = {};

    articles.forEach(a => {
      const cat = a.category || 'General';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const list = Object.keys(categoryCounts).map(name => ({
      name,
      count: categoryCounts[name],
    }));

    res.json({
      success: true,
      categories: list,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch categories.', error: error.message });
  }
});

// @route   GET /api/articles/slug/:slug (Public)
router.get('/slug/:slug', async (req, res) => {
  try {
    const article = await store.Article.findBySlug(req.params.slug);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found.' });
    }

    // Fetch related articles in same category
    const allInCat = await store.Article.find({ category: article.category, published: true });
    const related = allInCat
      .filter(a => (a._id || a.id) !== (article._id || article.id))
      .slice(0, 3);

    res.json({
      success: true,
      article,
      related,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch article.', error: error.message });
  }
});

// @route   POST /api/articles (Admin or Manager)
router.post('/', protect, authorize('Admin', 'Manager'), async (req, res) => {
  try {
    const { title, excerpt, content, coverImage, category, tags, readTime, published, metaTitle, metaDescription } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required.' });
    }

    let slug = slugify(title);
    // Check slug collision
    const existing = await store.Article.findBySlug(slug);
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const calculatedReadTime = readTime || Math.max(1, Math.round(content.split(/\s+/).length / 200));

    const article = await store.Article.create({
      title,
      slug,
      excerpt: excerpt || content.substring(0, 160) + '...',
      content,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80',
      author: req.user._id || req.user.id,
      authorId: req.user._id || req.user.id,
      category: category || 'Project Management',
      tags: tags || ['Agile', 'DevOps'],
      readTime: calculatedReadTime,
      published: published !== undefined ? published : true,
      publishedAt: new Date().toISOString(),
      metaTitle: metaTitle || `${title} | PulseFlow Engineering`,
      metaDescription: metaDescription || excerpt || title,
    });

    res.status(201).json({
      success: true,
      message: 'Article published successfully.',
      article,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create article.', error: error.message });
  }
});

// @route   PUT /api/articles/:id (Admin or Manager)
router.put('/:id', protect, authorize('Admin', 'Manager'), async (req, res) => {
  try {
    const article = await store.Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found.' });
    }

    if (req.body.title && req.body.title !== article.title && !req.body.slug) {
      req.body.slug = slugify(req.body.title);
    }

    const updated = await store.Article.updateById(req.params.id, req.body);

    res.json({
      success: true,
      message: 'Article updated successfully.',
      article: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update article.', error: error.message });
  }
});

// @route   DELETE /api/articles/:id (Admin only)
router.delete('/:id', protect, authorize('Admin'), async (req, res) => {
  try {
    const article = await store.Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found.' });
    }

    await store.Article.deleteById(req.params.id);

    res.json({
      success: true,
      message: 'Article deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete article.', error: error.message });
  }
});

module.exports = router;
