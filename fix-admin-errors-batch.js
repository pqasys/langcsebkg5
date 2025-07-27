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
      console.log(`  - Found malformed Context: template literals in ${path.basename(filePath)}`);
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
      console.log(`  - Found console.error indentation issue in ${path.basename(filePath)}`);
      content = content.replace(consoleErrorPattern, '$1} catch (error) {\n$2  console.error(\'Error occurred:\', error);');
      modified = true;
    }

    // Fix 3: Malformed toast.error calls with extra parameters
    const toastErrorPattern = /toast\.error\(`[^`]*\. Please try again or contact support if the problem persists\.`\), [^)]+\);/g;
    if (toastErrorPattern.test(content)) {
      console.log(`  - Found malformed toast.error call in ${path.basename(filePath)}`);
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
      console.log(`  - Found extra parentheses in toast.error in ${path.basename(filePath)}`);
      content = content.replace(extraParenPattern, (match) => {
        return match.replace('));', ');');
      });
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`  ✓ Fixed: ${path.basename(filePath)}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`  ✗ Error processing ${path.basename(filePath)}:`, error.message);
    return false;
  }
}

// Function to process one directory
function processDirectory(dirPath) {
  console.log(`\nProcessing directory: ${dirPath}`);
  
  if (!fs.existsSync(dirPath)) {
    console.log(`  Directory not found: ${dirPath}`);
    return { processed: 0, fixed: 0, errors: 0 };
  }

  let processed = 0;
  let fixed = 0;
  let errors = 0;

  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      
      try {
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Recursively process subdirectories
          const subResult = processDirectory(fullPath);
          processed += subResult.processed;
          fixed += subResult.fixed;
          errors += subResult.errors;
        } else if (item.endsWith('.tsx')) {
          processed++;
          if (fixSyntaxErrors(fullPath)) {
            fixed++;
          }
        }
      } catch (error) {
        console.error(`  ✗ Error accessing ${item}:`, error.message);
        errors++;
      }
    }
  } catch (error) {
    console.error(`  ✗ Error reading directory ${dirPath}:`, error.message);
    errors++;
  }

  return { processed, fixed, errors };
}

// Get the target directory from command line argument
const targetDir = process.argv[2] || 'app/admin';

console.log(`Starting batch fix for: ${targetDir}`);
console.log('=====================================');

const result = processDirectory(targetDir);

console.log('\n=====================================');
console.log('SUMMARY:');
console.log(`Files processed: ${result.processed}`);
console.log(`Files fixed: ${result.fixed}`);
console.log(`Errors encountered: ${result.errors}`);
console.log(`Success rate: ${result.processed > 0 ? Math.round((result.fixed / result.processed) * 100) : 0}%`); 