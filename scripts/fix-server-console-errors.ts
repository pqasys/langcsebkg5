#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';

interface FixResult {
  file: string;
  fixes: string[];
  errors: string[];
}

class ServerConsoleErrorFixer {
  private results: FixResult[] = [];

  async run(): Promise<void> {
    console.log('🔧 Fixing console.error statements in server-side code...\n');

    const serverDirs = ['app/api', 'lib', 'scripts'];
    
    for (const dir of serverDirs) {
      if (fs.existsSync(dir)) {
        await this.processDirectory(dir);
      }
    }

    this.generateReport();
  }

  private async processDirectory(dir: string): Promise<void> {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        await this.processDirectory(fullPath);
      } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
        await this.processFile(fullPath);
      }
    }
  }

  private async processFile(filePath: string): Promise<void> {
    const result: FixResult = { file: filePath, fixes: [], errors: [] };
    
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;

      // Skip if this is the logger file itself
      if (filePath.includes('lib/logger.ts')) {
        return;
      }

      // Check if file already imports logger
      const hasLoggerImport = content.includes("import { logger") || 
                             content.includes("import { logError") ||
                             content.includes("from '@/lib/logger'") ||
                             content.includes("from '../logger'") ||
                             content.includes("from './logger'");

      // Add logger import if not present
      if (!hasLoggerImport && content.includes('console.error')) {
        const importMatch = content.match(/import.*from.*['"]/);
        if (importMatch) {
          const lastImportIndex = content.lastIndexOf('import');
          const lastImportEndIndex = content.indexOf('\n', lastImportIndex) + 1;
          
          // Determine the relative path to logger
          const relativePath = this.getRelativePathToLogger(filePath);
          const loggerImport = `import { logger, logError } from '${relativePath}';\n`;
          content = content.slice(0, lastImportEndIndex) + loggerImport + content.slice(lastImportEndIndex);
          modified = true;
          result.fixes.push('Added logger import');
        }
      }

      // Replace console.error statements with logger.error
      const consoleErrorRegex = /console\.error\([^)]*\);/g;
      const matches = content.match(consoleErrorRegex);
      
      if (matches) {
        // Replace each console.error with logger.error
        content = content.replace(consoleErrorRegex, (match) => {
          // Extract the error message from console.error
          const messageMatch = match.match(/console\.error\(['"`]([^'"`]+)['"`]/);
          if (messageMatch) {
            const message = messageMatch[1];
            return `logger.error('${message}');`;
          } else {
            // If no specific message, use a generic one
            return `logger.error('An error occurred');`;
          }
        });
        
        modified = true;
        result.fixes.push(`Replaced ${matches.length} console.error statements with logger.error`);
      }

      if (modified) {
        fs.writeFileSync(filePath, content);
        this.results.push(result);
      }
    } catch (error) {
      result.errors.push(`Failed to process file: ${error}`);
      this.results.push(result);
    }
  }

  private getRelativePathToLogger(filePath: string): string {
    const fileDir = path.dirname(filePath);
    const loggerPath = path.resolve('lib/logger');
    const relativePath = path.relative(fileDir, loggerPath);
    
    // Convert Windows path separators to forward slashes
    return relativePath.replace(/\\/g, '/');
  }

  private generateReport(): void {
    console.log('\n📊 SERVER CONSOLE.ERROR FIX REPORT');
    console.log('='.repeat(50));
    
    let totalFixes = 0;
    let totalErrors = 0;
    let filesModified = 0;
    
    this.results.forEach(result => {
      if (result.fixes.length > 0 || result.errors.length > 0) {
        console.log(`\n ${result.file}`);
        
        if (result.fixes.length > 0) {
          console.log('  ✅ Fixes applied:');
          result.fixes.forEach(fix => console.log(`    • ${fix}`));
          totalFixes += result.fixes.length;
          filesModified++;
        }
        
        if (result.errors.length > 0) {
          console.log('  ❌ Errors:');
          result.errors.forEach(error => console.log(`    • ${error}`));
          totalErrors += result.errors.length;
        }
      }
    });
    
    console.log(`\n� SUMMARY:`);
    console.log(`  Files modified: ${filesModified}`);
    console.log(`  Total fixes applied: ${totalFixes}`);
    console.log(`  Total errors encountered: ${totalErrors}`);
    
    if (totalFixes > 0) {
      console.log('\n🔄 Next steps:');
      console.log('  1. Review the changes made');
      console.log('  2. Test the application to ensure logging works properly');
      console.log('  3. Run "npm run bug:detect" to check remaining issues');
      console.log('  4. Consider implementing external logging service integration');
    }
  }
}

// Run the server console error fixer
async function main() {
  const fixer = new ServerConsoleErrorFixer();
  await fixer.run();
}

if (require.main === module) {
  main().catch(console.error);
} 