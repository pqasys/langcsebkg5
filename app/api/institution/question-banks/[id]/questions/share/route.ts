import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const questionBankId = params.id;
    const body = await request.json();
    const { 
      questionIds, 
      sharingLevel, 
      selectedCourses, 
      selectedInstitutions, 
      message, 
      allowCopy, 
      allowModify 
    } = body;

    if (!questionIds || !Array.isArray(questionIds) || questionIds.length === 0) {
      return NextResponse.json({ error: 'No questions specified for sharing' }, { status: 400 });
    }

    if (!sharingLevel) {
      return NextResponse.json({ error: 'Sharing level is required' }, { status: 400 });
    }

    // Verify user has access to the question bank
    const questionBank = await prisma.questionBank.findFirst({
      where: {
        id: questionBankId,
        OR: [
          { created_by: session.user.id },
          {
            created_by: {
              in: await prisma.user.findMany({
                where: { institution_id: user.institution.id },
                select: { id: true }
              }).then(users => users.map(u => u.id))
            }
          }
        ]
      }
    });

    if (!questionBank) {
      return NextResponse.json({ error: 'Question bank not found or access denied' }, { status: 404 });
    }

    // Verify user has permission to share all specified questions
    const questionsToShare = await prisma.question.findMany({
      where: {
        id: { in: questionIds },
        question_bank_id: questionBankId,
        created_by: session.user.id
      }
    });

    if (questionsToShare.length !== questionIds.length) {
      return NextResponse.json({ error: 'Access denied to some questions' }, { status: 403 });
    }

    // Prepare sharing data
    const sharedWith = [];
    
    if (sharingLevel === 'INSTITUTION') {
      sharedWith.push('INSTITUTION');
      if (selectedCourses && selectedCourses.length > 0) {
        sharedWith.push(...selectedCourses.map(courseId => `COURSE_${courseId}`));
      }
    } else if (sharingLevel === 'PUBLIC') {
      sharedWith.push('PUBLIC');
      if (selectedInstitutions && selectedInstitutions.length > 0) {
        sharedWith.push(...selectedInstitutions.map(institutionId => `INSTITUTION_${institutionId}`));
      }
    }

    // Update questions with sharing information
    const updatedQuestions = await prisma.question.updateMany({
      where: {
        id: { in: questionIds }
      },
      data: {
        is_shared: true,
        shared_with: sharedWith,
        sharing_permissions: {
          allowCopy: allowCopy || false,
          allowModify: allowModify || false
        },
        shared_message: message || '',
        shared_by: session.user.id,
        shared_at: new Date()
      }
    });

    // Create sharing records for tracking
    const sharingRecords = questionIds.map(questionId => ({
      question_id: questionId,
      shared_by: session.user.id,
      shared_with: sharedWith,
      sharing_level: sharingLevel,
      message: message || '',
      allow_copy: allowCopy || false,
      allow_modify: allowModify || false,
      created_at: new Date()
    }));

    await prisma.questionSharing.createMany({
      data: sharingRecords
    });

    // // // console.log(`${questionIds.length} question(s) shared successfully`);
    return NextResponse.json({
      message: `${questionIds.length} question(s) shared successfully`,
      sharedCount: questionIds.length,
      sharingLevel,
      sharedWith
    });
  } catch (error) {
    console.error('Error sharing questions:');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 