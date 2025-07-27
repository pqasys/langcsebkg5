const fs = require('fs');
const path = require('path');

// Patterns to fix
const patterns = [
  {
    // Fix malformed toast.error calls with extra closing parenthesis
    regex: /toast\.error\(`([^`]+):\. Please try again or contact support if the problem persists\.`\)\);/g,
    replacement: (match, message) => {
      // Remove the colon and fix the syntax
      const cleanMessage = message.replace(/:$/, '');
      return `toast.error(\`${cleanMessage}. Please try again or contact support if the problem persists.\`);`;
    }
  },
  {
    // Fix malformed toast.error calls with extra closing parenthesis (alternative pattern)
    regex: /toast\.error\(`([^`]+)`\)\);/g,
    replacement: (match, message) => {
      return `toast.error(\`${message}\`);`;
    }
  },
  {
    // Fix console.error statements that are not properly indented
    regex: /(\s+)console\.error\('Error occurred:', error\);/g,
    replacement: (match, spaces) => {
      return `${spaces}console.error('Error occurred:', error);`;
    }
  },
  {
    // Fix malformed error messages with backticks inside backticks
    regex: /throw new Error\(`([^`]+)`([^`]+)`([^`]+)`\);/g,
    replacement: (match, part1, part2, part3) => {
      return `throw new Error(\`${part1}${part2}${part3}\`);`;
    }
  }
];

function findFiles(dir, extensions = ['.tsx', '.ts']) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip node_modules, .next, out, and other build directories
        if (!['node_modules', '.next', 'out', 'dist', 'build'].includes(item)) {
          traverse(fullPath);
        }
      } else if (extensions.includes(path.extname(item))) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

function fixFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let modifiedContent = content;
    let hasChanges = false;

    patterns.forEach(pattern => {
      const newContent = modifiedContent.replace(pattern.regex, pattern.replacement);
      if (newContent !== modifiedContent) {
        hasChanges = true;
        modifiedContent = newContent;
      }
    });

    if (hasChanges) {
      fs.writeFileSync(filePath, modifiedContent, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function findAndFixFiles() {
  const allFiles = findFiles('.');
  let fixedCount = 0;
  let totalFiles = 0;

  console.log('🔍 Scanning for syntax errors...');
  console.log(`Found ${allFiles.length} files to check\n`);

  allFiles.forEach(file => {
    totalFiles++;
    if (fixFile(file)) {
      fixedCount++;
    }
  });

  console.log(`\n📊 Summary:`);
  console.log(`- Total files processed: ${totalFiles}`);
  console.log(`- Files fixed: ${fixedCount}`);
  console.log(`- Files unchanged: ${totalFiles - fixedCount}`);
}

// Run the script
if (require.main === module) {
  findAndFixFiles();
}

module.exports = { fixFile, patterns }; 