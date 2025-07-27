import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

interface OrphanedRecordSummary {
  type: string;
  id: string;
  parentId: string;
  parentType: string;
  title?: string;
  relatedRecords?: {
    count: number;
    type: string;
  }[];
}

async function cleanupOrphanedRecords(dryRun: boolean = true) {
  console.log(`Starting ${dryRun ? 'dry run' : 'actual'} cleanup of orphaned records...`);
  const summary: OrphanedRecordSummary[] = [];

  try {
    // 1. Find orphaned modules (no valid course)
    const allModules = await prisma.modules.findMany();
    const validCourseIds = new Set(
      (await prisma.course.findMany()).map(course => course.id)
    );
    
    const orphanedModules = allModules.filter(
      module => !validCourseIds.has(module.course_id)
    );

    for (const module of orphanedModules) {
      // Count related records
      const studentProgress = await prisma.student_progress.count({
        where: { module_id: module.id }
      });
      const quizzes = await prisma.quizzes.count({
        where: { module_id: module.id }
      });
      const exercises = await prisma.exercises.count({
        where: { module_id: module.id }
      });
      const contentItems = await prisma.content_items.count({
        where: { module_id: module.id }
      });
      const moduleSkills = await prisma.module_skills.count({
        where: { module_id: module.id }
      });

      summary.push({
        type: 'module',
        id: module.id,
        parentId: module.course_id,
        parentType: 'course',
        title: module.title,
        relatedRecords: [
          { count: studentProgress, type: 'student_progress' },
          { count: quizzes, type: 'quizzes' },
          { count: exercises, type: 'exercises' },
          { count: contentItems, type: 'content_items' },
          { count: moduleSkills, type: 'module_skills' }
        ]
      });

      if (!dryRun) {
        // Delete in correct order to maintain referential integrity
        await prisma.student_progress.deleteMany({
          where: { module_id: module.id }
        });

        // Delete quiz questions first, then quizzes
        const moduleQuizzes = await prisma.quizzes.findMany({
          where: { module_id: module.id }
        });
        for (const quiz of moduleQuizzes) {
          await prisma.quiz_questions.deleteMany({
            where: { quiz_id: quiz.id }
          });
        }
        await prisma.quizzes.deleteMany({
          where: { module_id: module.id }
        });

        await prisma.exercises.deleteMany({
          where: { module_id: module.id }
        });

        await prisma.content_items.deleteMany({
          where: { module_id: module.id }
        });

        await prisma.module_skills.deleteMany({
          where: { module_id: module.id }
        });

        await prisma.modules.delete({
          where: { id: module.id }
        });
      }
    }

    // 2. Find orphaned quiz questions (no valid quiz)
    const allQuizQuestions = await prisma.quiz_questions.findMany();
    const validQuizIds = new Set(
      (await prisma.quizzes.findMany()).map(quiz => quiz.id)
    );

    const orphanedQuizQuestions = allQuizQuestions.filter(
      question => !validQuizIds.has(question.quiz_id)
    );

    for (const question of orphanedQuizQuestions) {
      summary.push({
        type: 'quiz_question',
        id: question.id,
        parentId: question.quiz_id,
        parentType: 'quiz',
        title: question.question.substring(0, 50) + '...'
      });

      if (!dryRun) {
        await prisma.quiz_questions.delete({
          where: { id: question.id }
        });
      }
    }

    // 3. Find orphaned content items (no valid module)
    const allContentItems = await prisma.content_items.findMany();
    const validModuleIds = new Set(
      (await prisma.modules.findMany()).map(module => module.id)
    );

    const orphanedContentItems = allContentItems.filter(
      item => !validModuleIds.has(item.module_id)
    );

    for (const item of orphanedContentItems) {
      summary.push({
        type: 'content_item',
        id: item.id,
        parentId: item.module_id,
        parentType: 'module',
        title: item.title
      });

      if (!dryRun) {
        await prisma.content_items.delete({
          where: { id: item.id }
        });
      }
    }

    // 4. Find orphaned exercises (no valid module)
    const allExercises = await prisma.exercises.findMany();
    const orphanedExercises = allExercises.filter(
      exercise => !validModuleIds.has(exercise.module_id)
    );

    for (const exercise of orphanedExercises) {
      summary.push({
        type: 'exercise',
        id: exercise.id,
        parentId: exercise.module_id,
        parentType: 'module',
        title: exercise.question.substring(0, 50) + '...'
      });

      if (!dryRun) {
        await prisma.exercises.delete({
          where: { id: exercise.id }
        });
      }
    }

    // 5. Find orphaned module skills (no valid module)
    const allModuleSkills = await prisma.module_skills.findMany();
    const orphanedModuleSkills = allModuleSkills.filter(
      skill => !validModuleIds.has(skill.module_id)
    );

    for (const skill of orphanedModuleSkills) {
      summary.push({
        type: 'module_skill',
        id: `${skill.module_id}-${skill.skill}`,
        parentId: skill.module_id,
        parentType: 'module',
        title: skill.skill
      });

      if (!dryRun) {
        await prisma.module_skills.delete({
          where: {
            module_id_skill: {
              module_id: skill.module_id,
              skill: skill.skill
            }
          }
        });
      }
    }

    // Print summary
    console.log('\n=== Orphaned Records Summary ===');
    const recordsByType = summary.reduce((acc, record) => {
      if (!acc[record.type]) {
        acc[record.type] = [];
      }
      acc[record.type].push(record);
      return acc;
    }, {} as Record<string, OrphanedRecordSummary[]>);

    for (const [type, records] of Object.entries(recordsByType)) {
      console.log(`\n${type.toUpperCase()} (${records.length} records):`);
      records.forEach(record => {
        console.log(`\n  ID: ${record.id}`);
        console.log(`  Title: ${record.title || 'N/A'}`);
        console.log(`  Orphaned from ${record.parentType}: ${record.parentId}`);
        if (record.relatedRecords) {
          console.log('  Related records to be deleted:');
          record.relatedRecords.forEach(rel => {
            console.log(`    - ${rel.type}: ${rel.count} records`);
          });
        }
      });
    }

    if (dryRun) {
      console.log('\nThis was a dry run. No changes were made.');
      console.log('To apply these changes, run the script with --apply');
    } else {
      console.log('\nCleanup completed successfully!');
    }
  } catch (error) {
    logger.error('Error during cleanup:');
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = !args.includes('--apply');

// Run the cleanup
cleanupOrphanedRecords(dryRun)
  .then(() => {
    console.log('Script completed');
    process.exit(0);
  })
  .catch(() => {
    logger.error('Script failed:');
    process.exit(1);
  }); 