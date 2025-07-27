#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing chunk loading cache issues...\n');

// Function to run commands
function runCommand(command, description) {
  console.log(`� ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(` ${description} completed successfully\n`);
  } catch (error) {
    console.log(` ${description} failed: ${error.message}\n`);
  }
}

// Function to remove directory if it exists
function removeDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    console.log(`�️  Removing ${dirPath}...`);
    try {
      fs.rmSync(dirPath, { recursive: true, force: true });
      console.log(` Removed ${dirPath}\n`);
    } catch (error) {
      console.log(` Failed to remove ${dirPath}: ${error.message}\n`);
    }
  }
}

// Clean up cache directories
console.log('🧹 Cleaning up cache directories...\n');

removeDirectory('.next');
removeDirectory('node_modules/.cache');
removeDirectory('dist');

// Clear browser cache instructions
console.log('🌐 Browser Cache Instructions:');
console.log('1. Open your browser\'s Developer Tools (F12)');
console.log('2. Right-click the refresh button');
console.log('3. Select "Empty Cache and Hard Reload"');
console.log('4. Or use Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)');
console.log('');

// Clear npm cache
runCommand('npm cache clean --force', 'Clearing npm cache');

// Reinstall dependencies
runCommand('npm install', 'Reinstalling dependencies');

// Generate Prisma client
runCommand('npx prisma generate', 'Generating Prisma client');

console.log('🎉 Chunk cache fix completed!');
console.log('🚀 You can now run "npm run dev" to start the development server.');
console.log('💡 If you still see chunk loading errors, try a hard refresh (Ctrl+F5) in your browser.'); 