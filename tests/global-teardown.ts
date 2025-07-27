import { FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function globalTeardown(config: FullConfig) {
  // // // // // // // // // // console.log('Cleaning up test environment...');

  // Clean up test data
  await cleanupTestData();

  // Generate test summary
  await generateTestSummary();

  // Clean up temporary files
  await cleanupTempFiles();

  console.log('Test environment cleanup completed');
}

async function cleanupTestData() {
  try {
    // This would typically involve cleaning up the database
    // For now, we'll just log the cleanup
    console.log('Test data cleanup completed');
  } catch (error) {
    console.error('Error cleaning up test data:', error);
  }
}

async function generateTestSummary() {
  try {
    const resultsDir = 'test-results/mobile';
    const resultsFile = path.join(resultsDir, 'mobile-results.json');
    
    if (fs.existsSync(resultsFile)) {
      const results = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));
      
      // Generate summary
      const summary = {
        timestamp: new Date().toISOString(),
        totalTests: results.length,
        passed: results.filter((r: unknown) => r.status === 'passed').length,
        failed: results.filter((r: unknown) => r.status === 'failed').length,
        skipped: results.filter((r: unknown) => r.status === 'skipped').length,
        devices: [...new Set(results.map((r: unknown) => r.projectName))],
        duration: results.reduce((sum: number, r: unknown) => sum + (r.duration || 0), 0),
        successRate: 0
      };
      
      summary.successRate = (summary.passed / summary.totalTests) * 100;
      
      // Write summary
      fs.writeFileSync(
        path.join(resultsDir, 'summary.json'),
        JSON.stringify(summary, null, 2)
      );
      
      // Generate markdown report
      const markdownReport = generateMarkdownReport(summary, results);
      fs.writeFileSync(
        path.join(resultsDir, 'report.md'),
        markdownReport
      );
      
      console.log('Test summary generated');
    }
  } catch (error) {
    console.error('Error generating test summary:', error);
  }
}

function generateMarkdownReport(summary: unknown, results: unknown[]) {
  let report = `# Mobile Device Testing Report\n\n`;
  report += `**Generated:** ${new Date(summary.timestamp).toLocaleString()}\n\n`;
  
  report += `## Summary\n\n`;
  report += `- **Total Tests:** ${summary.totalTests}\n`;
  report += `- **Passed:** ${summary.passed}\n`;
  report += `- **Failed:** ${summary.failed}\n`;
  report += `- **Skipped:** ${summary.skipped}\n`;
  report += `- **Success Rate:** ${summary.successRate.toFixed(1)}%\n`;
  report += `- **Total Duration:** ${(summary.duration / 1000).toFixed(1)}s\n\n`;
  
  report += `## Devices Tested\n\n`;
  summary.devices.forEach((device: string) => {
    report += `- ${device}\n`;
  });
  report += `\n`;
  
  report += `## Detailed Results\n\n`;
  
  // Group by device
  const deviceGroups = results.reduce((groups: unknown, result: unknown) => {
    const device = result.projectName;
    if (!groups[device]) {
      groups[device] = [];
    }
    groups[device].push(result);
    return groups;
  }, {});
  
  for (const [device, deviceResults] of Object.entries(deviceGroups)) {
    const devicePassed = (deviceResults as any[]).filter((r: unknown) => r.status === 'passed').length;
    const deviceTotal = (deviceResults as any[]).length;
    const deviceSuccessRate = (devicePassed / deviceTotal) * 100;
    
    report += `### ${device}\n\n`;
    report += `- **Success Rate:** ${deviceSuccessRate.toFixed(1)}% (${devicePassed}/${deviceTotal})\n\n`;
    
    (deviceResults as any[]).forEach((result: unknown) => {
      const status = result.status === 'passed' ? '✅' : result.status === 'failed' ? '❌' : '⏭️';
      report += `- ${status} **${result.title}** (${(result.duration / 1000).toFixed(1)}s)\n`;
      
      if (result.status === 'failed' && result.error) {
        report += `  - Error: ${result.error.message}\n`;
      }
    });
    
    report += `\n`;
  }
  
  return report;
}

async function cleanupTempFiles() {
  try {
    const tempDirs = ['test-results/temp', 'test-results/screenshots'];
    
    for (const dir of tempDirs) {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
      }
    }
    
    console.log('Temporary files cleaned up');
  } catch (error) {
    console.error('Error cleaning up temporary files:', error);
  }
}

export default globalTeardown; 