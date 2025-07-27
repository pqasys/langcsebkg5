#!/usr/bin/env tsx

import { execSync } from 'child_process';
import { existsSync, rmSync } from 'fs';
import { join } from 'path';

console.log('🔧 Fixing development server issues...\n');

try {
  // 1. Kill any running Next.js processes
  console.log('1. Killing existing Next.js processes...');
  try {
    if (process.platform === 'win32') {
      execSync('taskkill /f /im node.exe', { stdio: 'ignore' });
    } else {
      execSync('pkill -f "next"', { stdio: 'ignore' });
    }
  } catch (error) {
    console.log('   No running processes found or already killed');
  }

  // 2. Clean build cache
  console.log('2. Cleaning build cache...');
  const pathsToClean = [
    '.next',
    'node_modules/.cache',
    '.turbo',
    'dist',
    'build'
  ];

  pathsToClean.forEach(path => {
    if (existsSync(path)) {
      rmSync(path, { recursive: true, force: true });
      console.log(`    Cleaned ${path}`);
    } else {
      console.log(`   ⏭️  ${path} not found, skipping`);
    }
  });

  // 3. Clear npm cache
  console.log('3. Clearing npm cache...');
  try {
    execSync('npm cache clean --force', { stdio: 'inherit' });
    console.log('   ✅ NPM cache cleared');
  } catch (error) {
    console.log('   ⚠️  Failed to clear NPM cache, continuing...');
  }

  // 4. Reinstall dependencies (optional)
  console.log('4. Checking dependencies...');
  if (existsSync('package-lock.json')) {
    const lockFileAge = Date.now() - require('fs').statSync('package-lock.json').mtime.getTime();
    const oneDay = 24 * 60 * 60 * 1000;
    
    if (lockFileAge > oneDay) {
      console.log('   Package-lock.json is older than 1 day, reinstalling dependencies...');
      execSync('npm install', { stdio: 'inherit' });
    } else {
      console.log('   Dependencies are up to date');
    }
  }

  // 5. Generate Prisma client
  console.log('5. Regenerating Prisma client...');
  try {
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('   ✅ Prisma client regenerated');
  } catch (error) {
    console.log('   ⚠️  Failed to regenerate Prisma client, continuing...');
  }

  // 6. Build the project
  console.log('6. Building project...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('   ✅ Build completed successfully');
  } catch (error) {
    console.log('   ❌ Build failed, but continuing...');
  }

  console.log('\n🎉 Development server fix completed!');
  console.log('\nNext steps:');
  console.log('1. Run: npm run dev');
  console.log('2. If issues persist, try: npm run dev -- --turbo');
  console.log('3. For production testing: npm run start');

} catch (error) {
  console.error('❌ Error during fix process:', error);
  process.exit(1);
} 