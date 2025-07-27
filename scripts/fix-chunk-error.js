#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing chunk loading errors...\n');

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

// Clean up build artifacts
console.log('🧹 Cleaning up build artifacts...\n');

removeDirectory('.next');
removeDirectory('node_modules/.cache');
removeDirectory('dist');

// Clear npm cache
runCommand('npm cache clean --force', 'Clearing npm cache');

// Reinstall dependencies
runCommand('npm install', 'Reinstalling dependencies');

// Generate Prisma client
runCommand('npx prisma generate', 'Generating Prisma client');

// Build the project
runCommand('npm run build', 'Building the project');

console.log('🎉 Chunk error fix completed!');
console.log('🚀 You can now run "npm run dev" to start the development server.'); 