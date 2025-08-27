import { prisma } from './prisma';
import { logger } from './logger';
import { LanguageThresholdCache } from './cache-service';

export interface LanguageThresholdConfig {
  language: string;
  country?: string;
  region?: string;
  minAttendanceThreshold: number;
  profitMarginThreshold: number;
  instructorHourlyRate: number;
  platformRevenuePerStudent: number;
  autoCancelIfBelowThreshold: boolean;
  cancellationDeadlineHours: number;
  isActive: boolean;
  priority: number;
  notes?: string;
}

export interface ThresholdMatchResult {
  config: LanguageThresholdConfig;
  matchScore: number;
  matchedBy: 'exact' | 'language_country' | 'language_region' | 'language_only' | 'default';
}

export class LanguageAttendanceThresholdService {
  /**
   * Get the best matching threshold configuration for a language/country/region
   */
  static async getThresholdConfig(
    language: string,
    country?: string,
    region?: string
  ): Promise<LanguageThresholdConfig | null> {
    try {
      // Check cache first
      const cachedConfig = LanguageThresholdCache.getThresholdConfig(language, country, region);
      if (cachedConfig) {
        logger.debug(`Cache hit for threshold config: ${language}:${country || 'null'}:${region || 'null'}`);
        return cachedConfig;
      }

      // Find all active configurations that could match
      const possibleConfigs = await prisma.languageAttendanceThreshold.findMany({
        where: {
          isActive: true,
          OR: [
            // Exact match
            {
              language,
              country: country || null,
              region: region || null
            },
            // Language + country match
            {
              language,
              country: country || null,
              region: null
            },
            // Language + region match
            {
              language,
              country: null,
              region: region || null
            },
            // Language only match
            {
              language,
              country: null,
              region: null
            }
          ]
        },
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' }
        ]
      });

      if (possibleConfigs.length === 0) {
        return null;
      }

      // Score each configuration based on specificity
      const scoredConfigs: ThresholdMatchResult[] = possibleConfigs.map(config => {
        let matchScore = 0;
        let matchedBy: ThresholdMatchResult['matchedBy'] = 'default';

        if (config.language === language) {
          matchScore += 10;
          
          if (config.country === country && config.region === region) {
            matchScore += 30;
            matchedBy = 'exact';
          } else if (config.country === country && !config.region) {
            matchScore += 20;
            matchedBy = 'language_country';
          } else if (config.region === region && !config.country) {
            matchScore += 15;
            matchedBy = 'language_region';
          } else if (!config.country && !config.region) {
            matchScore += 5;
            matchedBy = 'language_only';
          }
        }

        // Add priority bonus
        matchScore += config.priority;

        return {
          config: {
            language: config.language,
            country: config.country || undefined,
            region: config.region || undefined,
            minAttendanceThreshold: config.minAttendanceThreshold,
            profitMarginThreshold: config.profitMarginThreshold,
            instructorHourlyRate: config.instructorHourlyRate,
            platformRevenuePerStudent: config.platformRevenuePerStudent,
            autoCancelIfBelowThreshold: config.autoCancelIfBelowThreshold,
            cancellationDeadlineHours: config.cancellationDeadlineHours,
            isActive: config.isActive,
            priority: config.priority,
            notes: config.notes || undefined
          },
          matchScore,
          matchedBy
        };
      });

      // Return the highest scoring configuration
      const bestMatch = scoredConfigs.reduce((best, current) => 
        current.matchScore > best.matchScore ? current : best
      );

      logger.info(`Found threshold config for ${language}/${country}/${region}:`, {
        matchedBy: bestMatch.matchedBy,
        matchScore: bestMatch.matchScore,
        config: bestMatch.config
      });

      // Cache the result
      LanguageThresholdCache.setThresholdConfig(language, country, region, bestMatch.config);

      return bestMatch.config;
    } catch (error) {
      logger.error('Error getting threshold config:', error);
      return null;
    }
  }

  /**
   * Create a new language-specific threshold configuration
   */
  static async createThresholdConfig(
    config: Omit<LanguageThresholdConfig, 'isActive'> & { isActive?: boolean },
    adminUserId: string
  ): Promise<LanguageAttendanceThreshold> {
    try {
      // Validate that the combination is unique
      const existing = await prisma.languageAttendanceThreshold.findUnique({
        where: {
          language_country_region: {
            language: config.language,
            country: config.country || null,
            region: config.region || null
          }
        }
      });

      if (existing) {
        throw new Error(`Threshold configuration already exists for ${config.language}/${config.country}/${config.region}`);
      }

      const newConfig = await prisma.languageAttendanceThreshold.create({
        data: {
          language: config.language,
          country: config.country || null,
          region: config.region || null,
          minAttendanceThreshold: config.minAttendanceThreshold,
          profitMarginThreshold: config.profitMarginThreshold,
          instructorHourlyRate: config.instructorHourlyRate,
          platformRevenuePerStudent: config.platformRevenuePerStudent,
          autoCancelIfBelowThreshold: config.autoCancelIfBelowThreshold,
          cancellationDeadlineHours: config.cancellationDeadlineHours,
          isActive: config.isActive ?? true,
          priority: config.priority,
          notes: config.notes,
          createdBy: adminUserId,
          updatedBy: adminUserId
        }
      });

      logger.info(`Created language threshold config:`, {
        id: newConfig.id,
        language: newConfig.language,
        country: newConfig.country,
        region: newConfig.region
      });

      // Invalidate cache for this language combination
      LanguageThresholdCache.invalidateThresholdConfigs();

      return newConfig;
    } catch (error) {
      logger.error('Error creating threshold config:', error);
      throw error;
    }
  }

  /**
   * Update an existing language-specific threshold configuration
   */
  static async updateThresholdConfig(
    id: string,
    updates: Partial<LanguageThresholdConfig>,
    adminUserId: string
  ): Promise<LanguageAttendanceThreshold> {
    try {
      const updatedConfig = await prisma.languageAttendanceThreshold.update({
        where: { id },
        data: {
          ...updates,
          updatedBy: adminUserId,
          updatedAt: new Date()
        }
      });

      logger.info(`Updated language threshold config:`, {
        id: updatedConfig.id,
        language: updatedConfig.language,
        country: updatedConfig.country,
        region: updatedConfig.region
      });

      // Invalidate cache for this language combination
      LanguageThresholdCache.invalidateThresholdConfigs();

      return updatedConfig;
    } catch (error) {
      logger.error('Error updating threshold config:', error);
      throw error;
    }
  }

  /**
   * Delete a language-specific threshold configuration
   */
  static async deleteThresholdConfig(id: string): Promise<void> {
    try {
      await prisma.languageAttendanceThreshold.delete({
        where: { id }
      });

      logger.info(`Deleted language threshold config: ${id}`);

      // Invalidate cache for this language combination
      LanguageThresholdCache.invalidateThresholdConfigs();
    } catch (error) {
      logger.error('Error deleting threshold config:', error);
      throw error;
    }
  }

  /**
   * Get all language-specific threshold configurations
   */
  static async getAllThresholdConfigs(): Promise<LanguageAttendanceThreshold[]> {
    try {
      return await prisma.languageAttendanceThreshold.findMany({
        orderBy: [
          { language: 'asc' },
          { country: 'asc' },
          { region: 'asc' },
          { priority: 'desc' }
        ],
        include: {
          createdByUser: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          updatedByUser: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });
    } catch (error) {
      logger.error('Error getting all threshold configs:', error);
      throw error;
    }
  }

  /**
   * Get threshold configurations for a specific language
   */
  static async getThresholdConfigsByLanguage(language: string): Promise<LanguageAttendanceThreshold[]> {
    try {
      return await prisma.languageAttendanceThreshold.findMany({
        where: { language },
        orderBy: [
          { priority: 'desc' },
          { country: 'asc' },
          { region: 'asc' }
        ],
        include: {
          createdByUser: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          updatedByUser: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });
    } catch (error) {
      logger.error('Error getting threshold configs by language:', error);
      throw error;
    }
  }

  /**
   * Get available languages with threshold configurations
   */
  static async getAvailableLanguages(): Promise<string[]> {
    try {
      // Check cache first
      const cachedLanguages = LanguageThresholdCache.getMetadata('languages');
      if (cachedLanguages) {
        return cachedLanguages;
      }

      const languages = await prisma.languageAttendanceThreshold.findMany({
        where: { isActive: true },
        select: { language: true },
        distinct: ['language']
      });

      const result = languages.map(l => l.language).sort();
      
      // Cache the result
      LanguageThresholdCache.setMetadata('languages', result);
      
      return result;
    } catch (error) {
      logger.error('Error getting available languages:', error);
      throw error;
    }
  }

  /**
   * Get available countries for a specific language
   */
  static async getAvailableCountries(language: string): Promise<string[]> {
    try {
      // Check cache first
      const cachedCountries = LanguageThresholdCache.getMetadata('countries', language);
      if (cachedCountries) {
        return cachedCountries;
      }

      const countries = await prisma.languageAttendanceThreshold.findMany({
        where: { 
          language,
          isActive: true,
          country: { not: null }
        },
        select: { country: true },
        distinct: ['country']
      });

      const result = countries.map(c => c.country!).sort();
      
      // Cache the result
      LanguageThresholdCache.setMetadata('countries', result, language);
      
      return result;
    } catch (error) {
      logger.error('Error getting available countries:', error);
      throw error;
    }
  }

  /**
   * Get available regions for a specific language
   */
  static async getAvailableRegions(language: string): Promise<string[]> {
    try {
      // Check cache first
      const cachedRegions = LanguageThresholdCache.getMetadata('regions', language);
      if (cachedRegions) {
        return cachedRegions;
      }

      const regions = await prisma.languageAttendanceThreshold.findMany({
        where: { 
          language,
          isActive: true,
          region: { not: null }
        },
        select: { region: true },
        distinct: ['region']
      });

      const result = regions.map(r => r.region!).sort();
      
      // Cache the result
      LanguageThresholdCache.setMetadata('regions', result, language);
      
      return result;
    } catch (error) {
      logger.error('Error getting available regions:', error);
      throw error;
    }
  }

  /**
   * Bulk update threshold configurations
   */
  static async bulkUpdateThresholdConfigs(
    updates: Array<{
      id: string;
      updates: Partial<LanguageThresholdConfig>;
    }>,
    adminUserId: string
  ): Promise<LanguageAttendanceThreshold[]> {
    try {
      const results = await Promise.all(
        updates.map(({ id, updates }) =>
          this.updateThresholdConfig(id, updates, adminUserId)
        )
      );

      logger.info(`Bulk updated ${results.length} threshold configs`);
      return results;
    } catch (error) {
      logger.error('Error bulk updating threshold configs:', error);
      throw error;
    }
  }

  /**
   * Import threshold configurations from CSV or JSON
   */
  static async importThresholdConfigs(
    configs: Array<Omit<LanguageThresholdConfig, 'isActive'> & { isActive?: boolean }>,
    adminUserId: string
  ): Promise<{
    created: number;
    updated: number;
    errors: Array<{ config: any; error: string }>;
  }> {
    const result = {
      created: 0,
      updated: 0,
      errors: [] as Array<{ config: any; error: string }>
    };

    for (const config of configs) {
      try {
        // Check if config already exists
        const existing = await prisma.languageAttendanceThreshold.findUnique({
          where: {
            language_country_region: {
              language: config.language,
              country: config.country || null,
              region: config.region || null
            }
          }
        });

        if (existing) {
          // Update existing
          await this.updateThresholdConfig(existing.id, config, adminUserId);
          result.updated++;
        } else {
          // Create new
          await this.createThresholdConfig(config, adminUserId);
          result.created++;
        }
      } catch (error) {
        result.errors.push({
          config,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    logger.info(`Import completed: ${result.created} created, ${result.updated} updated, ${result.errors.length} errors`);
    return result;
  }
}
