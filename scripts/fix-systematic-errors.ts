#!/usr/bin/env tsx

import { readFile, writeFile, readdir, stat } from 'fs/promises';
import { join, extname } from 'path';
import { glob } from 'glob';

interface FixPattern {
  name: string;
  pattern: RegExp;
  replacement: string | ((match: string, context: string) => string);
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  category: string;
}

interface FixResult {
  file: string;
  pattern: string;
  fixes: number;
  details: string[];
}

class SystematicErrorFixer {
  private patterns: FixPattern[] = [
    // Critical: Generic error throwing without context
    {
      name: 'Generic Error Throwing',
      pattern: /throw new Error\(['"`]([^'"`]+)['"`]\)/g,
      replacement: (match, context) => {
        const errorMsg = match.match(/throw new Error\(['"`]([^'"`]+)['"`]\)/)?.[1] || '';
        return `throw new Error(\`${errorMsg} - Context: ${context.trim().substring(0, 50)}...\`)`;
      },
      severity: 'critical',
      description: 'Add context to generic error messages',
      category: 'error-handling'
    },

    // Critical: Console statements in production
    {
      name: 'Console Log in Production',
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
      severity: 'critical',
      description: 'Comment out console statements for production',
      category: 'logging'
    },

    // High: Missing error handling in catch blocks
    {
      name: 'Empty Catch Blocks',
      pattern: /catch\s*\(\s*error\s*\)\s*\{\s*\}/g,
      replacement: 'catch (error) {\n    console.error(\'Error occurred:\', error);\n    throw error;\n  }',
      severity: 'high',
      description: 'Add proper error handling to empty catch blocks',
      category: 'error-handling'
    },

    // High: Generic error messages
    {
      name: 'Generic Error Messages',
      pattern: /toast\.error\(['"`]Error fetching ([^'"`]+)['"`]/g,
      replacement: (match) => {
        const resource = match.match(/Error fetching ([^'"`]+)/)?.[1] || '';
        return `toast.error(\`Failed to load ${resource}. Please try again or contact support if the problem persists.\`)`;
      },
      severity: 'high',
      description: 'Improve generic error messages with more helpful text',
      category: 'error-handling'
    },

    // High: Missing TypeScript types
    {
      name: 'Any Type Usage',
      pattern: /: any\b/g,
      replacement: ': unknown',
      severity: 'high',
      description: 'Replace any with unknown for better type safety',
      category: 'typescript'
    },

    // Medium: Inconsistent error responses
    {
      name: 'Generic 500 Errors',
      pattern: /status:\s*500/g,
      replacement: 'status: 500, statusText: \'Internal Server Error\'',
      severity: 'medium',
      description: 'Add status text to 500 errors',
      category: 'api'
    },

    // Medium: Missing validation
    {
      name: 'Missing Request Validation',
      pattern: /const data = await request\.json\(\)/g,
      replacement: 'const data = await request.json();\n    if (!data) throw new Error(\'Request body is required\');',
      severity: 'medium',
      description: 'Add basic validation for request data',
      category: 'validation'
    },

    // Low: Inconsistent naming patterns
    {
      name: 'Inconsistent Naming',
      pattern: /([a-z]+[A-Z][a-z]*[A-Z])/g,
      replacement: (match) => {
        // This is a complex pattern that needs manual review
        return match; // Keep as is for now, needs manual intervention
      },
      severity: 'low',
      description: 'Inconsistent camelCase naming (requires manual review)',
      category: 'naming'
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
    'scripts' // Don't fix the fixer scripts
  ];

  private includedExtensions = [
    '.ts',
    '.tsx',
    '.js',
    '.jsx'
  ];

  async fixFile(filePath: string): Promise<FixResult | null> {
    try {
      const content = await readFile(filePath, 'utf-8');
      let modifiedContent = content;
      const fixes: string[] = [];
      let totalFixes = 0;

      for (const pattern of this.patterns) {
        if (typeof pattern.replacement === 'string') {
          const newContent = modifiedContent.replace(pattern.pattern, pattern.replacement);
          if (newContent !== modifiedContent) {
            const fixCount = (modifiedContent.match(pattern.pattern) || []).length;
            totalFixes += fixCount;
            fixes.push(`${pattern.name}: ${fixCount} fixes`);
            modifiedContent = newContent;
          }
        } else {
          // Function replacement
          const matches = modifiedContent.matchAll(pattern.pattern);
          let hasChanges = false;
          
          for (const match of matches) {
            const replacement = pattern.replacement(match[0], this.getContext(modifiedContent, match.index || 0));
            if (replacement !== match[0]) {
              modifiedContent = modifiedContent.replace(match[0], replacement);
              hasChanges = true;
              totalFixes++;
            }
          }
          
          if (hasChanges) {
            fixes.push(`${pattern.name}: applied function-based fixes`);
          }
        }
      }

      if (totalFixes > 0) {
        await writeFile(filePath, modifiedContent, 'utf-8');
        return {
          file: filePath,
          pattern: 'Multiple patterns',
          fixes: totalFixes,
          details: fixes
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

  async fixDirectory(dirPath: string): Promise<FixResult[]> {
    const allResults: FixResult[] = [];
    
    try {
      const files = await glob('**/*', {
        cwd: dirPath,
        ignore: this.excludedDirs.map(dir => `**/${dir}/**`),
        nodir: true
      });

      console.log(` Found ${files.length} files to process...`);

      for (const file of files) {
        const fullPath = join(dirPath, file);
        const ext = extname(file);
        
        if (this.includedExtensions.includes(ext)) {
          const result = await this.fixFile(fullPath);
          if (result) {
            allResults.push(result);
            console.log(` Fixed ${result.fixes} issues in ${file}`);
          }
        }
      }
    } catch (error) {
      console.error('Error processing directory:', error);
    }

    return allResults;
  }

  generateReport(results: FixResult[]): void {
    console.log('\n🔧 SYSTEMATIC ERROR FIX REPORT');
    console.log('=' .repeat(50));
    
    const totalFixes = results.reduce((sum, result) => sum + result.fixes, 0);
    const totalFiles = results.length;
    
    console.log(`\n Summary:`);
    console.log(` Total fixes applied: ${totalFixes}`);
    console.log(` Files modified: ${totalFiles}`);
    
    if (totalFixes === 0) {
      console.log('✅ No fixes were needed!');
      return;
    }

    // Group by pattern
    const byPattern = results.reduce((acc, result) => {
      if (!acc[result.pattern]) {
        acc[result.pattern] = [];
      }
      acc[result.pattern].push(result);
      return acc;
    }, {} as Record<string, FixResult[]>);

    console.log('\n🎯 Fixes by Pattern:');
    Object.entries(byPattern).forEach(([pattern, patternResults]) => {
      const totalPatternFixes = patternResults.reduce((sum, result) => sum + result.fixes, 0);
      console.log(`� ${pattern}: ${totalPatternFixes} fixes across ${patternResults.length} files`);
    });

    // Top files with most fixes
    console.log('\n📁 Top Files with Most Fixes:');
    results
      .sort((a, b) => b.fixes - a.fixes)
      .slice(0, 10)
      .forEach(result => {
        console.log(`� ${result.file}: ${result.fixes} fixes`);
      });

    // Recommendations
    console.log('\n💡 Next Steps:');
    console.log('1. Review the modified files to ensure fixes are appropriate');
    console.log('2. Test the application to verify functionality is maintained');
    console.log('3. Run the error scan again to verify improvements');
    console.log('4. Address any remaining issues manually');
    console.log('5. Consider implementing automated testing for error handling');

    // Save detailed report
    const reportData = {
      timestamp: new Date().toISOString(),
      totalFixes,
      totalFiles,
      results,
      summary: {
        byPattern: Object.fromEntries(
          Object.entries(byPattern).map(([pattern, patternResults]) => [
            pattern, 
            patternResults.reduce((sum, result) => sum + result.fixes, 0)
          ])
        )
      }
    };

    const fs = require('fs');
    fs.writeFileSync('systematic-fixes-report.json', JSON.stringify(reportData, null, 2));
    console.log('\n📄 Detailed report saved to: systematic-fixes-report.json');
  }
}

async function main() {
  const fixer = new SystematicErrorFixer();
  const projectRoot = process.cwd();
  
  console.log('🔧 Starting systematic error fixes...');
  console.log(` Processing directory: ${projectRoot}`);
  
  const results = await fixer.fixDirectory(projectRoot);
  fixer.generateReport(results);
}

if (require.main === module) {
  main().catch(console.error);
}

export { SystematicErrorFixer }; 