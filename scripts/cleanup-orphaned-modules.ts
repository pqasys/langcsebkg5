import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function cleanupOrphanedModules() {
  console.log('Starting cleanup of orphaned modules...');

  try {
    // Find all modules
    const allModules = await prisma.modules.findMany();
    console.log(`Found ${allModules.length} total modules`);

    // Find all valid course IDs
    const validCourseIds = new Set(
      (await prisma.course.findMany()).map(course => course.id)
    );
    console.log(`Found ${validCourseIds.size} valid courses`);

    // Identify orphaned modules
    const orphanedModules = allModules.filter(
      module => !validCourseIds.has(module.course_id)
    );
    console.log(`Found ${orphanedModules.length} orphaned modules`);

    if (orphanedModules.length === 0) {
      console.log('No orphaned modules found. Exiting...');
      return;
    }

    // Process each orphaned module
    for (const module of orphanedModules) {
      console.log(`\nProcessing orphaned module: ${module.id} (${module.title})`);

      // 1. Delete student progress records
      const deletedProgress = await prisma.student_progress.deleteMany({
        where: { module_id: module.id }
      });
      console.log(`Deleted ${deletedProgress.count} student progress records`);

      // 2. Delete quiz questions and quizzes
      const quizzes = await prisma.quizzes.findMany({
        where: { module_id: module.id }
      });
      
      for (const quiz of quizzes) {
        const deletedQuestions = await prisma.quiz_questions.deleteMany({
          where: { quiz_id: quiz.id }
        });
        console.log(`Deleted ${deletedQuestions.count} quiz questions for quiz ${quiz.id}`);
      }

      const deletedQuizzes = await prisma.quizzes.deleteMany({
        where: { module_id: module.id }
      });
      console.log(`Deleted ${deletedQuizzes.count} quizzes`);

      // 3. Delete exercises
      const deletedExercises = await prisma.exercises.deleteMany({
        where: { module_id: module.id }
      });
      console.log(`Deleted ${deletedExercises.count} exercises`);

      // 4. Delete content items
      const deletedContent = await prisma.content_items.deleteMany({
        where: { module_id: module.id }
      });
      console.log(`Deleted ${deletedContent.count} content items`);

      // 5. Delete module skills
      const deletedSkills = await prisma.module_skills.deleteMany({
        where: { module_id: module.id }
      });
      console.log(`Deleted ${deletedSkills.count} module skills`);

      // 6. Finally, delete the module itself
      await prisma.modules.delete({
        where: { id: module.id }
      });
      console.log(`Deleted module ${module.id}`);
    }

    console.log('\nCleanup completed successfully!');
  } catch (error) {
    logger.error('Error during cleanup:');
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the cleanup
cleanupOrphanedModules()
  .then(() => {
    console.log('Script completed');
    process.exit(0);
  })
  .catch(() => {
    logger.error('Script failed:');
    process.exit(1);
  }); 