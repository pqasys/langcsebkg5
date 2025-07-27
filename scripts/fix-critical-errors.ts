#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';

interface CriticalFix {
  pattern: string;
  replacement: string;
  description: string;
  files: string[];
}

const criticalFixes: CriticalFix[] = [
  // Fix generic toast error messages
  {
    pattern: "toast\\.error\\('Error fetching ([^']+):'\\);",
    replacement: "toast.error('Error fetching $1:', error instanceof Error ? error.message : 'Unknown error');",
    description: 'Improve generic toast error messages with error details',
    files: [
      'app/admin/courses/page.tsx',
      'app/admin/institutions/page.tsx',
      'app/admin/institutions/[id]/courses/page.tsx',
      'app/admin/institutions/[id]/permissions/page.tsx',
      'app/admin/institutions/[id]/users/page.tsx',
      'app/admin/payments/page.tsx',
      'app/admin/question-banks/page.tsx',
      'app/admin/question-templates/page.tsx',
      'app/admin/settings/page.tsx',
      'app/admin/settings/commission-tiers/page.tsx',
      'app/admin/settings/notifications/templates/page.tsx',
      'app/admin/settings/payment-approval/page.tsx',
      'app/admin/institution-monetization/page.tsx'
    ]
  },
  // Fix generic console.error messages
  {
    pattern: "console\\.error\\('Error fetching ([^']+):'\\);",
    replacement: "console.error('Error fetching $1:', error instanceof Error ? error.message : error);",
    description: 'Improve generic console.error messages with error details',
    files: [
      'app/admin/revenue/page.tsx',
      'app/admin/subscriptions/page.tsx',
      'app/admin/subscriptions/[id]/edit/page.tsx',
      'app/admin/tags/page.tsx',
      'app/admin/users/page.tsx'
    ]
  },
  // Fix generic "Error fetching data:" messages
  {
    pattern: "toast\\.error\\('Error fetching data:'\\);",
    replacement: "toast.error('Error fetching data:', error instanceof Error ? error.message : 'Unknown error');",
    description: 'Improve generic data fetching error messages',
    files: [
      'app/admin/courses/[id]/modules/page.tsx',
      'app/admin/courses/[id]/modules/[moduleId]/page.tsx',
      'app/admin/courses/[id]/modules/[moduleId]/quizzes/page.tsx',
      'app/admin/courses/[id]/modules/[moduleId]/quizzes/[quizId]/edit/page.tsx',
      'app/admin/courses/[id]/modules/[moduleId]/quizzes/[quizId]/page.tsx',
      'app/admin/courses/[id]/modules/[moduleId]/quizzes/[quizId]/questions/new/page.tsx',
      'app/admin/courses/[id]/modules/[moduleId]/quizzes/[quizId]/questions/[questionId]/edit/page.tsx',
      'app/admin/institutions/[id]/permissions/page.tsx',
      'app/admin/payments/page.tsx',
      'app/admin/settings/commission-tiers/page.tsx'
    ]
  }
];

function applyCriticalFixes() {
  console.log('🔧 Applying critical error fixes...\n');
  
  let totalFixes = 0;
  let filesModified = 0;
  
  for (const fix of criticalFixes) {
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
            filesModified++;
          }
        } catch (error) {
          console.error(`❌ Error fixing ${filePath}:`, error);
        }
      } else {
        console.log(`⚠️  File not found: ${filePath}`);
      }
    }
  }
  
  console.log(`\n� Applied ${totalFixes} fixes across ${filesModified} files`);
  return { totalFixes, filesModified };
}

function fixGenericErrorPatterns() {
  console.log('\n🔧 Applying generic error pattern fixes...\n');
  
  const filesToScan = [
    'app/admin/courses/page.tsx',
    'app/admin/institutions/page.tsx',
    'app/admin/institutions/[id]/courses/page.tsx',
    'app/admin/institutions/[id]/permissions/page.tsx',
    'app/admin/institutions/[id]/users/page.tsx',
    'app/admin/payments/page.tsx',
    'app/admin/question-banks/page.tsx',
    'app/admin/question-templates/page.tsx',
    'app/admin/settings/page.tsx',
    'app/admin/settings/commission-tiers/page.tsx',
    'app/admin/settings/notifications/templates/page.tsx',
    'app/admin/settings/payment-approval/page.tsx',
    'app/admin/institution-monetization/page.tsx',
    'app/admin/revenue/page.tsx',
    'app/admin/subscriptions/page.tsx',
    'app/admin/subscriptions/[id]/edit/page.tsx',
    'app/admin/tags/page.tsx',
    'app/admin/users/page.tsx'
  ];
  
  let fixesApplied = 0;
  let filesModified = 0;
  
  for (const filePath of filesToScan) {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      continue;
    }
    
    try {
      let content = fs.readFileSync(filePath, 'utf-8');
      let modified = false;
      
      // Fix 1: Generic toast error messages
      const toastErrorRegex = /toast\.error\('Error fetching ([^']+):'\);/g;
      if (toastErrorRegex.test(content)) {
        content = content.replace(
          toastErrorRegex,
          "toast.error('Error fetching $1:', error instanceof Error ? error.message : 'Unknown error');"
        );
        modified = true;
      }
      
      // Fix 2: Generic console.error messages
      const consoleErrorRegex = /console\.error\('Error fetching ([^']+):'\);/g;
      if (consoleErrorRegex.test(content)) {
        content = content.replace(
          consoleErrorRegex,
          "console.error('Error fetching $1:', error instanceof Error ? error.message : error);"
        );
        modified = true;
      }
      
      // Fix 3: Generic "Error fetching data:" messages
      if (content.includes("toast.error('Error fetching data:');")) {
        content = content.replace(
          /toast\.error\('Error fetching data:'\);/g,
          "toast.error('Error fetching data:', error instanceof Error ? error.message : 'Unknown error');"
        );
        modified = true;
      }
      
      // Fix 4: Generic "Error fetching data:" console messages
      if (content.includes("console.error('Error fetching data:');")) {
        content = content.replace(
          /console\.error\('Error fetching data:'\);/g,
          "console.error('Error fetching data:', error instanceof Error ? error.message : error);"
        );
        modified = true;
      }
      
      if (modified) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(` Fixed generic error patterns in: ${filePath}`);
        fixesApplied++;
        filesModified++;
      }
      
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error);
    }
  }
  
  console.log(`\n� Applied ${fixesApplied} generic pattern fixes across ${filesModified} files`);
  return { fixesApplied, filesModified };
}

function fixAPIErrorResponses() {
  console.log('\n🔧 Fixing API error responses...\n');
  
  const apiFiles = [
    'app/api/admin/institutions/[id]/route.ts',
    'app/api/institutions/[id]/route.ts',
    'app/api/institution/profile/route.ts',
    'app/api/institution/settings/route.ts',
    'app/api/institution/subscription/route.ts',
    'app/api/institution/info/route.ts',
    'app/api/institution/current/route.ts',
    'app/api/institution/analytics/stats/route.ts',
    'app/api/admin/institutions/[id]/permissions/route.ts',
    'app/api/admin/institutions/[id]/users/route.ts',
    'app/api/admin/institutions/settings/route.ts',
    'app/api/admin/institutions/route.ts',
    'app/api/admin/institution-monetization/route.ts'
  ];
  
  let fixesApplied = 0;
  let filesModified = 0;
  
  for (const filePath of apiFiles) {
    if (!fs.existsSync(filePath)) continue;
    
    try {
      let content = fs.readFileSync(filePath, 'utf-8');
      let modified = false;
      
      // Fix generic 500 error responses
      const genericErrorRegex = /return NextResponse\.json\(\s*\{\s*error:\s*'([^']+)'\s*\},\s*\{\s*status:\s*500\s*\}\s*\);/g;
      if (genericErrorRegex.test(content)) {
        content = content.replace(
          genericErrorRegex,
          `return NextResponse.json(
      { 
        error: '$1',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );`
        );
        modified = true;
      }
      
      // Fix console.error without error details
      if (content.includes("console.error('Error fetching")) {
        content = content.replace(
          /console\.error\('Error fetching ([^']+):'\);/g,
          "console.error('Error fetching $1:', error instanceof Error ? error.message : error);"
        );
        modified = true;
      }
      
      if (modified) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(` Fixed API error responses in: ${filePath}`);
        fixesApplied++;
        filesModified++;
      }
      
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error);
    }
  }
  
  console.log(`\n� Applied ${fixesApplied} API error response fixes across ${filesModified} files`);
  return { fixesApplied, filesModified };
}

function main() {
  console.log('🚀 Starting critical error fixes...\n');
  
  const criticalResults = applyCriticalFixes();
  const genericResults = fixGenericErrorPatterns();
  const apiResults = fixAPIErrorResponses();
  
  const totalFixes = criticalResults.totalFixes + genericResults.fixesApplied + apiResults.fixesApplied;
  const totalFiles = criticalResults.filesModified + genericResults.filesModified + apiResults.filesModified;
  
  console.log('\n📊 Summary:');
  console.log(` Total fixes applied: ${totalFixes}`);
  console.log(` Files modified: ${totalFiles}`);
  
  console.log('\n✅ All critical fixes applied!');
  console.log('\n💡 Next steps:');
  console.log('1. Run "npm run error:scan" to verify improvements');
  console.log('2. Test the application to see better error messages');
  console.log('3. Monitor console logs for improved error details');
  console.log('4. Check API responses for better error information');
}

if (require.main === module) {
  main();
} 