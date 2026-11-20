const mongoose = require('mongoose');
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbState = {
  type: 'sqlite', // 'mongodb' or 'sqlite'
  connected: false,
  sqliteDb: null,
};

// SQLite tables initialization
function initSqlite() {
  const dataDir = path.join(__dirname, '..', '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbPath = path.join(dataDir, 'pulseflow.db');
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');

  // Create core tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'Developer',
      avatar TEXT DEFAULT '',
      bio TEXT DEFAULT '',
      settings TEXT DEFAULT '{}',
      resetPasswordToken TEXT,
      resetPasswordExpire INTEGER,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      key TEXT UNIQUE NOT NULL,
      description TEXT DEFAULT '',
      status TEXT DEFAULT 'Active',
      priority TEXT DEFAULT 'Medium',
      deadline TEXT,
      ownerId TEXT NOT NULL,
      members TEXT DEFAULT '[]',
      tags TEXT DEFAULT '[]',
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      key TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      type TEXT DEFAULT 'task',
      status TEXT DEFAULT 'todo',
      priority TEXT DEFAULT 'medium',
      severity TEXT DEFAULT 'minor',
      projectId TEXT NOT NULL,
      assigneeId TEXT,
      reporterId TEXT NOT NULL,
      deadline TEXT,
      tags TEXT DEFAULT '[]',
      attachments TEXT DEFAULT '[]',
      orderIndex INTEGER DEFAULT 0,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      taskId TEXT NOT NULL,
      userId TEXT NOT NULL,
      text TEXT NOT NULL,
      attachments TEXT DEFAULT '[]',
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS activities (
      id TEXT PRIMARY KEY,
      projectId TEXT,
      taskId TEXT,
      userId TEXT NOT NULL,
      action TEXT NOT NULL,
      details TEXT DEFAULT '',
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      recipientId TEXT NOT NULL,
      senderId TEXT,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      link TEXT DEFAULT '',
      read INTEGER DEFAULT 0,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS articles (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      excerpt TEXT DEFAULT '',
      content TEXT NOT NULL,
      coverImage TEXT DEFAULT '',
      authorId TEXT NOT NULL,
      category TEXT DEFAULT 'General',
      tags TEXT DEFAULT '[]',
      readTime INTEGER DEFAULT 5,
      published INTEGER DEFAULT 1,
      publishedAt TEXT NOT NULL,
      metaTitle TEXT DEFAULT '',
      metaDescription TEXT DEFAULT '',
      views INTEGER DEFAULT 0,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS adsense_config (
      id TEXT PRIMARY KEY DEFAULT 'global',
      publisherId TEXT DEFAULT 'ca-pub-9876543210987654',
      autoAdsEnabled INTEGER DEFAULT 0,
      clientSideEnabled INTEGER DEFAULT 1,
      slotHeader TEXT DEFAULT '1234567890',
      slotSidebar TEXT DEFAULT '2345678901',
      slotInFeed TEXT DEFAULT '3456789012',
      slotArticleBottom TEXT DEFAULT '4567890123',
      testMode INTEGER DEFAULT 1,
      adsTxtContent TEXT DEFAULT 'google.com, pub-9876543210987654, DIRECT, f08c47fec0942fa0',
      updatedAt TEXT NOT NULL
    );
  `);

  dbState.sqliteDb = db;
  dbState.type = 'sqlite';
  dbState.connected = true;
  console.log('⚡ PulseFlow Embedded High-Performance Storage Engine initialized at:', dbPath);
}

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri && !uri.includes('127.0.0.1') && !uri.includes('localhost')) {
    try {
      console.log('🔄 Attempting MongoDB Atlas Connection...');
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      dbState.type = 'mongodb';
      dbState.connected = true;
      console.log('✅ Connected to MongoDB Atlas successfully.');
      return;
    } catch (err) {
      console.warn('⚠️ MongoDB Atlas connection error:', err.message);
      console.log('👉 Falling back to PulseFlow Embedded Engine...');
    }
  } else if (uri) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 2000,
      });
      dbState.type = 'mongodb';
      dbState.connected = true;
      console.log('✅ Connected to Local MongoDB.');
      return;
    } catch (err) {
      console.log('ℹ️ Local MongoDB daemon not active, booting embedded engine...');
    }
  }

  initSqlite();
};

module.exports = {
  connectDB,
  dbState,
  getSqlite: () => dbState.sqliteDb,
};
