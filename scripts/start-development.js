const { spawn } = require('child_process');

console.log('🚀 Starting Development Environment...\n');

// Set environment variables for development
process.env.PORT = '3000';
process.env.SIGNALING_PORT = '3001';
process.env.NEXT_PUBLIC_SOCKET_URL = 'http://localhost:3001';
process.env.NODE_ENV = 'development';
process.env.TURBOPACK = '1'; // Enable Turbopack for faster development

console.log('📡 Next.js Dev Server will run on: http://localhost:3000');
console.log('🔌 Signaling Server will run on: http://localhost:3001');
console.log('🔗 Socket.IO URL: http://localhost:3001');
console.log('⚡ Turbopack: Enabled for faster development\n');

let nextAppRunning = false;
let signalingRunning = false;

// Start Next.js development server
const nextApp = spawn('npm', ['run', 'dev:next'], {
  stdio: 'pipe',
  shell: true,
  env: { ...process.env }
});

nextApp.stdout.on('data', (data) => {
  const output = data.toString().trim();
  console.log(`[Next.js] ${output}`);
  
  // Check if Next.js dev server is ready
  if (output.includes('Ready on') || output.includes('Local:') || output.includes('started server')) {
    nextAppRunning = true;
    console.log('✅ Next.js development server is ready!');
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
  console.log('\n🛑 Shutting down development servers...');
  if (nextApp && !nextApp.killed) {
    nextApp.kill('SIGINT');
  }
  if (signalingServer && !signalingServer.killed) {
    signalingServer.kill('SIGINT');
  }
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down development servers...');
  if (nextApp && !nextApp.killed) {
    nextApp.kill('SIGTERM');
  }
  if (signalingServer && !signalingServer.killed) {
    signalingServer.kill('SIGTERM');
  }
  process.exit(0);
});

console.log('✅ Both development servers are starting up...');
console.log('📝 Press Ctrl+C to stop both servers\n');
