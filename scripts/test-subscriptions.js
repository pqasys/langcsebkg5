const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testSubscriptions() {
  try {
    console.log('Testing subscriptions query...');
    
    // Check if there are any subscriptions
    const count = await prisma.institutionSubscription.count();
    console.log('Total subscriptions:', count);
    
    // Check subscriptions with institutions
    const withInstitutions = await prisma.institutionSubscription.findMany({
      where: {
        institutionId: {
          not: null
        }
      }
    });
    console.log('Subscriptions with institutions:', withInstitutions.length);
    
    // Check subscriptions without institutions
    const withoutInstitutions = await prisma.institutionSubscription.findMany({
      where: {
        institutionId: null
      }
    });
    console.log('Subscriptions without institutions:', withoutInstitutions.length);
    
    // Try the full query
    const subscriptions = await prisma.institutionSubscription.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        institution: {
          select: {
            id: true,
            name: true,
            email: true,
            logoUrl: true,
          }
        },
        commissionTier: true
      }
    }).then(subs => subs.filter(sub => sub.institution !== null));
    
    console.log('Full query result:', subscriptions.length, 'subscriptions');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testSubscriptions();
