import fs from 'fs';
import path from 'path';

// Directories to search
const searchDirs = [
  'app',
  'components'
];

// File extensions to process
const extensions = ['.tsx', '.ts'];

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

function implementCSSSearchFix(filePath: string): boolean {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let newContent = content;
    
    // Pattern 1: Find search containers with Search icon and Input
    const searchPattern = /<div className="relative[^"]*">\s*<Search[^>]*className="[^"]*absolute[^"]*left-[0-9][^"]*"[^>]*\/>\s*<Input[^>]*placeholder="([^"]*)"[^>]*className="([^"]*)"[^>]*>/g;
    
    const matches = newContent.match(searchPattern);
    if (matches) {
      // Replace with CSS-based approach
      newContent = newContent.replace(
        /<div className="relative([^"]*)">\s*<Search([^>]*)\/>\s*<Input([^>]*placeholder="[^"]*"[^>]*className="[^"]*"[^>]*)>/g,
        (match, containerClasses, searchProps, inputProps) => {
          // Check if placeholder is long (more than 40 characters)
          const placeholderMatch = inputProps.match(/placeholder="([^"]*)"/);
          const isLongPlaceholder = placeholderMatch && placeholderMatch[1].length > 40;
          
          if (isLongPlaceholder) {
            // Use CSS-based approach for long placeholders
            const updatedInputProps = inputProps.replace(/className="[^"]*"/, '');
            return `<div className="relative${containerClasses} search-container-long">\n            <Search${searchProps}/>\n            <Input${updatedInputProps}>`;
          } else {
            // Use standard approach for short placeholders
            return match;
          }
        }
      );
      modified = true;
      console.log(`  Fixed search bar(s) in ${path.basename(filePath)}`);
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
  console.log('🔍 Implementing CSS-based search bar fix across the project...\n');
  
  let totalFiles = 0;
  let fixedFiles = 0;
  
  for (const dir of searchDirs) {
    if (fs.existsSync(dir)) {
      console.log(`📁 Searching in ${dir}/`);
      const files = findFiles(dir);
      totalFiles += files.length;
      
      for (const file of files) {
        if (implementCSSSearchFix(file)) {
          fixedFiles++;
        }
      }
    }
  }
  
  console.log(`\n✅ CSS-based search bar fix completed!`);
  console.log(`📊 Files processed: ${totalFiles}`);
  console.log(`🔧 Files fixed: ${fixedFiles}`);
  
  if (fixedFiles > 0) {
    console.log(`\n🎯 Applied CSS-based fix to search bars with long placeholders`);
    console.log(`   - Added 'search-container-long' class to containers`);
    console.log(`   - Removed conflicting className from Input components`);
    console.log(`   - Uses CSS rules for consistent spacing`);
  } else {
    console.log(`\n✨ No search bars found that need the CSS-based fix`);
  }
}

main().catch(console.error); 