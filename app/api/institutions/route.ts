import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { logger, logError } from '../../../lib/logger';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured') === 'true';
    const limit = parseInt(searchParams.get('limit') || '0');

    const whereClause: any = {
      isApproved: true,
      status: 'ACTIVE'
    };
    if (featured) {
      whereClause.isFeatured = true;
    }

    const institutions = await prisma.institution.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        country: true,
        city: true,
        logoUrl: true,
        mainImageUrl: true,
        isApproved: true,
        status: true,
        commissionRate: true,
        subscriptionPlan: true,
        isFeatured: true,
        courses: {
          where: {
            status: 'ACTIVE'
          },
          select: {
            id: true
          }
        },
        users: {
          where: {
            role: 'STUDENT'
          },
          select: {
            id: true
          }
        }
      },
      ...(limit > 0 && { take: limit }),
      orderBy: featured ? [
        { isFeatured: 'desc' },
        { commissionRate: 'desc' },
        { subscriptionPlan: 'desc' }
      ] : [
        { isFeatured: 'desc' },
        { commissionRate: 'desc' },
        { name: 'asc' }
      ]
    })

    const institutionsWithStats = institutions.map(inst => ({
      id: inst.id,
      name: inst.name,
      slug: inst.slug,
      description: inst.description,
      country: inst.country,
      city: inst.city,
      logoUrl: inst.logoUrl,
      mainImageUrl: inst.mainImageUrl,
      isApproved: inst.isApproved,
      status: inst.status,
      commissionRate: inst.commissionRate,
      subscriptionPlan: inst.subscriptionPlan,
      isFeatured: inst.isFeatured,
      courseCount: inst.courses.length,
      studentCount: inst.users.length
    }))

    return NextResponse.json({ institutions: institutionsWithStats })
  } catch (error) {
    console.error('Error fetching institutions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}