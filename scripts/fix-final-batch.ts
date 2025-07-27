#!/usr/bin/env tsx

import { readFile, writeFile } from 'fs/promises';
import { join, extname } from 'path';
import { glob } from 'glob';

interface FinalFix {
  name: string;
  pattern: RegExp;
  replacement: string | ((match: string, context: string) => string);
  description: string;
  priority: 'high' | 'medium';
  safe: boolean;
}

class FinalBatchFixer {
  private finalFixes: FinalFix[] = [
    // High: Console statements in production (excluding test files)
    {
      name: 'Console Statements in Production',
      pattern: /console\.(log|warn|info)\(/g,
      replacement: (match, context) => {
        // Skip test files and development-only files
        if (context.includes('test') || context.includes('debug') || context.includes('dev')) {
          return match; // Keep console statements in test/debug files
        }
        
        if (match.includes('console.log(')) {
          return '// console.log(';
        } else if (match.includes('console.warn(')) {
          return '// console.warn(';
        } else if (match.includes('console.info(')) {
          return '// console.info(';
        }
        return match;
      },
      description: 'Comment out console statements in production code only',
      priority: 'high',
      safe: true
    },

    // High: Unused imports (basic detection)
    {
      name: 'Unused Imports Detection',
      pattern: /import\s+\{[^}]*\}\s+from\s+['"][^'"]+['"]/g,
      replacement: (match, context) => {
        // This is complex and needs manual review - just mark for review
        return match; // Keep as is, but we'll log it for manual review
      },
      description: 'Mark unused imports for manual review',
      priority: 'high',
      safe: true
    },

    // High: Missing error logging in catch blocks
    {
      name: 'Missing Error Logging',
      pattern: /catch\s*\(\s*error\s*\)\s*\{[^}]*\}/g,
      replacement: (match) => {
        // Only add logging if it doesn't already exist
        if (!match.includes('console.error') && !match.includes('logger.error')) {
          return match.replace('{', '{\n    console.error(\'Error occurred:\', error);');
        }
        return match;
      },
      description: 'Add error logging to catch blocks that don\'t have it',
      priority: 'high',
      safe: true
    },

    // Medium: Generic error messages
    {
      name: 'Generic Error Messages',
      pattern: /toast\.error\(['"`]Error ([^'"`]+)['"`]/g,
      replacement: (match) => {
        const action = match.match(/Error ([^'"`]+)/)?.[1] || '';
        return `toast.error(\`Failed to ${action}. Please try again or contact support if the problem persists.\`)`;
      },
      description: 'Improve generic error messages with more helpful text',
      priority: 'medium',
      safe: true
    },

    // Medium: Missing loading states
    {
      name: 'Missing Loading States',
      pattern: /useState\(false\)/g,
      replacement: (match, context) => {
        // Only suggest if it looks like it might be for loading
        if (context.includes('loading') || context.includes('isLoading')) {
          return match; // Keep as is, but we'll log it for manual review
        }
        return match;
      },
      description: 'Mark potential loading states for manual review',
      priority: 'medium',
      safe: true
    },

    // Medium: Missing error boundaries
    {
      name: 'Missing Error Boundaries',
      pattern: /useEffect\([^)]*\)(?!\s*\.catch)/g,
      replacement: (match) => {
        // This is complex and needs manual review
        return match; // Keep as is, but we'll log it for manual review
      },
      description: 'Mark useEffect hooks without error handling for manual review',
      priority: 'medium',
      safe: true
    },

    // Medium: Inconsistent error responses
    {
      name: 'Generic 500 Errors',
      pattern: /status:\s*500/g,
      replacement: 'status: 500, statusText: \'Internal Server Error\'',
      description: 'Add status text to 500 errors',
      priority: 'medium',
      safe: true
    },

    // Medium: Missing validation
    {
      name: 'Missing Request Validation',
      pattern: /const data = await request\.json\(\)/g,
      replacement: 'const data = await request.json();\n    if (!data) throw new Error(\'Request body is required\');',
      description: 'Add basic validation for request data',
      priority: 'medium',
      safe: true
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
    'scripts',
    'tests' // Exclude test files to avoid breaking test functionality
  ];

  private excludedFiles = [
    'test-',
    '.test.',
    '.spec.',
    'debug-',
    'dev-'
  ];

  private includedExtensions = [
    '.ts',
    '.tsx',
    '.js',
    '.jsx'
  ];

  private isExcludedFile(filePath: string): boolean {
    const fileName = filePath.toLowerCase();
    return this.excludedFiles.some(excluded => fileName.includes(excluded));
  }

  async fixFile(filePath: string): Promise<{ file: string; fixes: number; details: string[]; manualReview: string[] } | null> {
    try {
      // Skip excluded files
      if (this.isExcludedFile(filePath)) {
        return null;
      }

      const content = await readFile(filePath, 'utf-8');
      let modifiedContent = content;
      const details: string[] = [];
      const manualReview: string[] = [];
      let totalFixes = 0;

      for (const fix of this.finalFixes) {
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
            } else {
              // Log for manual review if no automatic fix was applied
              manualReview.push(`${fix.name}: ${match[0].substring(0, 50)}...`);
            }
          }
          
          if (hasChanges) {
            details.push(`${fix.name}: applied function-based fixes`);
          }
        }
      }

      if (totalFixes > 0 || manualReview.length > 0) {
        if (totalFixes > 0) {
          await writeFile(filePath, modifiedContent, 'utf-8');
        }
        return {
          file: filePath,
          fixes: totalFixes,
          details,
          manualReview
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

  async fixDirectory(dirPath: string): Promise<{ file: string; fixes: number; details: string[]; manualReview: string[] }[]> {
    const allResults: { file: string; fixes: number; details: string[]; manualReview: string[] }[] = [];
    
    try {
      const files = await glob('**/*', {
        cwd: dirPath,
        ignore: this.excludedDirs.map(dir => `**/${dir}/**`),
        nodir: true
      });

      console.log(` Found ${files.length} files to process for final batch fixes...`);

      for (const file of files) {
        const fullPath = join(dirPath, file);
        const ext = extname(file);
        
        if (this.includedExtensions.includes(ext)) {
          const result = await this.fixFile(fullPath);
          if (result) {
            allResults.push(result);
            if (result.fixes > 0) {
              console.log(` Fixed ${result.fixes} issues in ${file}`);
            }
            if (result.manualReview.length > 0) {
              console.log(` ${result.manualReview.length} items marked for manual review in ${file}`);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error processing directory:', error);
    }

    return allResults;
  }

  generateReport(results: { file: string; fixes: number; details: string[]; manualReview: string[] }[]): void {
    console.log('\n🔧 FINAL BATCH ERROR FIX REPORT');
    console.log('=' .repeat(50));
    
    const totalFixes = results.reduce((sum, result) => sum + result.fixes, 0);
    const totalFiles = results.length;
    const totalManualReview = results.reduce((sum, result) => sum + result.manualReview.length, 0);
    
    console.log(`\n Summary:`);
    console.log(` Total fixes applied: ${totalFixes}`);
    console.log(` Files modified: ${totalFiles}`);
    console.log(` Items for manual review: ${totalManualReview}`);
    
    if (totalFixes === 0 && totalManualReview === 0) {
      console.log('✅ No fixes or manual review items found!');
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
    }, {} as Record<string, { file: string; fixes: number; details: string[]; manualReview: string[] }[]>);

    if (Object.keys(byFixType).length > 0) {
      console.log('\n🎯 Fixes by Type:');
      Object.entries(byFixType).forEach(([fixType, fixResults]) => {
        const totalFixTypeFixes = fixResults.reduce((sum, result) => sum + result.fixes, 0);
        console.log(`� ${fixType}: ${totalFixTypeFixes} fixes across ${fixResults.length} files`);
      });
    }

    // Top files with most fixes
    if (totalFixes > 0) {
      console.log('\n📁 Top Files with Most Fixes:');
      results
        .filter(r => r.fixes > 0)
        .sort((a, b) => b.fixes - a.fixes)
        .slice(0, 10)
        .forEach(result => {
          console.log(`� ${result.file}: ${result.fixes} fixes`);
        });
    }

    // Manual review items
    if (totalManualReview > 0) {
      console.log('\n📝 Manual Review Items:');
      const allManualReview = results.flatMap(r => r.manualReview);
      allManualReview.slice(0, 20).forEach(item => {
        console.log(`� ${item}`);
      });
      
      if (allManualReview.length > 20) {
        console.log(`... and ${allManualReview.length - 20} more items for manual review`);
      }
    }

    // Recommendations
    console.log('\n💡 Next Steps:');
    console.log('1. Review the modified files to ensure fixes are appropriate');
    console.log('2. Address manual review items based on your codebase needs');
    console.log('3. Test the application to verify functionality is maintained');
    console.log('4. Run the error scan again to verify improvements');
    console.log('5. Consider implementing automated testing for error handling');
    console.log('6. Focus on remaining high-impact issues manually');

    // Save detailed report
    const reportData = {
      timestamp: new Date().toISOString(),
      totalFixes,
      totalFiles,
      totalManualReview,
      results,
      summary: {
        byFixType: Object.fromEntries(
          Object.entries(byFixType).map(([fixType, fixResults]) => [
            fixType, 
            fixResults.reduce((sum, result) => sum + result.fixes, 0)
          ])
        ),
        manualReviewItems: results.flatMap(r => r.manualReview)
      }
    };

    const fs = require('fs');
    fs.writeFileSync('final-batch-fixes-report.json', JSON.stringify(reportData, null, 2));
    console.log('\n📄 Detailed report saved to: final-batch-fixes-report.json');
  }
}

async function main() {
  const fixer = new FinalBatchFixer();
  const projectRoot = process.cwd();
  
  console.log('🔧 Starting final batch error fixes...');
  console.log(` Processing directory: ${projectRoot}`);
  console.log('⚠️  Excluding naming patterns to avoid breaking existing code');
  
  const results = await fixer.fixDirectory(projectRoot);
  fixer.generateReport(results);
}

if (require.main === module) {
  main().catch(console.error);
}

export { FinalBatchFixer }; 