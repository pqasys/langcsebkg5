import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkFeaturedTags() {
  try {
    console.log('Checking featured tags in database...\n');

    // Get ALL featured tags from database (regardless of course associations)
    const allFeaturedTags = await prisma.tag.findMany({
      where: { featured: true },
      select: {
        id: true,
        name: true,
        featured: true,
        courseTags: {
          select: {
            id: true,
            course: {
              select: {
                id: true,
                title: true,
                status: true,
                institution: {
                  select: {
                    id: true,
                    name: true,
                    isApproved: true,
                    status: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    console.log('📋 ALL featured tags in database:');
    allFeaturedTags.forEach(tag => {
      const validCourseTags = tag.courseTags.filter(ct => 
        ct.course.status === 'PUBLISHED' && 
        ct.course.institution.isApproved && 
        ct.course.institution.status === 'ACTIVE'
      );
      console.log(`- ${tag.name}: ${validCourseTags.length} valid courses, ${tag.courseTags.length} total courses`);
    });

    // Get featured tags that would be returned by the API (with valid course associations)
    const apiFeaturedTags = await prisma.tag.findMany({
      where: {
        featured: true,
        courseTags: {
          some: {
            course: {
              status: 'PUBLISHED',
              institution: {
                isApproved: true,
                status: 'ACTIVE'
              }
            }
          }
        }
      },
      select: {
        id: true,
        name: true,
        featured: true,
        courseTags: {
          where: {
            course: {
              status: 'PUBLISHED',
              institution: {
                isApproved: true,
                status: 'ACTIVE'
              }
            }
          },
          select: { id: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    console.log('\n📋 Featured tags that would be returned by API:');
    apiFeaturedTags.forEach(tag => {
      console.log(`- ${tag.name}: ${tag.courseTags.length} courses`);
    });

    // Find featured tags that are missing from API response
    const missingTags = allFeaturedTags.filter(tag => 
      !apiFeaturedTags.some(apiTag => apiTag.id === tag.id)
    );

    if (missingTags.length > 0) {
      console.log('\n❌ Featured tags missing from API response:');
      missingTags.forEach(tag => {
        console.log(`- ${tag.name}: No valid course associations`);
      });
    } else {
      console.log('\n✅ All featured tags have valid course associations');
    }

    console.log('\n🎯 Summary:');
    console.log(`- Total featured tags in database: ${allFeaturedTags.length}`);
    console.log(`- Featured tags with valid courses: ${apiFeaturedTags.length}`);
    console.log(`- Missing from API: ${missingTags.length}`);

  } catch (error) {
    console.error('❌ Error checking featured tags:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkFeaturedTags(); 