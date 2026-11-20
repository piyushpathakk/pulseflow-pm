require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const { Server } = require('socket.io');

const { connectDB } = require('./config/db');
const { initSocket } = require('./socket/socketHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const commentRoutes = require('./routes/commentRoutes');
const activityRoutes = require('./routes/activityRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const articleRoutes = require('./routes/articleRoutes');
const adminRoutes = require('./routes/adminRoutes');
const seoRoutes = require('./routes/seoRoutes');

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const clientOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
const io = new Server(server, {
  cors: {
    origin: [clientOrigin, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});
initSocket(io);

// Security & Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false, // Allows AdSense and dynamic font injection
}));

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Static uploads folder
const uploadDir = path.join(__dirname, '..', 'uploads');
app.use('/uploads', express.static(uploadDir));

// Mount SEO & AdSense verification routes at root
app.use('/', seoRoutes);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'PulseFlow Enterprise PM & Issue Tracker',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Serve frontend build if dist exists (Production mode)
const clientDist = path.join(__dirname, '..', '..', 'frontend', 'dist');
const fs = require('fs');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api/') || req.originalUrl === '/ads.txt' || req.originalUrl === '/sitemap.xml' || req.originalUrl === '/robots.txt') {
      return next();
    }
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: `API route ${req.originalUrl} not found.` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Application Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 5000;

// Start server after connecting to database
const startServer = async () => {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`🚀 PulseFlow Server active on port ${PORT} [Mode: ${process.env.NODE_ENV || 'development'}]`);
    console.log(`📡 Socket.io ready for real-time collaboration`);
    console.log(`🌐 API Health check available at: http://localhost:${PORT}/api/health`);
    console.log(`📄 AdSense ads.txt available at: http://localhost:${PORT}/ads.txt`);
    console.log(`🗺️ XML Sitemap available at: http://localhost:${PORT}/sitemap.xml`);
  });
};

if (require.main === module) {
  startServer();
}

module.exports = { app, server, startServer };
