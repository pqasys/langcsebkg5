const { getServerSession } = require('next-auth');
const { authOptions } = require('./lib/auth');

async function testAuthDebug() {
  try {
    console.log('🔍 Testing Authentication Debug...\n');

    // Test 1: Check if we can import authOptions
    console.log('1. Testing authOptions import...');
    try {
      console.log('✅ authOptions imported successfully');
      console.log('authOptions:', {
        secret: authOptions.secret ? '[SET]' : '[NOT SET]',
        session: authOptions.session,
        providers: authOptions.providers?.length || 0
      });
    } catch (error) {
      console.log('❌ Failed to import authOptions:', error.message);
      return;
    }

    // Test 2: Test getServerSession directly
    console.log('\n2. Testing getServerSession...');
    try {
      // Create a mock request object
      const mockReq = {
        headers: {},
        cookies: {}
      };
      
      const session = await getServerSession(authOptions, mockReq);
      console.log('Session result:', session);
      
      if (session) {
        console.log('❌ Session found when it should be null');
        console.log('Session data:', {
          hasUser: !!session.user,
          userId: session.user?.id,
          userRole: session.user?.role
        });
      } else {
        console.log('✅ Session is null as expected for unauthenticated request');
      }
    } catch (error) {
      console.log('❌ Error calling getServerSession:', error.message);
    }

    // Test 3: Check environment variables
    console.log('\n3. Checking environment variables...');
    console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '[SET]' : '[NOT SET]');
    console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL || '[NOT SET]');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? '[SET]' : '[NOT SET]');

    // Test 4: Test the API endpoint with curl-like request
    console.log('\n4. Testing API endpoint with fetch...');
    const fetch = require('node-fetch');
    
    try {
      const response = await fetch('http://localhost:3000/api/student/dashboard', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      const data = await response.json();
      console.log('Response data:', JSON.stringify(data, null, 2));
      
      if (response.status === 401) {
        console.log('✅ API correctly returns 401 for unauthenticated requests');
      } else {
        console.log('❌ API should return 401 but returned:', response.status);
      }
    } catch (error) {
      console.log('❌ Error testing API:', error.message);
    }

  } catch (error) {
    console.error('❌ Test error:', error);
    console.error('Stack trace:', error.stack);
  }
}

testAuthDebug();
