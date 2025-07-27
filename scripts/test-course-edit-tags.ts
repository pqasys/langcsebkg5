import { prisma } from '../lib/prisma';

async function testCourseEditTags() {
  try {
    console.log('Testing course edit tags functionality...');
    
    // 1. Find a course with tags
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
    
    if (!courseWithTags) {
      console.log('❌ No course with tags found');
      return;
    }
    
    console.log(`✅ Found course: ${courseWithTags.title}`);
    console.log(`   Tags count: ${courseWithTags.courseTags.length}`);
    
    // 2. Simulate the handleEdit function from the frontend
    console.log('\n=== SIMULATING FRONTEND HANDLE EDIT ===');
    
    const mappedTags = courseWithTags.courseTags?.map(ct => ({
      id: ct.tag.id,
      name: ct.tag.name,
      color: ct.tag.color,
      icon: ct.tag.icon
    }));
    
    console.log('Mapped tags for form data:');
    console.log(JSON.stringify(mappedTags, null, 2));
    
    // 3. Simulate the InstitutionCourseForm useEffect
    console.log('\n=== SIMULATING INSTITUTION COURSE FORM ===');
    
    const initialData = {
      title: courseWithTags.title,
      description: courseWithTags.description,
      categoryId: courseWithTags.categoryId,
      framework: courseWithTags.framework as any,
      level: (courseWithTags.level || '').toUpperCase(),
      status: (courseWithTags.status || 'DRAFT').toUpperCase(),
      base_price: courseWithTags.base_price.toString(),
      pricingPeriod: courseWithTags.pricingPeriod as any,
      duration: courseWithTags.duration.toString(),
      startDate: courseWithTags.startDate ? new Date(courseWithTags.startDate).toISOString().split('T')[0] : '',
      endDate: courseWithTags.endDate ? new Date(courseWithTags.endDate).toISOString().split('T')[0] : '',
      maxStudents: courseWithTags.maxStudents?.toString() || '',
      tags: mappedTags || [],
      institutionId: courseWithTags.institutionId
    };
    
    console.log('Initial form data:');
    console.log(JSON.stringify(initialData, null, 2));
    
    // 4. Simulate the CourseTagManager receiving selectedTags
    console.log('\n=== SIMULATING COURSE TAG MANAGER ===');
    
    const selectedTags = initialData.tags;
    console.log('CourseTagManager would receive selectedTags:', selectedTags);
    
    if (selectedTags && Array.isArray(selectedTags)) {
      const validTags = selectedTags.filter(tag => tag && tag.id && tag.name);
      console.log('Valid tags after filtering:', validTags);
      console.log(`✅ ${validTags.length} valid tags would be displayed`);
    } else {
      console.log('❌ No valid selectedTags provided');
    }
    
    console.log('\n✅ Course edit tags test completed!');
    console.log('\n📋 SUMMARY:');
    console.log(`   - Course: ${courseWithTags.title}`);
    console.log(`   - Database tags: ${courseWithTags.courseTags.length}`);
    console.log(`   - Mapped tags: ${mappedTags?.length || 0}`);
    console.log(`   - Valid tags for display: ${selectedTags?.filter(tag => tag && tag.id && tag.name).length || 0}`);
    
  } catch (error) {
    console.error('Error testing course edit tags:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCourseEditTags(); 