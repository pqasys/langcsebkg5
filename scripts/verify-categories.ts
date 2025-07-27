import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyCategories() {
  try {
    console.log('🔍 Verifying category migration results...\n');

    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            courses: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    console.log('📋 Current Categories:');
    console.log('='.repeat(60));
    
    let totalCourses = 0;
    categories.forEach(category => {
      const courseCount = category._count.courses;
      totalCourses += courseCount;
      console.log(`${category.name.padEnd(25)} | ${courseCount.toString().padStart(3)} courses | ${category.slug}`);
    });

    console.log('='.repeat(60));
    console.log(`Total Categories: ${categories.length}`);
    console.log(`Total Courses: ${totalCourses}`);

    const sampleCourses = await prisma.course.findMany({
      where: {
        NOT: {
          categoryId: null
        }
      },
      include: {
        category: {
          select: {
            name: true,
            slug: true
          }
        }
      },
      take: 5,
      orderBy: {
        title: 'asc'
      }
    });

    console.log('\n📚 Sample Courses with Categories:');
    sampleCourses.forEach(course => {
      const categoryName = course.category?.name || 'No Category';
      console.log(`${course.title} → ${categoryName}`);
    });

    // Check for courses without categories
    const uncategorizedCourses = await prisma.course.findMany({
      where: {
        categoryId: null
      },
      select: {
        id: true,
        title: true
      }
    });

    if (uncategorizedCourses.length > 0) {
      console.log(`\n⚠️  Found ${uncategorizedCourses.length} courses without categories:`);
      uncategorizedCourses.forEach(course => {
        console.log(`   - ${course.title}`);
      });
    } else {
      console.log('\n✅ All courses have categories assigned');
    }

    console.log('\n✅ Category verification completed!');

  } catch (error) {
    console.error('❌ Error during verification:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyCategories(); 