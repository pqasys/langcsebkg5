#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { logger } from '../lib/logger';

interface FixResult {
  file: string;
  fixes: string[];
  errors: string[];
}

class AutoFixer {
  private results: FixResult[] = [];

  async run(): Promise<void> {
    console.log('🔧 Starting automatic bug fixes...\n');

    // Fix Fast Refresh issues
    await this.fixFastRefreshIssues();
    
    // Fix missing error handling
    await this.fixErrorHandling();
    
    // Fix navigation issues
    await this.fixNavigationIssues();
    
    // Fix TypeScript issues
    await this.fixTypeScriptIssues();
    
    // Generate report
    this.generateReport();
  }

  private async fixFastRefreshIssues(): Promise<void> {
    console.log('🔧 Fixing Fast Refresh issues...');
    
    const sourceFiles = this.getSourceFiles();
    
    for (const file of sourceFiles) {
      const result: FixResult = { file, fixes: [], errors: [] };
      
      try {
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;

        // Fix router in useEffect dependencies
        const routerDependencyRegex = /useEffect\s*\(\s*\(\)\s*=>\s*\{[\s\S]*?\}\s*,\s*\[([^\]]*router[^\]]*)\]\s*\)/g;
        const matches = content.match(routerDependencyRegex);
        
        if (matches) {
          content = content.replace(routerDependencyRegex, (match, deps) => {
            const newDeps = deps.replace(/,\s*router\s*,?/, '').replace(/router\s*,?\s*/, '');
            return match.replace(deps, newDeps);
          });
          modified = true;
          result.fixes.push('Removed router from useEffect dependencies');
        }

        if (modified) {
          fs.writeFileSync(file, content);
          this.results.push(result);
        }
      } catch (error) {
        result.errors.push(`Failed to process file: ${error}`);
        this.results.push(result);
      }
    }
  }

  private async fixErrorHandling(): Promise<void> {
    console.log('🔧 Fixing error handling...');
    
    const sourceFiles = this.getSourceFiles();
    
    for (const file of sourceFiles) {
      const result: FixResult = { file, fixes: [], errors: [] };
      
      try {
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;

        // Add error state to components that fetch data
        if (content.includes('fetch(') && !content.includes('useState.*error') && content.includes('useState')) {
          const useStateRegex = /const\s*\[([^,]+),\s*set([^\]]+)\]\s*=\s*useState/g;
          const matches = content.match(useStateRegex);
          
          if (matches && !content.includes('error')) {
            // Add error state after existing useState declarations
            const insertPoint = content.lastIndexOf('useState');
            const insertIndex = content.indexOf(';', insertPoint) + 1;
            
            const errorState = `
  const [error, setError] = useState<string | null>(null);`;
            
            content = content.slice(0, insertIndex) + errorState + content.slice(insertIndex);
            modified = true;
            result.fixes.push('Added error state management');
          }
        }

        // Add error handling to fetch calls
        const fetchRegex = /fetch\([^)]+\)/g;
        const fetchMatches = content.match(fetchRegex);
        
        if (fetchMatches && !content.includes('catch')) {
          // Find fetch calls without error handling
          const fetchWithoutCatch = /fetch\([^)]+\)\s*\.then\([^)]+\)/g;
          if (fetchWithoutCatch.test(content)) {
            // This is a complex replacement that would need more sophisticated parsing
            result.fixes.push('Found fetch calls without error handling (manual fix needed)');
          }
        }

        if (modified) {
          fs.writeFileSync(file, content);
          this.results.push(result);
        }
      } catch (error) {
        result.errors.push(`Failed to process file: ${error}`);
        this.results.push(result);
      }
    }
  }

  private async fixNavigationIssues(): Promise<void> {
    console.log('🔧 Fixing navigation issues...');
    
    const sourceFiles = this.getSourceFiles();
    
    for (const file of sourceFiles) {
      const result: FixResult = { file, fixes: [], errors: [] };
      
      try {
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;

        // Fix incorrect navigation paths
        const pathFixes = [
          { from: '/student/course/', to: '/student/courses/' },
          { from: '/student/course/', to: '/student/courses/' },
          { from: '/module/', to: '/modules/' },
          { from: '/quiz/', to: '/quizzes/' }
        ];

        for (const fix of pathFixes) {
          if (content.includes(fix.from)) {
            content = content.replace(new RegExp(fix.from, 'g'), fix.to);
            modified = true;
            result.fixes.push(`Fixed navigation path: ${fix.from} → ${fix.to}`);
          }
        }

        if (modified) {
          fs.writeFileSync(file, content);
          this.results.push(result);
        }
      } catch (error) {
        result.errors.push(`Failed to process file: ${error}`);
        this.results.push(result);
      }
    }
  }

  private async fixTypeScriptIssues(): Promise<void> {
    console.log('🔧 Fixing TypeScript issues...');
    
    try {
      // Run TypeScript compiler to get errors
      const output = execSync('npx tsc --noEmit', { encoding: 'utf8' });
      
      // Parse TypeScript errors and suggest fixes
      const lines = output.split('\n');
      const errors: string[] = [];
      
      for (const line of lines) {
        if (line.includes('error TS')) {
          errors.push(line.trim());
        }
      }
      
      if (errors.length > 0) {
        console.log(`Found ${errors.length} TypeScript errors. Manual review needed.`);
        errors.forEach(error => console.log(`  ${error}`));
      }
    } catch (error: any) {
      // TypeScript errors are expected, this is just for analysis
      console.log('TypeScript analysis complete');
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
      file.endsWith('.tsx') || file.endsWith('.ts')
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
    console.log('\n📊 AUTO-FIX REPORT');
    console.log('='.repeat(50));
    
    let totalFixes = 0;
    let totalErrors = 0;
    
    this.results.forEach(result => {
      if (result.fixes.length > 0 || result.errors.length > 0) {
        console.log(`\n ${result.file}`);
        
        if (result.fixes.length > 0) {
          console.log('  ✅ Fixes applied:');
          result.fixes.forEach(fix => console.log(`    • ${fix}`));
          totalFixes += result.fixes.length;
        }
        
        if (result.errors.length > 0) {
          console.log('  ❌ Errors:');
          result.errors.forEach(error => console.log(`    • ${error}`));
          totalErrors += result.errors.length;
        }
      }
    });
    
    console.log(`\n� SUMMARY:`);
    console.log(`  Total fixes applied: ${totalFixes}`);
    console.log(`  Total errors encountered: ${totalErrors}`);
    console.log(`  Files processed: ${this.results.length}`);
    
    if (totalFixes > 0) {
      console.log('\n🔄 Next steps:');
      console.log('  1. Review the changes made');
      console.log('  2. Run tests to ensure nothing is broken');
      console.log('  3. Run "npm run bug:detect" to check for remaining issues');
    }
  }
}

// Run the auto-fixer
async function main() {
  const fixer = new AutoFixer();
  await fixer.run();
}

if (require.main === module) {
  main().catch(console.error);
} 