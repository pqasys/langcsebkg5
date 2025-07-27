#!/usr/bin/env node

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

interface ErrorPattern {
  pattern: string;
  description: string;
  fix?: string;
  severity: 'high' | 'medium' | 'low';
}

interface FoundError {
  file: string;
  line: number;
  pattern: ErrorPattern;
  context: string;
}

const commonErrorPatterns: ErrorPattern[] = [
  // Undefined props/parameters
  {
    pattern: 'undefined.*from props',
    description: 'Undefined values being passed as props',
    severity: 'high'
  },
  {
    pattern: 'console\\.log.*undefined',
    description: 'Console logging undefined values',
    severity: 'medium'
  },
  {
    pattern: 'Error fetching.*:',
    description: 'Generic error fetching messages without proper error handling',
    severity: 'high'
  },
  {
    pattern: 'catch \\(error\\) \\{[^}]*console\\.error[^}]*\\}',
    description: 'Catch blocks with only console.error',
    severity: 'medium'
  },
  {
    pattern: 'return NextResponse\\.json\\(\\{ error: [^}]*\\}, \\{ status: 500 \\}\\)',
    description: 'Generic 500 errors without proper error details',
    severity: 'high'
  },
  {
    pattern: 'throw new Error\\([^)]*\\)',
    description: 'Generic error throwing without context',
    severity: 'medium'
  },
  {
    pattern: 'if \\(![^)]*\\) \\{',
    description: 'Negative condition checks that might be unclear',
    severity: 'low'
  },
  {
    pattern: '\\?\\.[^\\s]*\\.',
    description: 'Optional chaining that might hide errors',
    severity: 'medium'
  },
  {
    pattern: '\\|\\| [^\\s]*',
    description: 'Fallback values that might mask issues',
    severity: 'low'
  }
];

function findFiles(dir: string, extensions: string[] = ['.ts', '.tsx', '.js', '.jsx']): string[] {
  const files: string[] = [];
  
  function traverse(currentDir: string) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip node_modules, .next, and other build directories
        if (!['node_modules', '.next', 'dist', 'build', '.git'].includes(item)) {
          traverse(fullPath);
        }
      } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

function scanFileForErrors(filePath: string): FoundError[] {
  const errors: FoundError[] = [];
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNumber = i + 1;
    
    for (const pattern of commonErrorPatterns) {
      const regex = new RegExp(pattern.pattern, 'gi');
      if (regex.test(line)) {
        errors.push({
          file: filePath,
          line: lineNumber,
          pattern,
          context: line.trim()
        });
      }
    }
  }
  
  return errors;
}

function generateErrorReport(errors: FoundError[]): string {
  let report = '# Common Error Patterns Report\n\n';
  report += `Generated on: ${new Date().toISOString()}\n`;
  report += `Total errors found: ${errors.length}\n\n`;
  
  // Group by severity
  const bySeverity = errors.reduce((acc, error) => {
    if (!acc[error.pattern.severity]) {
      acc[error.pattern.severity] = [];
    }
    acc[error.pattern.severity].push(error);
    return acc;
  }, {} as Record<string, FoundError[]>);
  
  // High severity errors
  if (bySeverity.high?.length) {
    report += '## 🔴 High Severity Errors\n\n';
    bySeverity.high.forEach(error => {
      report += `### ${error.pattern.description}\n`;
      report += `**File:** \`${error.file}\`\n`;
      report += `**Line:** ${error.line}\n`;
      report += `**Context:** \`${error.context}\`\n\n`;
    });
  }
  
  // Medium severity errors
  if (bySeverity.medium?.length) {
    report += '## 🟡 Medium Severity Errors\n\n';
    bySeverity.medium.forEach(error => {
      report += `### ${error.pattern.description}\n`;
      report += `**File:** \`${error.file}\`\n`;
      report += `**Line:** ${error.line}\n`;
      report += `**Context:** \`${error.context}\`\n\n`;
    });
  }
  
  // Low severity errors
  if (bySeverity.low?.length) {
    report += '## 🟢 Low Severity Errors\n\n';
    bySeverity.low.forEach(error => {
      report += `### ${error.pattern.description}\n`;
      report += `**File:** \`${error.file}\`\n`;
      report += `**Line:** ${error.line}\n`;
      report += `**Context:** \`${error.context}\`\n\n`;
    });
  }
  
  return report;
}

function suggestFixes(errors: FoundError[]): string {
  let suggestions = '# Suggested Fixes\n\n';
  
  const uniquePatterns = [...new Set(errors.map(e => e.pattern.description))];
  
  uniquePatterns.forEach(patternDesc => {
    const patternErrors = errors.filter(e => e.pattern.description === patternDesc);
    
    suggestions += `## ${patternDesc}\n`;
    suggestions += `**Found in ${patternErrors.length} locations:**\n\n`;
    
    patternErrors.forEach(error => {
      suggestions += `### ${error.file}:${error.line}\n`;
      suggestions += `**Current:** \`${error.context}\`\n`;
      
      // Suggest specific fixes based on pattern
      if (error.pattern.description.includes('Undefined values being passed as props')) {
        suggestions += `**Suggested fix:** Add proper default values or null checks\n`;
        suggestions += `\`\`\`tsx\n`;
        suggestions += `// Instead of: ${error.context}\n`;
        suggestions += `// Use: institutionId || null\n`;
        suggestions += `// Or: institutionId ?? null\n`;
        suggestions += `\`\`\`\n\n`;
      } else if (error.pattern.description.includes('Generic error fetching')) {
        suggestions += `**Suggested fix:** Add proper error handling with specific error messages\n`;
        suggestions += `\`\`\`tsx\n`;
        suggestions += `// Instead of: ${error.context}\n`;
        suggestions += `// Use: console.error('Error fetching institution:', error.message || error)\n`;
        suggestions += `\`\`\`\n\n`;
      } else if (error.pattern.description.includes('Generic 500 errors')) {
        suggestions += `**Suggested fix:** Include error details in response\n`;
        suggestions += `\`\`\`tsx\n`;
        suggestions += `// Instead of: ${error.context}\n`;
        suggestions += `// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })\n`;
        suggestions += `\`\`\`\n\n`;
      }
    });
  });
  
  return suggestions;
}

function main() {
  console.log('🔍 Scanning for common error patterns...\n');
  
  const projectRoot = process.cwd();
  const files = findFiles(projectRoot);
  
  console.log(`Found ${files.length} files to scan...\n`);
  
  const allErrors: FoundError[] = [];
  
  for (const file of files) {
    const errors = scanFileForErrors(file);
    allErrors.push(...errors);
  }
  
  console.log(`Found ${allErrors.length} potential issues\n`);
  
  // Generate reports
  const errorReport = generateErrorReport(allErrors);
  const suggestionsReport = suggestFixes(allErrors);
  
  // Write reports to files
  fs.writeFileSync('error-patterns-report.md', errorReport);
  fs.writeFileSync('error-fixes-suggestions.md', suggestionsReport);
  
  console.log('📊 Reports generated:');
  console.log('- error-patterns-report.md');
  console.log('- error-fixes-suggestions.md');
  
  // Show summary
  const bySeverity = allErrors.reduce((acc, error) => {
    acc[error.pattern.severity] = (acc[error.pattern.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  console.log('\n📈 Summary:');
  console.log(`� High severity: ${bySeverity.high || 0}`);
  console.log(`� Medium severity: ${bySeverity.medium || 0}`);
  console.log(`� Low severity: ${bySeverity.low || 0}`);
  
  if (allErrors.length > 0) {
    console.log('\n💡 Next steps:');
    console.log('1. Review error-patterns-report.md for detailed findings');
    console.log('2. Check error-fixes-suggestions.md for specific fix recommendations');
    console.log('3. Prioritize high severity errors first');
    console.log('4. Run this script again after making fixes to verify improvements');
  } else {
    console.log('\n✅ No common error patterns found!');
  }
}

if (require.main === module) {
  main();
} 