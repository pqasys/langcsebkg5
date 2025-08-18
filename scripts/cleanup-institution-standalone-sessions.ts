import { PrismaClient } from '@prisma/client';

/**
 * Cleanup script
 * - Deletes past institution-level standalone sessions
 *   (institutionId != null, courseId = null, moduleId = null)
 * - Only removes sessions where endTime < now and status is not ACTIVE
 * - Removes dependent rows first (participants, messages, optional recordings)
 */
async function main() {
  const prisma = new PrismaClient();
  try {
    const now = new Date();

    const sessions = await prisma.videoSession.findMany({
      where: {
        NOT: { institutionId: null },
        courseId: null,
        moduleId: null,
        endTime: { lt: now },
        NOT: { status: 'ACTIVE' },
      },
      select: { id: true, title: true, startTime: true, endTime: true, status: true, institutionId: true },
      orderBy: { endTime: 'asc' },
    });

    if (sessions.length === 0) {
      console.log('No past institution-level standalone sessions found to delete.');
      return;
    }

    console.log(`Found ${sessions.length} institution-level standalone sessions to delete...`);

    for (const s of sessions) {
      console.log(`Deleting dependencies for session ${s.id} (${s.title})...`);
      await prisma.videoSessionParticipant.deleteMany({ where: { sessionId: s.id } });
      await prisma.videoSessionMessage.deleteMany({ where: { sessionId: s.id } });
      try {
        // @ts-ignore optional table depending on schema generation
        if (prisma.videoSessionRecordings) {
          // @ts-ignore
          await prisma.videoSessionRecordings.deleteMany({ where: { sessionId: s.id } });
        }
      } catch {
        // ignore optional table
      }
    }

    const ids = sessions.map(s => s.id);
    await prisma.videoSession.deleteMany({ where: { id: { in: ids } } });

    console.log(`Deleted ${ids.length} institution-level standalone sessions.`);
  } catch (error) {
    console.error('Error cleaning up institution-level standalone sessions:', error);
    process.exitCode = 1;
  }
}

main();


