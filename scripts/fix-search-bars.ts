import fs from 'fs';
import path from 'path';

// Patterns to find search bars with icons
const searchPatterns = [
  // Pattern 1: Input with pl-10 and Search icon at left-3
  {
    regex: /className="[^"]*pl-10[^"]*"/g,
    replacement: (match: string) => match.replace(/pl-10/g, 'pl-12')
  },
  // Pattern 2: Input with pl-10 (standalone)
  {
    regex: /className="pl-10"/g,
    replacement: 'className="pl-12"'
  },
  // Pattern 3: Input with pl-10 in a larger className
  {
    regex: /className="([^"]*?)pl-10([^"]*?)"/g,
    replacement: (match: string, before: string, after: string) => 
      `className="${before}pl-12${after}"`
  },
  // Pattern 4: Input with pl-8 and Search icon at left-2 (pricing tables)
  {
    regex: /className="[^"]*pl-8[^"]*"/g,
    replacement: (match: string) => match.replace(/pl-8/g, 'pl-10')
  },
  // Pattern 5: Input with pl-8 (standalone)
  {
    regex: /className="pl-8"/g,
    replacement: 'className="pl-10"'
  },
  // Pattern 6: Search bars with long placeholders need extra padding
  {
    regex: /className="[^"]*pl-12[^"]*"/g,
    replacement: (match: string) => match.replace(/pl-12/g, 'pl-14')
  },
  // Pattern 7: pl-12 (standalone)
  {
    regex: /className="pl-12"/g,
    replacement: 'className="pl-14"'
  },
  // Pattern 8: Very long placeholders need maximum padding
  {
    regex: /className="[^"]*pl-14[^"]*"/g,
    replacement: (match: string) => match.replace(/pl-14/g, 'pl-16')
  },
  // Pattern 9: pl-14 (standalone)
  {
    regex: /className="pl-14"/g,
    replacement: 'className="pl-16"'
  }
];

// Directories to search
const searchDirs = [
  'app',
  'components',
  'lib'
];

// File extensions to process
const extensions = ['.tsx', '.ts', '.jsx', '.js'];

function findFiles(dir: string): string[] {
  const files: string[] = [];
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...findFiles(fullPath));
      } else if (extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.log(`Skipping directory ${dir}: ${error}`);
  }
  
  return files;
}

function fixSearchBars(filePath: string): boolean {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let newContent = content;
    
    // Apply each pattern
    for (const pattern of searchPatterns) {
      const matches = newContent.match(pattern.regex);
      if (matches) {
        newContent = newContent.replace(pattern.regex, pattern.replacement);
        modified = true;
        console.log(`  Fixed ${matches.length} search bar(s) in ${path.basename(filePath)}`);
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      return true;
    }
    
    return false;
  } catch (error) {
    console.log(`Error processing ${filePath}: ${error}`);
    return false;
  }
}

async function main() {
  console.log('🔍 Finding and fixing search bars with insufficient padding...\n');
  
  let totalFiles = 0;
  let fixedFiles = 0;
  
  for (const dir of searchDirs) {
    if (fs.existsSync(dir)) {
      console.log(`📁 Searching in ${dir}/`);
      const files = findFiles(dir);
      totalFiles += files.length;
      
      for (const file of files) {
        if (fixSearchBars(file)) {
          fixedFiles++;
        }
      }
    }
  }
  
  console.log(`\n✅ Search bar fix completed!`);
  console.log(`📊 Files processed: ${totalFiles}`);
  console.log(`🔧 Files fixed: ${fixedFiles}`);
  
  if (fixedFiles > 0) {
    console.log(`\n🎯 Fixed search bars by increasing left padding from pl-10 to pl-12`);
    console.log(`   This provides more space between search icons and placeholder text`);
  } else {
    console.log(`\n✨ No search bars found that need fixing`);
  }
}

main().catch(console.error); 