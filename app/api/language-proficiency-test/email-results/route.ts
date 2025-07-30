import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CertificateService } from '@/lib/services/certificate-service';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, results, language } = await request.json();

    // Verify user owns the results
    if (session.user.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create test attempt record
    const testAttempt = await prisma.languageProficiencyTestAttempt.create({
      data: {
        userId: userId,
        languageCode: language,
        score: results.score,
        level: results.level,
        answers: results.answers || {},
        timeSpent: results.timeSpent || 0
      }
    });

    // Generate certificate
    const certificate = await CertificateService.createCertificate(testAttempt.id);

    // Get user's achievements
    const achievements = await CertificateService.getUserAchievements(userId);

    // Get certificate stats
    const stats = await CertificateService.getCertificateStats(userId);

    // Prepare email content
    const languageNames: { [key: string]: string } = {
      'en': 'English',
      'fr': 'French',
      'es': 'Spanish',
      'de': 'German',
      'it': 'Italian',
      'pt': 'Portuguese',
      'ru': 'Russian',
      'zh': 'Chinese',
      'ja': 'Japanese',
      'ko': 'Korean'
    };

    const languageName = languageNames[language] || language;

    // Create email HTML
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your FluentShip Language Proficiency Test Results</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2563eb, #1e40af); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
          .result-card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .score { font-size: 2em; font-weight: bold; color: #2563eb; text-align: center; }
          .level { font-size: 1.5em; color: #059669; text-align: center; margin: 10px 0; }
          .achievement { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 10px 0; border-radius: 4px; }
          .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 20px 0; }
          .stat-item { background: white; padding: 15px; border-radius: 8px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
          .stat-number { font-size: 1.5em; font-weight: bold; color: #2563eb; }
          .btn { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 0.9em; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Congratulations, ${user.name}!</h1>
            <p>You've completed the ${languageName} Language Proficiency Test</p>
          </div>
          
          <div class="content">
            <div class="result-card">
              <div class="score">${results.score}/80</div>
              <div class="level">CEFR Level: ${results.level}</div>
              <p style="text-align: center; color: #6b7280;">${Math.round((results.score / 80) * 100)}% Accuracy</p>
            </div>

            <h2>Your Results Breakdown</h2>
            <p><strong>Language:</strong> ${languageName}</p>
            <p><strong>CEFR Level:</strong> ${results.level}</p>
            <p><strong>Score:</strong> ${results.score} out of 80 questions</p>
            <p><strong>Percentage:</strong> ${Math.round((results.score / 80) * 100)}%</p>
            <p><strong>Description:</strong> ${results.description}</p>

            ${achievements.length > 0 ? `
              <h2>🏆 New Achievements Unlocked!</h2>
              ${achievements.map(achievement => `
                <div class="achievement">
                  <strong>${achievement.icon} ${achievement.title}</strong><br>
                  ${achievement.description}
                </div>
              `).join('')}
            ` : ''}

            <h2>📊 Your Learning Stats</h2>
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-number">${stats.totalCertificates}</div>
                <div>Total Tests</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">${stats.totalAchievements}</div>
                <div>Achievements</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">${stats.averageScore}%</div>
                <div>Average Score</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">${stats.languagesTested}</div>
                <div>Languages</div>
              </div>
            </div>

            <h2>🎯 What's Next?</h2>
            <ul>
              <li>Share your certificate with the community</li>
              <li>Take tests in other languages</li>
              <li>Improve your score and reach higher CEFR levels</li>
              <li>Connect with other language learners</li>
            </ul>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL}/certificates" class="btn">View All Certificates</a>
              <a href="${process.env.NEXTAUTH_URL}/community" class="btn">Join Community</a>
            </div>
          </div>

          <div class="footer">
            <p>This certificate is attached to this email and can be verified online.</p>
            <p>Certificate ID: ${certificate.certificateId}</p>
            <p>© 2024 FluentShip. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email with certificate attachment
    await resend.emails.send({
      from: 'FluentShip <noreply@fluentship.com>',
      to: user.email,
      subject: `🎉 Your ${languageName} Language Proficiency Test Results - ${results.level} Level Achieved!`,
      html: emailHtml,
      attachments: [
        {
          filename: `FluentShip_${languageName}_${results.level}_Certificate.pdf`,
          path: certificate.certificateUrl
        }
      ]
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Results sent successfully',
      certificateId: certificate.certificateId
    });

  } catch (error) {
    console.error('Error sending email results:', error);
    return NextResponse.json(
      { error: 'Failed to send results' }, 
      { status: 500 }
    );
  }
}