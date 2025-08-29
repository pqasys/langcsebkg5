import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CertificateServiceSecure } from '@/lib/services/certificate-service-secure';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { userId, score, level, answers, timeSpent, languageCode } = body;

    if (!userId || score === undefined || !level || !answers || !languageCode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create a language proficiency test attempt record
    const testAttempt = await prisma.languageProficiencyTestAttempt.create({
      data: {
        id: uuidv4(),
        userId: userId,
        languageCode: languageCode,
        score: score,
        level: level,
        answers: answers,
        timeSpent: timeSpent || 0,
        completedAt: new Date()
      }
    });

    // Generate certificate
    let certificate = null;
    try {
      certificate = await CertificateServiceSecure.createCertificate(testAttempt.id);
    } catch (certError) {
      console.error('Error generating certificate:', certError);
      // Continue without certificate - the test attempt is still saved
    }

    return NextResponse.json({
      success: true,
      attemptId: testAttempt.id,
      certificateId: certificate?.id || null,
      score,
      level,
      percentage: Math.round((score / 160) * 100), // Assuming 160 questions total
      languageCode
    });

  } catch (error) {
    console.error('Error submitting language proficiency test:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}