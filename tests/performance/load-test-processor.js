const crypto = require('crypto');

// Generate random test data
function generateRandomData() {
  return {
    email: `test.${crypto.randomBytes(8).toString('hex')}@example.com`,
    name: `Test User ${crypto.randomBytes(4).toString('hex')}`,
    password: 'testpassword123',
    courseTitle: `Test Course ${crypto.randomBytes(4).toString('hex')}`,
    institutionName: `Test Institution ${crypto.randomBytes(4).toString('hex')}`
  };
}

// Process authentication tokens
function processAuthResponse(requestParams, response, context, ee, next) {
  if (response.statusCode === 200 && response.body) {
    try {
      const body = JSON.parse(response.body);
      if (body.token) {
        context.vars.authToken = body.token;
      }
      if (body.user) {
        context.vars.userId = body.user.id;
      }
    } catch (error) {
      console.error('Error parsing auth response:', error);
    }
  }
  return next();
}

// Add authentication headers
function addAuthHeaders(requestParams, context, ee, next) {
  if (context.vars.authToken) {
    requestParams.headers = requestParams.headers || {};
    requestParams.headers.Authorization = `Bearer ${context.vars.authToken}`;
  }
  return next();
}

// Generate dynamic course data
function generateCourseData(requestParams, context, ee, next) {
  const data = generateRandomData();
  requestParams.json = {
    title: data.courseTitle,
    description: `Test course description for ${data.courseTitle}`,
    duration: Math.floor(Math.random() * 30) + 10,
    level: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'][Math.floor(Math.random() * 3)],
    base_price: Math.floor(Math.random() * 200) + 50,
    maxStudents: Math.floor(Math.random() * 50) + 10,
    startDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + (30 + Math.random() * 60) * 24 * 60 * 60 * 1000).toISOString()
  };
  return next();
}

// Generate dynamic user data
function generateUserData(requestParams, context, ee, next) {
  const data = generateRandomData();
  requestParams.json = {
    name: data.name,
    email: data.email,
    password: data.password,
    role: ['STUDENT', 'INSTITUTION'][Math.floor(Math.random() * 2)]
  };
  return next();
}

// Add random delays to simulate real user behavior
function addRandomDelay(requestParams, context, ee, next) {
  const delay = Math.floor(Math.random() * 2000) + 500; // 500ms to 2.5s
  setTimeout(() => {
    return next();
  }, delay);
}

// Validate response times
function validateResponseTime(requestParams, response, context, ee, next) {
  const responseTime = response.timings.phases.firstByte;
  if (responseTime > 5000) { // 5 seconds
    // // console.warn(`Slow response detected: ${responseTime}ms for ${requestParams.url}`);
  }
  return next();
}

// Track custom metrics
function trackCustomMetrics(requestParams, response, context, ee, next) {
  const metrics = {
    endpoint: requestParams.url,
    method: requestParams.method,
    statusCode: response.statusCode,
    responseTime: response.timings.phases.firstByte,
    timestamp: new Date().toISOString()
  };
  
  // Store metrics for reporting
  if (!context.vars.metrics) {
    context.vars.metrics = [];
  }
  context.vars.metrics.push(metrics);
  
  return next();
}

// Generate search queries
function generateSearchQuery(requestParams, context, ee, next) {
  const searchTerms = [
    'language', 'english', 'spanish', 'french', 'german', 'chinese',
    'beginner', 'intermediate', 'advanced', 'business', 'conversation'
  ];
  const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
  
  if (requestParams.url.includes('/api/search')) {
    requestParams.url = requestParams.url.replace('{{searchTerm}}', randomTerm);
  }
  
  return next();
}

// Clean up test data
function cleanupTestData(context, ee, next) {
  // This would be called at the end of tests to clean up created data
  // // console.log('Cleaning up test data...');
  return next();
}

module.exports = {
  processAuthResponse,
  addAuthHeaders,
  generateCourseData,
  generateUserData,
  addRandomDelay,
  validateResponseTime,
  trackCustomMetrics,
  generateSearchQuery,
  cleanupTestData
}; 