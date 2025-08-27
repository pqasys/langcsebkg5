const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migrateLiveClassesTo60Minutes() {
  console.log('Starting migration of live classes to 60-minute duration...');
  
  try {
    // Get all VideoSession records
    const videoSessions = await prisma.videoSession.findMany({
      select: {
        id: true,
        title: true,
        startTime: true,
        endTime: true,
        duration: true,
        status: true
      }
    });

    console.log(`Found ${videoSessions.length} video sessions to process`);

    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const session of videoSessions) {
      try {
        // Calculate the correct endTime (60 minutes after startTime)
        const correctEndTime = new Date(session.startTime.getTime() + (60 * 60 * 1000)); // 60 minutes in milliseconds
        
        // Check if the session already has the correct duration and endTime
        const currentDuration = Math.round((session.endTime.getTime() - session.startTime.getTime()) / (1000 * 60)); // Duration in minutes
        
        if (currentDuration === 60 && session.endTime.getTime() === correctEndTime.getTime()) {
          console.log(`Session "${session.title}" (${session.id}) already has 60-minute duration - skipping`);
          skippedCount++;
          continue;
        }

        // Update the session
        await prisma.videoSession.update({
          where: { id: session.id },
          data: {
            endTime: correctEndTime,
            duration: 60, // 60 minutes
            updatedAt: new Date()
          }
        });

        console.log(`Updated session "${session.title}" (${session.id}):`);
        console.log(`  - Old duration: ${currentDuration} minutes`);
        console.log(`  - Old endTime: ${session.endTime.toISOString()}`);
        console.log(`  - New endTime: ${correctEndTime.toISOString()}`);
        console.log(`  - New duration: 60 minutes`);
        console.log('');

        updatedCount++;
      } catch (error) {
        console.error(`Error updating session "${session.title}" (${session.id}):`, error.message);
        errorCount++;
      }
    }

    console.log('\n=== Migration Summary ===');
    console.log(`Total sessions processed: ${videoSessions.length}`);
    console.log(`Sessions updated: ${updatedCount}`);
    console.log(`Sessions skipped (already correct): ${skippedCount}`);
    console.log(`Errors: ${errorCount}`);
    
    if (errorCount > 0) {
      console.log('\n⚠️  Some sessions could not be updated. Please check the errors above.');
    } else {
      console.log('\n✅ Migration completed successfully!');
    }

  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
migrateLiveClassesTo60Minutes()
  .then(() => {
    console.log('Migration script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration script failed:', error);
    process.exit(1);
  });
