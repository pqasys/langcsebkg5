import { prisma } from './prisma';
import { logger } from './logger';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: 'MONTHLY' | 'ANNUAL';
  features: string[];
  maxStudents?: number;
  maxCourses?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class SubscriptionPlanManager {
  /**
   * Get all active subscription plans
   */
  static async getActivePlans(): Promise<SubscriptionPlan[]> {
    try {
      const plans = await prisma.institutionSubscription.findMany({
        where: { isActive: true },
        orderBy: { price: 'asc' }
      });

      return plans.map(plan => ({
        id: plan.id,
        name: plan.name,
        description: plan.description || '',
        price: plan.price,
        currency: plan.currency,
        billingCycle: plan.billingCycle as 'MONTHLY' | 'ANNUAL',
        features: plan.features as string[] || [],
        maxStudents: plan.maxStudents,
        maxCourses: plan.maxCourses,
        isActive: plan.isActive,
        createdAt: plan.createdAt,
        updatedAt: plan.updatedAt
      }));
    } catch (error) {
      logger.error('Error fetching active subscription plans:', error);
      return [];
    }
  }

  /**
   * Get a specific subscription plan by ID
   */
  static async getPlanById(id: string): Promise<SubscriptionPlan | null> {
    try {
      const plan = await prisma.institutionSubscription.findUnique({
        where: { id }
      });

      if (!plan) return null;

      return {
        id: plan.id,
        name: plan.name,
        description: plan.description || '',
        price: plan.price,
        currency: plan.currency,
        billingCycle: plan.billingCycle as 'MONTHLY' | 'ANNUAL',
        features: plan.features as string[] || [],
        maxStudents: plan.maxStudents,
        maxCourses: plan.maxCourses,
        isActive: plan.isActive,
        createdAt: plan.createdAt,
        updatedAt: plan.updatedAt
      };
    } catch (error) {
      logger.error('Error fetching subscription plan by ID:', error);
      return null;
    }
  }

  /**
   * Create a new subscription plan
   */
  static async createPlan(planData: Omit<SubscriptionPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<SubscriptionPlan | null> {
    try {
      const plan = await prisma.institutionSubscription.create({
        data: {
          name: planData.name,
          description: planData.description,
          price: planData.price,
          currency: planData.currency,
          billingCycle: planData.billingCycle,
          features: planData.features,
          maxStudents: planData.maxStudents,
          maxCourses: planData.maxCourses,
          isActive: planData.isActive
        }
      });

      return {
        id: plan.id,
        name: plan.name,
        description: plan.description || '',
        price: plan.price,
        currency: plan.currency,
        billingCycle: plan.billingCycle as 'MONTHLY' | 'ANNUAL',
        features: plan.features as string[] || [],
        maxStudents: plan.maxStudents,
        maxCourses: plan.maxCourses,
        isActive: plan.isActive,
        createdAt: plan.createdAt,
        updatedAt: plan.updatedAt
      };
    } catch (error) {
      logger.error('Error creating subscription plan:', error);
      return null;
    }
  }

  /**
   * Update an existing subscription plan
   */
  static async updatePlan(id: string, planData: Partial<SubscriptionPlan>): Promise<SubscriptionPlan | null> {
    try {
      const plan = await prisma.institutionSubscription.update({
        where: { id },
        data: {
          name: planData.name,
          description: planData.description,
          price: planData.price,
          currency: planData.currency,
          billingCycle: planData.billingCycle,
          features: planData.features,
          maxStudents: planData.maxStudents,
          maxCourses: planData.maxCourses,
          isActive: planData.isActive
        }
      });

      return {
        id: plan.id,
        name: plan.name,
        description: plan.description || '',
        price: plan.price,
        currency: plan.currency,
        billingCycle: plan.billingCycle as 'MONTHLY' | 'ANNUAL',
        features: plan.features as string[] || [],
        maxStudents: plan.maxStudents,
        maxCourses: plan.maxCourses,
        isActive: plan.isActive,
        createdAt: plan.createdAt,
        updatedAt: plan.updatedAt
      };
    } catch (error) {
      logger.error('Error updating subscription plan:', error);
      return null;
    }
  }

  /**
   * Delete a subscription plan
   */
  static async deletePlan(id: string): Promise<boolean> {
    try {
      await prisma.institutionSubscription.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      logger.error('Error deleting subscription plan:', error);
      return false;
    }
  }
} 