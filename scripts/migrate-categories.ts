import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

// Mapping of old English-specific categories to new language-agnostic categories
const categoryMappings = [
  {
    from: 'general-english',
    to: 'general-language',
    description: 'General English → General Language'
  },
  {
    from: 'business-english',
    to: 'business-language',
    description: 'Business English → Business Language'
  },
  {
    from: 'academic-english',
    to: 'academic-language',
    description: 'Academic English → Academic Language'
  },
  {
    from: 'specialized-english',
    to: 'specialized-language',
    description: 'Specialized English → Specialized Language'
  }
];

async function migrateCategories() {
  try {
    console.log('🔄 Starting category migration...');
    console.log(`Found ${categoryMappings.length} category mappings to process`);

    let migratedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const mapping of categoryMappings) {
      try {
        console.log(`\n📋 Processing: ${mapping.description}`);

        // Find the old category
        const oldCategory = await prisma.category.findUnique({
          where: { slug: mapping.from }
        });

        if (!oldCategory) {
          console.log(`   ⏭️  Old category '${mapping.from}' not found, skipping`);
          skippedCount++;
          continue;
        }

        // Find the new category
        const newCategory = await prisma.category.findUnique({
          where: { slug: mapping.to }
        });

        if (!newCategory) {
          console.log(`   ❌ New category '${mapping.to}' not found, skipping`);
          errorCount++;
          continue;
        }

        // Update all courses that use the old category
        const updateResult = await prisma.course.updateMany({
          where: {
            categoryId: oldCategory.id
          },
          data: {
            categoryId: newCategory.id
          }
        });

        console.log(`   ✅ Migrated ${updateResult.count} courses from '${oldCategory.name}' to '${newCategory.name}'`);
        migratedCount += updateResult.count;

        // Optionally, we could delete the old category if no courses are using it
        // But let's keep it for now to avoid any issues

      } catch (error) {
        console.error(`   ❌ Error processing ${mapping.description}:`, error);
        errorCount++;
      }
    }

    console.log('\n📊 Migration Summary:');
    console.log(`- Courses migrated: ${migratedCount}`);
    console.log(`- Categories skipped: ${skippedCount}`);
    console.log(`- Errors encountered: ${errorCount}`);

    // Show current category distribution
    console.log('\n📋 Current category distribution:');
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

    categories.forEach(category => {
      console.log(`   ${category.name}: ${category._count.courses} courses`);
    });

    console.log('\n✅ Category migration completed!');

  } catch (error) {
    console.error('❌ Error during category migration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateCategories(); 