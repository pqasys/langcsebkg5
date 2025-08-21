import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // // // // // // // // // // // // // // // // // // // // // // // // // // // console.log('Fetching course details for ID:', params.id);
    
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.log('No session or user found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin (case-insensitive)
    if (session.user.role !== 'ADMIN') {
      console.log('User is not admin:', session.user.role);
      return NextResponse.json(
        { message: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    console.log('Fetching course from database...');
    const course = await prisma.course.findFirst({
      where: {
        id: params.id,
      },
      include: {
        institution: {
          select: {
            id: true,
            name: true
          }
        },
        category: true,
        courseTags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                color: true,
                icon: true
              }
            }
          }
        }
      }
    });

    if (!course) {
      console.log('Course not found');
      return NextResponse.json(
        { message: 'Course not found' },
        { status: 404 }
      );
    }

    // Get counts separately
    const [enrollments, completions, courseTags, weeklyPrices, pricingRules] = await Promise.all([
      prisma.studentCourseEnrollment.count({ where: { courseId: course.id } }),
      prisma.studentCourseCompletion.count({ where: { courseId: course.id } }),
      prisma.courseTag.count({ where: { courseId: course.id } }),
      prisma.course_weekly_prices.count({ where: { courseId: course.id } }),
      prisma.course_pricing_rules.count({ where: { courseId: course.id } })
    ]);

    const courseWithCounts = {
      ...course,
      _count: {
        enrollments,
        completions,
        courseTags,
        weeklyPrices,
        pricingRules,
      },
    };

    console.log('Course found:', {
      id: courseWithCounts.id,
      title: courseWithCounts.title,
      _count: courseWithCounts._count
    });

    return NextResponse.json(courseWithCounts);
  } catch (error) {
    console.error('Error fetching course:');
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const courseId = params.id;
    const data = await request.json();
    if (!data) throw new Error('Request body is required');;
    if (!data) throw new Error('Request body is required');;
    if (!data) throw new Error('Request body is required');;
    // debug removed

    // Validate required fields
    const requiredFields = ['title', 'categoryId'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields);
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Ensure base_price is a number
    const base_price = parseFloat(data.base_price) || 0;

    // Robust boolean coercion for placement flags
    const coerceBoolean = (val: unknown): boolean => {
      if (typeof val === 'boolean') return val;
      if (typeof val === 'number') return val === 1;
      if (typeof val === 'string') return val.toLowerCase() === 'true' || val === '1';
      return false;
    };

    const isFeaturedFlag = coerceBoolean(data.isFeatured);
    const isSponsoredFlag = coerceBoolean(data.isSponsored);

    // Mutually exclusive: if sponsored, force featured false
    const normalizedIsFeatured = isSponsoredFlag ? false : isFeaturedFlag;
    const normalizedIsSponsored = isSponsoredFlag;

    // Load existing course and any auto-generated sessions for governance
    const existingCourse = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
        isPlatformCourse: true,
        hasLiveClasses: true,
        marketingType: true,
        startDate: true,
        endDate: true,
        liveClassFrequency: true,
        liveClassSchedule: true,
      }
    });

    if (!existingCourse) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const qualifiesForAutoSessions = Boolean(existingCourse.isPlatformCourse && (data.isPlatformCourse ?? existingCourse.isPlatformCourse))
      && Boolean(existingCourse.hasLiveClasses || data.hasLiveClasses)
      && ((data.marketingType ?? existingCourse.marketingType) === 'LIVE_ONLINE');

    // Parse new values (fall back to current)
    const newStart = data.startDate ? new Date(data.startDate) : new Date(existingCourse.startDate as any);
    const newEnd = data.endDate ? new Date(data.endDate) : new Date(existingCourse.endDate as any);
    const newFreq = (data.liveClassFrequency ?? existingCourse.liveClassFrequency ?? '').toUpperCase();
    const oldFreq = (existingCourse.liveClassFrequency ?? '').toUpperCase();
    const schedule: any = data.liveClassSchedule ?? existingCourse.liveClassSchedule ?? {};
    const scheduleTime: string | undefined = schedule?.time;
    const scheduleDuration: number = Number(schedule?.duration) || 60;

    // Governance validations for auto-generated sessions
    let sessionsToDeleteIds: string[] = [];
    let sessionsToCreate: Array<{ startTime: Date; endTime: Date }> = [];

    if (qualifiesForAutoSessions && !isNaN(newStart.getTime()) && !isNaN(newEnd.getTime()) && newStart < newEnd) {
      // Fetch current auto-generated sessions and participant counts
      const currentSessions = await prisma.videoSession.findMany({
        where: { courseId: courseId },
        select: {
          id: true,
          startTime: true,
          endTime: true,
          status: true,
          isAutoGenerated: true,
          _count: { select: { participants: true } }
        },
        orderBy: { startTime: 'asc' }
      });

      const autoSessions = currentSessions.filter(s => s.isAutoGenerated);
      const hasLocked = (list: typeof autoSessions) => list.some(s => s._count.participants > 0 || (s.status && s.status !== 'SCHEDULED'));

      // Frequency change governance
      const frequencyChanged = newFreq && oldFreq && newFreq !== oldFreq;
      if (frequencyChanged && autoSessions.length > 0 && hasLocked(autoSessions)) {
        return NextResponse.json({
          error: 'Cannot change Live Class Frequency: one or more auto-generated sessions have enrollments or are not SCHEDULED. Cancel/migrate those sessions first.'
        }, { status: 409 });
      }

      // Date range shrink/grow governance
      const oldStart = new Date(existingCourse.startDate as any);
      const oldEnd = new Date(existingCourse.endDate as any);

      // If moving start later, identify sessions before newStart
      if (newStart > oldStart) {
        const affected = autoSessions.filter(s => s.startTime < newStart);
        if (hasLocked(affected)) {
          return NextResponse.json({
            error: 'Cannot move start date forward: some earlier sessions have enrollments or have started.'
          }, { status: 409 });
        }
        sessionsToDeleteIds.push(...affected.map(s => s.id));
      }

      // If moving end earlier, identify sessions after newEnd
      if (newEnd < oldEnd) {
        const affected = autoSessions.filter(s => s.startTime > newEnd);
        if (hasLocked(affected)) {
          return NextResponse.json({
            error: 'Cannot shorten end date: some later sessions have enrollments or have started.'
          }, { status: 409 });
        }
        sessionsToDeleteIds.push(...affected.map(s => s.id));
      }

      // Helper generators
      const addDays = (d: Date, days: number) => new Date(d.getTime() + days * 24 * 60 * 60 * 1000);
      const addWeeks = (d: Date, w: number) => addDays(d, w * 7);
      const addMonths = (d: Date, m: number) => { const n = new Date(d); n.setMonth(n.getMonth() + m); return n; };
      const setTimeFromString = (base: Date, time?: string) => {
        if (!time) return base;
        const [hh, mm] = time.split(':').map((v: any) => parseInt(v, 10));
        const x = new Date(base);
        x.setHours(isNaN(hh) ? 0 : hh, isNaN(mm) ? 0 : mm, 0, 0);
        return x;
      };

      const makePlan = (from: Date, to: Date) => {
        const plan: Array<{ startTime: Date; endTime: Date }> = [];
        let cursor = setTimeFromString(new Date(from), scheduleTime);
        const advance = () => {
          switch ((newFreq || oldFreq || 'WEEKLY')) {
            case 'DAILY': cursor = setTimeFromString(addDays(cursor, 1), scheduleTime); break;
            case 'BIWEEKLY': cursor = setTimeFromString(addWeeks(cursor, 2), scheduleTime); break;
            case 'MONTHLY': cursor = setTimeFromString(addMonths(cursor, 1), scheduleTime); break;
            case 'WEEKLY':
            default: cursor = setTimeFromString(addWeeks(cursor, 1), scheduleTime); break;
          }
        };
        while (cursor <= to) {
          const st = new Date(cursor);
          const et = new Date(st.getTime() + scheduleDuration * 60 * 1000);
          plan.push({ startTime: st, endTime: et });
          advance();
        }
        return plan;
      };

      // Create plan for newly added range segments
      if (newStart < oldStart) {
        sessionsToCreate.push(...makePlan(newStart, oldStart));
      }
      if (newEnd > oldEnd) {
        // start from just after oldEnd to newEnd
        const startAfterOldEnd = addDays(oldEnd, 0); // same day allowed if time-of-day differs
        sessionsToCreate.push(...makePlan(startAfterOldEnd, newEnd));
      }

      // If frequency changed, we will recreate all future auto-generated sessions that are SCHEDULED and have no participants
      if (frequencyChanged) {
        const recreatable = autoSessions.filter(s => s._count.participants === 0 && (s.status === 'SCHEDULED'));
        sessionsToDeleteIds.push(...recreatable.map(s => s.id));
        sessionsToCreate = makePlan(newStart, newEnd);
      }
    }

    // Wrap course update and session mutations in a single transaction for atomicity
    const result = await prisma.$transaction(async (tx) => {
      const updatedCourse = await tx.course.update({
        where: { id: courseId },
        data: {
          title: data.title,
          description: data.description,
          base_price: base_price,
          duration: parseInt(data.duration) || 0,
          priority: parseInt(data.priority) || 0,
          isFeatured: normalizedIsFeatured,
          isSponsored: normalizedIsSponsored,
          level: data.level,
          // Priority & placement (duplicate keys removed)
          framework: data.framework,
          status: data.status,
          institution: data.institutionId ? {
            connect: { id: data.institutionId }
          } : undefined,
          category: {
            connect: { id: data.categoryId }
          },
          startDate: data.startDate ? new Date(data.startDate) : null,
          endDate: data.endDate ? new Date(data.endDate) : null,
          maxStudents: parseInt(data.maxStudents) || 0,
          pricingPeriod: data.pricingPeriod || 'FULL_COURSE',
          // Simplified course classification fields
          hasLiveClasses: data.hasLiveClasses || false,
          liveClassType: data.liveClassType || null,
          liveClassFrequency: data.liveClassFrequency || null,
          liveClassSchedule: data.liveClassSchedule || null,
          isPlatformCourse: data.isPlatformCourse || false,
          requiresSubscription: data.requiresSubscription || false,
          subscriptionTier: data.subscriptionTier || null,
          // Marketing fields
          marketingType: data.marketingType ?? 'SELF_PACED',
          marketingDescription: data.marketingDescription ?? null,
          // Update tags
          courseTags: {
            deleteMany: {},
            create: data.tags.map((tag: unknown) => ({
              tag: {
                connect: {
                  id: tag.id
                }
              }
            }))
          }
        },
        include: {
          courseTags: {
            include: {
              tag: true
            }
          }
        }
      });

      if (qualifiesForAutoSessions && (sessionsToDeleteIds.length > 0 || sessionsToCreate.length > 0)) {
        const defaultInstructor = await tx.user.findFirst({
          where: { role: { in: ['ADMIN', 'INSTRUCTOR' as any] } },
          select: { id: true }
        });
        const instructorId = defaultInstructor?.id || session.user.id;

        if (sessionsToDeleteIds.length > 0) {
          await tx.videoSession.deleteMany({ where: { id: { in: sessionsToDeleteIds } } });
        }
        for (let i = 0; i < sessionsToCreate.length; i++) {
          const s = sessionsToCreate[i];
          await tx.videoSession.create({
            data: {
              title: `${updatedCourse.title} - Session ${i + 1}`,
              description: `Auto-generated session for ${updatedCourse.title}`,
              sessionType: 'LIVE_CLASS',
              language: updatedCourse.framework || 'en',
              level: updatedCourse.level || 'BEGINNER',
              maxParticipants: updatedCourse.maxStudents || 10,
              startTime: s.startTime,
              endTime: s.endTime,
              duration: Math.ceil((s.endTime.getTime() - s.startTime.getTime()) / (1000 * 60)),
              instructorId,
              institutionId: null,
              courseId: updatedCourse.id,
              isPublic: true,
              isRecorded: false,
              allowChat: true,
              allowScreenShare: true,
              allowRecording: false,
              isAutoGenerated: true,
              isRecurring: true,
              status: 'SCHEDULED'
            }
          });
        }
      }

      return updatedCourse;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating course:');
    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const courseId = params.id;

    // Delete the course
    await prisma.course.delete({
      where: { id: courseId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting course:');
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 