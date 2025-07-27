#!/usr/bin/env tsx

import { readFile, writeFile } from 'fs/promises';
import { join, extname } from 'path';
import { glob } from 'glob';

interface CriticalFix {
  name: string;
  pattern: RegExp;
  replacement: string | ((match: string, context: string) => string);
  description: string;
  priority: 'critical' | 'high';
}

class CriticalErrorFixer {
  private criticalFixes: CriticalFix[] = [
    // Critical: Template literal SQL injection patterns (false positives in test files)
    {
      name: 'Template Literal in Test Files',
      pattern: /\$\{.*\}/g,
      replacement: (match, context) => {
        // Only fix if it's in a test file and looks like a template literal
        if (context.includes('console.log') || context.includes('fetch')) {
          return match; // Keep as is for test files
        }
        return match;
      },
      description: 'Review template literals for potential SQL injection',
      priority: 'critical'
    },

    // Critical: Empty catch blocks
    {
      name: 'Empty Catch Blocks',
      pattern: /catch\s*\(\s*[^)]*\s*\)\s*\{\s*\}/g,
      replacement: 'catch (error) {\n    console.error(\'Error occurred:\', error);\n    throw error;\n  }',
      description: 'Add proper error handling to empty catch blocks',
      priority: 'critical'
    },

    // Critical: Direct object assignment without sanitization
    {
      name: 'Direct Object Assignment',
      pattern: /\.\.\.req\.body/g,
      replacement: '...Object.fromEntries(Object.entries(req.body).filter(([key, value]) => value !== undefined))',
      description: 'Sanitize direct object assignment',
      priority: 'critical'
    },

    // High: Missing error boundaries in useEffect
    {
      name: 'Missing Error Boundaries in useEffect',
      pattern: /useEffect\([^)]*\)(?!\s*\.catch)/g,
      replacement: (match) => {
        // This is complex and needs manual review
        return match;
      },
      description: 'Add error handling to useEffect hooks',
      priority: 'high'
    },

    // High: Generic error messages
    {
      name: 'Generic Error Messages',
      pattern: /toast\.error\(['"`]Error ([^'"`]+)['"`]/g,
      replacement: (match) => {
        const action = match.match(/Error ([^'"`]+)/)?.[1] || '';
        return `toast.error(\`Failed to ${action}. Please try again or contact support if the problem persists.\`)`;
      },
      description: 'Improve generic error messages',
      priority: 'high'
    },

    // High: Missing validation in API routes
    {
      name: 'Missing API Validation',
      pattern: /const data = await request\.json\(\)/g,
      replacement: 'const data = await request.json();\n    if (!data) throw new Error(\'Request body is required\');',
      description: 'Add basic validation for API requests',
      priority: 'high'
    },

    // High: Console statements in production code
    {
      name: 'Console Statements in Production',
      pattern: /console\.(log|warn|info)\(/g,
      replacement: (match) => {
        if (match.includes('console.log(')) {
          return '// console.log(';
        } else if (match.includes('console.warn(')) {
          return '// console.warn(';
        } else if (match.includes('console.info(')) {
          return '// console.info(';
        }
        return match;
      },
      description: 'Comment out console statements for production',
      priority: 'high'
    },

    // High: Missing TypeScript types
    {
      name: 'Any Type Usage',
      pattern: /: any\b/g,
      replacement: ': unknown',
      description: 'Replace any with unknown for better type safety',
      priority: 'high'
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
    'prisma/migrations',
    'scripts'
  ];

  private includedExtensions = [
    '.ts',
    '.tsx',
    '.js',
    '.jsx'
  ];

  async fixFile(filePath: string): Promise<{ file: string; fixes: number; details: string[] } | null> {
    try {
      const content = await readFile(filePath, 'utf-8');
      let modifiedContent = content;
      const details: string[] = [];
      let totalFixes = 0;

      for (const fix of this.criticalFixes) {
        if (typeof fix.replacement === 'string') {
          const newContent = modifiedContent.replace(fix.pattern, fix.replacement);
          if (newContent !== modifiedContent) {
            const fixCount = (modifiedContent.match(fix.pattern) || []).length;
            totalFixes += fixCount;
            details.push(`${fix.name}: ${fixCount} fixes`);
            modifiedContent = newContent;
          }
        } else {
          // Function replacement
          const matches = modifiedContent.matchAll(fix.pattern);
          let hasChanges = false;
          
          for (const match of matches) {
            const replacement = fix.replacement(match[0], this.getContext(modifiedContent, match.index || 0));
            if (replacement !== match[0]) {
              modifiedContent = modifiedContent.replace(match[0], replacement);
              hasChanges = true;
              totalFixes++;
            }
          }
          
          if (hasChanges) {
            details.push(`${fix.name}: applied function-based fixes`);
          }
        }
      }

      if (totalFixes > 0) {
        await writeFile(filePath, modifiedContent, 'utf-8');
        return {
          file: filePath,
          fixes: totalFixes,
          details
        };
      }

      return null;
    } catch (error) {
      console.error(`Error fixing file ${filePath}:`, error);
      return null;
    }
  }

  private getContext(content: string, index: number): string {
    const lines = content.split('\n');
    const lineNumber = content.substring(0, index).split('\n').length;
    return lines[lineNumber - 1] || '';
  }

  async fixDirectory(dirPath: string): Promise<{ file: string; fixes: number; details: string[] }[]> {
    const allResults: { file: string; fixes: number; details: string[] }[] = [];
    
    try {
      const files = await glob('**/*', {
        cwd: dirPath,
        ignore: this.excludedDirs.map(dir => `**/${dir}/**`),
        nodir: true
      });

      console.log(` Found ${files.length} files to process for critical fixes...`);

      for (const file of files) {
        const fullPath = join(dirPath, file);
        const ext = extname(file);
        
        if (this.includedExtensions.includes(ext)) {
          const result = await this.fixFile(fullPath);
          if (result) {
            allResults.push(result);
            console.log(` Fixed ${result.fixes} critical issues in ${file}`);
          }
        }
      }
    } catch (error) {
      console.error('Error processing directory:', error);
    }

    return allResults;
  }

  generateReport(results: { file: string; fixes: number; details: string[] }[]): void {
    console.log('\n🔴 CRITICAL ERROR FIX REPORT');
    console.log('=' .repeat(50));
    
    const totalFixes = results.reduce((sum, result) => sum + result.fixes, 0);
    const totalFiles = results.length;
    
    console.log(`\n Summary:`);
    console.log(` Total critical fixes applied: ${totalFixes}`);
    console.log(` Files modified: ${totalFiles}`);
    
    if (totalFixes === 0) {
      console.log('✅ No critical fixes were needed!');
      return;
    }

    // Group by fix type
    const byFixType = results.reduce((acc, result) => {
      result.details.forEach(detail => {
        const fixType = detail.split(':')[0];
        if (!acc[fixType]) {
          acc[fixType] = [];
        }
        acc[fixType].push(result);
      });
      return acc;
    }, {} as Record<string, { file: string; fixes: number; details: string[] }[]>);

    console.log('\n🎯 Fixes by Type:');
    Object.entries(byFixType).forEach(([fixType, fixResults]) => {
      const totalFixTypeFixes = fixResults.reduce((sum, result) => sum + result.fixes, 0);
      console.log(`� ${fixType}: ${totalFixTypeFixes} fixes across ${fixResults.length} files`);
    });

    // Top files with most critical fixes
    console.log('\n📁 Top Files with Most Critical Fixes:');
    results
      .sort((a, b) => b.fixes - a.fixes)
      .slice(0, 10)
      .forEach(result => {
        console.log(`� ${result.file}: ${result.fixes} fixes`);
      });

    // Recommendations
    console.log('\n💡 Next Steps:');
    console.log('1. Review the modified files to ensure critical fixes are appropriate');
    console.log('2. Test the application thoroughly to verify security improvements');
    console.log('3. Run the error scan again to verify critical issue reduction');
    console.log('4. Address any remaining security vulnerabilities manually');
    console.log('5. Consider implementing automated security testing');

    // Save detailed report
    const reportData = {
      timestamp: new Date().toISOString(),
      totalFixes,
      totalFiles,
      results,
      summary: {
        byFixType: Object.fromEntries(
          Object.entries(byFixType).map(([fixType, fixResults]) => [
            fixType, 
            fixResults.reduce((sum, result) => sum + result.fixes, 0)
          ])
        )
      }
    };

    const fs = require('fs');
    fs.writeFileSync('critical-fixes-report.json', JSON.stringify(reportData, null, 2));
    console.log('\n📄 Detailed report saved to: critical-fixes-report.json');
  }
}

async function main() {
  const fixer = new CriticalErrorFixer();
  const projectRoot = process.cwd();
  
  console.log('🔴 Starting critical error fixes...');
  console.log(` Processing directory: ${projectRoot}`);
  
  const results = await fixer.fixDirectory(projectRoot);
  fixer.generateReport(results);
}

if (require.main === module) {
  main().catch(console.error);
}

export { CriticalErrorFixer }; 