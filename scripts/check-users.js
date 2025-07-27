const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log('Checking test users in database...');
    
    const users = await prisma.user.findMany({
      where: {
        email: {
          contains: 'integration.test'
        }
      },
      select: {
        email: true,
        role: true,
        status: true,
        password: true
      }
    });
    
    console.log('Test users found:', users.length);
    users.forEach(user => {
      console.log(`- ${user.email}: ${user.role} (${user.status}) - Password: ${user.password ? 'Set' : 'Missing'}`);
    });
    
  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers(); 