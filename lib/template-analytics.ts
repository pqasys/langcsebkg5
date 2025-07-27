import { prisma } from '@/lib/prisma';

export interface TemplateUsageData {
  templateId: string;
  usedBy: string;
  institutionId?: string;
  usageContext: 'quiz' | 'question_bank' | 'assessment';
  targetQuizId?: string;
  targetQuestionBankId?: string;
  customizationLevel: 'none' | 'minor' | 'major';
  successRate?: number;
}

export interface TemplateVersionData {
  templateId: string;
  versionNumber: number;
  name: string;
  description?: string;
  templateConfig: any;
  category?: string;
  difficulty: string;
  tags?: any;
  changeLog?: string;
  createdBy: string;
}

export interface TemplateSuggestionData {
  templateId: string;
  suggestionType: 'improvement' | 'optimization' | 'popularity';
  title: string;
  description: string;
  suggestedChanges?: any;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  confidenceScore: number;
  basedOnUsage: boolean;
  basedOnPerformance: boolean;
  basedOnFeedback: boolean;
}

export class TemplateAnalyticsService {
  /**
   * Track template usage
   */
  static async trackUsage(data: TemplateUsageData) {
    try {
      const usage = await prisma.questionTemplateUsage.create({
        data: {
          template_id: data.templateId,
          used_by: data.usedBy,
          institution_id: data.institutionId,
          usage_context: data.usageContext,
          target_quiz_id: data.targetQuizId,
          target_question_bank_id: data.targetQuestionBankId,
          customization_level: data.customizationLevel,
          success_rate: data.successRate,
        },
      });

      // Update template usage count
      await prisma.questionTemplate.update({
        where: { id: data.templateId },
        data: {
          // Note: We'll add a usage_count field to QuestionTemplate if needed
        },
      });

      return usage;
    } catch (error) {
      console.error('Error tracking template usage:', error);
      throw error;
    }
  }

  /**
   * Create a new version of a template
   */
  static async createVersion(data: TemplateVersionData) {
    try {
      // Create version record
      const version = await prisma.questionTemplateVersion.create({
        data: {
          template_id: data.templateId,
          version_number: data.versionNumber,
          name: data.name,
          description: data.description,
          template_config: data.templateConfig,
          category: data.category,
          difficulty: data.difficulty,
          tags: data.tags,
          change_log: data.changeLog,
          created_by: data.createdBy,
        },
      });

      // Update template version number
      await prisma.questionTemplate.update({
        where: { id: data.templateId },
        data: {
          version: data.versionNumber,
          name: data.name,
          description: data.description,
          template_config: data.templateConfig,
          category: data.category,
          difficulty: data.difficulty,
          tags: data.tags,
        },
      });

      return version;
    } catch (error) {
      console.error('Error creating template version:', error);
      throw error;
    }
  }

  /**
   * Get template analytics
   */
  static async getTemplateAnalytics(templateId: string) {
    try {
      const [usageStats, versions, suggestions] = await Promise.all([
        // Usage statistics
        prisma.questionTemplateUsage.groupBy({
          by: ['usage_context', 'customization_level'],
          where: { template_id: templateId },
          _count: {
            id: true,
          },
          _avg: {
            success_rate: true,
          },
        }),

        // Version history
        prisma.questionTemplateVersion.findMany({
          where: { template_id: templateId },
          orderBy: { version_number: 'desc' },
          include: {
            createdByUser: {
              select: { name: true, email: true },
            },
          },
        }),

        // Suggestions
        prisma.questionTemplateSuggestion.findMany({
          where: { template_id: templateId },
          orderBy: [
            { priority: 'desc' },
            { confidence_score: 'desc' },
            { created_at: 'desc' },
          ],
          include: {
            reviewedByUser: {
              select: { name: true, email: true },
            },
          },
        }),
      ]);

      // Calculate overall usage metrics
      const totalUsage = await prisma.questionTemplateUsage.count({
        where: { template_id: templateId },
      });

      const averageSuccessRate = await prisma.questionTemplateUsage.aggregate({
        where: { template_id: templateId },
        _avg: { success_rate: true },
      });

      const recentUsage = await prisma.questionTemplateUsage.findMany({
        where: { template_id: templateId },
        orderBy: { created_at: 'desc' },
        take: 10,
        include: {
          usedByUser: {
            select: { name: true, email: true },
          },
          institution: {
            select: { name: true },
          },
        },
      });

      return {
        totalUsage,
        averageSuccessRate: averageSuccessRate._avg.success_rate || 0,
        usageStats,
        versions,
        suggestions,
        recentUsage,
      };
    } catch (error) {
      console.error('Error getting template analytics:', error);
      throw error;
    }
  }

  /**
   * Generate template suggestions based on usage patterns
   */
  static async generateSuggestions(templateId: string) {
    try {
      const template = await prisma.questionTemplate.findUnique({
        where: { id: templateId },
        include: {
          templateUsage: {
            orderBy: { created_at: 'desc' },
            take: 100,
          },
        },
      });

      if (!template) {
        throw new Error('Template not found');
      }

      const suggestions: TemplateSuggestionData[] = [];

      // Analyze usage patterns
      const usageCount = template.templateUsage.length;
      const customizationLevels = template.templateUsage.map(u => u.customization_level);
      const successRates = template.templateUsage
        .map(u => u.success_rate)
        .filter(rate => rate !== null) as number[];

      // Suggestion 1: Popularity-based
      if (usageCount > 10) {
        suggestions.push({
          templateId,
          suggestionType: 'popularity',
          title: 'High Usage Template',
          description: `This template has been used ${usageCount} times, indicating high popularity. Consider making it public to benefit more institutions.`,
          priority: 'MEDIUM',
          confidenceScore: Math.min(usageCount / 20, 1.0),
          basedOnUsage: true,
          basedOnPerformance: false,
          basedOnFeedback: false,
        });
      }

      // Suggestion 2: Performance-based
      if (successRates.length > 5) {
        const avgSuccessRate = successRates.reduce((a, b) => a + b, 0) / successRates.length;
        
        if (avgSuccessRate < 0.6) {
          suggestions.push({
            templateId,
            suggestionType: 'improvement',
            title: 'Low Success Rate Detected',
            description: `Average success rate is ${(avgSuccessRate * 100).toFixed(1)}%. Consider simplifying the question or adjusting difficulty.`,
            priority: 'HIGH',
            confidenceScore: 1 - avgSuccessRate,
            basedOnUsage: false,
            basedOnPerformance: true,
            basedOnFeedback: false,
            suggestedChanges: {
              difficulty: 'Consider reducing difficulty level',
              explanation: 'Add more detailed explanations',
            },
          });
        } else if (avgSuccessRate > 0.9) {
          suggestions.push({
            templateId,
            suggestionType: 'optimization',
            title: 'Very High Success Rate',
            description: `Average success rate is ${(avgSuccessRate * 100).toFixed(1)}%. Consider increasing difficulty to challenge students more.`,
            priority: 'LOW',
            confidenceScore: avgSuccessRate - 0.5,
            basedOnUsage: false,
            basedOnPerformance: true,
            basedOnFeedback: false,
            suggestedChanges: {
              difficulty: 'Consider increasing difficulty level',
              points: 'Increase point value for higher stakes',
            },
          });
        }
      }

      // Suggestion 3: Customization-based
      const majorCustomizations = customizationLevels.filter(level => level === 'major').length;
      const customizationRatio = majorCustomizations / usageCount;

      if (customizationRatio > 0.7) {
        suggestions.push({
          templateId,
          suggestionType: 'improvement',
          title: 'High Customization Rate',
          description: `${(customizationRatio * 100).toFixed(1)}% of users make major customizations. Consider making the template more flexible or creating variants.`,
          priority: 'MEDIUM',
          confidenceScore: customizationRatio,
          basedOnUsage: true,
          basedOnPerformance: false,
          basedOnFeedback: false,
          suggestedChanges: {
            template_config: 'Add more configurable options',
            variants: 'Consider creating template variants',
          },
        });
      }

      // Save suggestions to database
      for (const suggestion of suggestions) {
        await prisma.questionTemplateSuggestion.create({
          data: {
            template_id: suggestion.templateId,
            suggestion_type: suggestion.suggestionType,
            title: suggestion.title,
            description: suggestion.description,
            suggested_changes: suggestion.suggestedChanges,
            priority: suggestion.priority,
            confidence_score: suggestion.confidenceScore,
            based_on_usage: suggestion.basedOnUsage,
            based_on_performance: suggestion.basedOnPerformance,
            based_on_feedback: suggestion.basedOnFeedback,
          },
        });
      }

      return suggestions;
    } catch (error) {
      console.error('Error generating template suggestions:', error);
      throw error;
    }
  }

  /**
   * Get template usage trends
   */
  static async getUsageTrends(templateId: string, days: number = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const usage = await prisma.questionTemplateUsage.findMany({
        where: {
          template_id: templateId,
          created_at: {
            gte: startDate,
          },
        },
        orderBy: { created_at: 'asc' },
      });

      // Group by date
      const dailyUsage = usage.reduce((acc, usage) => {
        const date = usage.created_at.toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        dailyUsage,
        totalUsage: usage.length,
        averageDailyUsage: usage.length / days,
      };
    } catch (error) {
      console.error('Error getting usage trends:', error);
      throw error;
    }
  }
} 