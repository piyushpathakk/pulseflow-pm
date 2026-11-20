const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Manager', 'Developer', 'Viewer'], default: 'Developer' },
  avatar: { type: String, default: '' },
  bio: { type: String, default: '' },
  settings: {
    theme: { type: String, default: 'dark' },
    emailNotifications: { type: Boolean, default: true },
    desktopNotifications: { type: Boolean, default: true },
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, { timestamps: true });

// Project Schema
const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  key: { type: String, required: true, uppercase: true, trim: true },
  description: { type: String, default: '' },
  status: { type: String, enum: ['Active', 'Paused', 'Completed'], default: 'Active' },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium' },
  deadline: { type: Date },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['Admin', 'Manager', 'Developer', 'Viewer'], default: 'Developer' },
    joinedAt: { type: Date, default: Date.now },
  }],
  tags: [String],
}, { timestamps: true });

// Task & Bug Ticket Schema
const taskSchema = new mongoose.Schema({
  key: { type: String, required: true, uppercase: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  type: { type: String, enum: ['bug', 'feature', 'task', 'improvement'], default: 'task' },
  status: { type: String, enum: ['todo', 'in-progress', 'in-review', 'done'], default: 'todo' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  severity: { type: String, enum: ['minor', 'major', 'critical', 'blocker'], default: 'minor' },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  deadline: { type: Date },
  tags: [String],
  attachments: [{
    filename: String,
    originalName: String,
    path: String,
    url: String,
    mimetype: String,
    size: Number,
  }],
  orderIndex: { type: Number, default: 0 },
}, { timestamps: true });

// Comment Schema
const commentSchema = new mongoose.Schema({
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  attachments: [{
    filename: String,
    originalName: String,
    url: String,
  }],
}, { timestamps: true });

// Activity Schema
const activitySchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  details: { type: String, default: '' },
}, { timestamps: true });

// Notification Schema
const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['assignment', 'status_change', 'comment', 'invite', 'deadline'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  link: { type: String, default: '' },
  read: { type: Boolean, default: false },
}, { timestamps: true });

// Article Schema (Blog & AdSense SEO)
const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, default: '' },
  content: { type: String, required: true },
  coverImage: { type: String, default: '' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, default: 'General' },
  tags: [String],
  readTime: { type: Number, default: 5 },
  published: { type: Boolean, default: true },
  publishedAt: { type: Date, default: Date.now },
  metaTitle: { type: String, default: '' },
  metaDescription: { type: String, default: '' },
  views: { type: Number, default: 0 },
}, { timestamps: true });

// AdSense Configuration Schema
const adSenseConfigSchema = new mongoose.Schema({
  publisherId: { type: String, default: 'ca-pub-9876543210987654' },
  autoAdsEnabled: { type: Boolean, default: false },
  clientSideEnabled: { type: Boolean, default: true },
  slotHeader: { type: String, default: '1234567890' },
  slotSidebar: { type: String, default: '2345678901' },
  slotInFeed: { type: String, default: '3456789012' },
  slotArticleBottom: { type: String, default: '4567890123' },
  testMode: { type: Boolean, default: true },
  adsTxtContent: { type: String, default: 'google.com, pub-9876543210987654, DIRECT, f08c47fec0942fa0' },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);
const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);
const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema);
const Activity = mongoose.models.Activity || mongoose.model('Activity', activitySchema);
const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
const Article = mongoose.models.Article || mongoose.model('Article', articleSchema);
const AdSenseConfig = mongoose.models.AdSenseConfig || mongoose.model('AdSenseConfig', adSenseConfigSchema);

module.exports = {
  User,
  Project,
  Task,
  Comment,
  Activity,
  Notification,
  Article,
  AdSenseConfig,
};
