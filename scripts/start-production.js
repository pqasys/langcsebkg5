const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Production Environment...\n');

// Set environment variables
process.env.PORT = process.env.PORT || '3000';
process.env.SIGNALING_PORT = process.env.SIGNALING_PORT || '3001';
process.env.NEXT_PUBLIC_SOCKET_URL = `http://localhost:${process.env.SIGNALING_PORT}`;
process.env.NODE_ENV = 'production';

console.log(`📡 Next.js App will run on: http://localhost:${process.env.PORT}`);
console.log(`🔌 Signaling Server will run on: http://localhost:${process.env.SIGNALING_PORT}`);
console.log(`🔗 Socket.IO URL: ${process.env.NEXT_PUBLIC_SOCKET_URL}\n`);

let nextAppRunning = false;
let signalingRunning = false;

// Start Next.js production server
const nextApp = spawn('npm', ['start'], {
  stdio: 'pipe',
  shell: true,
  env: { ...process.env }
});

nextApp.stdout.on('data', (data) => {
  const output = data.toString().trim();
  console.log(`[Next.js] ${output}`);
  
  // Check if Next.js server is ready
  if (output.includes('Ready on') || output.includes('started server')) {
    nextAppRunning = true;
    console.log('✅ Next.js server is ready!');
  }
});

nextApp.stderr.on('data', (data) => {
  console.log(`[Next.js Error] ${data.toString().trim()}`);
});

nextApp.on('close', (code) => {
  console.log(`[Next.js] Process exited with code ${code}`);
  nextAppRunning = false;
  
  // Only exit if signaling server is also not running
  if (!signalingRunning) {
    console.log('❌ Both servers have stopped. Exiting...');
    process.exit(code);
  }
});

// Start signaling server
const signalingServer = spawn('node', ['scripts/start-signaling-dev.js'], {
  stdio: 'pipe',
  shell: true,
  env: { ...process.env }
});

signalingServer.stdout.on('data', (data) => {
  const output = data.toString().trim();
  console.log(`[Signaling] ${output}`);
  
  // Check if signaling server is ready
  if (output.includes('Ready on') || output.includes('WebRTC signaling server initialized')) {
    signalingRunning = true;
    console.log('✅ Signaling server is ready!');
  }
});

signalingServer.stderr.on('data', (data) => {
  console.log(`[Signaling Error] ${data.toString().trim()}`);
});

signalingServer.on('close', (code) => {
  console.log(`[Signaling] Process exited with code ${code}`);
  signalingRunning = false;
  
  // Only exit if Next.js server is also not running
  if (!nextAppRunning) {
    console.log('❌ Both servers have stopped. Exiting...');
    process.exit(code);
  }
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down production servers...');
  if (nextApp && !nextApp.killed) {
    nextApp.kill('SIGINT');
  }
  if (signalingServer && !signalingServer.killed) {
    signalingServer.kill('SIGINT');
  }
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down production servers...');
  if (nextApp && !nextApp.killed) {
    nextApp.kill('SIGTERM');
  }
  if (signalingServer && !signalingServer.killed) {
    signalingServer.kill('SIGTERM');
  }
  process.exit(0);
});

console.log('✅ Both servers are starting up...');
console.log('📝 Press Ctrl+C to stop both servers\n');
