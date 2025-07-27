#!/usr/bin/env tsx

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { program } from 'commander';
import { logger } from '../lib/logger';

interface TestConfig {
  devices: string[];
  tests: string[];
  parallel: boolean;
  retries: number;
  timeout: number;
  report: boolean;
  screenshots: boolean;
  videos: boolean;
}

class MobileTestRunner {
  private config: TestConfig;
  private resultsDir: string;

  constructor(config: TestConfig) {
    this.config = config;
    this.resultsDir = 'test-results/mobile';
    this.ensureResultsDir();
  }

  private ensureResultsDir() {
    if (!fs.existsSync(this.resultsDir)) {
      fs.mkdirSync(this.resultsDir, { recursive: true });
    }
  }

  async runTests() {
    console.log('🚀 Starting Mobile Device Testing...\n');

    const startTime = Date.now();

    try {
      // Check if dev server is running
      await this.checkDevServer();

      // Run tests
      const results = await this.executeTests();

      // Generate reports
      if (this.config.report) {
        await this.generateReports();
      }

      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;

      console.log(`\n Testing completed in ${duration.toFixed(1)}s`);
      console.log(` Results saved to: ${this.resultsDir}`);

      return results;
    } catch (error) {
      logger.error('❌ Testing failed:');
      process.exit(1);
    }
  }

  private async checkDevServer() {
    console.log('🔍 Checking development server...');
    
    try {
      const response = await fetch('http://localhost:3000');
      if (response.ok) {
        console.log('✅ Development server is running');
      } else {
        throw new Error('Server responded with non-200 status');
      }
    } catch (error) {
      console.log('⚠️  Development server not running, starting it...');
      this.startDevServer();
      
      // Wait for server to start
      await this.waitForServer();
    }
  }

  private startDevServer() {
    try {
      execSync('npm run dev', { 
        stdio: 'pipe',
        detached: true 
      });
    } catch (error) {
      logger.error('Failed to start dev server:');
      throw error;
    }
  }

  private async waitForServer(maxAttempts = 30) {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const response = await fetch('http://localhost:3000');
        if (response.ok) {
          console.log('✅ Development server is ready');
          return;
        }
      } catch (error) {
        // Server not ready yet
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    throw new Error('Development server failed to start');
  }

  private async executeTests() {
    console.log('🧪 Executing tests...\n');

    const args = this.buildPlaywrightArgs();
    const command = `npx playwright test ${args.join(' ')}`;

    console.log(`Running: ${command}\n`);

    try {
      execSync(command, { 
        stdio: 'inherit',
        cwd: process.cwd()
      });
      
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }

  private buildPlaywrightArgs(): string[] {
    const args: string[] = [];

    // Configuration
    args.push('--config=playwright.config.mobile.ts');

    // Device filtering
    if (this.config.devices.length > 0) {
      args.push(`--project=${this.config.devices.join(',')}`);
    }

    // Test filtering
    if (this.config.tests.length > 0) {
      args.push(`--grep="${this.config.tests.join('|')}"`);
    }

    // Parallel execution
    if (!this.config.parallel) {
      args.push('--workers=1');
    }

    // Retries
    if (this.config.retries > 0) {
      args.push(`--retries=${this.config.retries}`);
    }

    // Timeout
    if (this.config.timeout > 0) {
      args.push(`--timeout=${this.config.timeout}`);
    }

    // Screenshots
    if (this.config.screenshots) {
      args.push('--screenshot=on');
    } else {
      args.push('--screenshot=only-on-failure');
    }

    // Videos
    if (this.config.videos) {
      args.push('--video=on');
    } else {
      args.push('--video=retain-on-failure');
    }

    return args;
  }

  private async generateReports() {
    console.log('\n📊 Generating reports...');

    try {
      // Generate HTML report
      execSync('npx playwright show-report test-results/mobile', { 
        stdio: 'pipe' 
      });

      // Generate JSON report
      const resultsFile = path.join(this.resultsDir, 'mobile-results.json');
      if (fs.existsSync(resultsFile)) {
        const results = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));
        await this.generateDetailedReport(results);
      }

      console.log('✅ Reports generated successfully');
    } catch (error) {
      logger.error('❌ Failed to generate reports:');
    }
  }

  private async generateDetailedReport(results: any[]) {
    const report = {
      summary: this.generateSummary(results),
      deviceResults: this.generateDeviceResults(results),
      performance: this.generatePerformanceReport(results),
      recommendations: this.generateRecommendations(results)
    };

    const reportFile = path.join(this.resultsDir, 'detailed-report.json');
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));

    // Generate markdown report
    const markdownReport = this.generateMarkdownReport(report);
    const markdownFile = path.join(this.resultsDir, 'detailed-report.md');
    fs.writeFileSync(markdownFile, markdownReport);
  }

  private generateSummary(results: any[]) {
    const total = results.length;
    const passed = results.filter(r => r.status === 'passed').length;
    const failed = results.filter(r => r.status === 'failed').length;
    const skipped = results.filter(r => r.status === 'skipped').length;

    return {
      total,
      passed,
      failed,
      skipped,
      successRate: (passed / total) * 100,
      averageDuration: results.reduce((sum, r) => sum + (r.duration || 0), 0) / total
    };
  }

  private generateDeviceResults(results: any[]) {
    const deviceGroups = results.reduce((groups, result) => {
      const device = result.projectName;
      if (!groups[device]) {
        groups[device] = [];
      }
      groups[device].push(result);
      return groups;
    }, {} as Record<string, any[]>);

    return Object.entries(deviceGroups).map(([device, deviceResults]) => {
      const passed = deviceResults.filter(r => r.status === 'passed').length;
      const total = deviceResults.length;
      
      return {
        device,
        total,
        passed,
        failed: total - passed,
        successRate: (passed / total) * 100,
        averageDuration: deviceResults.reduce((sum, r) => sum + (r.duration || 0), 0) / total
      };
    });
  }

  private generatePerformanceReport(results: any[]) {
    const performanceTests = results.filter(r => 
      r.title.toLowerCase().includes('performance') || 
      r.title.toLowerCase().includes('load time')
    );

    return {
      totalPerformanceTests: performanceTests.length,
      averageLoadTime: performanceTests.reduce((sum, r) => sum + (r.duration || 0), 0) / performanceTests.length,
      slowestTest: performanceTests.reduce((slowest, r) => 
        (r.duration || 0) > (slowest.duration || 0) ? r : slowest
      , performanceTests[0]),
      fastestTest: performanceTests.reduce((fastest, r) => 
        (r.duration || 0) < (fastest.duration || 0) ? r : fastest
      , performanceTests[0])
    };
  }

  private generateRecommendations(results: any[]) {
    const recommendations = [];

    const failedTests = results.filter(r => r.status === 'failed');
    if (failedTests.length > 0) {
      recommendations.push({
        type: 'critical',
        message: `${failedTests.length} tests failed. Review and fix these issues.`,
        tests: failedTests.map(t => ({ title: t.title, error: t.error?.message }))
      });
    }

    const slowTests = results.filter(r => (r.duration || 0) > 5000);
    if (slowTests.length > 0) {
      recommendations.push({
        type: 'performance',
        message: `${slowTests.length} tests are taking longer than 5 seconds. Consider optimization.`,
        tests: slowTests.map(t => ({ title: t.title, duration: t.duration }))
      });
    }

    const deviceSuccessRates = this.generateDeviceResults(results);
    const lowSuccessDevices = deviceSuccessRates.filter(d => d.successRate < 80);
    if (lowSuccessDevices.length > 0) {
      recommendations.push({
        type: 'compatibility',
        message: `${lowSuccessDevices.length} devices have success rates below 80%. Review device-specific issues.`,
        devices: lowSuccessDevices.map(d => ({ device: d.device, successRate: d.successRate }))
      });
    }

    return recommendations;
  }

  private generateMarkdownReport(report: any) {
    let markdown = `# Mobile Device Testing Report\n\n`;
    markdown += `**Generated:** ${new Date().toISOString()}\n\n`;

    // Summary
    markdown += `## Summary\n\n`;
    markdown += `- **Total Tests:** ${report.summary.total}\n`;
    markdown += `- **Passed:** ${report.summary.passed}\n`;
    markdown += `- **Failed:** ${report.summary.failed}\n`;
    markdown += `- **Skipped:** ${report.summary.skipped}\n`;
    markdown += `- **Success Rate:** ${report.summary.successRate.toFixed(1)}%\n`;
    markdown += `- **Average Duration:** ${(report.summary.averageDuration / 1000).toFixed(1)}s\n\n`;

    // Device Results
    markdown += `## Device Results\n\n`;
    markdown += `| Device | Total | Passed | Failed | Success Rate | Avg Duration |\n`;
    markdown += `|--------|-------|--------|--------|--------------|--------------|\n`;
    
    report.deviceResults.forEach((device: any) => {
      markdown += `| ${device.device} | ${device.total} | ${device.passed} | ${device.failed} | ${device.successRate.toFixed(1)}% | ${(device.averageDuration / 1000).toFixed(1)}s |\n`;
    });
    markdown += `\n`;

    // Performance Report
    markdown += `## Performance Report\n\n`;
    markdown += `- **Performance Tests:** ${report.performance.totalPerformanceTests}\n`;
    markdown += `- **Average Load Time:** ${(report.performance.averageLoadTime / 1000).toFixed(1)}s\n`;
    if (report.performance.slowestTest) {
      markdown += `- **Slowest Test:** ${report.performance.slowestTest.title} (${(report.performance.slowestTest.duration / 1000).toFixed(1)}s)\n`;
    }
    if (report.performance.fastestTest) {
      markdown += `- **Fastest Test:** ${report.performance.fastestTest.title} (${(report.performance.fastestTest.duration / 1000).toFixed(1)}s)\n`;
    }
    markdown += `\n`;

    // Recommendations
    if (report.recommendations.length > 0) {
      markdown += `## Recommendations\n\n`;
      report.recommendations.forEach((rec: any) => {
        markdown += `### ${rec.type.toUpperCase()}\n\n`;
        markdown += `${rec.message}\n\n`;
        
        if (rec.tests) {
          markdown += `**Affected Tests:**\n`;
          rec.tests.forEach((test: any) => {
            markdown += `- ${test.title}`;
            if (test.error) markdown += ` (${test.error})`;
            if (test.duration) markdown += ` (${(test.duration / 1000).toFixed(1)}s)`;
            markdown += `\n`;
          });
        }
        
        if (rec.devices) {
          markdown += `**Affected Devices:**\n`;
          rec.devices.forEach((device: any) => {
            markdown += `- ${device.device} (${device.successRate.toFixed(1)}%)\n`;
          });
        }
        markdown += `\n`;
      });
    }

    return markdown;
  }
}

// CLI setup
program
  .name('mobile-test-runner')
  .description('Run comprehensive mobile device tests')
  .version('1.0.0');

program
  .option('-d, --devices <devices>', 'Comma-separated list of devices to test')
  .option('-t, --tests <tests>', 'Comma-separated list of test patterns to run')
  .option('-p, --parallel', 'Run tests in parallel', true)
  .option('-r, --retries <number>', 'Number of retries for failed tests', '2')
  .option('--timeout <number>', 'Test timeout in milliseconds', '30000')
  .option('--no-report', 'Skip report generation')
  .option('--screenshots', 'Take screenshots for all tests')
  .option('--videos', 'Record videos for all tests')
  .action(async (options) => {
    const config: TestConfig = {
      devices: options.devices ? options.devices.split(',') : [],
      tests: options.tests ? options.tests.split(',') : [],
      parallel: options.parallel,
      retries: parseInt(options.retries),
      timeout: parseInt(options.timeout),
      report: options.report,
      screenshots: options.screenshots,
      videos: options.videos
    };

    const runner = new MobileTestRunner(config);
    await runner.runTests();
  });

program.parse(process.argv); 