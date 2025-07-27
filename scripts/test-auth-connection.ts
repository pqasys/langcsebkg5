import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function testAuthConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Test user lookup
    const testEmail = 'pqasys@yahoo.com';
    console.log(`Looking up user: ${testEmail}`);
    
    const user = await prisma.user.findUnique({
      where: { email: testEmail },
      include: { institution: true }
    });
    
    if (user) {
      console.log('✅ User found:', {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        hasPassword: !!user.password,
        institutionId: user.institution?.id,
        institutionApproved: user.institution?.isApproved
      });
      
      // Test password comparison (with a dummy password)
      const testPassword = 'test123';
      const isPasswordValid = await bcrypt.compare(testPassword, user.password);
      console.log(`Password comparison test: ${isPasswordValid ? 'Valid' : 'Invalid'}`);
      
    } else {
      console.log('❌ User not found');
    }
    
    // Test session table
    console.log('Testing session table...');
    const sessions = await prisma.session.findMany({
      take: 5,
      orderBy: { expires: 'desc' }
    });
    console.log(`Found ${sessions.length} sessions`);
    
    // Test account table
    console.log('Testing account table...');
    const accounts = await prisma.account.findMany({
      take: 5
    });
    console.log(`Found ${accounts.length} accounts`);
    
  } catch (error) {
    console.error('❌ Error testing auth connection:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAuthConnection(); 