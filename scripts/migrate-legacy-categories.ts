import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

// Mapping of legacy English categories to modern equivalents
const categoryMappings = [
  {
    from: 'academic-english',
    to: 'specialized-context-based',
    description: 'Academic English → Specialized & Context-Based (Academic focus)'
  },
  {
    from: 'business-english',
    to: 'specialized-context-based', 
    description: 'Business English → Specialized & Context-Based (Business focus)'
  },
  {
    from: 'general-english',
    to: 'conversation-speaking',
    description: 'General English → Conversation & Speaking (General communication)'
  },
  {
    from: 'conversation-skills',
    to: 'conversation-speaking',
    description: 'Conversation Skills → Conversation & Speaking'
  },
  {
    from: 'conversational-skills',
    to: 'conversation-speaking',
    description: 'Conversational Skills → Conversation & Speaking'
  },
  {
    from: 'business-communication',
    to: 'specialized-context-based',
    description: 'Business Communication → Specialized & Context-Based (Business focus)'
  },
  {
    from: 'language-learning',
    to: 'conversation-speaking',
    description: 'Language Learning → Conversation & Speaking (General language learning)'
  },
  {
    from: 'specialized-skills',
    to: 'specialized-context-based',
    description: 'Specialized Skills → Specialized & Context-Based'
  },
  {
    from: 'sports-recreation',
    to: 'specialized-context-based',
    description: 'Sports & Recreation → Specialized & Context-Based (Sports focus)'
  },
  {
    from: 'education-teaching',
    to: 'specialized-context-based',
    description: 'Education & Teaching → Specialized & Context-Based (Education focus)'
  }
];

// Legacy categories to be removed after migration
const legacyCategoriesToRemove = [
  'academic-english',
  'business-english',
  'general-english',
  'conversation-skills',
  'conversational-skills',
  'business-communication',
  'language-learning',
  'specialized-skills',
  'sports-recreation',
  'education-teaching'
];

async function migrateLegacyCategories() {
  try {
    console.log('Starting legacy category migration...');
    
    // Step 1: Show current courses using legacy categories
    console.log('\n📊 Current courses using legacy categories:');
    let totalLegacyCourses = 0;
    
    for (const mapping of categoryMappings) {
      const courses = await prisma.course.findMany({
        where: {
          category: {
            slug: mapping.from
          }
        },
        select: {
          id: true,
          title: true,
          category: {
            select: {
              name: true,
              slug: true
            }
          }
        }
      });
      
      if (courses.length > 0) {
        console.log(`\n${mapping.description}:`);
        courses.forEach(course => {
          console.log(`  - ${course.title} (${course.category.name})`);
        });
        totalLegacyCourses += courses.length;
      }
    }
    
    console.log(`\nTotal courses to migrate: ${totalLegacyCourses}`);

    // Step 2: Migrate courses to new categories
    console.log('\n🔄 Migrating courses to new categories...');
    let migratedCount = 0;
    
    for (const mapping of categoryMappings) {
      try {
        // Get the target category
        const targetCategory = await prisma.category.findUnique({
          where: { slug: mapping.to }
        });

        if (!targetCategory) {
          console.log(`⚠️  Target category '${mapping.to}' not found, skipping migration for '${mapping.from}'`);
          continue;
        }

        // Update courses
        const updateResult = await prisma.course.updateMany({
          where: {
            category: {
              slug: mapping.from
            }
          },
          data: {
            categoryId: targetCategory.id
          }
        });

        if (updateResult.count > 0) {
          console.log(` Migrated ${updateResult.count} courses: ${mapping.description}`);
          migratedCount += updateResult.count;
        }
      } catch (error) {
        logger.error('❌ Error migrating courses from ');
      }
    }

    console.log(`\nTotal courses migrated: ${migratedCount}`);

    // Step 3: Remove legacy categories
    console.log('\n🗑️  Removing legacy categories...');
    let removedCount = 0;
    
    for (const slug of legacyCategoriesToRemove) {
      try {
        // Double-check no courses are using this category
        const remainingCourses = await prisma.course.findMany({
          where: {
            category: {
              slug: slug
            }
          }
        });

        if (remainingCourses.length > 0) {
          console.log(`⚠️  Cannot remove '${slug}' - ${remainingCourses.length} courses still using it`);
          continue;
        }

        const deletedCategory = await prisma.category.deleteMany({
          where: { slug: slug }
        });

        if (deletedCategory.count > 0) {
          console.log(` Removed legacy category: ${slug}`);
          removedCount++;
        } else {
          console.log(`⏭️  Legacy category not found: ${slug}`);
        }
      } catch (error) {
        logger.error('❌ Error removing legacy category ${slug}:');
      }
    }

    // Step 4: Show final results
    console.log('\n📊 Migration Summary:');
    console.log(`- Courses migrated: ${migratedCount}`);
    console.log(`- Legacy categories removed: ${removedCount}`);

    // Show final categories
    const allCategories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });

    console.log('\n📋 Final categories in database:');
    allCategories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.name} (${cat.slug})`);
    });

    // Show courses by category
    console.log('\n📋 Courses by category:');
    const coursesByCategory = await prisma.course.findMany({
      include: {
        category: {
          select: {
            name: true,
            slug: true
          }
        }
      },
      orderBy: {
        category: {
          name: 'asc'
        }
      }
    });

    const categoryGroups = coursesByCategory.reduce((acc, course) => {
      const categoryName = course.category.name;
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(course.title);
      return acc;
    }, {} as Record<string, string[]>);

    Object.entries(categoryGroups).forEach(([categoryName, courses]) => {
      console.log(`\n${categoryName} (${courses.length} courses):`);
      courses.forEach(courseTitle => {
        console.log(`  - ${courseTitle}`);
      });
    });

    console.log('\n✅ Legacy category migration completed!');
    console.log('💡 All legacy English categories have been replaced with modern, language-agnostic equivalents.');

  } catch (error) {
    logger.error('❌ Error in migrateLegacyCategories:');
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
migrateLegacyCategories()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch(() => {
    logger.error('Script failed:');
    process.exit(1);
  }); 