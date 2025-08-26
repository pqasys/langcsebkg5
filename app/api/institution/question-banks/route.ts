import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isBuildTime } from '@/lib/build-error-handler';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json([]);
    }


    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's institution
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { institution: true }
    });

    if (!user?.institution) {
      return NextResponse.json({ error: 'User not associated with an institution' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const isPublic = searchParams.get('is_public');

    // Build where clause
    const where: unknown = {
      OR: [
        { created_by: session.user.id }, // User's own banks
        { is_public: true }, // Public banks
        { 
          created_by: {
            in: await prisma.user.findMany({
              where: { institutionId: user.institution.id },
              select: { id: true }
            }).then(users => users.map(u => u.id))
          }
        } // Banks from same institution
      ]
    };

    if (category) where.category = category;
    if (isPublic !== null) where.is_public = isPublic === 'true';

    const questionBanks = await prisma.questionBank.findMany({
      where,
      orderBy: {
        created_at: 'desc'
      }
    });

    // Get question counts for each bank
    const banksWithCounts = await Promise.all(
      questionBanks.map(async (bank) => {
        const questionCount = await prisma.questionBankItem.count({
          where: { bank_id: bank.id }
        });
        
        return {
          ...bank,
          question_count: questionCount
        };
      })
    );

    return NextResponse.json(banksWithCounts);
  } catch (error) {
    console.error('Error fetching question banks:');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's institution
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { institution: true }
    });

    if (!user?.institution) {
      return NextResponse.json({ error: 'User not associated with an institution' }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, category, tags, is_public } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const questionBank = await prisma.questionBank.create({
      data: {
        name,
        description,
        category,
        tags: tags || [],
        is_public: is_public || false,
        created_by: session.user.id
      }
    });

    const transformedBank = {
      ...questionBank,
      question_count: 0 // New bank has no questions initially
    };

    return NextResponse.json(transformedBank, { status: 201 });
  } catch (error) {
    console.error('Error creating question bank:');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 