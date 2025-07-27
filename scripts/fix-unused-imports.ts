#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';

interface FixResult {
  file: string;
  fixes: string[];
  errors: string[];
}

class UnusedImportFixer {
  private results: FixResult[] = [];

  async run(): Promise<void> {
    console.log('🔧 Fixing unused imports...\n');

    const sourceDirs = ['scripts', 'tests'];
    
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
      } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
        await this.processFile(fullPath);
      }
    }
  }

  private async processFile(filePath: string): Promise<void> {
    const result: FixResult = {
      file: filePath,
      fixes: [],
      errors: []
    };

    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;

      // Remove unused logError imports
      if (content.includes('import { logger, logError }')) {
        content = content.replace(
          /import \{ logger, logError \} from ['"]\.\.\/lib\/logger['"];?\n?/g,
          'import { logger } from \'../lib/logger\';\n'
        );
        modified = true;
        result.fixes.push('Removed unused logError import');
      }

      // Remove unused error variables in catch blocks
      content = content.replace(
        /\.catch\(\(error\) => \{[\s\S]*?\}\);/g,
        (match) => {
          if (match.includes('error') && !match.includes('console.error') && !match.includes('toast.error')) {
            return match.replace(/\(error\) =>/, '() =>');
          }
          return match;
        }
      );

      // Remove unused browserName parameters
      content = content.replace(
        /async \(\{ page, browserName \}\)/g,
        'async ({ page })'
      );

      // Remove unused config parameters
      content = content.replace(
        /async function \w+\(config: FullConfig\)/g,
        'async function globalSetup()'
      );

      // Remove unused expect imports
      content = content.replace(
        /import \{ test, expect \} from ['"]@playwright\/test['"];?\n?/g,
        'import { test } from \'@playwright/test\';\n'
      );

      // Remove unused chromium imports
      content = content.replace(
        /import \{ chromium, FullConfig \} from ['"]@playwright\/test['"];?\n?/g,
        'import { FullConfig } from \'@playwright/test\';\n'
      );

      // Remove unused testData imports
      content = content.replace(
        /import \{ TestHelpers, testData \} from ['"]\.\/utils\/test-helpers['"];?\n?/g,
        'import { TestHelpers } from \'./utils/test-helpers\';\n'
      );

      if (modified) {
        fs.writeFileSync(filePath, content);
        result.fixes.push('Fixed unused imports and parameters');
      }

    } catch (error) {
      result.errors.push(`Error processing file: ${error}`);
    }

    if (result.fixes.length > 0 || result.errors.length > 0) {
      this.results.push(result);
    }
  }

  private generateReport(): void {
    console.log('\n📊 Unused Import Fix Report\n');
    console.log('=' .repeat(50));

    let totalFixes = 0;
    let totalErrors = 0;

    for (const result of this.results) {
      console.log(`\n ${result.file}`);
      
      if (result.fixes.length > 0) {
        console.log('  ✅ Fixes:');
        result.fixes.forEach(fix => console.log(`    - ${fix}`));
        totalFixes += result.fixes.length;
      }
      
      if (result.errors.length > 0) {
        console.log('  ❌ Errors:');
        result.errors.forEach(error => console.log(`    - ${error}`));
        totalErrors += result.errors.length;
      }
    }

    console.log('\n' + '=' .repeat(50));
    console.log(`� Summary: ${totalFixes} fixes applied, ${totalErrors} errors encountered`);
    console.log(` Files processed: ${this.results.length}`);

    // Save report
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalFixes,
        totalErrors,
        filesProcessed: this.results.length
      },
      results: this.results
    };

    fs.writeFileSync('unused-import-fix-report.json', JSON.stringify(report, null, 2));
    console.log('\n📄 Report saved to: unused-import-fix-report.json');
  }
}

// Run the fixer
const fixer = new UnusedImportFixer();
fixer.run().catch(console.error); 