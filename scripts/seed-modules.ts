import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function main() {
  const courseId = '48ae8680-4cf2-4dba-9fdc-a2206cc8ba08';

  // Check if course exists
  const course = await prisma.course.findUnique({
    where: { id: courseId }
  });

  if (!course) {
    logger.error('Course not found');
    return;
  }

  // Create test modules
  const modules = [
    {
      id: uuidv4(),
      title: 'Introduction to the Language',
      description: 'Basic greetings, introductions, and essential vocabulary',
      level: 'A1',
      skills: ['speaking', 'listening', 'vocabulary'],
      estimatedDuration: 60,
      vocabularyList: ['hello', 'goodbye', 'thank you', 'please', 'yes', 'no'],
      grammarPoints: ['basic sentence structure', 'present tense'],
      culturalNotes: 'Understanding cultural context of greetings and basic interactions',
      order: 1
    },
    {
      id: uuidv4(),
      title: 'Daily Conversations',
      description: 'Common phrases and expressions used in daily life',
      level: 'A1',
      skills: ['speaking', 'listening', 'reading'],
      estimatedDuration: 90,
      vocabularyList: ['good morning', 'good evening', 'how are you', 'fine', 'not bad'],
      grammarPoints: ['questions and answers', 'simple present tense'],
      culturalNotes: 'Cultural differences in daily greetings and small talk',
      order: 2
    },
    {
      id: uuidv4(),
      title: 'Numbers and Time',
      description: 'Learn to count, tell time, and discuss schedules',
      level: 'A1',
      skills: ['reading', 'writing', 'vocabulary'],
      estimatedDuration: 75,
      vocabularyList: ['numbers 1-100', 'o\'clock', 'morning', 'afternoon', 'evening'],
      grammarPoints: ['telling time', 'using numbers in context'],
      culturalNotes: 'Different time formats and cultural attitudes towards punctuality',
      order: 3
    },
    {
      id: uuidv4(),
      title: 'Food and Dining',
      description: 'Ordering food, discussing preferences, and table manners',
      level: 'A2',
      skills: ['speaking', 'listening', 'vocabulary'],
      estimatedDuration: 90,
      vocabularyList: ['menu', 'restaurant', 'delicious', 'spicy', 'sweet', 'sour'],
      grammarPoints: ['expressing preferences', 'ordering food'],
      culturalNotes: 'Dining etiquette and traditional cuisine',
      order: 4
    },
    {
      id: uuidv4(),
      title: 'Travel and Transportation',
      description: 'Navigating cities, using public transport, and asking for directions',
      level: 'A2',
      skills: ['speaking', 'listening', 'reading'],
      estimatedDuration: 120,
      vocabularyList: ['bus', 'train', 'subway', 'ticket', 'station', 'map'],
      grammarPoints: ['asking for directions', 'giving directions'],
      culturalNotes: 'Public transportation systems and travel customs',
      order: 5
    }
  ];

  // Insert modules
  for (const module of modules) {
    await prisma.modules.create({
      data: {
        ...module,
        course_id: courseId
      }
    });
  }

  console.log('Successfully created test modules');
}

main()
  .catch((e) => {
    logger.error('An error occurred');
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 