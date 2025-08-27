const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migrateLiveClassesTo60Minutes() {
  console.log('🚀 Starting migration of live classes to 60-minute duration...');
  console.log('=' .repeat(60));
  
  try {
    // First, let's check the current state
    const totalSessions = await prisma.videoSession.count();
    console.log(`📊 Total video sessions in database: ${totalSessions}`);
    
    if (totalSessions === 0) {
      console.log('✅ No video sessions found. Migration not needed.');
      return;
    }

    // Get all sessions that are not cancelled
    const allSessions = await prisma.videoSession.findMany({
      where: {
        status: {
          not: 'CANCELLED'
        }
      },
      select: {
        id: true,
        title: true,
        startTime: true,
        endTime: true,
        duration: true,
        status: true,
        language: true,
        level: true
      }
    });

    console.log(`📋 Active sessions found: ${allSessions.length}`);

    // Filter sessions that need updating
    const sessionsToUpdate = allSessions.filter(session => {
      const correctEndTime = new Date(session.startTime.getTime() + (60 * 60 * 1000));
      const currentDuration = Math.round((session.endTime.getTime() - session.startTime.getTime()) / (1000 * 60));
      
      return currentDuration !== 60 || session.endTime.getTime() !== correctEndTime.getTime();
    });

    console.log(`📋 Sessions that need updating: ${sessionsToUpdate.length}`);
    
    if (sessionsToUpdate.length === 0) {
      console.log('✅ All sessions already conform to 60-minute duration!');
      return;
    }

    let updatedCount = 0;
    let errorCount = 0;
    const errors = [];

    console.log('\n🔄 Processing sessions...\n');

    for (const session of sessionsToUpdate) {
      try {
        // Calculate the correct endTime (60 minutes after startTime)
        const correctEndTime = new Date(session.startTime.getTime() + (60 * 60 * 1000));
        
        // Calculate current duration in minutes
        const currentDuration = Math.round((session.endTime.getTime() - session.startTime.getTime()) / (1000 * 60));
        
        // Update the session
        await prisma.videoSession.update({
          where: { id: session.id },
          data: {
            endTime: correctEndTime,
            duration: 60,
            updatedAt: new Date()
          }
        });

        console.log(`✅ Updated: "${session.title}"`);
        console.log(`   ID: ${session.id}`);
        console.log(`   Language: ${session.language} | Level: ${session.level}`);
        console.log(`   Old duration: ${currentDuration} min → New: 60 min`);
        console.log(`   Old endTime: ${session.endTime.toISOString()}`);
        console.log(`   New endTime: ${correctEndTime.toISOString()}`);
        console.log('');

        updatedCount++;
      } catch (error) {
        console.error(`❌ Error updating session "${session.title}" (${session.id}):`, error.message);
        errors.push({
          sessionId: session.id,
          title: session.title,
          error: error.message
        });
        errorCount++;
      }
    }

    // Summary
    console.log('=' .repeat(60));
    console.log('📈 MIGRATION SUMMARY');
    console.log('=' .repeat(60));
    console.log(`Total sessions in database: ${totalSessions}`);
    console.log(`Active sessions processed: ${allSessions.length}`);
    console.log(`Sessions that needed updating: ${sessionsToUpdate.length}`);
    console.log(`✅ Successfully updated: ${updatedCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    
    if (errorCount > 0) {
      console.log('\n⚠️  ERRORS DETAILS:');
      errors.forEach((error, index) => {
        console.log(`${index + 1}. Session "${error.title}" (${error.sessionId}): ${error.error}`);
      });
    }

    // Verify the migration
    console.log('\n🔍 VERIFICATION:');
    const remainingSessions = await prisma.videoSession.findMany({
      where: {
        status: {
          not: 'CANCELLED'
        }
      },
      select: {
        id: true,
        title: true,
        duration: true,
        startTime: true,
        endTime: true
      }
    });

    const nonConformingSessions = remainingSessions.filter(session => {
      const correctEndTime = new Date(session.startTime.getTime() + (60 * 60 * 1000));
      const currentDuration = Math.round((session.endTime.getTime() - session.startTime.getTime()) / (1000 * 60));
      
      return currentDuration !== 60 || session.endTime.getTime() !== correctEndTime.getTime();
    });

    if (nonConformingSessions.length === 0) {
      console.log('✅ All active sessions now conform to 60-minute duration!');
    } else {
      console.log(`⚠️  ${nonConformingSessions.length} sessions still don't conform to 60-minute duration:`);
      nonConformingSessions.forEach(session => {
        const currentDuration = Math.round((session.endTime.getTime() - session.startTime.getTime()) / (1000 * 60));
        console.log(`   - "${session.title}" (${session.id}): ${currentDuration} minutes`);
      });
    }

  } catch (error) {
    console.error('💥 Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
migrateLiveClassesTo60Minutes()
  .then(() => {
    console.log('\n🎉 Migration script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Migration script failed:', error);
    process.exit(1);
  });
