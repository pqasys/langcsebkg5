const fs = require('fs');
const path = require('path');

// Function to fix syntax errors in a file
function fixSyntaxErrors(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix console.error indentation issues
    const consoleErrorPattern = /(\s*)\} catch \(error\) \{\n(\s*)console\.error\('Error occurred:', error\);/g;
    const replacement = '$1} catch (error) {\n$2  console.error(\'Error occurred:\', error);';
    
    if (consoleErrorPattern.test(content)) {
      content = content.replace(consoleErrorPattern, replacement);
      modified = true;
    }

    // Fix missing backticks in template literals
    const missingBacktickPattern = /throw new Error\(`([^`]*)\);/g;
    const backtickReplacement = 'throw new Error(`$1`);';
    
    if (missingBacktickPattern.test(content)) {
      content = content.replace(missingBacktickPattern, backtickReplacement);
      modified = true;
    }

    // Fix missing backticks in fetch URLs
    const fetchUrlPattern = /fetch\(([^`]*)\$\{([^}]*)\}\)/g;
    const fetchUrlReplacement = 'fetch(`$1${$2}`)';
    
    if (fetchUrlPattern.test(content)) {
      content = content.replace(fetchUrlPattern, fetchUrlReplacement);
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Function to recursively find and fix all .tsx files in admin-backup-restored
function fixAllFiles(dir) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      fixAllFiles(fullPath);
    } else if (item.endsWith('.tsx')) {
      fixSyntaxErrors(fullPath);
    }
  }
}

// Start fixing files
const adminBackupRestoredPath = path.join(__dirname, 'app', 'admin-backup-restored');
if (fs.existsSync(adminBackupRestoredPath)) {
  console.log('Fixing syntax errors in admin-backup-restored files...');
  fixAllFiles(adminBackupRestoredPath);
  console.log('Done!');
} else {
  console.log('admin-backup-restored directory not found');
} 