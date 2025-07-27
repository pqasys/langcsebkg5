#!/usr/bin/env tsx

import { readdir, readFile, stat } from 'fs/promises';
import { join, extname } from 'path';
import { glob } from 'glob';

interface ErrorPattern {
  name: string;
  pattern: RegExp;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  category: string;
}

interface ScanResult {
  file: string;
  line: number;
  pattern: ErrorPattern;
  match: string;
  context: string;
}

class ErrorScanner {
  private patterns: ErrorPattern[] = [
    // Critical Issues
    {
      name: 'Missing Error Handling',
      pattern: /\.catch\(\)/g,
      severity: 'critical',
      description: 'Empty catch blocks without error handling',
      category: 'error-handling'
    },
    {
      name: 'Unhandled Promise Rejection',
      pattern: /new Promise\([^)]*\)(?!\s*\.catch)/g,
      severity: 'critical',
      description: 'Promises without error handling',
      category: 'error-handling'
    },
    {
      name: 'Hardcoded API URLs',
      pattern: /https?:\/\/[^\s'"]+\.com/g,
      severity: 'critical',
      description: 'Hardcoded external URLs that should be configurable',
      category: 'configuration'
    },
    {
      name: 'Console Log in Production',
      pattern: /console\.(log|warn|error|info)/g,
      severity: 'high',
      description: 'Console statements that should be removed in production',
      category: 'logging'
    },
    {
      name: 'Missing TypeScript Types',
      pattern: /: any\b/g,
      severity: 'high',
      description: 'Usage of any type instead of proper typing',
      category: 'typescript'
    },
    {
      name: 'Unused Imports',
      pattern: /import\s+\{[^}]*\}\s+from\s+['"][^'"]+['"]/g,
      severity: 'medium',
      description: 'Potentially unused imports (requires manual verification)',
      category: 'imports'
    },
    {
      name: 'Missing Error Boundaries',
      pattern: /useEffect\([^)]*\)(?!\s*\.catch)/g,
      severity: 'high',
      description: 'useEffect without error handling',
      category: 'react'
    },
    {
      name: 'Inconsistent Error Messages',
      pattern: /error:\s*['"][^'"]*['"]/g,
      severity: 'medium',
      description: 'Generic error messages that could be more specific',
      category: 'error-handling'
    },
    {
      name: 'Missing Loading States',
      pattern: /useState\(false\)/g,
      severity: 'medium',
      description: 'Boolean state that might be for loading (requires context)',
      category: 'ui'
    },
    {
      name: 'Hardcoded Database Queries',
      pattern: /SELECT\s+\*\s+FROM/g,
      severity: 'high',
      description: 'SELECT * queries that should specify columns',
      category: 'database'
    },
    {
      name: 'Missing Authentication Checks',
      pattern: /prisma\.[a-zA-Z]+\.findMany\(/g,
      severity: 'high',
      description: 'Database queries without authentication context',
      category: 'security'
    },
    {
      name: 'Inconsistent Naming',
      pattern: /[a-z]+[A-Z][a-z]*[A-Z]/g,
      severity: 'low',
      description: 'Inconsistent camelCase naming patterns',
      category: 'naming'
    },
    {
      name: 'Missing Error Logging',
      pattern: /catch\s*\(\s*error\s*\)\s*\{[^}]*\}/g,
      severity: 'medium',
      description: 'Catch blocks without proper error logging',
      category: 'error-handling'
    },
    {
      name: 'Potential Memory Leaks',
      pattern: /addEventListener\([^)]*\)(?!\s*removeEventListener)/g,
      severity: 'high',
      description: 'Event listeners without cleanup',
      category: 'memory'
    },
    {
      name: 'Missing Validation',
      pattern: /request\.json\(\)/g,
      severity: 'high',
      description: 'JSON parsing without validation',
      category: 'validation'
    },
    {
      name: 'Insecure Direct Object Assignment',
      pattern: /\.\.\.req\.body/g,
      severity: 'critical',
      description: 'Direct object assignment without sanitization',
      category: 'security'
    },
    {
      name: 'Missing CSRF Protection',
      pattern: /POST.*request\.json/g,
      severity: 'high',
      description: 'POST endpoints without CSRF protection',
      category: 'security'
    },
    {
      name: 'Potential SQL Injection',
      pattern: /\$\{.*\}/g,
      severity: 'critical',
      description: 'Template literals in database queries',
      category: 'security'
    },
    {
      name: 'Missing Environment Variables',
      pattern: /process\.env\.[A-Z_]+/g,
      severity: 'medium',
      description: 'Environment variables that might be missing',
      category: 'configuration'
    },
    {
      name: 'Inconsistent Error Responses',
      pattern: /status:\s*500/g,
      severity: 'medium',
      description: 'Generic 500 errors without specific details',
      category: 'api'
    }
  ];

  private excludedDirs = [
    'node_modules',
    '.next',
    'dist',
    'build',
    'coverage',
    '.git',
    'public',
    'prisma/migrations'
  ];

  private includedExtensions = [
    '.ts',
    '.tsx',
    '.js',
    '.jsx'
  ];

  async scanFile(filePath: string): Promise<ScanResult[]> {
    try {
      const content = await readFile(filePath, 'utf-8');
      const lines = content.split('\n');
      const results: ScanResult[] = [];

      for (const pattern of this.patterns) {
        const matches = content.matchAll(pattern.pattern);
        
        for (const match of matches) {
          const lineNumber = content.substring(0, match.index).split('\n').length;
          const lineContent = lines[lineNumber - 1] || '';
          
          results.push({
            file: filePath,
            line: lineNumber,
            pattern,
            match: match[0],
            context: lineContent.trim()
          });
        }
      }

      return results;
    } catch (error) {
      console.error(`Error scanning file ${filePath}:`, error);
      return [];
    }
  }

  async scanDirectory(dirPath: string): Promise<ScanResult[]> {
    const allResults: ScanResult[] = [];
    
    try {
      const files = await glob('**/*', {
        cwd: dirPath,
        ignore: this.excludedDirs.map(dir => `**/${dir}/**`),
        nodir: true
      });

      for (const file of files) {
        const fullPath = join(dirPath, file);
        const ext = extname(file);
        
        if (this.includedExtensions.includes(ext)) {
          const results = await this.scanFile(fullPath);
          allResults.push(...results);
        }
      }
    } catch (error) {
      console.error('Error scanning directory:', error);
    }

    return allResults;
  }

  generateReport(results: ScanResult[]): void {
    console.log('\n🔍 ERROR SCAN REPORT');
    console.log('=' .repeat(50));
    
    const totalIssues = results.length;
    console.log(`\n Total Issues Found: ${totalIssues}`);
    
    if (totalIssues === 0) {
      console.log('✅ No issues detected!');
      return;
    }

    // Group by severity
    const bySeverity = results.reduce((acc, result) => {
      if (!acc[result.pattern.severity]) {
        acc[result.pattern.severity] = [];
      }
      acc[result.pattern.severity].push(result);
      return acc;
    }, {} as Record<string, ScanResult[]>);

    // Group by category
    const byCategory = results.reduce((acc, result) => {
      if (!acc[result.pattern.category]) {
        acc[result.pattern.category] = [];
      }
      acc[result.pattern.category].push(result);
      return acc;
    }, {} as Record<string, ScanResult[]>);

    // Severity breakdown
    console.log('\n🚨 Severity Breakdown:');
    Object.entries(bySeverity).forEach(([severity, issues]) => {
      const icon = severity === 'critical' ? '🔴' : 
                   severity === 'high' ? '🟠' : 
                   severity === 'medium' ? '🟡' : '🟢';
      console.log(`${icon} ${severity.toUpperCase()}: ${issues.length} issues`);
    });

    // Category breakdown
    console.log('\n📂 Category Breakdown:');
    Object.entries(byCategory).forEach(([category, issues]) => {
      console.log(` ${category}: ${issues.length} issues`);
    });

    // Top issues by pattern
    const byPattern = results.reduce((acc, result) => {
      if (!acc[result.pattern.name]) {
        acc[result.pattern.name] = [];
      }
      acc[result.pattern.name].push(result);
      return acc;
    }, {} as Record<string, ScanResult[]>);

    console.log('\n🎯 Top Issues by Pattern:');
    Object.entries(byPattern)
      .sort(([,a], [,b]) => b.length - a.length)
      .slice(0, 10)
      .forEach(([pattern, issues]) => {
        console.log(`� ${pattern}: ${issues.length} occurrences`);
      });

    // Critical issues details
    if (bySeverity.critical) {
      console.log('\n🔴 CRITICAL ISSUES:');
      bySeverity.critical.slice(0, 5).forEach(result => {
        console.log(`\nFile: ${result.file}:${result.line}`);
        console.log(`Pattern: ${result.pattern.name}`);
        console.log(`Context: ${result.context}`);
      });
      
      if (bySeverity.critical.length > 5) {
        console.log(`\n... and ${bySeverity.critical.length - 5} more critical issues`);
      }
    }

    // Recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    console.log('1. Start with critical issues first');
    console.log('2. Use the fix scripts: fix-critical-errors.ts, fix-specific-errors.ts, fix-common-errors.ts');
    console.log('3. Address security issues immediately');
    console.log('4. Review error handling patterns');
    console.log('5. Implement consistent logging strategy');

    // Export results
    const reportData = {
      timestamp: new Date().toISOString(),
      totalIssues,
      bySeverity: Object.fromEntries(
        Object.entries(bySeverity).map(([severity, issues]) => [severity, issues.length])
      ),
      byCategory: Object.fromEntries(
        Object.entries(byCategory).map(([category, issues]) => [category, issues.length])
      ),
      criticalIssues: bySeverity.critical?.slice(0, 10) || [],
      allResults: results
    };

    // Save detailed report
    const fs = require('fs');
    fs.writeFileSync('error-scan-report.json', JSON.stringify(reportData, null, 2));
    console.log('\n📄 Detailed report saved to: error-scan-report.json');
  }
}

async function main() {
  const scanner = new ErrorScanner();
  const projectRoot = process.cwd();
  
  console.log('🔍 Starting comprehensive error scan...');
  console.log(` Scanning directory: ${projectRoot}`);
  
  const results = await scanner.scanDirectory(projectRoot);
  scanner.generateReport(results);
}

if (require.main === module) {
  main().catch(console.error);
}

export { ErrorScanner }; 