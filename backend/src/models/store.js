const crypto = require('crypto');
const { dbState, getSqlite } = require('../config/db');
const mongooseModels = require('./mongooseSchemas');

const generateId = () => crypto.randomBytes(12).toString('hex');

// Safe JSON parser
const safeParse = (str, fallback = []) => {
  if (!str) return fallback;
  if (typeof str !== 'string') return str;
  try {
    return JSON.parse(str);
  } catch (e) {
    return fallback;
  }
};

// USER STORE
const UserStore = {
  async findOne(query) {
    if (dbState.type === 'mongodb') {
      return await mongooseModels.User.findOne(query);
    }
    const db = getSqlite();
    if (query.email) {
      const row = db.prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?)').get(query.email);
      if (!row) return null;
      return {
        ...row,
        _id: row.id,
        settings: safeParse(row.settings, {}),
      };
    }
    if (query.resetPasswordToken) {
      const row = db.prepare('SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpire > ?').get(query.resetPasswordToken, Date.now());
      if (!row) return null;
      return {
        ...row,
        _id: row.id,
        settings: safeParse(row.settings, {}),
      };
    }
    return null;
  },

  async findById(id) {
    if (dbState.type === 'mongodb') {
      return await mongooseModels.User.findById(id);
    }
    const db = getSqlite();
    const row = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    if (!row) return null;
    return {
      ...row,
      _id: row.id,
      settings: safeParse(row.settings, {}),
    };
  },

  async find(filter = {}) {
    if (dbState.type === 'mongodb') {
      return await mongooseModels.User.find(filter).select('-password');
    }
    const db = getSqlite();
    const rows = db.prepare('SELECT id, name, email, role, avatar, bio, settings, createdAt FROM users ORDER BY createdAt DESC').all();
    return rows.map(r => ({
      ...r,
      _id: r.id,
      settings: safeParse(r.settings, {}),
    }));
  },

  async create(data) {
    if (dbState.type === 'mongodb') {
      return await mongooseModels.User.create(data);
    }
    const db = getSqlite();
    const id = data._id || generateId();
    const now = new Date().toISOString();
    const stmt = db.prepare(`
      INSERT INTO users (id, name, email, password, role, avatar, bio, settings, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      data.name,
      data.email.toLowerCase(),
      data.password,
      data.role || 'Developer',
      data.avatar || '',
      data.bio || '',
      JSON.stringify(data.settings || {}),
      now
    );
    return this.findById(id);
  },

  async updateById(id, updateData) {
    if (dbState.type === 'mongodb') {
      return await mongooseModels.User.findByIdAndUpdate(id, updateData, { new: true });
    }
    const db = getSqlite();
    const existing = await this.findById(id);
    if (!existing) return null;

    const merged = { ...existing, ...updateData };
    const stmt = db.prepare(`
      UPDATE users SET
        name = ?,
        email = ?,
        password = ?,
        role = ?,
        avatar = ?,
        bio = ?,
        settings = ?,
        resetPasswordToken = ?,
        resetPasswordExpire = ?
      WHERE id = ?
    `);
    stmt.run(
      merged.name,
      merged.email.toLowerCase(),
      merged.password,
      merged.role,
      merged.avatar || '',
      merged.bio || '',
      JSON.stringify(merged.settings || {}),
      merged.resetPasswordToken || null,
      merged.resetPasswordExpire || null,
      id
    );
    return this.findById(id);
  },

  async deleteById(id) {
    if (dbState.type === 'mongodb') {
      return await mongooseModels.User.findByIdAndDelete(id);
    }
    const db = getSqlite();
    db.prepare('DELETE FROM users WHERE id = ?').run(id);
    return true;
  },

  async count(filter = {}) {
    if (dbState.type === 'mongodb') {
      return await mongooseModels.User.countDocuments(filter);
    }
    const db = getSqlite();
    const result = db.prepare('SELECT COUNT(*) as count FROM users').get();
    return result.count;
  }
};

// PROJECT STORE
const ProjectStore = {
  async find(filter = {}) {
    if (dbState.type === 'mongodb') {
      return await mongooseModels.Project.find(filter).populate('owner members.user');
    }
    const db = getSqlite();
    let rows;
    if (filter.ownerId) {
      rows = db.prepare('SELECT * FROM projects WHERE ownerId = ? ORDER BY createdAt DESC').all(filter.ownerId);
    } else {
      rows = db.prepare('SELECT * FROM projects ORDER BY createdAt DESC').all();
    }

    return await Promise.all(rows.map(async r => {
      const owner = await UserStore.findById(r.ownerId);
      const membersRaw = safeParse(r.members, []);
      const populatedMembers = await Promise.all(membersRaw.map(async m => {
        const user = await UserStore.findById(m.userId || m.user);
        return { user, role: m.role || 'Developer', joinedAt: m.joinedAt };
      }));

      return {
        ...r,
        _id: r.id,
        owner,
        members: populatedMembers,
        tags: safeParse(r.tags, []),
      };
    }));
  },

  async findById(id) {
    if (dbState.type === 'mongodb') {
      return await mongooseModels.Project.findById(id).populate('owner members.user');
    }
    const db = getSqlite();
    const row = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
    if (!row) return null;

    const owner = await UserStore.findById(row.ownerId);
    const membersRaw = safeParse(row.members, []);
    const populatedMembers = await Promise.all(membersRaw.map(async m => {
      const user = await UserStore.findById(m.userId || m.user);
      return { user, role: m.role || 'Developer', joinedAt: m.joinedAt };
    }));

    return {
      ...row,
      _id: row.id,
      owner,
      members: populatedMembers,
      tags: safeParse(row.tags, []),
    };
  },

  async create(data) {
    if (dbState.type === 'mongodb') {
      return await mongooseModels.Project.create(data);
    }
    const db = getSqlite();
    const id = data._id || generateId();
    const now = new Date().toISOString();
    const stmt = db.prepare(`
      INSERT INTO projects (id, name, key, description, status, priority, deadline, ownerId, members, tags, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      data.name,
      data.key.toUpperCase(),
      data.description || '',
      data.status || 'Active',
      data.priority || 'Medium',
      data.deadline || null,
      data.ownerId || data.owner,
      JSON.stringify(data.members || []),
      JSON.stringify(data.tags || []),
      now
    );
    return this.findById(id);
  },

  async updateById(id, data) {
    if (dbState.type === 'mongodb') {
      return await mongooseModels.Project.findByIdAndUpdate(id, data, { new: true }).populate('owner members.user');
    }
    const db = getSqlite();
    const existing = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
    if (!existing) return null;

    const stmt = db.prepare(`
      UPDATE projects SET
        name = ?,
        key = ?,
        description = ?,
        status = ?,
        priority = ?,
        deadline = ?,
        members = ?,
        tags = ?
      WHERE id = ?
    `);
    stmt.run(
      data.name !== undefined ? data.name : existing.name,
      data.key !== undefined ? data.key.toUpperCase() : existing.key,
      data.description !== undefined ? data.description : existing.description,
      data.status !== undefined ? data.status : existing.status,
      data.priority !== undefined ? data.priority : existing.priority,
      data.deadline !== undefined ? data.deadline : existing.deadline,
      data.members !== undefined ? JSON.stringify(data.members) : existing.members,
      data.tags !== undefined ? JSON.stringify(data.tags) : existing.tags,
      id
    );
    return this.findById(id);
  },

  async deleteById(id) {
    if (dbState.type === 'mongodb') {
      return await mongooseModels.Project.findByIdAndDelete(id);
    }
    const db = getSqlite();
    db.prepare('DELETE FROM projects WHERE id = ?').run(id);
    db.prepare('DELETE FROM tasks WHERE projectId = ?').run(id);
    db.prepare('DELETE FROM activities WHERE projectId = ?').run(id);
    return true;
  },

  async count(filter = {}) {
    if (dbState.type === 'mongodb') {
      return await mongooseModels.Project.countDocuments(filter);
    }
    const db = getSqlite();
    const result = db.prepare('SELECT COUNT(*) as count FROM projects').get();
    return result.count;
  }
};

// TASK STORE
const TaskStore = {
  async find(filter = {}) {
    if (dbState.type === 'mongodb') {
      return await mongooseModels.Task.find(filter).populate('assignee reporter project');
    }
    const db = getSqlite();
    let query = 'SELECT * FROM tasks WHERE 1=1';
    const params = [];

    if (filter.projectId) {
      query += ' AND projectId = ?';
      params.push(filter.projectId);
    }
    if (filter.status) {
      query += ' AND status = ?';
      params.push(filter.status);
    }
    if (filter.type) {
      query += ' AND type = ?';
      params.push(filter.type);
    }
    if (filter.priority) {
      query += ' AND priority = ?';
      params.push(filter.priority);
    }
    if (filter.assigneeId) {
      query += ' AND assigneeId = ?';
      params.push(filter.assigneeId);
    }

    query += ' ORDER BY orderIndex ASC, createdAt DESC';
    const rows = db.prepare(query).all(...params);

    return await Promise.all(rows.map(async r => {
      const assignee = r.assigneeId ? await UserStore.findById(r.assigneeId) : null;
      const reporter = await UserStore.findById(r.reporterId);
      return {
        ...r,
        _id: r.id,
        assignee,
        reporter,
        tags: safeParse(r.tags, []),
        attachments: safeParse(r.attachments, []),
      };
    }));
  },

  async findById(id) {
    if (dbState.type === 'mongodb') {
      return await mongooseModels.Task.findById(id).populate('assignee reporter project');
    }
    const db = getSqlite();
    const row = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!row) return null;

    const assignee = row.assigneeId ? await UserStore.findById(row.assigneeId) : null;
    const reporter = await UserStore.findById(row.reporterId);
    const project = await ProjectStore.findById(row.projectId);

    return {
      ...row,
      _id: row.id,
      assignee,
      reporter,
      project,
      tags: safeParse(row.tags, []),
      attachments: safeParse(row.attachments, []),
    };
  },

  async create(data) {
    if (dbState.type === 'mongodb') {
      return await mongooseModels.Task.create(data);
    }
    const db = getSqlite();
    const id = data._id || generateId();
    const now = new Date().toISOString();
    const stmt = db.prepare(`
      INSERT INTO tasks (id, key, title, description, type, status, priority, severity, projectId, assigneeId, reporterId, deadline, tags, attachments, orderIndex, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      data.key.toUpperCase(),
      data.title,
      data.description || '',
      data.type || 'task',
      data.status || 'todo',
      data.priority || 'medium',
      data.severity || 'minor',
      data.projectId || data.project,
      data.assigneeId || data.assignee || null,
      data.reporterId || data.reporter,
      data.deadline || null,
      JSON.stringify(data.tags || []),
      JSON.stringify(data.attachments || []),
      data.orderIndex || 0,
      now,
      now
    );
    return this.findById(id);
  },

  async updateById(id, data) {
    if (dbState.type === 'mongodb') {
      return await mongooseModels.Task.findByIdAndUpdate(id, data, { new: true }).populate('assignee reporter project');
    }
    const db = getSqlite();
    const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!existing) return null;

    const now = new Date().toISOString();
    const stmt = db.prepare(`
      UPDATE tasks SET
        title = ?,
        description = ?,
        type = ?,
        status = ?,
        priority = ?,
        severity = ?,
        assigneeId = ?,
        deadline = ?,
        tags = ?,
        attachments = ?,
        orderIndex = ?,
        updatedAt = ?
      WHERE id = ?
    `);
    stmt.run(
      data.title !== undefined ? data.title : existing.title,
      data.description !== undefined ? data.description : existing.description,
      data.type !== undefined ? data.type : existing.type,
      data.status !== undefined ? data.status : existing.status,
      data.priority !== undefined ? data.priority : existing.priority,
      data.severity !== undefined ? data.severity : existing.severity,
      data.assigneeId !== undefined ? data.assigneeId : (data.assignee !== undefined ? data.assignee : existing.assigneeId),
      data.deadline !== undefined ? data.deadline : existing.deadline,
      data.tags !== undefined ? JSON.stringify(data.tags) : existing.tags,
      data.attachments !== undefined ? JSON.stringify(data.attachments) : existing.attachments,
      data.orderIndex !== undefined ? data.orderIndex : existing.orderIndex,
      now,
      id
    );
    return this.findById(id);
  },

  async deleteById(id) {
    if (dbState.type === 'mongodb') {
      return await mongooseModels.Task.findByIdAndDelete(id);
    }
    const db = getSqlite();
    db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
    db.prepare('DELETE FROM comments WHERE taskId = ?').run(id);
    db.prepare('DELETE FROM activities WHERE taskId = ?').run(id);
    return true;
  },

  async count(filter = {}) {
    if (dbState.type === 'mongodb') {
      return await mongooseModels.Task.countDocuments(filter);
    }
    const db = getSqlite();
    let query = 'SELECT COUNT(*) as count FROM tasks WHERE 1=1';
    const params = [];
    if (filter.status) {
      query += ' AND status = ?';
      params.push(filter.status);
    }
    if (filter.type) {
      query += ' AND type = ?';
      params.push(filter.type);
    }
    if (filter.projectId) {
      query += ' AND projectId = ?';
      params.push(filter.projectId);
    }
    const result = db.prepare(query).get(...params);
    return result.count;
  }
};

// COMMENT STORE
const CommentStore = {
  async findByTaskId(taskId) {
    if (dbState.type === 'mongodb') {
      return await mongooseModels.Comment.find({ task: taskId }).populate('user').sort({ createdAt: 1 });
    }
    const db = getSqlite();
    const rows = db.prepare('SELECT * FROM comments WHERE taskId = ? ORDER BY createdAt ASC').all(taskId);
    return await Promise.all(rows.map(async r => {
      const user = await UserStore.findById(r.userId);
      return {
        ...r,
        _id: r.id,
        user,
        attachments: safeParse(r.attachments, []),
      };
    }));
  },

  async create(data) {
    if (dbState.type === 'mongodb') {
      return await mongooseModels.Comment.create(data);
    }
    const db = getSqlite();
    const id = data._id || generateId();
    const now = new Date().toISOString();
    const stmt = db.prepare(`
      INSERT INTO comments (id, taskId, userId, text, attachments, createdAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      data.taskId || data.task,
      data.userId || data.user,
      data.text,
      JSON.stringify(data.attachments || []),
      now
    );
    const row = db.prepare('SELECT * FROM comments WHERE id = ?').get(id);
    const user = await UserStore.findById(row.userId);
    return {
      ...row,
      _id: row.id,
      user,
      attachments: safeParse(row.attachments, []),
    };
  },

  async deleteById(id) {
    if (dbState.type === 'mongodb') {
      return await mongooseModels.Comment.findByIdAndDelete(id);
    }
    const db = getSqlite();
    db.prepare('DELETE FROM comments WHERE id = ?').run(id);
    return true;
  }
};

// ACTIVITY STORE
const ActivityStore = {
  async find(filter = {}, limit = 20) {
    if (dbState.type === 'mongodb') {
      return await mongooseModels.Activity.find(filter).populate('user task project').sort({ createdAt: -1 }).limit(limit);
    }
    const db = getSqlite();
    let query = 'SELECT * FROM activities WHERE 1=1';
    const params = [];
    if (filter.projectId) {
      query += ' AND projectId = ?';
      params.push(filter.projectId);
    }
    query += ' ORDER BY createdAt DESC LIMIT ?';
    params.push(limit);

    const rows = db.prepare(query).all(...params);
    return await Promise.all(rows.map(async r => {
      const user = await UserStore.findById(r.userId);
      const task = r.taskId ? await TaskStore.findById(r.taskId) : null;
      return {
        ...r,
        _id: r.id,
        user,
        task,
      };
    }));
  },

  async create(data) {
    if (dbState.type === 'mongodb') {
      return await mongooseModels.Activity.create(data);
    }
    const db = getSqlite();
    const id = data._id || generateId();
    const now = new Date().toISOString();
    const stmt = db.prepare(`
      INSERT INTO activities (id, projectId, taskId, userId, action, details, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      data.projectId || data.project || null,
      data.taskId || data.task || null,
      data.userId || data.user,
      data.action,
      data.details || '',
      now
    );
    return { ...data, id, _id: id, createdAt: now };
  }
};

// NOTIFICATION STORE
const NotificationStore = {
  async findByRecipient(recipientId, limit = 30) {
    if (dbState.type === 'mongodb') {
      return await mongooseModels.Notification.find({ recipient: recipientId }).populate('sender').sort({ createdAt: -1 }).limit(limit);
    }
    const db = getSqlite();
    const rows = db.prepare('SELECT * FROM notifications WHERE recipientId = ? ORDER BY createdAt DESC LIMIT ?').all(recipientId, limit);
    return await Promise.all(rows.map(async r => {
      const sender = r.senderId ? await UserStore.findById(r.senderId) : null;
      return {
        ...r,
        _id: r.id,
        sender,
        read: Boolean(r.read),
      };
    }));
  },

  async create(data) {
    if (dbState.type === 'mongodb') {
      return await mongooseModels.Notification.create(data);
    }
    const db = getSqlite();
    const id = data._id || generateId();
    const now = new Date().toISOString();
    const stmt = db.prepare(`
      INSERT INTO notifications (id, recipientId, senderId, type, title, message, link, read, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      data.recipientId || data.recipient,
      data.senderId || data.sender || null,
      data.type,
      data.title,
      data.message,
      data.link || '',
      data.read ? 1 : 0,
      now
    );
    return { ...data, id, _id: id, read: false, createdAt: now };
  },

  async markAsRead(id) {
    if (dbState.type === 'mongodb') {
      return await mongooseModels.Notification.findByIdAndUpdate(id, { read: true }, { new: true });
    }
    const db = getSqlite();
    db.prepare('UPDATE notifications SET read = 1 WHERE id = ?').run(id);
    return true;
  },

  async markAllAsRead(recipientId) {
    if (dbState.type === 'mongodb') {
      return await mongooseModels.Notification.updateMany({ recipient: recipientId }, { read: true });
    }
    const db = getSqlite();
    db.prepare('UPDATE notifications SET read = 1 WHERE recipientId = ?').run(recipientId);
    return true;
  },

  async getUnreadCount(recipientId) {
    if (dbState.type === 'mongodb') {
      return await mongooseModels.Notification.countDocuments({ recipient: recipientId, read: false });
    }
    const db = getSqlite();
    const result = db.prepare('SELECT COUNT(*) as count FROM notifications WHERE recipientId = ? AND read = 0').get(recipientId);
    return result.count;
  }
};

// ARTICLE STORE (Blog & SEO Content)
const ArticleStore = {
  async find(filter = {}) {
    if (dbState.type === 'mongodb') {
      return await mongooseModels.Article.find(filter).populate('author').sort({ publishedAt: -1 });
    }
    const db = getSqlite();
    let query = 'SELECT * FROM articles WHERE 1=1';
    const params = [];
    if (filter.published !== undefined) {
      query += ' AND published = ?';
      params.push(filter.published ? 1 : 0);
    }
    if (filter.category) {
      query += ' AND category = ?';
      params.push(filter.category);
    }
    query += ' ORDER BY publishedAt DESC';
    const rows = db.prepare(query).all(...params);

    return await Promise.all(rows.map(async r => {
      const author = await UserStore.findById(r.authorId);
      return {
        ...r,
        _id: r.id,
        author,
        tags: safeParse(r.tags, []),
        published: Boolean(r.published),
      };
    }));
  },

  async findBySlug(slug) {
    if (dbState.type === 'mongodb') {
      return await mongooseModels.Article.findOne({ slug }).populate('author');
    }
    const db = getSqlite();
    const row = db.prepare('SELECT * FROM articles WHERE slug = ?').get(slug);
    if (!row) return null;

    // increment view count
    db.prepare('UPDATE articles SET views = views + 1 WHERE id = ?').run(row.id);
    row.views = (row.views || 0) + 1;

    const author = await UserStore.findById(row.authorId);
    return {
      ...row,
      _id: row.id,
      author,
      tags: safeParse(row.tags, []),
      published: Boolean(row.published),
    };
  },

  async findById(id) {
    if (dbState.type === 'mongodb') {
      return await mongooseModels.Article.findById(id).populate('author');
    }
    const db = getSqlite();
    const row = db.prepare('SELECT * FROM articles WHERE id = ?').get(id);
    if (!row) return null;
    const author = await UserStore.findById(row.authorId);
    return {
      ...row,
      _id: row.id,
      author,
      tags: safeParse(row.tags, []),
      published: Boolean(row.published),
    };
  },

  async create(data) {
    if (dbState.type === 'mongodb') {
      return await mongooseModels.Article.create(data);
    }
    const db = getSqlite();
    const id = data._id || generateId();
    const now = new Date().toISOString();
    const stmt = db.prepare(`
      INSERT INTO articles (id, title, slug, excerpt, content, coverImage, authorId, category, tags, readTime, published, publishedAt, metaTitle, metaDescription, views, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      data.title,
      data.slug,
      data.excerpt || '',
      data.content,
      data.coverImage || '',
      data.authorId || data.author,
      data.category || 'General',
      JSON.stringify(data.tags || []),
      data.readTime || 5,
      data.published !== undefined ? (data.published ? 1 : 0) : 1,
      data.publishedAt || now,
      data.metaTitle || data.title,
      data.metaDescription || data.excerpt || '',
      0,
      now
    );
    return this.findById(id);
  },

  async updateById(id, data) {
    if (dbState.type === 'mongodb') {
      return await mongooseModels.Article.findByIdAndUpdate(id, data, { new: true }).populate('author');
    }
    const db = getSqlite();
    const existing = db.prepare('SELECT * FROM articles WHERE id = ?').get(id);
    if (!existing) return null;

    const stmt = db.prepare(`
      UPDATE articles SET
        title = ?,
        slug = ?,
        excerpt = ?,
        content = ?,
        coverImage = ?,
        category = ?,
        tags = ?,
        readTime = ?,
        published = ?,
        metaTitle = ?,
        metaDescription = ?
      WHERE id = ?
    `);
    stmt.run(
      data.title !== undefined ? data.title : existing.title,
      data.slug !== undefined ? data.slug : existing.slug,
      data.excerpt !== undefined ? data.excerpt : existing.excerpt,
      data.content !== undefined ? data.content : existing.content,
      data.coverImage !== undefined ? data.coverImage : existing.coverImage,
      data.category !== undefined ? data.category : existing.category,
      data.tags !== undefined ? JSON.stringify(data.tags) : existing.tags,
      data.readTime !== undefined ? data.readTime : existing.readTime,
      data.published !== undefined ? (data.published ? 1 : 0) : existing.published,
      data.metaTitle !== undefined ? data.metaTitle : existing.metaTitle,
      data.metaDescription !== undefined ? data.metaDescription : existing.metaDescription,
      id
    );
    return this.findById(id);
  },

  async deleteById(id) {
    if (dbState.type === 'mongodb') {
      return await mongooseModels.Article.findByIdAndDelete(id);
    }
    const db = getSqlite();
    db.prepare('DELETE FROM articles WHERE id = ?').run(id);
    return true;
  }
};

// ADSENSE CONFIG STORE
const AdSenseConfigStore = {
  async get() {
    if (dbState.type === 'mongodb') {
      let cfg = await mongooseModels.AdSenseConfig.findOne();
      if (!cfg) {
        cfg = await mongooseModels.AdSenseConfig.create({
          publisherId: process.env.ADSENSE_PUBLISHER_ID || 'ca-pub-9876543210987654',
          autoAdsEnabled: process.env.ADSENSE_AUTO_ADS === 'true',
          clientSideEnabled: true,
          testMode: true,
        });
      }
      return cfg;
    }
    const db = getSqlite();
    let row = db.prepare('SELECT * FROM adsense_config WHERE id = ?').get('global');
    if (!row) {
      const now = new Date().toISOString();
      const pubId = process.env.ADSENSE_PUBLISHER_ID || 'ca-pub-9876543210987654';
      db.prepare(`
        INSERT INTO adsense_config (id, publisherId, autoAdsEnabled, clientSideEnabled, slotHeader, slotSidebar, slotInFeed, slotArticleBottom, testMode, adsTxtContent, updatedAt)
        VALUES ('global', ?, 0, 1, '1234567890', '2345678901', '3456789012', '4567890123', 1, ?, ?)
      `).run(pubId, `google.com, ${pubId}, DIRECT, f08c47fec0942fa0`, now);
      row = db.prepare('SELECT * FROM adsense_config WHERE id = ?').get('global');
    }
    return {
      ...row,
      autoAdsEnabled: Boolean(row.autoAdsEnabled),
      clientSideEnabled: Boolean(row.clientSideEnabled),
      testMode: Boolean(row.testMode),
    };
  },

  async update(data) {
    if (dbState.type === 'mongodb') {
      let cfg = await mongooseModels.AdSenseConfig.findOne();
      if (!cfg) {
        return await mongooseModels.AdSenseConfig.create(data);
      }
      return await mongooseModels.AdSenseConfig.findByIdAndUpdate(cfg._id, data, { new: true });
    }
    const db = getSqlite();
    const existing = await this.get();
    const now = new Date().toISOString();
    const stmt = db.prepare(`
      UPDATE adsense_config SET
        publisherId = ?,
        autoAdsEnabled = ?,
        clientSideEnabled = ?,
        slotHeader = ?,
        slotSidebar = ?,
        slotInFeed = ?,
        slotArticleBottom = ?,
        testMode = ?,
        adsTxtContent = ?,
        updatedAt = ?
      WHERE id = 'global'
    `);
    stmt.run(
      data.publisherId !== undefined ? data.publisherId : existing.publisherId,
      data.autoAdsEnabled !== undefined ? (data.autoAdsEnabled ? 1 : 0) : (existing.autoAdsEnabled ? 1 : 0),
      data.clientSideEnabled !== undefined ? (data.clientSideEnabled ? 1 : 0) : (existing.clientSideEnabled ? 1 : 0),
      data.slotHeader !== undefined ? data.slotHeader : existing.slotHeader,
      data.slotSidebar !== undefined ? data.slotSidebar : existing.slotSidebar,
      data.slotInFeed !== undefined ? data.slotInFeed : existing.slotInFeed,
      data.slotArticleBottom !== undefined ? data.slotArticleBottom : existing.slotArticleBottom,
      data.testMode !== undefined ? (data.testMode ? 1 : 0) : (existing.testMode ? 1 : 0),
      data.adsTxtContent !== undefined ? data.adsTxtContent : existing.adsTxtContent,
      now
    );
    return await this.get();
  }
};

module.exports = {
  User: UserStore,
  Project: ProjectStore,
  Task: TaskStore,
  Comment: CommentStore,
  Activity: ActivityStore,
  Notification: NotificationStore,
  Article: ArticleStore,
  AdSenseConfig: AdSenseConfigStore,
};
