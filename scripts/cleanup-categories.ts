import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

// Categories to remove (level-based categories)
const categoriesToRemove = [
  'beginner-level',
  'elementary-level', 
  'intermediate-level',
  'advanced-level'
];

// Categories to consolidate into "Specialized & Context-Based"
const categoriesToConsolidate = [
  'business-professional',
  'academic-research',
  'travel-cultural',
  'medical-healthcare',
  'legal-government',
  'tourism-hospitality',
  'technical-scientific',
  'creative-arts',
  'cultural-immersion',
  'literature-media',
  'technology-digital',
  'social-media-communication',
  'emergency-safety',
  'family-relationships',
  'food-culinary',
  'music-entertainment',
  'fashion-lifestyle',
  'environment-sustainability',
  'current-events-news'
];

async function cleanupCategories() {
  try {
    console.log('Starting category cleanup...');
    
    // Step 1: Remove level-based categories
    console.log('\n🗑️  Removing level-based categories...');
    let removedCount = 0;
    
    for (const slug of categoriesToRemove) {
      try {
        // Check if any courses are using this category
        const coursesUsingCategory = await prisma.course.findMany({
          where: {
            category: {
              slug: slug
            }
          }
        });

        if (coursesUsingCategory.length > 0) {
          console.log(`⚠️  Cannot remove '${slug}' - ${coursesUsingCategory.length} courses are using it`);
          continue;
        }

        const deletedCategory = await prisma.category.deleteMany({
          where: { slug: slug }
        });

        if (deletedCategory.count > 0) {
          console.log(` Removed category: ${slug}`);
          removedCount++;
        } else {
          console.log(`⏭️  Category not found: ${slug}`);
        }
      } catch (error) {
        logger.error('❌ Error removing category ${slug}:');
      }
    }

    console.log(`Removed ${removedCount} level-based categories`);

    // Step 2: Create consolidated "Specialized & Context-Based" category
    console.log('\n🔗 Creating consolidated "Specialized & Context-Based" category...');
    
    const consolidatedCategory = await prisma.category.upsert({
      where: { slug: 'specialized-context-based' },
      update: {
        name: 'Specialized & Context-Based',
        description: 'Language courses for specific contexts, industries, and specialized purposes including business, academic, medical, legal, technical, cultural, and other professional or specialized domains',
        updatedAt: new Date()
      },
      create: {
        id: require('uuid').v4(),
        name: 'Specialized & Context-Based',
        description: 'Language courses for specific contexts, industries, and specialized purposes including business, academic, medical, legal, technical, cultural, and other professional or specialized domains',
        slug: 'specialized-context-based',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    console.log(` Created/Updated consolidated category: ${consolidatedCategory.name}`);

    // Step 3: Update courses using the categories to be consolidated
    console.log('\n🔄 Updating courses to use consolidated category...');
    let updatedCoursesCount = 0;

    for (const slug of categoriesToConsolidate) {
      try {
        const coursesToUpdate = await prisma.course.findMany({
          where: {
            category: {
              slug: slug
            }
          }
        });

        if (coursesToUpdate.length > 0) {
          await prisma.course.updateMany({
            where: {
              category: {
                slug: slug
              }
            },
            data: {
              categoryId: consolidatedCategory.id
            }
          });
          
          console.log(` Updated ${coursesToUpdate.length} courses from '${slug}' to consolidated category`);
          updatedCoursesCount += coursesToUpdate.length;
        }
      } catch (error) {
        logger.error('❌ Error updating courses for category ${slug}:');
      }
    }

    // Step 4: Remove the individual specialized categories (after updating courses)
    console.log('\n🗑️  Removing individual specialized categories...');
    let removedSpecializedCount = 0;

    for (const slug of categoriesToConsolidate) {
      try {
        const deletedCategory = await prisma.category.deleteMany({
          where: { slug: slug }
        });

        if (deletedCategory.count > 0) {
          console.log(` Removed category: ${slug}`);
          removedSpecializedCount++;
        }
      } catch (error) {
        logger.error('❌ Error removing category ${slug}:');
      }
    }

    // Step 5: Show final results
    console.log('\n📊 Cleanup Summary:');
    console.log(`- Removed level-based categories: ${removedCount}`);
    console.log(`- Updated courses to consolidated category: ${updatedCoursesCount}`);
    console.log(`- Removed specialized categories: ${removedSpecializedCount}`);
    console.log(`- Created consolidated category: Specialized & Context-Based`);

    // Show current categories
    const allCategories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });

    console.log('\n📋 Final categories in database:');
    allCategories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.name} (${cat.slug})`);
    });

    console.log('\n✅ Category cleanup completed!');
    console.log('💡 The course table already has a "level" field, so level-based categories were removed.');
    console.log('💡 Context-based and specialized categories have been consolidated for better organization.');

  } catch (error) {
    logger.error('❌ Error in cleanupCategories:');
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
cleanupCategories()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch(() => {
    logger.error('Script failed:');
    process.exit(1);
  }); 