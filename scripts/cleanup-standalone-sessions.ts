import { PrismaClient } from '@prisma/client';

/**
 * Cleanup script
 * - Deletes past standalone platform sessions (institutionId = null, courseId = null, moduleId = null)
 * - Only removes sessions where endTime < now and status is not ACTIVE
 * - Cascades to participants and messages via relations (foreign keys configured with cascade where applicable)
 */
async function main() {
  const prisma = new PrismaClient();
  try {
    const now = new Date();

    const sessions = await prisma.videoSession.findMany({
      where: {
        institutionId: null,
        courseId: null,
        moduleId: null,
        endTime: { lt: now },
        NOT: { status: 'ACTIVE' },
      },
      select: { id: true, title: true, startTime: true, endTime: true, status: true },
      orderBy: { endTime: 'asc' },
    });

    if (sessions.length === 0) {
      console.log('No past standalone sessions found to delete.');
      return;
    }

    console.log(`Found ${sessions.length} standalone sessions to delete...`);

    // Delete dependents first to be safe (participants, messages, recordings)
    for (const s of sessions) {
      console.log(`Deleting dependencies for session ${s.id} (${s.title})...`);
      await prisma.videoSessionParticipant.deleteMany({ where: { sessionId: s.id } });
      await prisma.videoSessionMessage.deleteMany({ where: { sessionId: s.id } });
      // Some projects have recordings; if present in schema/table
      try {
        // @ts-ignore - may not exist in Prisma client
        if (prisma.videoSessionRecordings) {
          // @ts-ignore
          await prisma.videoSessionRecordings.deleteMany({ where: { sessionId: s.id } });
        }
      } catch {
        // ignore optional table
      }
    }

    // Delete sessions
    const ids = sessions.map(s => s.id);
    await prisma.videoSession.deleteMany({ where: { id: { in: ids } } });

    console.log(`Deleted ${ids.length} standalone sessions.`);
  } catch (error) {
    console.error('Error cleaning up standalone sessions:', error);
    process.exitCode = 1;
  }
}

main();


