import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleCourseTitles = [
  'Web Development Bootcamp',
  'Data Science Fundamentals',
  'Business Management',
  'UI/UX Design Masterclass',
  'Digital Marketing Strategy',
  'English Language Proficiency',
  'Python Programming',
  'Graphic Design Fundamentals',
];

const sampleTagNames = [
  'Web Development',
  'Data Science',
  'Business',
  'Design',
  'Marketing',
  'Language',
  'Science',
  'Arts',
  'Health',
  'Programming',
];

async function cleanupSampleData() {
  const results = {
    courseTags: 0,
    courses: 0,
    tags: 0,
    departments: 0,
  };

  try {
    console.log('Starting cleanup of sample data...');

    // 1. Delete course tags for sample courses
    console.log('Cleaning up course tags...');
    const coursesWithTags = await prisma.course.findMany({
      where: {
        title: {
          in: sampleCourseTitles,
        },
      },
      include: {
        courseTags: true,
      },
    });

    for (const course of coursesWithTags) {
      if (course.courseTags.length > 0) {
        await prisma.courseTag.deleteMany({
          where: {
            courseId: course.id,
          },
        });
        results.courseTags += course.courseTags.length;
      }
    }

    // 2. Delete sample courses
    console.log('Cleaning up courses...');
    const deletedCourses = await prisma.course.deleteMany({
      where: {
        title: {
          in: sampleCourseTitles,
        },
      },
    });
    results.courses = deletedCourses.count;

    // 3. Delete sample tags if they're not used by other courses
    console.log('Cleaning up unused tags...');
    for (const tagName of sampleTagNames) {
      const tag = await prisma.tag.findUnique({
        where: { name: tagName },
        include: {
          courses: true,
        },
      });

      if (tag && tag.courses.length === 0) {
        await prisma.tag.delete({
          where: { id: tag.id },
        });
        results.tags++;
      }
    }

    // 4. Delete empty 'General' departments
    console.log('Cleaning up empty General departments...');
    const emptyDepartments = await prisma.department.findMany({
      where: {
        name: 'General',
        courses: {
          none: {},
        },
      },
    });

    for (const dept of emptyDepartments) {
      await prisma.department.delete({
        where: { id: dept.id },
      });
      results.departments++;
    }

    console.log('Cleanup completed successfully!');
    console.log('Summary:');
    console.log(`- Removed ${results.courseTags} course tags`);
    console.log(`- Removed ${results.courses} courses`);
    console.log(`- Removed ${results.tags} unused tags`);
    console.log(`- Removed ${results.departments} empty departments`);

    return {
      success: true,
      results,
    };
  } catch (error) {
    logger.error('Error during cleanup:');
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      results,
    };
  } finally {
    await prisma.$disconnect();
  }
}

// Export the function for use in the API route
export { cleanupSampleData };

// If running directly (not imported)
import { logger } from '../lib/logger';
if (require.main === module) {
  cleanupSampleData()
    .then((result) => {
      if (!result.success) {
        process.exit(1);
      }
      process.exit(0);
    })
    .catch(() => {
      logger.error('Fatal error:');
      process.exit(1);
    });
} 