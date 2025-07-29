import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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
    const { userId, results } = body;

    if (!userId || !results) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true }
    });

    if (!user?.email) {
      return NextResponse.json(
        { error: 'User email not found' },
        { status: 404 }
      );
    }

    // CEFR Level descriptions for email
    const CEFR_DESCRIPTIONS = {
      'A1': 'You are a beginner learner. You can understand and use familiar everyday expressions and very basic phrases. Focus on building basic vocabulary and simple sentence structures.',
      'A2': 'You are an elementary learner. You can communicate in simple and routine tasks requiring a simple exchange of information. Continue practicing basic grammar and expanding your vocabulary.',
      'B1': 'You are an intermediate learner. You can deal with most situations likely to arise while traveling. Work on more complex grammar structures and idiomatic expressions.',
      'B2': 'You are an upper-intermediate learner. You can interact with a degree of fluency and spontaneity. Focus on advanced vocabulary and nuanced language use.',
      'C1': 'You are an advanced learner. You can express ideas fluently and spontaneously without much searching for expressions. Continue refining your language skills.',
      'C2': 'You are a proficient learner. You can understand with ease virtually everything heard or read. You can express yourself very fluently and precisely.'
    };

    // Generate recommendations based on level
    const getRecommendations = (level: string) => {
      const recommendations = {
        'A1': [
          'Start with basic vocabulary building',
          'Practice simple sentence structures',
          'Focus on common everyday phrases',
          'Use language learning apps for beginners'
        ],
        'A2': [
          'Expand your vocabulary with themed words',
          'Practice past and future tenses',
          'Work on basic conversation skills',
          'Read simple texts and stories'
        ],
        'B1': [
          'Study more complex grammar structures',
          'Practice writing short essays',
          'Listen to podcasts and watch videos',
          'Join conversation groups'
        ],
        'B2': [
          'Focus on academic vocabulary',
          'Practice formal writing styles',
          'Work on pronunciation and intonation',
          'Read newspapers and articles'
        ],
        'C1': [
          'Study advanced grammar and syntax',
          'Practice academic writing',
          'Work on nuanced expressions',
          'Engage in debates and discussions'
        ],
        'C2': [
          'Refine your language precision',
          'Study literature and complex texts',
          'Practice public speaking',
          'Consider teaching or mentoring others'
        ]
      };
      return recommendations[level as keyof typeof recommendations] || recommendations['B1'];
    };

    const recommendations = getRecommendations(results.level);
    const levelDescription = CEFR_DESCRIPTIONS[results.level as keyof typeof CEFR_DESCRIPTIONS];

    // Send email
    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Language Proficiency Test Results</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .score-section { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
          .score { font-size: 48px; font-weight: bold; color: #667eea; }
          .level { font-size: 36px; font-weight: bold; color: #28a745; }
          .recommendations { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .recommendations ul { padding-left: 20px; }
          .recommendations li { margin: 10px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 Language Proficiency Test Results</h1>
            <p>Congratulations on completing your English language assessment!</p>
          </div>
          
          <div class="content">
            <div class="score-section">
              <div class="score">${results.score}/80</div>
              <div class="level">${results.level}</div>
              <p>Your CEFR Level</p>
            </div>
            
            <div class="recommendations">
              <h3>📊 Your Assessment</h3>
              <p>${levelDescription}</p>
              
              <h3>🎯 Recommended Next Steps</h3>
              <ul>
                ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/language-proficiency-test" class="button">
                Take Test Again
              </a>
            </div>
            
            <div class="footer">
              <p>Thank you for using our Language Proficiency Test!</p>
              <p>This assessment is based on the Common European Framework of Reference for Languages (CEFR).</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: 'Language Proficiency Test <noreply@yourdomain.com>',
      to: [user.email],
      subject: `Your Language Proficiency Test Results - ${results.level} Level`,
      html: emailContent
    });

    if (error) {
      console.error('Error sending email:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Results sent successfully'
    });

  } catch (error) {
    console.error('Error sending language proficiency test results:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}