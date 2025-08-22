import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { mapConversationRow } from '@/lib/live-conversations';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language');
    const level = searchParams.get('level');
    const type = searchParams.get('type');
    const status = searchParams.get('status') || 'SCHEDULED';
    const isFree = searchParams.get('isFree');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build where clause
    const whereClause: any = {
      status: status,
      isPublic: true,
    };

    if (language && language !== 'all') {
      whereClause.language = language;
    }

    if (level && level !== 'all') {
      whereClause.level = level;
    }

    if (type && type !== 'all') {
      whereClause.conversationType = type;
    }

    if (isFree !== null && isFree !== 'all') {
      whereClause.isFree = isFree === 'true';
    }

    // Get conversations (base rows only)
    const [conversations, total] = await Promise.all([
      prisma.liveConversation.findMany({
        where: whereClause,
        orderBy: [
          { startTime: 'asc' },
          { createdAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      prisma.liveConversation.count({
        where: whereClause,
      }),
    ]);

    // Collect IDs for batch queries
    const conversationIds = conversations.map((c) => c.id);
    const hostIds = conversations.map((c) => c.hostId);
    const instructorIds = conversations
      .map((c) => c.instructorId)
      .filter((id): id is string => !!id);

    // Fetch participants across all conversations
    const participantRows = await prisma.liveConversationParticipant.findMany({
      where: { conversationId: { in: conversationIds } },
    });
    const participantUserIds = Array.from(new Set(participantRows.map((p) => p.userId)));

    // Fetch user records for hosts, instructors, and participants in one go
    const userIds = Array.from(new Set([...hostIds, ...instructorIds, ...participantUserIds]));
    const users = userIds.length
      ? await prisma.user.findMany({
          where: { id: { in: userIds } },
          select: { id: true, name: true, email: true, image: true },
        })
      : [];
    const userById = new Map(users.map((u) => [u.id, u]));

    // Compute counts via groupBy
    const [participantsCounts, bookingsCounts] = await Promise.all([
      prisma.liveConversationParticipant.groupBy({
        by: ['conversationId'],
        where: { conversationId: { in: conversationIds } },
        _count: { id: true },
      }),
      prisma.liveConversationBooking.groupBy({
        by: ['conversationId'],
        where: { conversationId: { in: conversationIds } },
        _count: { id: true },
      }),
    ]);
    const participantsCountByConv = new Map(participantsCounts.map((r) => [r.conversationId, r._count.id]));
    const bookingsCountByConv = new Map(bookingsCounts.map((r) => [r.conversationId, r._count.id]));

    // Check if user is booked and map DTO shape
    const conversationsWithBookingStatus = await Promise.all(
      conversations.map(async (conversation) => {
        const userBooking = await prisma.liveConversationBooking.findFirst({
          where: { conversationId: conversation.id, userId: session.user.id },
        });

        const dto = mapConversationRow(conversation as any);

        const instructor = conversation.instructorId ? userById.get(conversation.instructorId) || null : null;
        const host = userById.get(conversation.hostId) || null;

        const participantsForConversation = participantRows
          .filter((p) => p.conversationId === conversation.id)
          .map((p) => ({
            ...p,
            user: userById.get(p.userId)
              ? {
                  id: userById.get(p.userId)!.id,
                  name: userById.get(p.userId)!.name,
                  image: userById.get(p.userId)!.image,
                }
              : null,
          }));

        return {
          ...dto,
          instructor,
          host,
          participants: participantsForConversation,
          _count: {
            participants: participantsCountByConv.get(conversation.id) || 0,
            bookings: bookingsCountByConv.get(conversation.id) || 0,
          },
          isBooked: !!userBooking,
          bookingStatus: userBooking?.status || null,
        };
      })
    );

    return NextResponse.json({
      success: true,
      conversations: conversationsWithBookingStatus,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error('Error fetching live conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      conversationType,
      language,
      level,
      startTime,
      endTime,
      duration,
      maxParticipants,
      price,
      isPublic,
      isFree,
      topic,
      culturalNotes,
      vocabularyList,
      grammarPoints,
      conversationPrompts,
      instructorId,
      requiresSubscription,
      allowedStudentTiers,
      allowedInstitutionTiers,
    } = body;

    // Validate required fields
    if (!title || !conversationType || !language || !level || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate time constraints
    const startDateTime = new Date(startTime);
    const endDateTime = new Date(endTime);
    const now = new Date();

    if (startDateTime <= now) {
      return NextResponse.json(
        { error: 'Start time must be in the future' },
        { status: 400 }
      );
    }

    if (endDateTime <= startDateTime) {
      return NextResponse.json(
        { error: 'End time must be after start time' },
        { status: 400 }
      );
    }

    // Check user permissions
    if (session.user.role === 'STUDENT') {
      // Students can only create free peer-to-peer conversations
      if (!isFree) {
        return NextResponse.json(
          { error: 'Students can only create free conversations' },
          { status: 403 }
        );
      }
      if (instructorId) {
        return NextResponse.json(
          { error: 'Students cannot create instructor-led conversations' },
          { status: 403 }
        );
      }
    }

    // Create conversation
    const conversation = await prisma.liveConversation.create({
      data: {
        title,
        description,
        conversationType,
        language,
        level,
        startTime: startDateTime,
        endTime: endDateTime,
        duration,
        maxParticipants: maxParticipants || 8,
        price: price || 0,
        isPublic: isPublic !== false,
        isFree: isFree || false,
        topic,
        culturalNotes,
        vocabularyList,
        grammarPoints,
        conversationPrompts,
        instructorId: instructorId || null,
        hostId: session.user.id,
        status: 'SCHEDULED',
        // Optional gating fields persisted if present in schema
        requiresSubscription: !!requiresSubscription,
        allowedStudentTiers: Array.isArray(allowedStudentTiers) ? allowedStudentTiers : undefined,
        allowedInstitutionTiers: Array.isArray(allowedInstitutionTiers) ? allowedInstitutionTiers : undefined,
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        host: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    logger.info(`Live conversation created: ${conversation.id} by user ${session.user.id}`);

    const dto = mapConversationRow(conversation as any);

    return NextResponse.json({
      success: true,
      conversation: {
        ...dto,
        instructor: conversation.instructor || null,
        host: conversation.host,
      },
    });
  } catch (error) {
    logger.error('Error creating live conversation:', error);
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
} 