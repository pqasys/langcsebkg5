import { NextRequest, NextResponse } from 'next/server';
import { LanguageProficiencyService } from '@/lib/services/language-proficiency-service';

export async function POST(request: NextRequest) {
  try {
    const { languageCode = 'en' } = await request.json();

    // Initialize the question bank
    await LanguageProficiencyService.initializeQuestionBank(languageCode);

    // Get statistics
    const stats = await LanguageProficiencyService.getQuestionBankStats(languageCode);

    return NextResponse.json({
      success: true,
      message: `Question bank initialized for ${languageCode}`,
      stats
    });
  } catch (error) {
    console.error('Error initializing question bank:', error);
    return NextResponse.json(
      { error: 'Failed to initialize question bank' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const languageCode = searchParams.get('languageCode') || 'en';

    // Get statistics
    const stats = await LanguageProficiencyService.getQuestionBankStats(languageCode);

    return NextResponse.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error getting question bank stats:', error);
    return NextResponse.json(
      { error: 'Failed to get question bank statistics' },
      { status: 500 }
    );
  }
} 