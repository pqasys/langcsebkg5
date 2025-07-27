import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting to add language-related tags...');

    const tagData = [
      // Language Proficiency Levels
      {
        name: 'CEFR A1',
        description: 'Beginner level language courses',
        color: '#4CAF50',
        icon: 'graduation-cap',
        featured: true,
        priority: 10
      },
      {
        name: 'CEFR A2',
        description: 'Elementary level language courses',
        color: '#8BC34A',
        icon: 'graduation-cap',
        featured: true,
        priority: 9
      },
      {
        name: 'CEFR B1',
        description: 'Intermediate level language courses',
        color: '#FFC107',
        icon: 'graduation-cap',
        featured: true,
        priority: 8
      },
      {
        name: 'CEFR B2',
        description: 'Upper-intermediate level language courses',
        color: '#FF9800',
        icon: 'graduation-cap',
        featured: true,
        priority: 7
      },
      {
        name: 'CEFR C1',
        description: 'Advanced level language courses',
        color: '#FF5722',
        icon: 'graduation-cap',
        featured: true,
        priority: 6
      },
      {
        name: 'CEFR C2',
        description: 'Mastery level language courses',
        color: '#F44336',
        icon: 'graduation-cap',
        featured: true,
        priority: 5
      },

      // Language Skills
      {
        name: 'Speaking Practice',
        description: 'Courses focusing on oral communication skills',
        color: '#2196F3',
        icon: 'mic',
        featured: true,
        priority: 8
      },
      {
        name: 'Writing Skills',
        description: 'Courses focusing on written communication',
        color: '#3F51B5',
        icon: 'pen-tool',
        featured: true,
        priority: 8
      },
      {
        name: 'Listening Comprehension',
        description: 'Courses focusing on understanding spoken language',
        color: '#9C27B0',
        icon: 'headphones',
        featured: true,
        priority: 8
      },
      {
        name: 'Reading Skills',
        description: 'Courses focusing on reading comprehension',
        color: '#673AB7',
        icon: 'book-open',
        featured: true,
        priority: 8
      },

      // Specialized Language Areas
      {
        name: 'Business Language',
        description: 'Language courses for professional and business contexts',
        color: '#009688',
        icon: 'briefcase',
        featured: true,
        priority: 7
      },
      {
        name: 'Academic Language',
        description: 'Language courses for academic purposes',
        color: '#795548',
        icon: 'book',
        featured: true,
        priority: 7
      },
      {
        name: 'Medical Language',
        description: 'Language courses for healthcare professionals',
        color: '#E91E63',
        icon: 'heart',
        featured: true,
        priority: 7
      },
      {
        name: 'Legal Language',
        description: 'Language courses for legal professionals',
        color: '#607D8B',
        icon: 'scale',
        featured: true,
        priority: 7
      },

      // Course Types
      {
        name: 'Intensive Courses',
        description: 'Fast-paced, immersive language courses',
        color: '#FF4081',
        icon: 'zap',
        featured: true,
        priority: 6
      },
      {
        name: 'Part-time Courses',
        description: 'Flexible schedule language courses',
        color: '#00BCD4',
        icon: 'clock',
        featured: true,
        priority: 6
      },
      {
        name: 'Online Courses',
        description: 'Virtual language learning programs',
        color: '#03A9F4',
        icon: 'monitor',
        featured: true,
        priority: 6
      },
      {
        name: 'In-person Courses',
        description: 'Traditional classroom-based language courses',
        color: '#4CAF50',
        icon: 'users',
        featured: true,
        priority: 6
      },

      // Additional Features
      {
        name: 'Cultural Immersion',
        description: 'Courses including cultural activities and experiences',
        color: '#FF9800',
        icon: 'globe',
        featured: true,
        priority: 5
      },
      {
        name: 'Exam Preparation',
        description: 'Courses preparing for language proficiency exams',
        color: '#9C27B0',
        icon: 'award',
        featured: true,
        priority: 5
      },
      {
        name: 'Small Groups',
        description: 'Courses with limited class sizes for personalized attention',
        color: '#2196F3',
        icon: 'users',
        featured: true,
        priority: 5
      },
      {
        name: 'One-on-One',
        description: 'Private language tutoring sessions',
        color: '#E91E63',
        icon: 'user',
        featured: true,
        priority: 5
      }
    ];

    // Create or update tags
    console.log('Creating/updating tags...');
    const tags = await Promise.all(
      tagData.map(async (tag) => {
        const existingTag = await prisma.tag.findUnique({
          where: { name: tag.name }
        });

        if (existingTag) {
          return prisma.tag.update({
            where: { id: existingTag.id },
            data: {
              description: tag.description,
              color: tag.color,
              icon: tag.icon,
              featured: tag.featured,
              priority: tag.priority,
              updatedAt: new Date()
            }
          });
        }

        return prisma.tag.create({
          data: {
            id: uuidv4(),
            name: tag.name,
            description: tag.description,
            slug: slugify(tag.name, { lower: true, strict: true }),
            color: tag.color,
            icon: tag.icon,
            featured: tag.featured,
            priority: tag.priority,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
      })
    );

    console.log('Successfully created/updated tags:', tags.length);
    console.log('Tags:', tags.map(t => t.name).join(', '));
  } catch (error) {
    logger.error('Error adding language tags:');
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch(() => {
    logger.error('Error in main:');
    process.exit(1);
  }); 