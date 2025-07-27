import { config } from 'dotenv';

// Load environment variables
config();

console.log('Checking environment variables...\n');

const requiredVars = [
  'DATABASE_URL',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET'
];

const optionalVars = [
  'STRIPE_SECRET_KEY',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'NEXT_PUBLIC_APP_URL',
  'RESEND_API_KEY',
  'CRON_SECRET',
  'COMMISSION_RATE'
];

console.log('Required Environment Variables:');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(` ${varName}: ${varName.includes('SECRET') || varName.includes('KEY') ? '***SET***' : value}`);
  } else {
    console.log(` ${varName}: Not set`);
  }
});

console.log('\nOptional Environment Variables:');
optionalVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(` ${varName}: ${varName.includes('SECRET') || varName.includes('KEY') ? '***SET***' : value}`);
  } else {
    console.log(`⚠️  ${varName}: Not set (optional)`);
  }
});

console.log('\nNextAuth Configuration:');
console.log(`NEXTAUTH_URL: ${process.env.NEXTAUTH_URL || 'Not set'}`);
console.log(`NEXTAUTH_SECRET: ${process.env.NEXTAUTH_SECRET ? '***SET***' : 'Not set'}`);
console.log(`DATABASE_URL: ${process.env.DATABASE_URL || 'Not set'}`);

// Check if we're in development or production
console.log(`\nEnvironment: ${process.env.NODE_ENV || 'development'}`);

// Test if we can parse the DATABASE_URL
if (process.env.DATABASE_URL) {
  try {
    const url = new URL(process.env.DATABASE_URL);
    console.log(`\nDatabase URL parsed successfully:`);
    console.log(`- Protocol: ${url.protocol}`);
    console.log(`- Host: ${url.hostname}`);
    console.log(`- Port: ${url.port || 'default'}`);
    console.log(`- Database: ${url.pathname.slice(1)}`);
  } catch (error) {
    console.log(`\n Error parsing DATABASE_URL: ${error}`);
  }
} 