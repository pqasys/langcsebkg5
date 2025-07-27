#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';

interface FixPattern {
  pattern: string;
  replacement: string;
  description: string;
  files: string[];
}

const specificFixes: FixPattern[] = [
  // Fix undefined institution ID logging
  {
    pattern: 'console\\.log.*Institution ID from props: undefined',
    replacement: "console.log('Sidebar - Institution ID from props:', institutionId || 'Not provided');",
    description: 'Fix undefined institution ID logging',
    files: ['components/admin/Sidebar.tsx']
  },
  // Fix generic error fetching messages
  {
    pattern: "toast\\.error\\('Error fetching institution:'\\);",
    replacement: "toast.error('Error fetching institution:', error instanceof Error ? error.message : 'Unknown error');",
    description: 'Improve error fetching institution messages',
    files: ['app/admin/institutions/[id]/edit/page.tsx', 'app/awaiting-approval/page.tsx']
  },
  // Fix generic 500 error responses
  {
    pattern: "return NextResponse\\.json\\(\\{ error: 'Failed to fetch institution' \\}, \\{ status: 500 \\}\\);",
    replacement: `return NextResponse.json(
      { 
        error: 'Failed to fetch institution',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );`,
    description: 'Improve 500 error responses with details',
    files: ['app/api/admin/institutions/[id]/route.ts']
  },
  // Fix console.error without error details
  {
    pattern: "console\\.error\\('Error fetching institution:'\\);",
    replacement: "console.error('Error fetching institution:', error instanceof Error ? error.message : error);",
    description: 'Add error details to console.error',
    files: ['app/api/admin/institutions/[id]/route.ts']
  }
];

function applyFixes() {
  console.log('🔧 Applying specific error fixes...\n');
  
  let totalFixes = 0;
  
  for (const fix of specificFixes) {
    for (const filePath of fix.files) {
      if (fs.existsSync(filePath)) {
        try {
          const content = fs.readFileSync(filePath, 'utf-8');
          const regex = new RegExp(fix.pattern, 'g');
          
          if (regex.test(content)) {
            const newContent = content.replace(regex, fix.replacement);
            fs.writeFileSync(filePath, newContent, 'utf-8');
            
            console.log(` Fixed: ${fix.description}`);
            console.log(`   File: ${filePath}`);
            totalFixes++;
          }
        } catch (error) {
          console.error(`❌ Error fixing ${filePath}:`, error);
        }
      } else {
        console.log(`⚠️  File not found: ${filePath}`);
      }
    }
  }
  
  console.log(`\n� Applied ${totalFixes} fixes`);
}

// Additional fixes for common patterns
function fixCommonPatterns() {
  console.log('\n🔧 Applying common pattern fixes...\n');
  
  const filesToScan = [
    'app/api/admin/institutions/[id]/route.ts',
    'components/admin/Sidebar.tsx',
    'app/admin/institutions/[id]/edit/page.tsx',
    'app/awaiting-approval/page.tsx'
  ];
  
  let fixesApplied = 0;
  
  for (const filePath of filesToScan) {
    if (!fs.existsSync(filePath)) continue;
    
    try {
      let content = fs.readFileSync(filePath, 'utf-8');
      let modified = false;
      
      // Fix 1: Improve error logging
      if (content.includes("console.error('Error fetching institution:');")) {
        content = content.replace(
          "console.error('Error fetching institution:');",
          "console.error('Error fetching institution:', error instanceof Error ? error.message : error);"
        );
        modified = true;
      }
      
      // Fix 2: Improve toast error messages
      if (content.includes("toast.error('Error fetching institution:');")) {
        content = content.replace(
          "toast.error('Error fetching institution:');",
          "toast.error('Error fetching institution:', error instanceof Error ? error.message : 'Unknown error');"
        );
        modified = true;
      }
      
      // Fix 3: Improve 500 error responses
      if (content.includes("{ error: 'Failed to fetch institution' }")) {
        content = content.replace(
          "{ error: 'Failed to fetch institution' }",
          `{ 
        error: 'Failed to fetch institution',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      }`
        );
        modified = true;
      }
      
      if (modified) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(` Fixed common patterns in: ${filePath}`);
        fixesApplied++;
      }
      
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error);
    }
  }
  
  console.log(`\n� Applied ${fixesApplied} common pattern fixes`);
}

function main() {
  console.log('🚀 Starting specific error fixes...\n');
  
  applyFixes();
  fixCommonPatterns();
  
  console.log('\n✅ All fixes applied!');
  console.log('\n💡 Next steps:');
  console.log('1. Test the application to verify fixes work');
  console.log('2. Check the console for improved error messages');
  console.log('3. Monitor API responses for better error details');
  console.log('4. Run the error scan again to verify improvements');
}

if (require.main === module) {
  main();
} 