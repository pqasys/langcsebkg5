import { PrismaClient } from '@prisma/client';

/**
 * One-off maintenance script
 * - Links upcoming platform-level standalone sessions (institutionId = null AND courseId = null)
 *   to an existing platform-wide, subscription-based course.
 *
 * Priority for target course:
 * 1) Course with slug 'global-english-mastery-live-platform-course'
 * 2) Any course where institutionId IS NULL AND (requiresSubscription = true OR isPlatformCourse = true)
 *    ordered by createdAt desc
 */
async function main() {
  const prisma = new PrismaClient();
  try {
    const now = new Date();

    // 1) Find target platform-wide course
    let targetCourse = await prisma.course.findUnique({
      where: { slug: 'global-english-mastery-live-platform-course' }
    });

    if (!targetCourse) {
      targetCourse = await prisma.course.findFirst({
        where: {
          institutionId: null,
          OR: [
            { requiresSubscription: true },
            { isPlatformCourse: true },
          ],
        },
        orderBy: { createdAt: 'desc' }
      });
    }

    if (!targetCourse) {
      console.error('No platform-wide subscription course found to attach sessions to. Aborting.');
      process.exitCode = 1;
      return;
    }

    console.log('Target course:', {
      id: targetCourse.id,
      title: targetCourse.title,
      slug: targetCourse.slug,
    });

    // 2) Find upcoming standalone platform sessions
    const standaloneSessions = await prisma.videoSession.findMany({
      where: {
        institutionId: null,
        courseId: null,
        startTime: { gt: now },
        status: 'SCHEDULED',
      },
      orderBy: { startTime: 'asc' },
    });

    if (standaloneSessions.length === 0) {
      console.log('No upcoming standalone platform sessions found. Nothing to do.');
      return;
    }

    console.log(`Found ${standaloneSessions.length} standalone platform sessions to link...`);

    // 3) Link sessions to target course
    const updates = await Promise.all(
      standaloneSessions.map((session) =>
        prisma.videoSession.update({
          where: { id: session.id },
          data: { courseId: targetCourse!.id },
        })
      )
    );

    console.log(`Linked ${updates.length} sessions to course '${targetCourse.title}'.`);
  } catch (error) {
    console.error('Error linking standalone platform sessions:', error);
    process.exitCode = 1;
  }
}

main();


