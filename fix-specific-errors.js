const fs = require('fs');

// Function to fix specific syntax errors in a file
function fixSpecificErrors(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    console.log(`\nProcessing: ${filePath}`);

    // Fix console.error indentation - only fix the specific pattern
    const consoleErrorPattern = /(\s*)\} catch \(error\) \{\n(\s*)console\.error\('Error occurred:', error\);/g;
    const consoleErrorReplacement = '$1} catch (error) {\n$2  console.error(\'Error occurred:\', error);';
    
    if (consoleErrorPattern.test(content)) {
      console.log('  - Found console.error indentation issue');
      content = content.replace(consoleErrorPattern, consoleErrorReplacement);
      modified = true;
    }

    // Fix missing closing backtick in throw statements - only fix the specific pattern
    const throwErrorPattern = /throw new Error\(`([^`]*)\);/g;
    const throwErrorReplacement = 'throw new Error(`$1`);';
    
    if (throwErrorPattern.test(content)) {
      console.log('  - Found missing backtick in throw statement');
      content = content.replace(throwErrorPattern, throwErrorReplacement);
      modified = true;
    }

    // Fix malformed fetch URLs that were created by the previous script
    const malformedFetchPattern = /fetch\(\/api\/([^`]*)\$\{([^}]*)\}\)/g;
    const malformedFetchReplacement = 'fetch(`/api/$1${$2}`)';
    
    if (malformedFetchPattern.test(content)) {
      console.log('  - Found malformed fetch URL');
      content = content.replace(malformedFetchPattern, malformedFetchReplacement);
      modified = true;
    }

    // Fix malformed setCourse calls
    const malformedSetCoursePattern = /setCourse\(courseData`\);/g;
    const malformedSetCourseReplacement = 'setCourse(courseData);';
    
    if (malformedSetCoursePattern.test(content)) {
      console.log('  - Found malformed setCourse call');
      content = content.replace(malformedSetCoursePattern, malformedSetCourseReplacement);
      modified = true;
    }

    // Fix malformed setModule calls
    const malformedSetModulePattern = /setModule\(moduleData`\);/g;
    const malformedSetModuleReplacement = 'setModule(moduleData);';
    
    if (malformedSetModulePattern.test(content)) {
      console.log('  - Found malformed setModule call');
      content = content.replace(malformedSetModulePattern, malformedSetModuleReplacement);
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

console.log('Fixing specific syntax errors...');

for (const filePath of testFiles) {
  if (fs.existsSync(filePath)) {
    fixSpecificErrors(filePath);
  } else {
    console.log(`\nFile not found: ${filePath}`);
  }
}

console.log('\nFix completed!'); 