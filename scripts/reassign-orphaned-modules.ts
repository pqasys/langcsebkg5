import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

// Function to find the best matching course for a module
async function findBestMatchingCourse(module: any, validCourses: any[]) {
  // If there's only one course, return it
  if (validCourses.length === 1) {
    return validCourses[0];
  }

  // Get all modules from valid courses to analyze their characteristics
  const courseModules = await prisma.modules.findMany({
    where: {
      course_id: {
        in: validCourses.map(c => c.id)
      }
    }
  });

  // Group modules by course
  const modulesByCourse = courseModules.reduce((acc, m) => {
    if (!acc[m.course_id]) {
      acc[m.course_id] = [];
    }
    acc[m.course_id].push(m);
    return acc;
  }, {} as Record<string, any[]>);

  // Score each course based on similarity
  const courseScores = validCourses.map(course => {
    const courseModules = modulesByCourse[course.id] || [];
    let score = 0;

    // Score based on level match
    if (courseModules.some(m => m.level === module.level)) {
      score += 3;
    }

    // Score based on average module count (prefer courses with similar number of modules)
    const avgModuleCount = courseModules.length;
    const targetModuleCount = Object.values(modulesByCourse).reduce((sum, modules) => sum + modules.length, 0) / validCourses.length;
    if (Math.abs(avgModuleCount - targetModuleCount) <= 2) {
      score += 2;
    }

    // Score based on course title similarity (if available)
    if (course.title && module.title) {
      const courseWords = course.title.toLowerCase().split(/\s+/);
      const moduleWords = module.title.toLowerCase().split(/\s+/);
      const commonWords = courseWords.filter(word => moduleWords.includes(word));
      score += commonWords.length;
    }

    return { course, score };
  });

  // Sort by score and return the best match
  courseScores.sort((a, b) => b.score - a.score);
  return courseScores[0].course;
}

interface ReassignmentSummary {
  moduleId: string;
  moduleTitle: string;
  originalCourseId: string;
  targetCourseId: string;
  targetCourseTitle: string;
  relatedRecords: {
    studentProgress: number;
    quizzes: number;
    exercises: number;
    contentItems: number;
    moduleSkills: number;
  };
}

async function reassignOrphanedModules(dryRun: boolean = true) {
  console.log(`Starting ${dryRun ? 'dry run' : 'actual'} reassignment of orphaned modules...`);

  try {
    // Find all modules
    const allModules = await prisma.modules.findMany();
    console.log(`Found ${allModules.length} total modules`);

    // Find all valid courses
    const validCourses = await prisma.course.findMany();
    console.log(`Found ${validCourses.length} valid courses`);

    if (validCourses.length === 0) {
      console.log('No valid courses found to reassign modules to. Exiting...');
      return;
    }

    // Create a map of valid course IDs
    const validCourseIds = new Set(validCourses.map(course => course.id));

    // Identify orphaned modules
    const orphanedModules = allModules.filter(
      module => !validCourseIds.has(module.course_id)
    );
    console.log(`Found ${orphanedModules.length} orphaned modules`);

    if (orphanedModules.length === 0) {
      console.log('No orphaned modules found. Exiting...');
      return;
    }

    // Group orphaned modules by their original course_id
    const modulesByOriginalCourse = orphanedModules.reduce((acc, module) => {
      if (!acc[module.course_id]) {
        acc[module.course_id] = [];
      }
      acc[module.course_id].push(module);
      return acc;
    }, {} as Record<string, typeof orphanedModules>);

    const reassignmentSummary: ReassignmentSummary[] = [];

    // Process each group of orphaned modules
    for (const [originalCourseId, modules] of Object.entries(modulesByOriginalCourse)) {
      console.log(`\nProcessing modules from original course: ${originalCourseId}`);
      
      // Find the best matching course for this group of modules
      const targetCourse = await findBestMatchingCourse(modules[0], validCourses);
      console.log(`Would reassign to course: ${targetCourse.id} (${targetCourse.title})`);

      // Update each module and its related records
      for (const module of modules) {
        console.log(`\nProcessing module: ${module.id} (${module.title})`);

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

        // Add to summary
        reassignmentSummary.push({
          moduleId: module.id,
          moduleTitle: module.title,
          originalCourseId,
          targetCourseId: targetCourse.id,
          targetCourseTitle: targetCourse.title,
          relatedRecords: {
            studentProgress,
            quizzes,
            exercises,
            contentItems,
            moduleSkills
          }
        });

        if (!dryRun) {
          // 1. Update student progress records
          const updatedProgress = await prisma.student_progress.updateMany({
            where: { module_id: module.id },
            data: { module_id: module.id }
          });
          console.log(`Updated ${updatedProgress.count} student progress records`);

          // 2. Update quizzes
          const updatedQuizzes = await prisma.quizzes.updateMany({
            where: { module_id: module.id },
            data: { module_id: module.id }
          });
          console.log(`Updated ${updatedQuizzes.count} quizzes`);

          // 3. Update exercises
          const updatedExercises = await prisma.exercises.updateMany({
            where: { module_id: module.id },
            data: { module_id: module.id }
          });
          console.log(`Updated ${updatedExercises.count} exercises`);

          // 4. Update content items
          const updatedContent = await prisma.content_items.updateMany({
            where: { module_id: module.id },
            data: { module_id: module.id }
          });
          console.log(`Updated ${updatedContent.count} content items`);

          // 5. Update module skills
          const updatedSkills = await prisma.module_skills.updateMany({
            where: { module_id: module.id },
            data: { module_id: module.id }
          });
          console.log(`Updated ${updatedSkills.count} module skills`);

          // 6. Finally, update the module itself
          await prisma.modules.update({
            where: { id: module.id },
            data: { 
              course_id: targetCourse.id,
              updated_at: new Date()
            }
          });
          console.log(`Updated module ${module.id} with new course_id: ${targetCourse.id}`);
        }
      }
    }

    // Print summary
    console.log('\n=== Reassignment Summary ===');
    console.log(`Total modules to be reassigned: ${reassignmentSummary.length}`);
    console.log('\nDetailed Summary:');
    reassignmentSummary.forEach(summary => {
      console.log(`\nModule: ${summary.moduleTitle} (${summary.moduleId})`);
      console.log(`  From Course: ${summary.originalCourseId}`);
      console.log(`  To Course: ${summary.targetCourseTitle} (${summary.targetCourseId})`);
      console.log('  Related Records:');
      console.log(`    - Student Progress: ${summary.relatedRecords.studentProgress}`);
      console.log(`    - Quizzes: ${summary.relatedRecords.quizzes}`);
      console.log(`    - Exercises: ${summary.relatedRecords.exercises}`);
      console.log(`    - Content Items: ${summary.relatedRecords.contentItems}`);
      console.log(`    - Module Skills: ${summary.relatedRecords.moduleSkills}`);
    });

    if (dryRun) {
      console.log('\nThis was a dry run. No changes were made.');
      console.log('To apply these changes, run the script with dryRun=false');
    } else {
      console.log('\nReassignment completed successfully!');
    }
  } catch (error) {
    logger.error('Error during reassignment:');
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = !args.includes('--apply');

// Run the reassignment
reassignOrphanedModules(dryRun)
  .then(() => {
    console.log('Script completed');
    process.exit(0);
  })
  .catch(() => {
    logger.error('Script failed:');
    process.exit(1);
  }); 