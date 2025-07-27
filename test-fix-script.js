const fs = require('fs');
const path = require('path');

// Function to fix syntax errors in a file
function fixSyntaxErrors(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    console.log(`\nProcessing: ${filePath}`);

    // Fix console.error indentation issues
    const consoleErrorPattern = /(\s*)\} catch \(error\) \{\n(\s*)console\.error\('Error occurred:', error\);/g;
    const replacement = '$1} catch (error) {\n$2  console.error(\'Error occurred:\', error);';
    
    if (consoleErrorPattern.test(content)) {
      console.log('  - Found console.error indentation issue');
      content = content.replace(consoleErrorPattern, replacement);
      modified = true;
    }

    // Fix missing backticks in template literals
    const missingBacktickPattern = /throw new Error\(`([^`]*)\);/g;
    const backtickReplacement = 'throw new Error(`$1`);';
    
    if (missingBacktickPattern.test(content)) {
      console.log('  - Found missing backtick in template literal');
      content = content.replace(missingBacktickPattern, backtickReplacement);
      modified = true;
    }

    // Fix missing backticks in fetch URLs
    const fetchUrlPattern = /fetch\(([^`]*)\$\{([^}]*)\}\)/g;
    const fetchUrlReplacement = 'fetch(`$1${$2}`)';
    
    if (fetchUrlPattern.test(content)) {
      console.log('  - Found missing backtick in fetch URL');
      content = content.replace(fetchUrlPattern, fetchUrlReplacement);
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`  ✓ Fixed: ${filePath}`);
    } else {
      console.log('  - No issues found');
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Test on specific files mentioned in the build error
const testFiles = [
  'app/admin-backup-restored/courses/[id]/modules/[moduleId]/page.tsx',
  'app/admin-backup-restored/courses/[id]/modules/[moduleId]/quizzes/[quizId]/edit/page.tsx',
  'app/admin-backup-restored/courses/[id]/modules/[moduleId]/quizzes/[quizId]/page.tsx',
  'app/admin-backup-restored/courses/[id]/modules/[moduleId]/quizzes/[quizId]/questions/[questionId]/edit/page.tsx'
];

console.log('Testing fix script on specific files...');

for (const filePath of testFiles) {
  if (fs.existsSync(filePath)) {
    fixSyntaxErrors(filePath);
  } else {
    console.log(`\nFile not found: ${filePath}`);
  }
}

console.log('\nTest completed!'); 