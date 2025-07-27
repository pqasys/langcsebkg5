import { prisma } from '../lib/prisma';
import slugify from 'slugify';
import { logger } from '../lib/logger';

async function createLanguageTags() {
  try {
    // Create "Language Learning" tag
    const languageLearningTag = await prisma.tag.create({
      data: {
        id: crypto.randomUUID(),
        name: 'Language Learning',
        description: 'Courses focused on language acquisition and proficiency',
        color: '#4F46E5', // Indigo color
        icon: 'Languages',
        featured: true,
        priority: 1,
        slug: slugify('Language Learning', { lower: true, strict: true }),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    // Create "Conversational Practice" tag
    const conversationalPracticeTag = await prisma.tag.create({
      data: {
        id: crypto.randomUUID(),
        name: 'Conversational Practice',
        description: 'Courses emphasizing practical speaking and communication skills',
        color: '#10B981', // Emerald color
        icon: 'MessageSquare',
        featured: true,
        priority: 2,
        slug: slugify('Conversational Practice', { lower: true, strict: true }),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    console.log('Created tags:', {
      languageLearning: languageLearningTag,
      conversationalPractice: conversationalPracticeTag
    });
  } catch (error) {
    logger.error('Error creating tags:');
  } finally {
    await prisma.$disconnect();
  }
}

createLanguageTags(); 