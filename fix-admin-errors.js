const fs = require('fs');
const path = require('path');

// Function to fix specific syntax errors in a file
function fixSyntaxErrors(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix 1: Malformed template literals with "Context:" patterns
    const contextPattern = /throw new Error\(`Failed to [^`]* - Context: [^`]*\);/g;
    if (contextPattern.test(content)) {
      console.log(`  - Found malformed Context: template literals in ${filePath}`);
      content = content.replace(contextPattern, (match) => {
        // Extract just the error message part
        const errorMatch = match.match(/Failed to [^-]+/);
        if (errorMatch) {
          return `throw new Error('${errorMatch[0]}');`;
        }
        return match;
      });
      modified = true;
    }

    // Fix 2: Console.error indentation issues
    const consoleErrorPattern = /(\s*)\} catch \(error\) \{\n(\s*)console\.error\('Error occurred:', error\);/g;
    if (consoleErrorPattern.test(content)) {
      console.log(`  - Found console.error indentation issue in ${filePath}`);
      content = content.replace(consoleErrorPattern, '$1} catch (error) {\n$2  console.error(\'Error occurred:\', error);');
      modified = true;
    }

    // Fix 3: Malformed toast.error calls with extra parameters
    const toastErrorPattern = /toast\.error\(`[^`]*\. Please try again or contact support if the problem persists\.`\), [^)]+\);/g;
    if (toastErrorPattern.test(content)) {
      console.log(`  - Found malformed toast.error call in ${filePath}`);
      content = content.replace(toastErrorPattern, (match) => {
        // Extract just the message part
        const messageMatch = match.match(/`([^`]*)\. Please try again or contact support if the problem persists\.`/);
        if (messageMatch) {
          return `toast.error(\`${messageMatch[1]}. Please try again or contact support if the problem persists.\`);`;
        }
        return match;
      });
      modified = true;
    }

    // Fix 4: Extra closing parentheses in toast.error
    const extraParenPattern = /toast\.error\(`[^`]*\. Please try again or contact support if the problem persists\.`\)\);/g;
    if (extraParenPattern.test(content)) {
      console.log(`  - Found extra parentheses in toast.error in ${filePath}`);
      content = content.replace(extraParenPattern, (match) => {
        return match.replace('));', ');');
      });
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`  ✓ Fixed: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Function to recursively find and fix all .tsx files in admin directory
function fixAllAdminFiles(dir) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      fixAllAdminFiles(fullPath);
    } else if (item.endsWith('.tsx')) {
      fixSyntaxErrors(fullPath);
    }
  }
}

// Start fixing files
const adminPath = path.join(__dirname, 'app', 'admin');
if (fs.existsSync(adminPath)) {
  console.log('Fixing syntax errors in admin files...');
  fixAllAdminFiles(adminPath);
  console.log('Done!');
} else {
  console.log('admin directory not found');
}