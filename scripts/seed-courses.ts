import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

const courseStatuses = ['DRAFT', 'PUBLISHED', 'ARCHIVED'];
const courseDurations = [20, 30, 40, 60, 80]; // hours
const maxStudents = [20, 30, 40, 50];

// Course templates with varying content to test auto-tagging
const courseTemplates = [
  {
    title: 'English for Business Communication',
    description: 'Master professional English communication skills for the workplace. Learn business vocabulary, email writing, presentations, and meeting participation.',
    price: 299.99,
    level: 'Intermediate',
    tags: ['English', 'Business English', 'Communication']
  },
  {
    title: 'Spanish Conversation Mastery',
    description: 'Develop fluent Spanish speaking skills through interactive conversations. Practice everyday dialogues, pronunciation, and cultural expressions.',
    price: 249.99,
    level: 'Beginner',
    tags: ['Spanish', 'Conversation', 'Speaking']
  },
  {
    title: 'IELTS Preparation Course',
    description: 'Comprehensive preparation for IELTS exam. Cover all four modules: Reading, Writing, Listening, and Speaking with practice tests and feedback.',
    price: 399.99,
    level: 'Advanced',
    tags: ['English', 'IELTS', 'Exam Preparation']
  },
  {
    title: 'Japanese for Beginners',
    description: 'Start your Japanese language journey. Learn basic grammar, essential vocabulary, and writing systems (Hiragana and Katakana).',
    price: 349.99,
    level: 'Beginner',
    tags: ['Japanese', 'Beginner', 'Writing']
  },
  {
    title: 'French Business Writing',
    description: 'Learn to write professional documents in French. Master business correspondence, reports, and formal communication.',
    price: 299.99,
    level: 'Intermediate',
    tags: ['French', 'Business French', 'Writing']
  },
  {
    title: 'German Grammar Intensive',
    description: 'Deep dive into German grammar structures. Master complex sentence patterns, cases, and verb conjugations.',
    price: 279.99,
    level: 'Intermediate',
    tags: ['German', 'Grammar', 'Writing']
  },
  {
    title: 'Chinese Characters Workshop',
    description: 'Learn to read and write Chinese characters. Understand radicals, stroke order, and common character combinations.',
    price: 329.99,
    level: 'Beginner',
    tags: ['Chinese', 'Characters', 'Writing']
  },
  {
    title: 'TOEFL Preparation',
    description: 'Prepare for the TOEFL exam with comprehensive practice. Focus on academic English skills and test-taking strategies.',
    price: 379.99,
    level: 'Advanced',
    tags: ['English', 'TOEFL', 'Exam Preparation']
  },
  {
    title: 'Italian for Travelers',
    description: 'Essential Italian for travelers. Learn practical phrases, cultural tips, and survival language for your Italian journey.',
    price: 199.99,
    level: 'Beginner',
    tags: ['Italian', 'Travel', 'Conversation']
  },
  {
    title: 'Korean Speaking Practice',
    description: 'Improve your Korean speaking skills through guided conversations. Practice pronunciation, intonation, and natural expressions.',
    price: 259.99,
    level: 'Intermediate',
    tags: ['Korean', 'Speaking', 'Conversation']
  }
];

async function getAutoTags(
  template: typeof courseTemplates[0], 
  tags: any[], 
  category: any
) {
  const autoTags = new Set<string>();

  // Add template tags
  template.tags.forEach(tag => autoTags.add(tag.toLowerCase()));

  // Add level tag
  autoTags.add(template.level.toLowerCase());

  // Add delivery method (random selection)
  const deliveryMethods = ['Online', 'In-Person', 'Hybrid'];
  const selectedDelivery = deliveryMethods[Math.floor(Math.random() * deliveryMethods.length)];
  autoTags.add(selectedDelivery.toLowerCase());

  // Add schedule type (random selection, can have multiple)
  const scheduleTypes = ['Morning', 'Evening', 'Weekend', 'Weekday'];
  const numScheduleTypes = Math.floor(Math.random() * 2) + 1; // 1-2 schedule types
  const selectedSchedules = new Set<string>();
  while (selectedSchedules.size < numScheduleTypes) {
    const schedule = scheduleTypes[Math.floor(Math.random() * scheduleTypes.length)];
    selectedSchedules.add(schedule.toLowerCase());
  }
  selectedSchedules.forEach(schedule => autoTags.add(schedule));

  // Add learning style tags (random selection)
  const learningStyles = ['Self-Paced', 'Instructor-Led', 'Group Learning', 'One-on-One'];
  if (Math.random() > 0.5) {
    const style = learningStyles[Math.floor(Math.random() * learningStyles.length)];
    autoTags.add(style.toLowerCase());
  }

  // Add category-related tags
  if (category?.name) {
    autoTags.add(category.name.toLowerCase());
  }

  // Add additional characteristic tags
  const characteristics = ['Project-Based', 'Practical', 'Theory', 'Certification'];
  const numCharacteristics = Math.floor(Math.random() * 2);
  for (let i = 0; i < numCharacteristics; i++) {
    const characteristic = characteristics[Math.floor(Math.random() * characteristics.length)];
    autoTags.add(characteristic.toLowerCase());
  }

  // Find matching tags from the database
  const matchingTags = tags.filter(tag => 
    autoTags.has(tag.name.toLowerCase()) || 
    autoTags.has(tag.slug?.toLowerCase() || '')
  );

  return matchingTags;
}

async function main() {
  try {
    console.log('Starting course creation process...');

    // Get all institutions
    const institutions = await prisma.institution.findMany();
    console.log(`Found ${institutions.length} institutions`);

    if (institutions.length === 0) {
      console.log('No institutions found. Please create institutions first.');
      return;
    }

    // Get all categories
    const categories = await prisma.category.findMany();
    console.log(`Found ${categories.length} categories`);

    if (categories.length === 0) {
      console.log('No categories found. Please create categories first.');
      return;
    }

    // Get all tags
    const tags = await prisma.tag.findMany();
    console.log(`Found ${tags.length} tags`);

    if (tags.length === 0) {
      console.log('No tags found. Please create tags first.');
      return;
    }

    // Create courses for each institution
    for (const institution of institutions) {
      console.log(`\nProcessing institution: ${institution.name}`);

      // Random number of courses (3-8) per institution
      const numCourses = Math.floor(Math.random() * 6) + 3;
      console.log(`Will create ${numCourses} courses for this institution`);

      for (let i = 0; i < numCourses; i++) {
        try {
          // Select random template
          const template = courseTemplates[Math.floor(Math.random() * courseTemplates.length)];
          
          // Select random category
          const category = categories[Math.floor(Math.random() * categories.length)];
          console.log(`Selected category: ${category.name}`);
          
          // Generate random dates
          const startDate = new Date();
          startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30));
          
          const duration = courseDurations[Math.floor(Math.random() * courseDurations.length)];
          const endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + (duration * 7));

          console.log('Creating course with the following data:');
          console.log({
            title: `${template.title} - ${institution.name}`,
            category: category.name,
            duration,
            level: template.level,
            price: template.price
          });

          // Create the course
          const course = await prisma.course.create({
            data: {
              id: uuidv4(),
              title: `${template.title} - ${institution.name}`,
              description: template.description,
              price: template.price,
              duration: duration,
              level: template.level,
              status: courseStatuses[Math.floor(Math.random() * courseStatuses.length)],
              institutionId: institution.id,
              categoryId: category.id,
              createdAt: new Date(),
              updatedAt: new Date(),
              startDate: startDate,
              endDate: endDate,
              maxStudents: maxStudents[Math.floor(Math.random() * maxStudents.length)]
            }
          });

          console.log(`Successfully created course: ${course.title}`);

          // Get auto-generated tags
          const courseTags = await getAutoTags(template, tags, category);
          console.log(`Auto-generated tags: ${courseTags.map(t => t.name).join(', ')}`);

          // Add tags to the course
          console.log('Adding tags to the course...');
          for (const tag of courseTags) {
            await prisma.courseTag.create({
              data: {
                id: uuidv4(),
                courseId: course.id,
                tagId: tag.id,
                createdAt: new Date(),
                updatedAt: new Date()
              }
            });
            console.log(`Added tag: ${tag.name}`);
          }
        } catch (error) {
          logger.error('Error creating course for institution ${institution.name}:');
          continue;
        }
      }
    }

    console.log('\nSample courses have been created successfully!');
  } catch (error) {
    logger.error('Error creating sample courses:');
  } finally {
    await prisma.$disconnect();
  }
}

main(); 