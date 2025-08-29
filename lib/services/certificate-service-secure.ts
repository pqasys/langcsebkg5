import { prisma } from '@/lib/prisma';
import { FluentShipCertificateGeneratorSecure, CertificateData } from '@/lib/certificate-generator-secure';

export interface AchievementCriteria {
  type: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  condition: (certificate: any, userHistory: any[]) => boolean;
}

export class CertificateServiceSecure {
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
    const certificateId = FluentShipCertificateGeneratorSecure.generateCertificateId();

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

    // Calculate total questions from answers
    const answers = testAttempt.answers as Record<string, string>;
    const totalQuestions = Object.keys(answers).length;

    // Create certificate data
    const certificateData: CertificateData = {
      userName: testAttempt.user.name || 'Student',
      language: testAttempt.languageCode,
      languageName: languageName,
      cefrLevel: testAttempt.level, // Use 'level' field from the model
      score: testAttempt.score,
      totalQuestions: totalQuestions, // Calculate from actual answers
      completionDate: testAttempt.completedAt?.toLocaleDateString() || new Date().toLocaleDateString(),
      certificateId: certificateId,
      testType: 'proficiency'
    };

    // Generate PDF certificate
    const pdfBuffer = await FluentShipCertificateGeneratorSecure.generateCertificate(certificateData);

    // Save certificate to database
    const certificate = await prisma.certificate.create({
      data: {
        id: certificateId,
        certificateId: certificateId,
        userId: testAttempt.userId,
        testAttemptId: testAttemptId,
        language: testAttempt.languageCode,
        languageName: languageName,
        cefrLevel: testAttempt.level, // Use 'level' field from the model
        score: testAttempt.score,
        totalQuestions: totalQuestions, // Use calculated total questions
        completionDate: testAttempt.completedAt,
        certificateUrl: `/certificates/${certificateId}`
      }
    });

    // Note: PDF file saving is disabled for browser compatibility
    // The certificate data is stored in the database and can be generated on-demand

    // Check for achievements
    await this.checkAndAwardAchievements(testAttempt.userId, certificate);

    return certificate;
  }

  static async getUserCertificates(userId: string): Promise<any[]> {
    const certificates = await prisma.certificate.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        certificateId: true,
        language: true,
        languageName: true,
        cefrLevel: true,
        score: true,
        totalQuestions: true,
        completionDate: true,
        certificateUrl: true,
        isPublic: true,
        sharedAt: true,
        createdAt: true
      }
    });

    // Get achievements for each certificate
    const certificatesWithAchievements = await Promise.all(
      certificates.map(async (cert) => {
        const achievements = await prisma.userAchievement.findMany({
          where: {
            userId: userId,
            certificateId: cert.id
          },
          select: {
            id: true,
            type: true,
            title: true,
            description: true,
            icon: true,
            color: true,
            createdAt: true
          }
        });

        return {
          ...cert,
          percentage: Math.round((cert.score / cert.totalQuestions) * 100),
          isExpired: false, // Certificates don't expire in this schema
          achievements: achievements
        };
      })
    );

    return certificatesWithAchievements;
  }

  static async getCertificateById(certificateId: string): Promise<any> {
    const certificate = await prisma.certificate.findUnique({
      where: { certificateId: certificateId },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        testAttempt: {
          select: {
            languageCode: true,
            level: true,
            score: true,
            completedAt: true
          }
        }
      }
    });

    if (!certificate) {
      return null;
    }

    return {
      ...certificate,
      percentage: Math.round((certificate.score / certificate.totalQuestions) * 100),
      isExpired: false, // Certificates don't expire in this schema
      isValid: true
    };
  }

  static async verifyCertificate(certificateId: string): Promise<any> {
    const certificate = await this.getCertificateById(certificateId);
    
    if (!certificate) {
      return {
        valid: false,
        reason: 'Certificate not found'
      };
    }

    if (!certificate.isActive) {
      return {
        valid: false,
        reason: 'Certificate has been revoked'
      };
    }

    if (new Date() > certificate.expiresAt) {
      return {
        valid: false,
        reason: 'Certificate has expired',
        expiredAt: certificate.expiresAt
      };
    }

    return {
      valid: true,
      certificate: {
        id: certificate.id,
        userName: certificate.user.name,
        languageCode: certificate.languageCode,
        cefrLevel: certificate.cefrLevel,
        score: certificate.score,
        totalQuestions: certificate.totalQuestions,
        percentage: certificate.percentage,
        issuedAt: certificate.issuedAt,
        expiresAt: certificate.expiresAt
      }
    };
  }

  static async getCertificateStats(): Promise<any> {
    const totalCertificates = await prisma.certificate.count();

    const certificatesByLanguage = await prisma.certificate.groupBy({
      by: ['language'],
      _count: {
        language: true
      }
    });

    const certificatesByLevel = await prisma.certificate.groupBy({
      by: ['cefrLevel'],
      _count: {
        cefrLevel: true
      }
    });

    return {
      total: totalCertificates,
      active: totalCertificates, // All certificates are active in this schema
      expired: 0, // Certificates don't expire in this schema
      byLanguage: certificatesByLanguage.map(item => ({
        language: item.language,
        count: item._count.language
      })),
      byLevel: certificatesByLevel.map(item => ({
        level: item.cefrLevel,
        count: item._count.cefrLevel
      }))
    };
  }

  static async getUserStats(userId: string): Promise<any> {
    const userCertificates = await prisma.certificate.findMany({
      where: { userId: userId }
    });

    const totalCertificates = userCertificates.length;
    const totalAchievements = await prisma.userAchievement.count({
      where: { userId: userId }
    });

    const averageScore = totalCertificates > 0 
      ? Math.round(userCertificates.reduce((sum, cert) => sum + (cert.score / cert.totalQuestions * 100), 0) / totalCertificates)
      : 0;

    const languagesTested = new Set(userCertificates.map(cert => cert.language)).size;

    const highestLevel = userCertificates.length > 0 
      ? userCertificates.reduce((highest, cert) => {
          const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
          const currentIndex = levels.indexOf(cert.cefrLevel);
          const highestIndex = levels.indexOf(highest);
          return currentIndex > highestIndex ? cert.cefrLevel : highest;
        }, 'A1')
      : 'A1';

    return {
      totalCertificates,
      totalAchievements,
      averageScore,
      languagesTested,
      highestLevel
    };
  }

  private static async checkAndAwardAchievements(userId: string, certificate: any): Promise<void> {
    // Get user's certificate history
    const userHistory = await prisma.certificate.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'asc' }
    });

    // Check each achievement criteria
    for (const criteria of this.ACHIEVEMENT_CRITERIA) {
      if (criteria.condition(certificate, userHistory)) {
        // Check if achievement already exists
        const existingAchievement = await prisma.userAchievement.findFirst({
          where: {
            userId: userId,
            type: criteria.type
          }
        });

        if (!existingAchievement) {
          // Award new achievement
          await prisma.userAchievement.create({
            data: {
              userId: userId,
              type: criteria.type,
              title: criteria.title,
              description: criteria.description,
              icon: criteria.icon,
              color: criteria.color,
              certificateId: certificate.id
            }
          });
        }
      }
    }
  }

  static async getUserAchievements(userId: string): Promise<any[]> {
    return await prisma.userAchievement.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' }
    });
  }
}
