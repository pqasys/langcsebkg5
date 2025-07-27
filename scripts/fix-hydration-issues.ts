#!/usr/bin/env tsx

/**
 * Script to fix hydration issues by replacing direct window.location usage
 * with safe navigation utilities
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const FIXES = [
  // Replace window.location.href = '/auth/signin' with navigate.to('/auth/signin')
  {
    pattern: /window\.location\.href\s*=\s*['"`]\/auth\/signin['"`]/g,
    replacement: "navigate.to('/auth/signin')",
    requiresImport: true
  },
  {
    pattern: /window\.location\.href\s*=\s*['"`]\/auth\/login['"`]/g,
    replacement: "navigate.to('/auth/login')",
    requiresImport: true
  },
  {
    pattern: /window\.location\.href\s*=\s*['"`]\/['"`]/g,
    replacement: "navigate.to('/')",
    requiresImport: true
  },
  {
    pattern: /window\.location\.replace\s*\(\s*['"`]\/['"`]\s*\)/g,
    replacement: "navigate.replace('/')",
    requiresImport: true
  },
  {
    pattern: /window\.location\.reload\s*\(\s*\)/g,
    replacement: "navigate.reload()",
    requiresImport: true
  },
  {
    pattern: /onClick\s*=\s*\(\s*\)\s*=>\s*window\.location\.reload\s*\(\s*\)/g,
    replacement: "onClick={() => navigate.reload()}",
    requiresImport: true
  },
  {
    pattern: /onClick\s*=\s*\(\s*\)\s*=>\s*window\.location\.href\s*=\s*['"`]\/['"`]/g,
    replacement: "onClick={() => navigate.to('/')",
    requiresImport: true
  }
];

const IMPORT_STATEMENT = "import { useNavigation } from '@/lib/navigation';";
const NAVIGATE_HOOK = "const navigate = useNavigation();";

async function findTsxFiles(): Promise<string[]> {
  const patterns = [
    'app/**/*.tsx',
    'components/**/*.tsx',
    'lib/**/*.tsx'
  ];
  
  const files: string[] = [];
  for (const pattern of patterns) {
    const matches = await glob(pattern, { ignore: ['node_modules/**', '.next/**'] });
    files.push(...matches);
  }
  
  return files;
}

function needsImport(content: string): boolean {
  return FIXES.some(fix => 
    fix.requiresImport && fix.pattern.test(content)
  );
}

function addImport(content: string): string {
  // Check if import already exists
  if (content.includes("import { useNavigation } from '@/lib/navigation'")) {
    return content;
  }
  
  // Find the last import statement
  const lines = content.split('\n');
  let lastImportIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('import ')) {
      lastImportIndex = i;
    }
  }
  
  if (lastImportIndex >= 0) {
    lines.splice(lastImportIndex + 1, 0, IMPORT_STATEMENT);
  } else {
    // No imports found, add at the beginning
    lines.unshift(IMPORT_STATEMENT);
  }
  
  return lines.join('\n');
}

function addNavigateHook(content: string): string {
  // Check if hook already exists
  if (content.includes('const navigate = useNavigation();')) {
    return content;
  }
  
  const lines = content.split('\n');
  
  // Find where to add the hook (after other hooks)
  let insertIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('const ') && line.includes('use') && line.includes('(')) {
      insertIndex = i;
    }
  }
  
  if (insertIndex >= 0) {
    lines.splice(insertIndex + 1, 0, '  ' + NAVIGATE_HOOK);
  } else {
    // No hooks found, add after function declaration
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('function ') || lines[i].includes('const ') && lines[i].includes('= () =>')) {
        insertIndex = i;
        break;
      }
    }
    if (insertIndex >= 0) {
      lines.splice(insertIndex + 1, 0, '  ' + NAVIGATE_HOOK);
    }
  }
  
  return lines.join('\n');
}

function applyFixes(content: string): string {
  let modifiedContent = content;
  
  for (const fix of FIXES) {
    modifiedContent = modifiedContent.replace(fix.pattern, fix.replacement);
  }
  
  return modifiedContent;
}

async function fixFile(filePath: string): Promise<void> {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let modifiedContent = content;
    
    // Apply fixes
    modifiedContent = applyFixes(modifiedContent);
    
    // Add imports and hooks if needed
    if (needsImport(modifiedContent)) {
      modifiedContent = addImport(modifiedContent);
      modifiedContent = addNavigateHook(modifiedContent);
    }
    
    // Only write if content changed
    if (modifiedContent !== content) {
      fs.writeFileSync(filePath, modifiedContent, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error);
  }
}

async function main() {
  console.log('🔍 Finding TSX files...');
  const files = await findTsxFiles();
  console.log(`Found ${files.length} TSX files`);
  
  console.log('🔧 Applying hydration fixes...');
  let fixedCount = 0;
  
  for (const file of files) {
    const originalContent = fs.readFileSync(file, 'utf8');
    await fixFile(file);
    const newContent = fs.readFileSync(file, 'utf8');
    
    if (originalContent !== newContent) {
      fixedCount++;
    }
  }
  
  console.log(`✅ Fixed ${fixedCount} files`);
  console.log('🎉 Hydration fixes completed!');
}

if (require.main === module) {
  main().catch(console.error);
} 