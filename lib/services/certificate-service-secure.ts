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

    // Generate certificate data for storage and email distribution
    let certificateBuffer;
    try {
      certificateBuffer = await FluentShipCertificateGeneratorSecure.generateEmailCertificate(certificateData);
    } catch (error) {
      console.error('Error generating certificate:', error);
      // Continue without certificate buffer - certificate can still be created
      certificateBuffer = null;
    }

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
         // certificateData: certificateBuffer ? certificateBuffer.toString('base64') : null // Temporarily disabled
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

  static async getCertificateById(certificateId: string, includeData: boolean = false): Promise<any> {
    const certificate = await prisma.certificate.findUnique({
      where: { certificateId: certificateId },
      include: includeData ? undefined : {
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
      },
             select: includeData ? {
         id: true,
         certificateId: true,
         userId: true,
         testAttemptId: true,
         language: true,
         languageName: true,
         cefrLevel: true,
         score: true,
         totalQuestions: true,
         completionDate: true,
         certificateUrl: true,
         // certificateData: true, // Temporarily commented out until database field is properly added
         isPublic: true,
         sharedAt: true,
         createdAt: true,
         updatedAt: true,
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
       } : undefined
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

  static async getCertificateStats(userId: string) {
    const certificates = await this.getUserCertificates(userId);
    
    if (certificates.length === 0) {
      return {
        totalCertificates: 0,
        totalAchievements: 0,
        averageScore: 0,
        languagesTested: 0,
        highestLevel: 'A1'
      };
    }

    const totalCertificates = certificates.length;
    const totalAchievements = certificates.reduce((sum, cert) => sum + (cert.achievements?.length || 0), 0);
    const averageScore = Math.round(
      certificates.reduce((sum, cert) => sum + (cert.score / cert.totalQuestions * 100), 0) / totalCertificates
    );
    const languagesTested = new Set(certificates.map(cert => cert.language)).size;
    const highestLevel = this.getHighestCEFRLevel(certificates.map(cert => cert.cefrLevel));

    return {
      totalCertificates,
      totalAchievements,
      averageScore,
      languagesTested,
      highestLevel
    };
  }

  static async getPublicCertificates() {
    const certificates = await prisma.certificate.findMany({
      where: {
        isPublic: true
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        achievements: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20 // Limit to 20 most recent public certificates
    });

    return certificates;
  }

  static async getPublicCertificateStats() {
    const publicCertificates = await prisma.certificate.findMany({
      where: {
        isPublic: true
      },
      include: {
        achievements: true
      }
    });

    if (publicCertificates.length === 0) {
      return {
        totalCertificates: 0,
        totalAchievements: 0,
        averageScore: 0,
        languagesTested: 0,
        highestLevel: 'A1'
      };
    }

    const totalCertificates = publicCertificates.length;
    const totalAchievements = publicCertificates.reduce((sum, cert) => sum + (cert.achievements?.length || 0), 0);
    const averageScore = Math.round(
      publicCertificates.reduce((sum, cert) => sum + (cert.score / cert.totalQuestions * 100), 0) / totalCertificates
    );
    const languagesTested = new Set(publicCertificates.map(cert => cert.language)).size;
    const highestLevel = this.getHighestCEFRLevel(publicCertificates.map(cert => cert.cefrLevel));

    return {
      totalCertificates,
      totalAchievements,
      averageScore,
      languagesTested,
      highestLevel
    };
  }

  private static getHighestCEFRLevel(levels: string[]): string {
    const levelsOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    return levels.reduce((highest, current) => {
      const currentIndex = levelsOrder.indexOf(current);
      const highestIndex = levelsOrder.indexOf(highest);
      return currentIndex > highestIndex ? current : highest;
    }, 'A1');
  }
}
