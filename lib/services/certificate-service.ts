import { prisma } from '@/lib/prisma';
import { FluentShipCertificateGenerator, CertificateData } from '@/lib/certificate-generator';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export interface AchievementCriteria {
  type: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  condition: (certificate: any, userHistory: any[]) => boolean;
}

export class CertificateService {
  private static readonly ACHIEVEMENT_CRITERIA: AchievementCriteria[] = [
    {
      type: 'first_test',
      title: 'First Steps',
      description: 'Completed your first language proficiency test',
      icon: '🎯',
      color: '#10b981',
      condition: (certificate, userHistory) => userHistory.length === 1
    },
    {
      type: 'high_score',
      title: 'Excellence',
      description: 'Achieved a score of 90% or higher',
      icon: '🏆',
      color: '#f59e0b',
      condition: (certificate, userHistory) => (certificate.score / certificate.totalQuestions) >= 0.9
    },
    {
      type: 'cefr_c2',
      title: 'Master Level',
      description: 'Achieved CEFR C2 level proficiency',
      icon: '👑',
      color: '#8b5cf6',
      condition: (certificate, userHistory) => certificate.cefrLevel === 'C2'
    },
    {
      type: 'multiple_languages',
      title: 'Polyglot',
      description: 'Completed tests in 3 or more different languages',
      icon: '🌍',
      color: '#3b82f6',
      condition: (certificate, userHistory) => {
        const uniqueLanguages = new Set(userHistory.map(c => c.language));
        return uniqueLanguages.size >= 3;
      }
    },
    {
      type: 'perfect_score',
      title: 'Perfect Score',
      description: 'Achieved 100% on a language proficiency test',
      icon: '💎',
      color: '#ef4444',
      condition: (certificate, userHistory) => certificate.score === certificate.totalQuestions
    },
    {
      type: 'consistent_learner',
      title: 'Consistent Learner',
      description: 'Completed 5 or more tests',
      icon: '📚',
      color: '#06b6d4',
      condition: (certificate, userHistory) => userHistory.length >= 5
    }
  ];

  static async createCertificate(testAttemptId: string): Promise<any> {
    // Get test attempt data
    const testAttempt = await prisma.languageProficiencyTestAttempt.findUnique({
      where: { id: testAttemptId },
      include: { user: true }
    });

    if (!testAttempt) {
      throw new Error('Test attempt not found');
    }

    // Generate certificate ID
    const certificateId = FluentShipCertificateGenerator.generateCertificateId();

    // Get language name
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

    const languageName = languageNames[testAttempt.languageCode] || testAttempt.languageCode;

    // Create certificate data
    const certificateData: CertificateData = {
      userName: testAttempt.user.name,
      language: testAttempt.languageCode,
      languageName: languageName,
      cefrLevel: testAttempt.level,
      score: testAttempt.score,
      totalQuestions: 80, // Assuming 80 questions per test
      completionDate: testAttempt.completedAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      certificateId: certificateId,
      testType: 'proficiency'
    };

    // Generate PDF certificate
    const pdfBuffer = await FluentShipCertificateGenerator.generateCertificate(certificateData);

    // Save PDF to file system
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'certificates');
    await mkdir(uploadsDir, { recursive: true });
    
    const fileName = `${certificateId}.pdf`;
    const filePath = join(uploadsDir, fileName);
    await writeFile(filePath, pdfBuffer);

    const certificateUrl = `/uploads/certificates/${fileName}`;

    // Create certificate record in database
    const certificate = await prisma.certificate.create({
      data: {
        certificateId,
        userId: testAttempt.userId,
        testAttemptId: testAttempt.id,
        language: testAttempt.languageCode,
        languageName,
        cefrLevel: testAttempt.level,
        score: testAttempt.score,
        totalQuestions: 80,
        completionDate: testAttempt.completedAt,
        certificateUrl
      }
    });

    // Check and create achievements
    await this.checkAndCreateAchievements(certificate);

    return certificate;
  }

  static async checkAndCreateAchievements(certificate: any): Promise<void> {
    // Get user's certificate history
    const userHistory = await prisma.certificate.findMany({
      where: { userId: certificate.userId },
      orderBy: { completionDate: 'asc' }
    });

    // Check each achievement criteria
    for (const criteria of this.ACHIEVEMENT_CRITERIA) {
      // Check if user already has this achievement
      const existingAchievement = await prisma.userAchievement.findFirst({
        where: {
          userId: certificate.userId,
          type: criteria.type
        }
      });

      if (!existingAchievement && criteria.condition(certificate, userHistory)) {
        // Create achievement using the UserAchievement model
        await prisma.userAchievement.create({
          data: {
            userId: certificate.userId,
            certificateId: certificate.id,
            type: criteria.type,
            title: criteria.title,
            description: criteria.description,
            icon: criteria.icon,
            color: criteria.color,
            isPublic: false // Default to private, user can choose to share
          }
        });
      }
    }
  }

  static async shareCertificate(certificateId: string, userId: string, isPublic: boolean = true): Promise<any> {
    try {
      const certificate = await prisma.certificate.findFirst({
        where: {
          certificateId,
          userId
        }
      });

      if (!certificate) {
        throw new Error('Certificate not found');
      }

      // Update certificate visibility
      const updatedCertificate = await prisma.certificate.update({
        where: { id: certificate.id },
        data: {
          isPublic,
          sharedAt: isPublic ? new Date() : null
        }
      });

      // If making public, create community announcement
      if (isPublic) {
        await this.createCommunityAnnouncement(certificate);
      }

      return updatedCertificate;
    } catch (error) {
      console.error('Error sharing certificate:', error);
      throw new Error('Failed to share certificate');
    }
  }

  static async createCommunityAnnouncement(certificate: any): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: certificate.userId }
    });

    if (!user) return;

    const announcementTitle = `${user.name} earned a ${certificate.cefrLevel} certificate in ${certificate.languageName}!`;
    const announcementMessage = `Congratulations to ${user.name} for achieving ${certificate.cefrLevel} level proficiency in ${certificate.languageName} with a score of ${certificate.score}/${certificate.totalQuestions}! 🎉`;

    await prisma.communityAnnouncement.create({
      data: {
        userId: certificate.userId,
        certificateId: certificate.id,
        type: 'certificate_earned',
        title: announcementTitle,
        message: announcementMessage,
        language: certificate.language,
        cefrLevel: certificate.cefrLevel,
        isPublic: true
      }
    });
  }

  static async getUserCertificates(userId: string): Promise<any[]> {
    try {
      return await prisma.certificate.findMany({
        where: { userId },
        include: {
          achievements: true,
          announcements: true
        },
        orderBy: { completionDate: 'desc' }
      });
    } catch (error) {
      console.error('Error fetching user certificates:', error);
      return [];
    }
  }

  static async getUserAchievements(userId: string): Promise<any[]> {
    return await prisma.userAchievement.findMany({
      where: { userId },
      include: {
        certificate: {
          include: {
            user: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getPublicAnnouncements(limit: number = 20): Promise<any[]> {
    return await prisma.communityAnnouncement.findMany({
      where: { isPublic: true },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        certificate: {
          select: {
            certificateId: true,
            language: true,
            languageName: true,
            cefrLevel: true,
            score: true,
            totalQuestions: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }

  static async likeAnnouncement(announcementId: string): Promise<void> {
    await prisma.communityAnnouncement.update({
      where: { id: announcementId },
      data: {
        likes: {
          increment: 1
        }
      }
    });
  }

  static async verifyCertificate(certificateId: string): Promise<any> {
    try {
      return await prisma.certificate.findUnique({
        where: { certificateId },
        include: {
          user: {
            select: {
              name: true
            }
          },
          achievements: true
        }
      });
    } catch (error) {
      console.error('Error verifying certificate:', error);
      return null;
    }
  }

  static async getCertificateStats(userId: string): Promise<any> {
    const certificates = await prisma.certificate.findMany({
      where: { userId }
    });

    const achievements = await prisma.userAchievement.findMany({
      where: { userId }
    });

    const totalScore = certificates.reduce((sum, cert) => sum + cert.score, 0);
    const totalQuestions = certificates.reduce((sum, cert) => sum + cert.totalQuestions, 0);
    const averageScore = totalQuestions > 0 ? (totalScore / totalQuestions) * 100 : 0;

    const languageCount = new Set(certificates.map(c => c.language)).size;
    const highestLevel = certificates.reduce((highest, cert) => {
      const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
      const currentIndex = levels.indexOf(cert.cefrLevel);
      const highestIndex = levels.indexOf(highest);
      return currentIndex > highestIndex ? cert.cefrLevel : highest;
    }, 'A1');

    return {
      totalCertificates: certificates.length,
      totalAchievements: achievements.length,
      averageScore: Math.round(averageScore),
      languagesTested: languageCount,
      highestLevel,
      totalScore,
      totalQuestions
    };
  }
} 