import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs';

const prisma = new PrismaClient();

test.describe('Password Test', () => {
  test('should verify test user password', async () => {
    // // // // // // // // // // // // // // // // console.log('Testing password verification...');
    
    // Get the test admin user
    const user = await prisma.user.findUnique({
      where: { email: 'integration.test.admin@example.com' }
    });
    
    if (!user) {
      console.log('❌ Test admin user not found');
      throw new Error(`Test admin user not found - Context: throw new Error('Test admin user not found');...`);
    }
    
    console.log('✅ Test admin user found:', user.email);
    console.log('User role:', user.role);
    console.log('User status:', user.status);
    console.log('Has password:', !!user.password);
    
    // Test password comparison
    const isPasswordValid = await compare('testpassword123', user.password);
    console.log('Password is valid:', isPasswordValid);
    
    // Test with wrong password
    const isWrongPasswordValid = await compare('wrongpassword', user.password);
    console.log('Wrong password is valid:', isWrongPasswordValid);
    
    expect(isPasswordValid).toBe(true);
    expect(isWrongPasswordValid).toBe(false);
    
    await prisma.$disconnect();
  });
}); 