import { prisma } from '@/lib/prisma';
import { FluentShipCertificateGeneratorSecure, CertificateData } from '@/lib/certificate-generator-secure';
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

    // Create certificate data
    const certificateData: CertificateData = {
      userName: testAttempt.user.name || 'Student',
      language: testAttempt.languageCode,
      languageName: languageName,
      cefrLevel: testAttempt.cefrLevel,
      score: testAttempt.score,
      totalQuestions: testAttempt.totalQuestions,
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
        userId: testAttempt.userId,
        testAttemptId: testAttemptId,
        languageCode: testAttempt.languageCode,
        cefrLevel: testAttempt.cefrLevel,
        score: testAttempt.score,
        totalQuestions: testAttempt.totalQuestions,
        certificateData: certificateData,
        pdfData: pdfBuffer,
        issuedAt: new Date(),
        expiresAt: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000), // 5 years
        isActive: true
      }
    });

    // Save PDF file to disk (optional)
    try {
      const uploadDir = join(process.cwd(), 'public', 'certificates');
      await mkdir(uploadDir, { recursive: true });
      
      const fileName = `${certificateId}.pdf`;
      const filePath = join(uploadDir, fileName);
      await writeFile(filePath, pdfBuffer);
      
      // Update certificate with file path
      await prisma.certificate.update({
        where: { id: certificateId },
        data: { filePath: `/certificates/${fileName}` }
      });
    } catch (error) {
      console.error('Error saving certificate file:', error);
      // Continue without file path - PDF is still stored in database
    }

    // Check for achievements
    await this.checkAndAwardAchievements(testAttempt.userId, certificate);

    return certificate;
  }

  static async getUserCertificates(userId: string): Promise<any[]> {
    const certificates = await prisma.certificate.findMany({
      where: {
        userId: userId,
        isActive: true
      },
      orderBy: {
        issuedAt: 'desc'
      },
      select: {
        id: true,
        languageCode: true,
        cefrLevel: true,
        score: true,
        totalQuestions: true,
        issuedAt: true,
        expiresAt: true,
        filePath: true,
        certificateData: true
      }
    });

    return certificates.map(cert => ({
      ...cert,
      percentage: Math.round((cert.score / cert.totalQuestions) * 100),
      isExpired: new Date() > cert.expiresAt
    }));
  }

  static async getCertificateById(certificateId: string): Promise<any> {
    const certificate = await prisma.certificate.findUnique({
      where: { id: certificateId },
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
            cefrLevel: true,
            score: true,
            totalQuestions: true,
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
      isExpired: new Date() > certificate.expiresAt,
      isValid: certificate.isActive && new Date() <= certificate.expiresAt
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
    const totalCertificates = await prisma.certificate.count({
      where: { isActive: true }
    });

    const activeCertificates = await prisma.certificate.count({
      where: {
        isActive: true,
        expiresAt: { gt: new Date() }
      }
    });

    const expiredCertificates = await prisma.certificate.count({
      where: {
        isActive: true,
        expiresAt: { lte: new Date() }
      }
    });

    const certificatesByLanguage = await prisma.certificate.groupBy({
      by: ['languageCode'],
      where: { isActive: true },
      _count: {
        languageCode: true
      }
    });

    const certificatesByLevel = await prisma.certificate.groupBy({
      by: ['cefrLevel'],
      where: { isActive: true },
      _count: {
        cefrLevel: true
      }
    });

    return {
      total: totalCertificates,
      active: activeCertificates,
      expired: expiredCertificates,
      byLanguage: certificatesByLanguage.map(item => ({
        language: item.languageCode,
        count: item._count.languageCode
      })),
      byLevel: certificatesByLevel.map(item => ({
        level: item.cefrLevel,
        count: item._count.cefrLevel
      }))
    };
  }

  private static async checkAndAwardAchievements(userId: string, certificate: any): Promise<void> {
    // Get user's certificate history
    const userHistory = await prisma.certificate.findMany({
      where: { userId: userId },
      orderBy: { issuedAt: 'asc' }
    });

    // Check each achievement criteria
    for (const criteria of this.ACHIEVEMENT_CRITERIA) {
      if (criteria.condition(certificate, userHistory)) {
        // Check if achievement already exists
        const existingAchievement = await prisma.achievement.findFirst({
          where: {
            userId: userId,
            type: criteria.type
          }
        });

        if (!existingAchievement) {
          // Award new achievement
          await prisma.achievement.create({
            data: {
              userId: userId,
              type: criteria.type,
              title: criteria.title,
              description: criteria.description,
              icon: criteria.icon,
              color: criteria.color,
              awardedAt: new Date(),
              certificateId: certificate.id
            }
          });
        }
      }
    }
  }

  static async getUserAchievements(userId: string): Promise<any[]> {
    return await prisma.achievement.findMany({
      where: { userId: userId },
      orderBy: { awardedAt: 'desc' }
    });
  }
}
