#!/usr/bin/env tsx

import { readFile, writeFile } from 'fs/promises';
import { glob } from 'glob';

interface SyntaxFix {
  name: string;
  pattern: RegExp;
  replacement: string;
  description: string;
}

class SyntaxErrorFixer {
  private syntaxFixes: SyntaxFix[] = [
    // Fix malformed error messages with nested template literals
    {
      name: 'Malformed Error Messages',
      pattern: /throw new Error\(`([^`]+) - Context: throw new Error\(`([^`]+)\.\.\.`\);\.\.\.`\)/g,
      replacement: 'throw new Error(`$1 - Context: $2`)',
      description: 'Fix malformed error messages with nested template literals'
    },
    
    // Fix unterminated template literals
    {
      name: 'Unterminated Template Literals',
      pattern: /throw new Error\(`([^`]+)\.\.\.`\);\.\.\.`\)/g,
      replacement: 'throw new Error(`$1`)',
      description: 'Fix unterminated template literals in error messages'
    },
    
    // Fix console statements with emoji characters
    {
      name: 'Console Statements with Emoji',
      pattern: /console\.(log|error|warn)\(`([^`]+)`\)/g,
      replacement: (match: string) => {
        // Remove emoji characters and fix the string
        const cleaned = match.replace(/[✅❌🔍📊🎯💡📄🔧📁📝]/g, '');
        return cleaned;
      },
      description: 'Fix console statements with emoji characters'
    },
    
    // Fix malformed context strings
    {
      name: 'Malformed Context Strings',
      pattern: /throw new Error\(`([^`]+) - Context: ([^`]+)\.\.\.`\);\.\.\.`\)/g,
      replacement: 'throw new Error(`$1 - Context: $2)',
      description: 'Fix malformed context strings in error messages'
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

  async fixFile(filePath: string): Promise<{ file: string; fixes: number; details: string[] } | null> {
    try {
      const content = await readFile(filePath, 'utf-8');
      let modifiedContent = content;
      const details: string[] = [];
      let totalFixes = 0;

      for (const fix of this.syntaxFixes) {
        if (typeof fix.replacement === 'string') {
          const newContent = modifiedContent.replace(fix.pattern, fix.replacement);
          if (newContent !== modifiedContent) {
            const fixCount = (modifiedContent.match(fix.pattern) || []).length;
            totalFixes += fixCount;
            details.push(${fix.name}: ${fixCount} fixes`);
            modifiedContent = newContent;
          }
        } else {
          // Function replacement
          const matches = modifiedContent.matchAll(fix.pattern);
          let hasChanges = false;
          
          for (const match of matches) {
            const replacement = fix.replacement(match[0]);
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

  async fixDirectory(dirPath: string): Promise<{ file: string; fixes: number; details: string[] }[]> {
    const allResults: { file: string; fixes: number; details: string[] }[] = [];
    
    try {
      const files = await glob('**/*', {
        cwd: dirPath,
        ignore: this.excludedDirs.map(dir => `**/${dir}/**`),
        nodir: true
      });

      console.log(` Found ${files.length} files to process for syntax fixes...`);

      for (const file of files) {
        const fullPath = `${dirPath}/${file}`;
        const ext = fullPath.split('.').pop();
        
        if (ext && this.includedExtensions.includes(`.${ext}`)) {
          const result = await this.fixFile(fullPath);
          if (result) {
            allResults.push(result);
            console.log(` Fixed ${result.fixes} syntax issues in ${file}`);
          }
        }
      }
    } catch (error) {
      console.error('Error processing directory:', error);
    }

    return allResults;
  }

  generateReport(results: { file: string; fixes: number; details: string[] }[]): void {
    console.log('\n🔧 SYNTAX ERROR FIX REPORT');
    console.log('=' .repeat(50));
    
    const totalFixes = results.reduce((sum, result) => sum + result.fixes, 0);
    const totalFiles = results.length;
    
    console.log(`\n Summary:`);
    console.log(` Total syntax fixes applied: ${totalFixes}`);
    console.log(` Files modified: ${totalFiles}`);
    
    if (totalFixes === 0) {
      console.log('✅ No syntax errors found!');
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

    // Top files with most fixes
    console.log('\n📁 Top Files with Most Fixes:');
    results
      .sort((a, b) => b.fixes - a.fixes)
      .slice(0, 10)
      .forEach(result => {
        console.log(`� ${result.file}: ${result.fixes} fixes`);
      });

    console.log('\n💡 Next Steps:');
    console.log('1. Run TypeScript compilation check: npx tsc --noEmit');
    console.log('2. Test the application to ensure functionality is maintained');
    console.log('3. Review any remaining syntax errors manually');
  }
}

async function main() {
  const fixer = new SyntaxErrorFixer();
  const projectRoot = process.cwd();
  
  console.log('🔧 Starting syntax error fixes...');
  console.log(` Processing directory: ${projectRoot}`);
  
  const results = await fixer.fixDirectory(projectRoot);
  fixer.generateReport(results);
}

if (require.main === module) {
  main().catch(console.error);
}

export { SyntaxErrorFixer }; 