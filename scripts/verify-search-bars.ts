import fs from 'fs';
import path from 'path';

function findSearchBars(dir: string): string[] {
  const results: string[] = [];
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        results.push(...findSearchBars(fullPath));
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        
        // Look for search-related patterns
        if (content.includes('Search') && content.includes('placeholder') && content.includes('pl-')) {
          results.push(fullPath);
        }
      }
    }
  } catch (error) {
    console.log(`Skipping directory ${dir}: ${error}`);
  }
  
  return results;
}

async function main() {
  console.log('🔍 Verifying search bars across the project...\n');
  
  const searchDirs = ['app', 'components'];
  const allFiles: string[] = [];
  
  for (const dir of searchDirs) {
    if (fs.existsSync(dir)) {
      console.log(`📁 Searching in ${dir}/`);
      const files = findSearchBars(dir);
      allFiles.push(...files);
    }
  }
  
  console.log(`\n📊 Found ${allFiles.length} files with search bars:\n`);
  
  for (const file of allFiles) {
    console.log(`📄 ${path.relative('.', file)}`);
    
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Look for Search icons
      if (line.includes('<Search') && line.includes('left-')) {
        console.log(`   Line ${i + 1}: Search icon found`);
        console.log(`   ${line.trim()}`);
      }
      
      // Look for Input with placeholder
      if (line.includes('<Input') && line.includes('placeholder') && line.includes('pl-')) {
        console.log(`   Line ${i + 1}: Input with placeholder found`);
        console.log(`   ${line.trim()}`);
      }
    }
    console.log('');
  }
  
  console.log('✅ Search bar verification completed!');
}

main().catch(console.error); 