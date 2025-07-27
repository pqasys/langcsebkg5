import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Testing database connection...');

    // Test institutions
    const institutions = await prisma.institution.findMany({
      include: {
        departments: true
      }
    });
    console.log('\nInstitutions:', institutions.length);
    institutions.forEach(inst => {
      console.log(`- ${inst.name} (${inst.departments.length} departments)`);
    });

    // Test categories
    const categories = await prisma.category.findMany();
    console.log('\nCategories:', categories.length);
    categories.forEach(cat => {
      console.log(`- ${cat.name}`);
    });

    // Test tags
    const tags = await prisma.tag.findMany();
    console.log('\nTags:', tags.length);
    tags.forEach(tag => {
      console.log(`- ${tag.name}`);
    });

    // Test courses
    const courses = await prisma.course.findMany();
    console.log('\nCourses:', courses.length);
    courses.forEach(course => {
      console.log(`- ${course.title}`);
    });

  } catch (error) {
    logger.error('Database test failed:');
  } finally {
    await prisma.$disconnect();
  }
}

main(); 