import { prisma } from '../lib/prisma';

async function findStudent3() {
  try {
    console.log('🔍 Searching for users...');
    
    // Find all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    console.log(`📊 Found ${users.length} users:`);
    
    for (const user of users) {
      console.log(`   - ${user.name} (${user.email}) - ID: ${user.id}`);
    }

    // Also check for test attempts to see who has taken tests
    console.log('\n🔍 Checking for test attempts...');
    
    const testAttempts = await prisma.languageProficiencyTestAttempt.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        completedAt: 'desc'
      }
    });

    console.log(`📊 Found ${testAttempts.length} test attempts:`);
    
    for (const attempt of testAttempts) {
      const answers = attempt.answers as Record<string, string>;
      const totalQuestions = Object.keys(answers).length;
      const percentage = Math.round((attempt.score / totalQuestions) * 100);
      
      console.log(`   - ${attempt.user.name} (${attempt.user.email})`);
      console.log(`     Language: ${attempt.languageCode}, Score: ${attempt.score}/${totalQuestions} (${percentage}%), Level: ${attempt.level}`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

findStudent3();
