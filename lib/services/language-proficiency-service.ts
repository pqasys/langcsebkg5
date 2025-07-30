import { prisma } from '@/lib/prisma';

export interface TestQuestion {
  id: string;
  level: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface QuestionBankStats {
  totalQuestions: number;
  questionsByLevel: Record<string, number>;
  questionsByCategory: Record<string, number>;
  questionsByDifficulty: Record<string, number>;
}

export class LanguageProficiencyService {
  /**
   * Get questions from the database for a specific language
   */
  static async getQuestions(languageCode: string = 'en', filters?: {
    level?: string;
    category?: string;
    difficulty?: string;
    limit?: number;
  }): Promise<TestQuestion[]> {
    try {
      const where: any = {
        bank: {
          languageCode,
          isActive: true
        },
        isActive: true
      };

      if (filters?.level) where.level = filters.level;
      if (filters?.category) where.category = filters.category;
      if (filters?.difficulty) where.difficulty = filters.difficulty;

      const questions = await prisma.languageProficiencyQuestion.findMany({
        where,
        take: filters?.limit || 500,
        orderBy: {
          usageCount: 'asc' // Prioritize less used questions
        }
      });

      return questions.map(q => ({
        id: q.id,
        level: q.level,
        question: q.question,
        options: q.options as string[],
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || undefined,
        category: q.category,
        difficulty: q.difficulty as 'easy' | 'medium' | 'hard'
      }));
    } catch (error) {
      console.error('Error fetching questions from database:', error);
      // Fallback to static questions if database fails
      return this.getStaticQuestions(languageCode, filters);
    }
  }

  /**
   * Get a balanced set of questions for a test
   */
  static async getBalancedQuestionSet(
    languageCode: string = 'en',
    count: number = 80
  ): Promise<TestQuestion[]> {
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const questionsPerLevel = Math.floor(count / levels.length);
    const remainingQuestions = count % levels.length;

    let selectedQuestions: TestQuestion[] = [];

    for (let i = 0; i < levels.length; i++) {
      const level = levels[i];
      const questionsToSelect = questionsPerLevel + (i < remainingQuestions ? 1 : 0);
      
      const levelQuestions = await this.getQuestions(languageCode, {
        level,
        limit: questionsToSelect * 2 // Get more to shuffle from
      });

      // Shuffle and select
      const shuffled = this.shuffleArray(levelQuestions);
      selectedQuestions.push(...shuffled.slice(0, questionsToSelect));
    }

    // Shuffle the final selection
    return this.shuffleArray(selectedQuestions);
  }

  /**
   * Save a test attempt to the database
   */
  static async saveTestAttempt(data: {
    userId: string;
    languageCode: string;
    score: number;
    level: string;
    answers: Record<string, string>;
    timeSpent: number;
  }): Promise<void> {
    try {
      await prisma.languageProficiencyTestAttempt.create({
        data: {
          userId: data.userId,
          languageCode: data.languageCode,
          score: data.score,
          level: data.level,
          answers: data.answers,
          timeSpent: data.timeSpent
        }
      });

      // Update question usage statistics
      await this.updateQuestionStats(data.answers);
    } catch (error) {
      console.error('Error saving test attempt:', error);
    }
  }

  /**
   * Update question usage statistics
   */
  private static async updateQuestionStats(answers: Record<string, string>): Promise<void> {
    try {
      for (const [questionId, answer] of Object.entries(answers)) {
        const question = await prisma.languageProficiencyQuestion.findUnique({
          where: { id: questionId }
        });

        if (question) {
          const isCorrect = answer === question.correctAnswer;
          const newUsageCount = question.usageCount + 1;
          const newSuccessRate = ((question.successRate * question.usageCount) + (isCorrect ? 1 : 0)) / newUsageCount;

          await prisma.languageProficiencyQuestion.update({
            where: { id: questionId },
            data: {
              usageCount: newUsageCount,
              successRate: newSuccessRate
            }
          });
        }
      }
    } catch (error) {
      console.error('Error updating question stats:', error);
    }
  }

  /**
   * Get question bank statistics
   */
  static async getQuestionBankStats(languageCode: string = 'en'): Promise<QuestionBankStats> {
    try {
      const questions = await this.getQuestions(languageCode);
      
      const stats: QuestionBankStats = {
        totalQuestions: questions.length,
        questionsByLevel: {},
        questionsByCategory: {},
        questionsByDifficulty: {}
      };

      questions.forEach(q => {
        stats.questionsByLevel[q.level] = (stats.questionsByLevel[q.level] || 0) + 1;
        if (q.category) {
          stats.questionsByCategory[q.category] = (stats.questionsByCategory[q.category] || 0) + 1;
        }
        if (q.difficulty) {
          stats.questionsByDifficulty[q.difficulty] = (stats.questionsByDifficulty[q.difficulty] || 0) + 1;
        }
      });

      return stats;
    } catch (error) {
      console.error('Error getting question bank stats:', error);
      return {
        totalQuestions: 0,
        questionsByLevel: {},
        questionsByCategory: {},
        questionsByDifficulty: {}
      };
    }
  }

  /**
   * Initialize the question bank with static questions
   */
  static async initializeQuestionBank(languageCode: string = 'en'): Promise<void> {
    try {
      // Check if bank already exists
      const existingBank = await prisma.languageProficiencyQuestionBank.findUnique({
        where: { languageCode }
      });

      if (existingBank) {
        console.log(`Question bank for ${languageCode} already exists`);
        return;
      }

      // Create the question bank
      const bank = await prisma.languageProficiencyQuestionBank.create({
        data: {
          languageCode,
          name: `${languageCode.toUpperCase()} Language Proficiency Test`,
          description: `Comprehensive ${languageCode.toUpperCase()} proficiency test with questions covering all CEFR levels`,
          totalQuestions: 0
        }
      });

      // Import static questions
      const staticQuestions = this.getStaticQuestions(languageCode);
      
      for (const question of staticQuestions) {
        await prisma.languageProficiencyQuestion.create({
          data: {
            bankId: bank.id,
            level: question.level,
            category: question.category || 'grammar',
            difficulty: question.difficulty || 'medium',
            question: question.question,
            options: question.options,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation
          }
        });
      }

      // Update total questions count
      await prisma.languageProficiencyQuestionBank.update({
        where: { id: bank.id },
        data: { totalQuestions: staticQuestions.length }
      });

      console.log(`Initialized question bank for ${languageCode} with ${staticQuestions.length} questions`);
    } catch (error) {
      console.error('Error initializing question bank:', error);
    }
  }

  /**
   * Fallback to static questions if database is not available
   */
  private static getStaticQuestions(languageCode: string, filters?: any): TestQuestion[] {
    // Import static questions based on language
    if (languageCode === 'en') {
      const { ENGLISH_PROFICIENCY_QUESTIONS } = require('@/lib/data/english-proficiency-questions');
      let questions = ENGLISH_PROFICIENCY_QUESTIONS;

      if (filters?.level) {
        questions = questions.filter(q => q.level === filters.level);
      }
      if (filters?.category) {
        questions = questions.filter(q => q.category === filters.category);
      }
      if (filters?.difficulty) {
        questions = questions.filter(q => q.difficulty === filters.difficulty);
      }

      return questions.slice(0, filters?.limit || questions.length);
    }

    if (languageCode === 'fr') {
      const { FRENCH_PROFICIENCY_QUESTIONS } = require('@/lib/data/french-proficiency-questions');
      let questions = FRENCH_PROFICIENCY_QUESTIONS;

      if (filters?.level) {
        questions = questions.filter(q => q.level === filters.level);
      }
      if (filters?.category) {
        questions = questions.filter(q => q.category === filters.category);
      }
      if (filters?.difficulty) {
        questions = questions.filter(q => q.difficulty === filters.difficulty);
      }

      return questions.slice(0, filters?.limit || questions.length);
    }

    // Return empty array for other languages (to be implemented)
    return [];
  }

  /**
   * Utility function to shuffle an array
   */
  private static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
} 