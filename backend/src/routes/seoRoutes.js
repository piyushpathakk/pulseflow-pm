const express = require('express');
const router = express.Router();
const store = require('../models/store');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

// @route   GET /ads.txt (Google AdSense crawler verification)
router.get('/ads.txt', async (req, res) => {
  try {
    const config = await store.AdSenseConfig.get();
    const content = config.adsTxtContent || `google.com, ${config.publisherId || 'pub-9876543210987654'}, DIRECT, f08c47fec0942fa0`;
    res.setHeader('Content-Type', 'text/plain');
    res.send(content);
  } catch (error) {
    res.status(500).send('google.com, pub-9876543210987654, DIRECT, f08c47fec0942fa0');
  }
});

// @route   GET /robots.txt (Search engine crawler instructions)
router.get('/robots.txt', (req, res) => {
  const host = req.headers.host || 'pulseflow.dev';
  const protocol = req.protocol || 'https';
  const robotsTxt = `# PulseFlow SEO Robots Configuration
User-agent: *
Allow: /
Allow: /about
Allow: /pricing
Allow: /contact
Allow: /blog
Allow: /blog/*
Allow: /privacy
Allow: /terms
Allow: /disclaimer
Allow: /cookie-policy

# Disallow authenticated SaaS workspaces and private API endpoints
Disallow: /dashboard
Disallow: /projects
Disallow: /projects/*
Disallow: /tasks/*
Disallow: /analytics
Disallow: /settings
Disallow: /admin
Disallow: /api/

Sitemap: ${protocol}://${host}/sitemap.xml
`;
  res.setHeader('Content-Type', 'text/plain');
  res.send(robotsTxt);
});

// @route   GET /sitemap.xml (Dynamic XML Sitemap for Google Search Console)
router.get('/sitemap.xml', async (req, res) => {
  try {
    const host = req.headers.host || 'localhost:5173';
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
    const baseUrl = `${protocol}://${host}`;

    const staticRoutes = [
      { loc: '/', priority: '1.0', changefreq: 'daily' },
      { loc: '/features', priority: '0.9', changefreq: 'weekly' },
      { loc: '/pricing', priority: '0.9', changefreq: 'weekly' },
      { loc: '/about', priority: '0.8', changefreq: 'monthly' },
      { loc: '/contact', priority: '0.8', changefreq: 'monthly' },
      { loc: '/blog', priority: '0.9', changefreq: 'daily' },
      { loc: '/privacy', priority: '0.5', changefreq: 'monthly' },
      { loc: '/terms', priority: '0.5', changefreq: 'monthly' },
      { loc: '/disclaimer', priority: '0.5', changefreq: 'monthly' },
      { loc: '/cookie-policy', priority: '0.5', changefreq: 'monthly' },
    ];

    const articles = await store.Article.find({ published: true });
    const now = new Date().toISOString();

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static pages
    for (const route of staticRoutes) {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${route.loc}</loc>\n`;
      xml += `    <lastmod>${now}</lastmod>\n`;
      xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
      xml += `    <priority>${route.priority}</priority>\n`;
      xml += `  </url>\n`;
    }

    // Dynamic blog articles
    for (const art of articles) {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/blog/${art.slug}</loc>\n`;
      xml += `    <lastmod>${art.publishedAt || now}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    }

    xml += `</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    res.status(500).send('Error generating sitemap');
  }
});

// @route   GET /api/adsense/config (Public)
router.get('/api/adsense/config', async (req, res) => {
  try {
    const config = await store.AdSenseConfig.get();
    res.json({
      success: true,
      config: {
        publisherId: config.publisherId,
        autoAdsEnabled: config.autoAdsEnabled,
        clientSideEnabled: config.clientSideEnabled,
        slotHeader: config.slotHeader,
        slotSidebar: config.slotSidebar,
        slotInFeed: config.slotInFeed,
        slotArticleBottom: config.slotArticleBottom,
        testMode: config.testMode,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch AdSense config.' });
  }
});

// @route   PUT /api/adsense/config (Admin)
router.put('/api/adsense/config', protect, authorize('Admin'), async (req, res) => {
  try {
    const updated = await store.AdSenseConfig.update(req.body);
    res.json({
      success: true,
      message: 'AdSense & Ads.txt configuration updated successfully.',
      config: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update AdSense config.', error: error.message });
  }
});

module.exports = router;
