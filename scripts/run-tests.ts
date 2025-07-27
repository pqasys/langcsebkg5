#!/usr/bin/env tsx

import { execSync } from 'child_process';
import { performance } from 'perf_hooks';
import { logger } from '../lib/logger';

interface TestResult {
  type: string;
  passed: number;
  failed: number;
  duration: number;
  success: boolean;
}

class TestRunner {
  private results: TestResult[] = [];

  async runAllTests() {
    console.log('🚀 Starting comprehensive test suite...\n');
    
    const startTime = performance.now();
    
    try {
      // Run integration tests
      await this.runIntegrationTests();
      
      // Run E2E tests
      await this.runE2ETests();
      
      // Run performance tests
      await this.runPerformanceTests();
      
      const totalDuration = performance.now() - startTime;
      
      this.generateReport(totalDuration);
      
    } catch (error) {
      logger.error('❌ Test suite failed:');
      process.exit(1);
    }
  }

  private async runIntegrationTests(): Promise<void> {
    console.log('🧪 Running Integration Tests...');
    const startTime = performance.now();
    
    try {
      execSync('npm run test:integration', { 
        stdio: 'inherit',
        env: { ...process.env, NODE_ENV: 'test' }
      });
      
      const duration = performance.now() - startTime;
      this.results.push({
        type: 'Integration Tests',
        passed: 0, // Will be parsed from output
        failed: 0,
        duration,
        success: true
      });
      
      console.log('✅ Integration tests completed\n');
    } catch (error) {
      const duration = performance.now() - startTime;
      this.results.push({
        type: 'Integration Tests',
        passed: 0,
        failed: 1,
        duration,
        success: false
      });
      throw error;
    }
  }

  private async runE2ETests(): Promise<void> {
    console.log('🌐 Running E2E Tests...');
    const startTime = performance.now();
    
    try {
      execSync('npx playwright test', { 
        stdio: 'inherit',
        env: { ...process.env, BASE_URL: 'http://localhost:3000' }
      });
      
      const duration = performance.now() - startTime;
      this.results.push({
        type: 'E2E Tests',
        passed: 0,
        failed: 0,
        duration,
        success: true
      });
      
      console.log('✅ E2E tests completed\n');
    } catch (error) {
      const duration = performance.now() - startTime;
      this.results.push({
        type: 'E2E Tests',
        passed: 0,
        failed: 1,
        duration,
        success: false
      });
      throw error;
    }
  }

  private async runPerformanceTests(): Promise<void> {
    console.log('⚡ Running Performance Tests...');
    const startTime = performance.now();
    
    try {
      // Run Artillery load tests
      execSync('npx artillery run tests/performance/api-load-test.yml', { 
        stdio: 'inherit' 
      });
      
      const duration = performance.now() - startTime;
      this.results.push({
        type: 'Performance Tests',
        passed: 1,
        failed: 0,
        duration,
        success: true
      });
      
      console.log('✅ Performance tests completed\n');
    } catch (error) {
      const duration = performance.now() - startTime;
      this.results.push({
        type: 'Performance Tests',
        passed: 0,
        failed: 1,
        duration,
        success: false
      });
      throw error;
    }
  }

  private generateReport(totalDuration: number) {
    console.log('\n📊 Test Suite Report');
    console.log('===================');
    
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.success).length;
    const failedTests = totalTests - passedTests;
    
    this.results.forEach(result => {
      const status = result.success ? '✅' : '❌';
      const duration = Math.round(result.duration / 1000);
      console.log(`${status} ${result.type}: ${duration}s`);
    });
    
    console.log('\n📈 Summary:');
    console.log(`Total Test Suites: ${totalTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${failedTests}`);
    console.log(`Total Duration: ${Math.round(totalDuration / 1000)}s`);
    console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
    
    if (failedTests > 0) {
      console.log('\n❌ Some tests failed. Check the output above for details.');
      process.exit(1);
    } else {
      console.log('\n🎉 All tests passed successfully!');
    }
  }

  async runSpecificTest(type: 'e2e' | 'integration' | 'performance') {
    console.log(`� Running ${type.toUpperCase()} tests...`);
    
    switch (type) {
      case 'e2e':
        await this.runE2ETests();
        break;
      case 'integration':
        await this.runIntegrationTests();
        break;
      case 'performance':
        await this.runPerformanceTests();
        break;
      default:
        logger.error('❌ Invalid test type. Use: e2e, integration, or performance');
        process.exit(1);
    }
  }
}

// CLI interface
const testRunner = new TestRunner();

const args = process.argv.slice(2);
const testType = args[0];

if (testType) {
  testRunner.runSpecificTest(testType as any);
} else {
  testRunner.runAllTests();
} 