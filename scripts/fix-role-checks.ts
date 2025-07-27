import * as fs from 'fs';
import * as path from 'path';
import { logger } from '../lib/logger';

// Function to recursively find all TypeScript and JavaScript files
function findFiles(dir: string, extensions: string[] = ['.ts', '.tsx', '.js', '.jsx']): string[] {
  const files: string[] = [];
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      files.push(...findFiles(fullPath, extensions));
    } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Function to fix role checks in a file
function fixRoleChecks(filePath: string): boolean {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Fix lowercase role checks to uppercase
    const roleCheckPatterns = [
      // Exact matches for role comparisons
      { 
        pattern: /role\s*===?\s*['"]institution['"]/g, 
        replacement: "role === 'INSTITUTION'" 
      },
      { 
        pattern: /role\s*===?\s*['"]admin['"]/g, 
        replacement: "role === 'ADMIN'" 
      },
      { 
        pattern: /role\s*===?\s*['"]student['"]/g, 
        replacement: "role === 'STUDENT'" 
      },
      
      // toLowerCase() comparisons
      { 
        pattern: /role\?\.toLowerCase\(\)\s*===?\s*['"]institution['"]/g, 
        replacement: "role === 'INSTITUTION'" 
      },
      { 
        pattern: /role\?\.toLowerCase\(\)\s*===?\s*['"]admin['"]/g, 
        replacement: "role === 'ADMIN'" 
      },
      { 
        pattern: /role\?\.toLowerCase\(\)\s*===?\s*['"]student['"]/g, 
        replacement: "role === 'STUDENT'" 
      },
      
      // More complex patterns
      { 
        pattern: /role\.toLowerCase\(\)\s*===?\s*['"]institution['"]/g, 
        replacement: "role === 'INSTITUTION'" 
      },
      { 
        pattern: /role\.toLowerCase\(\)\s*===?\s*['"]admin['"]/g, 
        replacement: "role === 'ADMIN'" 
      },
      { 
        pattern: /role\.toLowerCase\(\)\s*===?\s*['"]student['"]/g, 
        replacement: "role === 'STUDENT'" 
      },
      
      // Negated comparisons
      { 
        pattern: /role\s*!==\s*['"]institution['"]/g, 
        replacement: "role !== 'INSTITUTION'" 
      },
      { 
        pattern: /role\s*!==\s*['"]admin['"]/g, 
        replacement: "role !== 'ADMIN'" 
      },
      { 
        pattern: /role\s*!==\s*['"]student['"]/g, 
        replacement: "role !== 'STUDENT'" 
      },
      
      // toLowerCase() negated comparisons
      { 
        pattern: /role\.toLowerCase\(\)\s*!==\s*['"]institution['"]/g, 
        replacement: "role !== 'INSTITUTION'" 
      },
      { 
        pattern: /role\.toLowerCase\(\)\s*!==\s*['"]admin['"]/g, 
        replacement: "role !== 'ADMIN'" 
      },
      { 
        pattern: /role\.toLowerCase\(\)\s*!==\s*['"]student['"]/g, 
        replacement: "role !== 'STUDENT'" 
      },
      
      // Optional chaining with toLowerCase()
      { 
        pattern: /role\?\.toLowerCase\(\)\s*!==\s*['"]institution['"]/g, 
        replacement: "role !== 'INSTITUTION'" 
      },
      { 
        pattern: /role\?\.toLowerCase\(\)\s*!==\s*['"]admin['"]/g, 
        replacement: "role !== 'ADMIN'" 
      },
      { 
        pattern: /role\?\.toLowerCase\(\)\s*!==\s*['"]student['"]/g, 
        replacement: "role !== 'STUDENT'" 
      }
    ];
    
    for (const { pattern, replacement } of roleCheckPatterns) {
      const newContent = content.replace(pattern, replacement);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(` Fixed role checks in: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    logger.error('❌ Error processing ${filePath}:');
    return false;
  }
}

// Main execution
function main() {
  console.log('🔧 Starting role check fixes...');
  
  const projectRoot = process.cwd();
  const files = findFiles(projectRoot);
  
  console.log(` Found ${files.length} files to check`);
  
  let fixedCount = 0;
  
  for (const file of files) {
    if (fixRoleChecks(file)) {
      fixedCount++;
    }
  }
  
  console.log(`\n� Completed! Fixed role checks in ${fixedCount} files`);
  console.log('\n📋 Summary of changes:');
  console.log('- Changed all role comparisons to use uppercase values (INSTITUTION, ADMIN, STUDENT)');
  console.log('- Removed unnecessary toLowerCase() calls');
  console.log('- Fixed both positive and negative role checks');
  console.log('- Maintained optional chaining where appropriate');
}

// Run the script
if (require.main === module) {
  main();
}

export { fixRoleChecks, findFiles }; 