const { spawn } = require('child_process');
const { execSync } = require('child_process');

console.log('🔥 Starting development server with database warmup...\n');

async function startDevWithWarmup() {
  try {
    // First, warm up the database
    console.log('1. Warming up database connection...');
    execSync('npx tsx scripts/warmup-db.ts', { stdio: 'inherit' });
    console.log('✅ Database warmup completed\n');

    // Then start the development server
    console.log('2. Starting Next.js development server...');
    const devProcess = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      shell: true
    });

    // Handle process termination
    devProcess.on('close', (code) => {
      console.log(`\n🚪 Development server exited with code ${code}`);
      process.exit(code);
    });

    devProcess.on('error', (error) => {
      console.error('❌ Failed to start development server:', error);
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Error during startup:', error);
    process.exit(1);
  }
}

startDevWithWarmup(); 