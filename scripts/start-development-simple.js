const { spawn } = require('child_process');

console.log('🚀 Starting Development Environment (Simple)...\n');

// Set environment variables for development
process.env.PORT = '3000';
process.env.SIGNALING_PORT = '3001';
process.env.NEXT_PUBLIC_SOCKET_URL = 'http://localhost:3001';
process.env.NODE_ENV = 'development';
process.env.TURBOPACK = '1';

console.log('📡 Next.js Dev Server will run on: http://localhost:3000');
console.log('🔌 Signaling Server will run on: http://localhost:3001');
console.log('🔗 Socket.IO URL: http://localhost:3001');
console.log('⚡ Turbopack: Enabled for faster development\n');

// Start signaling server first
console.log('🔌 Starting signaling server...');
const signalingServer = spawn('node', ['scripts/start-signaling-dev.js'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env }
});

// Wait a moment for signaling server to start
setTimeout(() => {
  console.log('📡 Starting Next.js development server...');
  const nextApp = spawn('npm', ['run', 'dev:next'], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env }
  });

  // Handle Next.js app exit
  nextApp.on('close', (code) => {
    console.log(`\n🛑 Next.js development server stopped with code ${code}`);
    signalingServer.kill('SIGINT');
    process.exit(code);
  });
}, 2000);

// Handle signaling server exit
signalingServer.on('close', (code) => {
  console.log(`\n🛑 Signaling server stopped with code ${code}`);
  process.exit(code);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down development servers...');
  signalingServer.kill('SIGINT');
  process.exit(0);
});

console.log('✅ Both development servers are starting up...');
console.log('📝 Press Ctrl+C to stop both servers\n');
