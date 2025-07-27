#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';

interface FixResult {
  file: string;
  fixes: string[];
  errors: string[];
}

class ConsoleErrorFixer {
  private results: FixResult[] = [];

  async run(): Promise<void> {
    console.log('🔧 Fixing console.error statements in production code...\n');

    const sourceDirs = ['app', 'components'];
    
    for (const dir of sourceDirs) {
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
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        await this.processFile(fullPath);
      }
    }
  }

  private async processFile(filePath: string): Promise<void> {
    const result: FixResult = { file: filePath, fixes: [], errors: [] };
    
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;

      // Check if file already imports toast
      const hasToastImport = content.includes("import { toast } from 'sonner'") || 
                            content.includes("import { toast } from '@/components/ui/use-toast'") ||
                            content.includes("import { toast } from 'react-hot-toast'");

      // Add toast import if not present
      if (!hasToastImport && content.includes('console.error')) {
        const importMatch = content.match(/import.*from.*['"]/);
        if (importMatch) {
          const lastImportIndex = content.lastIndexOf('import');
          const lastImportEndIndex = content.indexOf('\n', lastImportIndex) + 1;
          
          const toastImport = "import { toast } from 'sonner';\n";
          content = content.slice(0, lastImportEndIndex) + toastImport + content.slice(lastImportEndIndex);
          modified = true;
          result.fixes.push('Added toast import');
        }
      }

      // Replace console.error statements
      const consoleErrorRegex = /console\.error\([^)]*\);/g;
      const matches = content.match(consoleErrorRegex);
      
      if (matches) {
        // Replace each console.error with appropriate toast.error
        content = content.replace(consoleErrorRegex, (match) => {
          // Extract the error message from console.error
          const messageMatch = match.match(/console\.error\(['"`]([^'"`]+)['"`]/);
          if (messageMatch) {
            const message = messageMatch[1];
            return `toast.error('${message}');`;
          } else {
            // If no specific message, use a generic one
            return `toast.error('An error occurred');`;
          }
        });
        
        modified = true;
        result.fixes.push(`Replaced ${matches.length} console.error statements with toast notifications`);
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

  private generateReport(): void {
    console.log('\n📊 CONSOLE.ERROR FIX REPORT');
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
      console.log('  2. Test the application to ensure toast notifications work');
      console.log('  3. Run "npm run bug:detect" to check remaining issues');
    }
  }
}

// Run the console error fixer
async function main() {
  const fixer = new ConsoleErrorFixer();
  await fixer.run();
}

if (require.main === module) {
  main().catch(console.error);
} 