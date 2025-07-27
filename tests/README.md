# Testing Suite Documentation

This document provides comprehensive information about the testing suite implemented for the course booking platform.

## 🏗️ Testing Architecture

The testing suite consists of three main components:

1. **E2E Tests** - End-to-end user journey testing with Playwright
2. **Integration Tests** - API endpoint testing with Jest and Supertest
3. **Performance Tests** - Load testing with Artillery

## 📁 Directory Structure

```
tests/
├── e2e/                    # End-to-end tests
│   ├── utils/             # Test utilities and helpers
│   ├── auth.spec.ts       # Authentication tests
│   ├── admin-dashboard.spec.ts
│   ├── student-dashboard.spec.ts
│   ├── global-setup.ts    # Global test setup
│   └── global-teardown.ts # Global test cleanup
├── integration/           # Integration tests
│   ├── setup.ts          # Integration test setup
│   ├── auth.test.ts      # Authentication API tests
│   └── admin-api.test.ts # Admin API tests
├── performance/          # Performance tests
│   ├── artillery-config.yml
│   ├── api-load-test.yml
│   ├── load-test-processor.js
│   └── performance-monitor.ts
└── README.md            # This file
```

## 🚀 Quick Start

### Prerequisites

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npm run test:install
```

3. Set up test database:
```bash
# Ensure your database is running and migrations are applied
npx prisma migrate deploy
```

### Running Tests

#### Run All Tests
```bash
npm run test:all
```

#### Run Specific Test Types

**E2E Tests:**
```bash
npm run test:e2e
```

**Integration Tests:**
```bash
npm run test:integration
```

**Performance Tests:**
```bash
npm run test:performance
```

#### Run Tests with UI
```bash
npm run test:ui
```

#### View Test Reports
```bash
npm run test:report
```

## 🧪 E2E Testing

### Overview
E2E tests simulate real user interactions across the entire application stack.

### Test Structure
- **Authentication Tests** - Login, logout, access control
- **Admin Dashboard Tests** - Admin functionality and navigation
- **Student Dashboard Tests** - Student functionality and mobile responsiveness

### Running E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run specific test file
npx playwright test auth.spec.ts

# Run tests in UI mode
npm run test:ui

# Run tests in specific browser
npx playwright test --project=chromium
```

### E2E Test Configuration

The E2E tests are configured in `playwright.config.ts`:

- **Browsers**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
- **Parallel Execution**: Enabled for faster test runs
- **Retries**: 2 retries on CI, 0 in development
- **Screenshots**: Taken on failure
- **Videos**: Recorded on failure
- **Traces**: Collected on first retry

### Test Data Management

E2E tests use dedicated test data:
- Test users are created in `global-setup.ts`
- Data is cleaned up in `global-teardown.ts`
- Test data is isolated from production data

## 🔗 Integration Testing

### Overview
Integration tests verify API endpoints work correctly with the database.

### Test Structure
- **Authentication API** - Login, registration, session management
- **Admin API** - User management, course management, statistics
- **Student API** - Course access, progress tracking

### Running Integration Tests

```bash
# Run all integration tests
npm run test:integration

# Run with coverage
npm run test:integration -- --coverage

# Run specific test file
npm run test:integration -- auth.test.ts
```

### Integration Test Configuration

Integration tests use Jest with the following configuration:

- **Test Environment**: Node.js
- **Coverage**: HTML, LCOV, and text reports
- **Timeout**: 30 seconds per test
- **Setup**: Database cleanup and test data creation

### Database Handling

Integration tests:
- Use a separate test database or test data isolation
- Clean up data before and after tests
- Create realistic test scenarios
- Verify database state after operations

## ⚡ Performance Testing

### Overview
Performance tests measure application performance under load.

### Test Scenarios

1. **Public API Endpoints** (30% weight)
   - Homepage, categories, institutions, courses

2. **Admin API Endpoints** (20% weight)
   - Authentication, dashboard, user management

3. **Student API Endpoints** (25% weight)
   - Student dashboard, courses, progress

4. **Search and Filter** (15% weight)
   - Search functionality, filtering

5. **Database Intensive** (10% weight)
   - Complex queries, statistics

### Running Performance Tests

```bash
# Run basic load test
npm run test:performance

# Run with custom configuration
npx artillery run tests/performance/artillery-config.yml

# Run with specific environment
npx artillery run tests/performance/api-load-test.yml --environment production
```

### Performance Metrics

The tests measure:
- **Response Time**: Average, median, 95th percentile
- **Throughput**: Requests per second
- **Error Rate**: Percentage of failed requests
- **Resource Usage**: CPU, memory, database connections

### Load Test Phases

1. **Warm-up** (60s) - 1 req/s
2. **Ramp-up** (120s) - 5 to 20 req/s
3. **Sustained Load** (300s) - 20 req/s
4. **Peak Load** (120s) - 20 to 50 req/s
5. **Cool-down** (60s) - 50 to 1 req/s

## 📊 Test Reports

### E2E Test Reports
- HTML reports in `test-results/`
- Screenshots on failure
- Video recordings on failure
- Trace files for debugging

### Integration Test Reports
- Coverage reports in `coverage/`
- JUnit XML reports
- Console output with test results

### Performance Test Reports
- Artillery JSON reports
- Custom metrics tracking
- Performance trend analysis

## 🛠️ Test Utilities

### Test Helpers (`tests/e2e/utils/test-helpers.ts`)

Common utilities for E2E tests:
- Authentication helpers
- Form filling utilities
- Navigation helpers
- Screenshot utilities

### Performance Monitor (`tests/performance/performance-monitor.ts`)

Real-time performance monitoring:
- API response time tracking
- Database query monitoring
- Memory usage tracking
- Custom metrics collection

## 🔧 Configuration

### Environment Variables

```bash
# Test database
TEST_DATABASE_URL="mysql://user:pass@localhost:3306/test_db"

# Test environment
NODE_ENV=test

# Base URL for tests
BASE_URL=http://localhost:3000
```

### Jest Configuration (`jest.config.js`)

- TypeScript support
- Coverage reporting
- Test timeout settings
- Module mapping

### Playwright Configuration (`playwright.config.ts`)

- Browser configurations
- Test parallelization
- Screenshot and video settings
- Global setup/teardown

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Ensure test database is running
   - Check database URL configuration
   - Verify migrations are applied

2. **Playwright Installation Issues**
   - Run `npm run test:install`
   - Check Node.js version compatibility
   - Clear Playwright cache if needed

3. **Test Timeout Issues**
   - Increase timeout in configuration
   - Check for slow database queries
   - Verify network connectivity

4. **Performance Test Failures**
   - Check server is running
   - Verify API endpoints are accessible
   - Monitor server resources during tests

### Debug Mode

```bash
# Debug E2E tests
npx playwright test --debug

# Debug integration tests
npm run test:integration -- --verbose

# Debug performance tests
npx artillery run tests/performance/api-load-test.yml --debug
```

## 📈 Continuous Integration

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test:all
```

### Test Parallelization

- E2E tests run in parallel across browsers
- Integration tests can be parallelized by test file
- Performance tests run sequentially for accurate metrics

## 🎯 Best Practices

### Writing Tests

1. **Test Isolation**: Each test should be independent
2. **Descriptive Names**: Use clear, descriptive test names
3. **Setup/Teardown**: Properly clean up test data
4. **Assertions**: Use specific, meaningful assertions
5. **Error Handling**: Test both success and failure scenarios

### Performance Testing

1. **Baseline Metrics**: Establish performance baselines
2. **Realistic Scenarios**: Test realistic user workflows
3. **Resource Monitoring**: Monitor server resources during tests
4. **Trend Analysis**: Track performance over time
5. **Thresholds**: Set performance thresholds for CI/CD

### Maintenance

1. **Regular Updates**: Keep test dependencies updated
2. **Test Data**: Maintain realistic test data
3. **Documentation**: Keep test documentation current
4. **Code Review**: Review test code with the same rigor as application code
5. **Monitoring**: Monitor test execution times and success rates

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Jest Documentation](https://jestjs.io/)
- [Artillery Documentation](https://www.artillery.io/)
- [Testing Best Practices](https://testing-library.com/docs/guiding-principles) 