import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

// Define language-related tags that should be kept
const languageRelatedTags = [
  'English',
  'Spanish',
  'French',
  'German',
  'Chinese',
  'Japanese',
  'Arabic',
  'Business Communication',
  'Public Speaking',
  'Academic Writing',
  'Language',
  'IELTS',
  'TOEFL',
  'Conversation',
  'Speaking',
  'Writing',
  'Grammar',
  'Vocabulary',
  'Pronunciation',
  'Reading',
  'Listening',
  'Translation',
  'Interpretation',
  'Business English',
  'Exam Preparation',
  'Beginner',
  'Intermediate',
  'Advanced'
];

async function cleanupTags() {
  try {
    console.log('Starting tag cleanup...');

    // Get all tags
    const allTags = await prisma.tag.findMany();
    console.log(`Found ${allTags.length} total tags`);

    // Find tags to delete (those not in languageRelatedTags)
    const tagsToDelete = allTags.filter(tag => 
      !languageRelatedTags.includes(tag.name)
    );
    console.log(`Found ${tagsToDelete.length} tags to delete`);

    // Delete course-tag associations first
    for (const tag of tagsToDelete) {
      await prisma.courseTag.deleteMany({
        where: {
          tagId: tag.id
        }
      });
      console.log(`Deleted course-tag associations for tag: ${tag.name}`);
    }

    // Delete the tags
    for (const tag of tagsToDelete) {
      await prisma.tag.delete({
        where: {
          id: tag.id
        }
      });
      console.log(`Deleted tag: ${tag.name}`);
    }

    console.log('Tag cleanup completed successfully');
  } catch (error) {
    logger.error('Error during tag cleanup:');
  } finally {
    await prisma.$disconnect();
  }
}

cleanupTags(); 