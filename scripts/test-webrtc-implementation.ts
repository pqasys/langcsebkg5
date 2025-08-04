import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testWebRTCImplementation() {
  try {
    console.log('Testing WebRTC implementation...\n');
    
    // Test 1: Check dependencies
    console.log('🔧 DEPENDENCY CHECK:');
    console.log('=' .repeat(50));
    
    try {
      const socketIO = require('socket.io-client');
      console.log('✅ Socket.IO client installed');
    } catch (error) {
      console.log('❌ Socket.IO client not installed');
      console.log('   Run: npm install socket.io-client');
    }
    
    try {
      const socketIOServer = require('socket.io');
      console.log('✅ Socket.IO server installed');
    } catch (error) {
      console.log('❌ Socket.IO server not installed');
      console.log('   Run: npm install socket.io');
    }
    
    // Test 2: Check server configuration
    console.log('\n🖥️  SERVER CONFIGURATION:');
    console.log('=' .repeat(50));
    
    const fs = require('fs');
    const serverFile = 'server.js';
    
    if (fs.existsSync(serverFile)) {
      console.log('✅ Custom server file exists (server.js)');
      const serverContent = fs.readFileSync(serverFile, 'utf8');
      
      if (serverContent.includes('initializeSignalingServer')) {
        console.log('✅ Signaling server initialization found');
      } else {
        console.log('❌ Signaling server initialization missing');
      }
      
      if (serverContent.includes('SocketIOServer')) {
        console.log('✅ Socket.IO server import found');
      } else {
        console.log('❌ Socket.IO server import missing');
      }
    } else {
      console.log('❌ Custom server file missing (server.js)');
    }
    
    // Test 3: Check WebSocket server
    console.log('\n📡 WEBSOCKET SERVER:');
    console.log('=' .repeat(50));
    
    const websocketServerFile = 'lib/websocket-server.ts';
    
    if (fs.existsSync(websocketServerFile)) {
      console.log('✅ WebSocket server file exists');
      const wsContent = fs.readFileSync(websocketServerFile, 'utf8');
      
      if (wsContent.includes('WebRTCSignalingServer')) {
        console.log('✅ WebRTC signaling server class found');
      } else {
        console.log('❌ WebRTC signaling server class missing');
      }
      
      if (wsContent.includes('join-session')) {
        console.log('✅ Session join handler found');
      } else {
        console.log('❌ Session join handler missing');
      }
      
      if (wsContent.includes('offer') && wsContent.includes('answer')) {
        console.log('✅ WebRTC signaling handlers found');
      } else {
        console.log('❌ WebRTC signaling handlers missing');
      }
    } else {
      console.log('❌ WebSocket server file missing');
    }
    
    // Test 4: Check frontend implementation
    console.log('\n🎨 FRONTEND IMPLEMENTATION:');
    console.log('=' .repeat(50));
    
    const sessionPageFile = 'app/student/live-classes/session/[id]/page.tsx';
    
    if (fs.existsSync(sessionPageFile)) {
      console.log('✅ Live class session page exists');
      const pageContent = fs.readFileSync(sessionPageFile, 'utf8');
      
      if (pageContent.includes('socket.io-client')) {
        console.log('✅ Socket.IO client import found');
      } else {
        console.log('❌ Socket.IO client import missing');
      }
      
      if (pageContent.includes('RTCPeerConnection')) {
        console.log('✅ WebRTC peer connection found');
      } else {
        console.log('❌ WebRTC peer connection missing');
      }
      
      if (pageContent.includes('getUserMedia')) {
        console.log('✅ Media stream access found');
      } else {
        console.log('❌ Media stream access missing');
      }
      
      if (pageContent.includes('initializeSocket')) {
        console.log('✅ Socket initialization found');
      } else {
        console.log('❌ Socket initialization missing');
      }
    } else {
      console.log('❌ Live class session page missing');
    }
    
    // Test 5: Check package.json scripts
    console.log('\n📦 PACKAGE.JSON CONFIGURATION:');
    console.log('=' .repeat(50));
    
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    if (packageJson.scripts.dev === 'node server.js') {
      console.log('✅ Custom server script configured');
    } else {
      console.log('❌ Custom server script not configured');
      console.log('   Update dev script to: "node server.js"');
    }
    
    // Test 6: Check live class data
    console.log('\n📊 LIVE CLASS DATA:');
    console.log('=' .repeat(50));
    
    const liveClass = await prisma.videoSession.findFirst({
      where: {
        status: 'SCHEDULED',
        startTime: { gt: new Date() },
      },
      include: {
        instructor: {
          select: { name: true, email: true },
        },
      },
    });
    
    if (liveClass) {
      console.log('✅ Live class found for testing');
      console.log(`   - Class: ${liveClass.title}`);
      console.log(`   - Instructor: ${liveClass.instructor.name}`);
      console.log(`   - Start Time: ${liveClass.startTime}`);
      console.log(`   - Meeting URL: ${liveClass.meetingUrl || 'Not set'}`);
      
      if (liveClass.meetingUrl && liveClass.meetingUrl.includes('meet.example.com')) {
        console.log('⚠️  Using placeholder meeting URL - will use WebRTC instead');
      }
    } else {
      console.log('❌ No live class found for testing');
    }
    
    // Test 7: Environment configuration
    console.log('\n⚙️  ENVIRONMENT CONFIGURATION:');
    console.log('=' .repeat(50));
    
    const envFile = '.env.local';
    if (fs.existsSync(envFile)) {
      const envContent = fs.readFileSync(envFile, 'utf8');
      if (envContent.includes('NEXT_PUBLIC_SOCKET_URL')) {
        console.log('✅ Socket URL environment variable configured');
      } else {
        console.log('⚠️  Socket URL environment variable not configured');
        console.log('   Add to .env.local: NEXT_PUBLIC_SOCKET_URL=http://localhost:3001');
      }
    } else {
      console.log('⚠️  .env.local file not found');
      console.log('   Create .env.local with: NEXT_PUBLIC_SOCKET_URL=http://localhost:3001');
    }
    
    // Test 8: Browser compatibility check
    console.log('\n🌐 BROWSER COMPATIBILITY:');
    console.log('=' .repeat(50));
    
    console.log('✅ WebRTC supported browsers:');
    console.log('   - Chrome 60+');
    console.log('   - Firefox 55+');
    console.log('   - Safari 11+');
    console.log('   - Edge 79+');
    
    console.log('\n✅ Required browser features:');
    console.log('   - RTCPeerConnection');
    console.log('   - getUserMedia');
    console.log('   - WebSocket support');
    console.log('   - MediaDevices API');
    
    // Test 9: Usage instructions
    console.log('\n📋 USAGE INSTRUCTIONS:');
    console.log('=' .repeat(50));
    
    console.log('1. Start the development server:');
    console.log('   npm run dev');
    
    console.log('\n2. Navigate to live classes:');
    console.log('   http://localhost:3001/student/live-classes');
    
    console.log('\n3. Enroll in a live class');
    
    console.log('\n4. Click "Join Early" or "Join Class" button');
    
    console.log('\n5. Grant camera/microphone permissions');
    
    console.log('\n6. Test WebRTC features:');
    console.log('   - Video/audio communication');
    console.log('   - Chat messaging');
    console.log('   - Screen sharing');
    console.log('   - Media controls');
    
    // Test 10: Troubleshooting
    console.log('\n🔧 TROUBLESHOOTING:');
    console.log('=' .repeat(50));
    
    console.log('If WebRTC doesn\'t work:');
    console.log('1. Check browser console for errors');
    console.log('2. Verify camera/microphone permissions');
    console.log('3. Check Socket.IO connection status');
    console.log('4. Verify STUN server connectivity');
    console.log('5. Check network firewall settings');
    
    console.log('\n✅ WebRTC implementation test completed!');
    
  } catch (error) {
    console.error('❌ Error testing WebRTC implementation:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testWebRTCImplementation(); 