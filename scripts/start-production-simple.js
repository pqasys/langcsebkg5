const { spawn } = require('child_process');

console.log('🚀 Starting Production Environment...\n');

// Set environment variables
process.env.PORT = '3000';
process.env.SIGNALING_PORT = '3001';
process.env.NEXT_PUBLIC_SOCKET_URL = 'http://localhost:3001';
process.env.NODE_ENV = 'production';

console.log('📡 Next.js App will run on: http://localhost:3000');
console.log('🔌 Signaling Server will run on: http://localhost:3001');
console.log('🔗 Socket.IO URL: http://localhost:3001\n');

// Start signaling server first
console.log('🔌 Starting signaling server...');
const signalingServer = spawn('node', ['scripts/start-signaling-dev.js'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env }
});

// Wait a moment for signaling server to start
setTimeout(() => {
  console.log('📡 Starting Next.js production server...');
  const nextApp = spawn('npm', ['start'], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env }
  });

  // Handle Next.js app exit
  nextApp.on('close', (code) => {
    console.log(`\n🛑 Next.js server stopped with code ${code}`);
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
  console.log('\n🛑 Shutting down production servers...');
  signalingServer.kill('SIGINT');
  process.exit(0);
});

console.log('✅ Both servers are starting up...');
console.log('📝 Press Ctrl+C to stop both servers\n');
