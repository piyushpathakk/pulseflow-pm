require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });
const http = require('http');
const { app, startServer } = require('../server');

let serverInstance;
const TEST_PORT = 5055;

function makeRequest(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const headers = {
      'Content-Type': 'application/json',
    };
    if (payload) {
      headers['Content-Length'] = Buffer.byteLength(payload);
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: TEST_PORT,
        path,
        method,
        headers,
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          let parsed;
          try {
            parsed = JSON.parse(data);
          } catch (e) {
            parsed = data;
          }
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        });
      }
    );

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting PulseFlow Automated API Integration Test Suite...\n');

  // Start test server instance
  const { connectDB } = require('../config/db');
  await connectDB();
  serverInstance = app.listen(TEST_PORT);

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    const health = await makeRequest('GET', '/api/health');
    assert(health.status === 200 && health.data.status === 'healthy', 'Health check returns 200 OK');

    // 2. SEO & AdSense Routes
    const adsTxt = await makeRequest('GET', '/ads.txt');
    assert(adsTxt.status === 200 && adsTxt.data.includes('google.com'), 'Google AdSense ads.txt accessible');

    const robotsTxt = await makeRequest('GET', '/robots.txt');
    assert(robotsTxt.status === 200 && robotsTxt.data.includes('Sitemap:'), 'SEO robots.txt accessible with Sitemap link');

    const sitemap = await makeRequest('GET', '/sitemap.xml');
    assert(sitemap.status === 200 && sitemap.data.includes('<urlset'), 'Dynamic XML sitemap generated properly');

    // 3. User Authentication - Login Admin
    const adminLogin = await makeRequest('POST', '/api/auth/login', {
      email: 'admin@pulseflow.dev',
      password: 'Admin@123456',
    });
    assert(adminLogin.status === 200 && adminLogin.data.token, 'Admin login succeeds with JWT');
    const adminToken = adminLogin.data.token;

    // 4. Verify Auth Me
    const me = await makeRequest('GET', '/api/auth/me', null, adminToken);
    assert(me.status === 200 && me.data.user.role === 'Admin', 'Protected /api/auth/me retrieves correct profile');

    // 5. Register New User
    const testEmail = `test_${Date.now()}@pulseflow.dev`;
    const reg = await makeRequest('POST', '/api/auth/register', {
      name: 'Taylor Shift',
      email: testEmail,
      password: 'Password@123',
      role: 'Developer',
    });
    assert(reg.status === 201 && reg.data.token, 'Registration creates new user with token');
    const userToken = reg.data.token;

    // 6. List Projects
    const projects = await makeRequest('GET', '/api/projects', null, adminToken);
    assert(projects.status === 200 && projects.data.projects.length >= 3, 'Fetch all projects with metrics');
    const firstProj = projects.data.projects[0];

    // 7. Create New Project
    const newProjKey = `TEST${Date.now().toString().slice(-3)}`;
    const newProj = await makeRequest('POST', '/api/projects', {
      name: 'Integration Test Suite Project',
      key: newProjKey,
      description: 'Automated verification test project',
      priority: 'High',
    }, adminToken);
    assert(newProj.status === 201 && newProj.data.project.key === newProjKey, 'Project created successfully');
    const createdProjectId = newProj.data.project._id || newProj.data.project.id;

    // 8. Create Bug Ticket in Project
    const bugTicket = await makeRequest('POST', '/api/tasks', {
      projectId: createdProjectId,
      title: 'Flaky retry timeout in Redis lock acquisition',
      description: 'Distributed lock acquisition fails when clock drift exceeds 50ms.',
      type: 'bug',
      priority: 'urgent',
      severity: 'critical',
      status: 'todo',
    }, adminToken);
    assert(bugTicket.status === 201 && bugTicket.data.task.type === 'bug', 'Bug ticket created with auto-key');
    const ticketId = bugTicket.data.task._id || bugTicket.data.task.id;

    // 9. Kanban Drag-and-Drop Status Update
    const statusMove = await makeRequest('PUT', `/api/tasks/${ticketId}/status`, {
      status: 'in-progress',
      orderIndex: 0,
    }, adminToken);
    assert(statusMove.status === 200 && statusMove.data.task.status === 'in-progress', 'Kanban drag status move succeeds');

    // 10. Post Comment on Ticket
    const comment = await makeRequest('POST', '/api/comments', {
      taskId: ticketId,
      text: 'Investigating Redis redlock node clock skew and heartbeat intervals.',
    }, adminToken);
    assert(comment.status === 201 && comment.data.comment.text.includes('redlock'), 'Threaded comment posted');

    // 11. Fetch Comments
    const commentsList = await makeRequest('GET', `/api/comments/${ticketId}`, null, adminToken);
    assert(commentsList.status === 200 && commentsList.data.comments.length >= 1, 'Threaded comments retrieved for ticket');

    // 12. Notification Center
    const notifs = await makeRequest('GET', '/api/notifications', null, adminToken);
    assert(notifs.status === 200 && Array.isArray(notifs.data.notifications), 'Notification feed retrieved');

    // 13. Analytics Dashboard
    const analytics = await makeRequest('GET', '/api/analytics/dashboard', null, adminToken);
    assert(analytics.status === 200 && analytics.data.summary.totalProjects >= 4, 'Analytics dashboard returns real-time calculations');

    // 14. CSV Report Export
    const csvExport = await makeRequest('GET', '/api/analytics/export-csv', null, adminToken);
    assert(csvExport.status === 200 && csvExport.headers['content-type'].includes('text/csv'), 'CSV report exported with proper mime-type');

    // 15. Blog & SEO Content
    const articles = await makeRequest('GET', '/api/articles');
    assert(articles.status === 200 && articles.data.articles.length >= 4, 'Public blog articles listed');

    const singleArticle = await makeRequest('GET', `/api/articles/slug/${articles.data.articles[0].slug}`);
    assert(singleArticle.status === 200 && singleArticle.data.article.title, 'Single blog article retrieved by SEO slug');

    // 16. Admin Control Panel
    const adminMetrics = await makeRequest('GET', '/api/admin/metrics', null, adminToken);
    assert(adminMetrics.status === 200 && adminMetrics.data.metrics.totalUsers >= 5, 'Super-admin metrics endpoint returns complete system telemetry');

  } catch (err) {
    console.error('Fatal test execution error:', err);
    failed++;
  } finally {
    if (serverInstance) {
      serverInstance.close();
    }
  }

  console.log(`\n📊 TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
  if (failed === 0) {
    console.log('🎉 ALL BACKEND API & GOOGLE ADSENSE INTEGRATION TESTS PASSED 100%!\n');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests();
