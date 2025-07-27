#!/usr/bin/env tsx

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { logger } from '../lib/logger';

interface BugReport {
  timestamp: string;
  summary: {
    totalTests: number;
    passed: number;
    failed: number;
    errors: string[];
  };
  issues: {
    category: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    description: string;
    location?: string;
    suggestion?: string;
  }[];
  performance: {
    loadTimes: number[];
    memoryUsage: number[];
  };
}

class BugDetector {
  private report: BugReport;

  constructor() {
    this.report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTests: 0,
        passed: 0,
        failed: 0,
        errors: []
      },
      issues: [],
      performance: {
        loadTimes: [],
        memoryUsage: []
      }
    };
  }

  async runTests(): Promise<void> {
    console.log('🔍 Starting comprehensive bug detection...\n');

    try {
      // Run the comprehensive test suite
      const testOutput = execSync('npx playwright test tests/comprehensive-bug-detection.spec.ts --reporter=json', {
        encoding: 'utf8',
        cwd: process.cwd()
      });

      this.parseTestResults(testOutput);
    } catch (error: any) {
      logger.error('❌ Test execution failed:');
      this.report.summary.errors.push(error.message);
    }

    // Run additional static analysis
    await this.runStaticAnalysis();
    
    // Generate report
    this.generateReport();
  }

  private parseTestResults(testOutput: string): void {
    try {
      const results = JSON.parse(testOutput);
      
      this.report.summary.totalTests = results.suites?.reduce((acc: number, suite: any) => 
        acc + (suite.specs?.length || 0), 0) || 0;
      
      let passed = 0;
      let failed = 0;

      results.suites?.forEach((suite: any) => {
        suite.specs?.forEach((spec: any) => {
          spec.tests?.forEach((test: any) => {
            if (test.results?.[0]?.status === 'passed') {
              passed++;
            } else if (test.results?.[0]?.status === 'failed') {
              failed++;
              this.addIssueFromTest(test, spec, suite);
            }
          });
        });
      });

      this.report.summary.passed = passed;
      this.report.summary.failed = failed;
    } catch (error) {
      logger.error('Failed to parse test results:');
    }
  }

  private addIssueFromTest(test: any, spec: any, suite: any): void {
    const testName = test.name;
    const specName = spec.name;
    const suiteName = suite.name;

    let category = 'Unknown';
    let severity: 'critical' | 'high' | 'medium' | 'low' = 'medium';

    // Categorize based on test name and suite
    if (suiteName.includes('Fast Refresh') || testName.includes('webpack')) {
      category = 'Fast Refresh & Module Loading';
      severity = 'critical';
    } else if (suiteName.includes('Navigation') || testName.includes('routing')) {
      category = 'Navigation & Routing';
      severity = 'high';
    } else if (suiteName.includes('API') || testName.includes('data loading')) {
      category = 'API & Data Loading';
      severity = 'high';
    } else if (suiteName.includes('UI') || testName.includes('rendering')) {
      category = 'UI Rendering & Components';
      severity = 'medium';
    } else if (suiteName.includes('Authentication')) {
      category = 'Authentication & Authorization';
      severity = 'critical';
    } else if (suiteName.includes('Performance')) {
      category = 'Performance & Memory';
      severity = 'medium';
    }

    this.report.issues.push({
      category,
      severity,
      description: `${testName} failed in ${specName}`,
      suggestion: this.getSuggestionForIssue(category, testName)
    });
  }

  private getSuggestionForIssue(category: string, testName: string): string {
    const suggestions: Record<string, string> = {
      'Fast Refresh & Module Loading': 'Check useEffect dependencies, remove router objects from dependency arrays, clear .next cache',
      'Navigation & Routing': 'Verify route paths, check dynamic route parameters, ensure proper redirects',
      'API & Data Loading': 'Add error handling, implement loading states, check API endpoint responses',
      'UI Rendering & Components': 'Add null checks, implement error boundaries, verify component props',
      'Authentication & Authorization': 'Check session management, verify protected routes, implement proper redirects',
      'Performance & Memory': 'Optimize bundle size, implement lazy loading, check for memory leaks'
    };

    return suggestions[category] || 'Review the failing test and implement appropriate fixes';
  }

  private async runStaticAnalysis(): Promise<void> {
    console.log('🔍 Running static analysis...\n');

    // Check for common code issues
    await this.checkForCommonIssues();
    
    // Check for missing dependencies
    await this.checkDependencies();
    
    // Check for TypeScript errors
    await this.checkTypeScriptErrors();
  }

  private async checkForCommonIssues(): Promise<void> {
    const commonIssues = [
      {
        pattern: /useEffect.*\[.*router.*\]/g,
        category: 'Fast Refresh & Module Loading',
        severity: 'critical' as const,
        description: 'Router object in useEffect dependencies',
        suggestion: 'Remove router from dependency array to prevent Fast Refresh full reloads'
      },
      {
        pattern: /console\.error/g,
        category: 'Error Handling',
        severity: 'medium' as const,
        description: 'Console.error statements in production code',
        suggestion: 'Replace with proper error handling and user feedback'
      },
      {
        pattern: /TODO|FIXME|HACK/g,
        category: 'Code Quality',
        severity: 'low' as const,
        description: 'TODO/FIXME comments found',
        suggestion: 'Address pending issues and remove TODO comments'
      }
    ];

    const sourceFiles = this.getSourceFiles();
    
    for (const file of sourceFiles) {
      const content = fs.readFileSync(file, 'utf8');
      
      for (const issue of commonIssues) {
        const matches = content.match(issue.pattern);
        if (matches) {
          this.report.issues.push({
            ...issue,
            location: file,
            description: `${issue.description} (${matches.length} occurrences)`
          });
        }
      }
    }
  }

  private async checkDependencies(): Promise<void> {
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      // Check for known problematic dependencies
      const problematicDeps = [
        { name: '@radix-ui/react-toast', version: '1.2.14', issue: 'Known webpack module loading issues' },
        { name: 'next', version: '14.1.0', issue: 'Fast Refresh issues in some configurations' }
      ];

      for (const dep of problematicDeps) {
        if (dependencies[dep.name]) {
          this.report.issues.push({
            category: 'Dependencies',
            severity: 'medium',
            description: `${dep.name} version ${dependencies[dep.name]} - ${dep.issue}`,
            suggestion: 'Consider updating to latest version or applying known workarounds'
          });
        }
      }
    } catch (error) {
      logger.error('Failed to check dependencies:');
    }
  }

  private async checkTypeScriptErrors(): Promise<void> {
    try {
      const output = execSync('npx tsc --noEmit', { encoding: 'utf8' });
      if (output.includes('error')) {
        this.report.issues.push({
          category: 'TypeScript',
          severity: 'high',
          description: 'TypeScript compilation errors found',
          suggestion: 'Fix TypeScript errors to prevent runtime issues'
        });
      }
    } catch (error: any) {
      if (error.stdout) {
        this.report.issues.push({
          category: 'TypeScript',
          severity: 'high',
          description: 'TypeScript compilation errors found',
          suggestion: 'Fix TypeScript errors to prevent runtime issues'
        });
      }
    }
  }

  private getSourceFiles(): string[] {
    const sourceDirs = ['app', 'components', 'lib'];
    const files: string[] = [];

    for (const dir of sourceDirs) {
      if (fs.existsSync(dir)) {
        this.walkDir(dir, files);
      }
    }

    return files.filter(file => 
      file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js')
    );
  }

  private walkDir(dir: string, files: string[]): void {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        this.walkDir(fullPath, files);
      } else {
        files.push(fullPath);
      }
    }
  }

  private generateReport(): void {
    const reportPath = 'bug-detection-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(this.report, null, 2));

    // Generate human-readable summary
    this.generateSummary();
    
    console.log(`\n Bug detection complete! Report saved to ${reportPath}`);
  }

  private generateSummary(): void {
    console.log('\n📋 BUG DETECTION SUMMARY');
    console.log('='.repeat(50));
    
    console.log(`Total Tests: ${this.report.summary.totalTests}`);
    console.log(`Passed: ${this.report.summary.passed}`);
    console.log(`Failed: ${this.report.summary.failed}`);
    console.log(`Success Rate: ${((this.report.summary.passed / this.report.summary.totalTests) * 100).toFixed(1)}%`);
    
    if (this.report.issues.length > 0) {
      console.log('\n🚨 ISSUES FOUND:');
      console.log('-'.repeat(30));
      
      const byCategory = this.report.issues.reduce((acc, issue) => {
        acc[issue.category] = (acc[issue.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      Object.entries(byCategory).forEach(([category, count]) => {
        console.log(`${category}: ${count} issues`);
      });

      console.log('\n🔧 CRITICAL ISSUES TO FIX FIRST:');
      const criticalIssues = this.report.issues.filter(i => i.severity === 'critical');
      criticalIssues.forEach(issue => {
        console.log(`• ${issue.description}`);
        console.log(`  Suggestion: ${issue.suggestion}`);
      });
    } else {
      console.log('\n✅ No issues found!');
    }
  }
}

// Run the bug detector
async function main() {
  const detector = new BugDetector();
  await detector.runTests();
}

if (require.main === module) {
  main().catch(console.error);
} 