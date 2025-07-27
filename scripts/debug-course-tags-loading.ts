import { prisma } from '../lib/prisma';

async function debugCourseTagsLoading() {
  try {
    console.log('Debugging course tags loading issue...');
    
    // 1. Check a specific course and its tags
    console.log('\n=== 1. COURSE WITH TAGS CHECK ===');
    const courseWithTags = await prisma.course.findFirst({
      where: {
        courseTags: {
          some: {}
        }
      },
      include: {
        courseTags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                color: true,
                icon: true
              }
            }
          }
        }
      }
    });
    
    if (courseWithTags) {
      console.log(`Found course: ${courseWithTags.title} (${courseWithTags.id})`);
      console.log(`Course tags count: ${courseWithTags.courseTags.length}`);
      
      courseWithTags.courseTags.forEach((ct, index) => {
        console.log(`  ${index + 1}. Tag: ${ct.tag.name} (${ct.tag.id})`);
        console.log(`     Color: ${ct.tag.color}, Icon: ${ct.tag.icon}`);
      });
      
      // 2. Simulate the handleEdit mapping
      console.log('\n=== 2. HANDLE EDIT MAPPING SIMULATION ===');
      const mappedTags = courseWithTags.courseTags?.map(ct => ({
        id: ct.tag.id,
        name: ct.tag.name,
        color: ct.tag.color,
        icon: ct.tag.icon
      }));
      
      console.log('Mapped tags for form data:');
      console.log(JSON.stringify(mappedTags, null, 2));
      
      // 3. Check if the mapping would work correctly
      console.log('\n=== 3. MAPPING VALIDATION ===');
      if (mappedTags && mappedTags.length > 0) {
        console.log('✅ Tags would be mapped correctly');
        console.log(`   Count: ${mappedTags.length}`);
        console.log(`   First tag: ${mappedTags[0].name} (${mappedTags[0].id})`);
      } else {
        console.log('❌ No tags would be mapped');
      }
      
    } else {
      console.log('❌ No course with tags found');
    }
    
    // 4. Check all courses and their tag counts
    console.log('\n=== 4. ALL COURSES TAG COUNT ===');
    const allCourses = await prisma.course.findMany({
      include: {
        courseTags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });
    
    console.log(`Total courses: ${allCourses.length}`);
    allCourses.forEach((course, index) => {
      console.log(`  ${index + 1}. ${course.title}: ${course.courseTags.length} tags`);
      if (course.courseTags.length > 0) {
        course.courseTags.forEach(ct => {
          console.log(`     - ${ct.tag.name}`);
        });
      }
    });
    
    // 5. Check if there are any courses with tags but the tags are null/undefined
    console.log('\n=== 5. NULL TAG CHECK ===');
    const coursesWithNullTags = await prisma.courseTag.findMany({
      where: {
        tag: null
      },
      include: {
        course: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });
    
    if (coursesWithNullTags.length > 0) {
      console.log(`❌ Found ${coursesWithNullTags.length} course tags with null tag references`);
      coursesWithNullTags.forEach(ct => {
        console.log(`   Course: ${ct.course.title} (${ct.course.id})`);
      });
    } else {
      console.log('✅ No null tag references found');
    }
    
    console.log('\n✅ Course tags debugging completed!');
    
  } catch (error) {
    console.error('Error debugging course tags:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugCourseTagsLoading(); 