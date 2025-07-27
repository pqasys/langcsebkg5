import { prisma } from '../lib/prisma';

async function testTagsAPI() {
  try {
    console.log('Testing Tags API and Database...');
    
    // 1. Check if tags exist in database
    console.log('\n=== 1. DATABASE TAGS CHECK ===');
    const tags = await prisma.tag.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        color: true,
        icon: true,
        featured: true,
        priority: true
      },
      orderBy: [
        { priority: 'desc' },
        { name: 'asc' }
      ]
    });
    
    console.log(`Total tags in database: ${tags.length}`);
    
    if (tags.length === 0) {
      console.log('❌ No tags found in database');
      console.log('Creating some sample tags...');
      
      // Create sample tags
      const sampleTags = [
        { name: 'Beginner', description: 'Suitable for beginners', color: '#10B981', icon: 'BookOpen' },
        { name: 'Intermediate', description: 'Suitable for intermediate learners', color: '#F59E0B', icon: 'Target' },
        { name: 'Advanced', description: 'Suitable for advanced learners', color: '#EF4444', icon: 'Zap' },
        { name: 'Business', description: 'Business-focused content', color: '#3B82F6', icon: 'Briefcase' },
        { name: 'Academic', description: 'Academic-focused content', color: '#8B5CF6', icon: 'GraduationCap' },
        { name: 'Conversation', description: 'Conversation practice', color: '#06B6D4', icon: 'MessageCircle' },
        { name: 'Grammar', description: 'Grammar-focused content', color: '#84CC16', icon: 'FileText' },
        { name: 'Vocabulary', description: 'Vocabulary building', color: '#F97316', icon: 'Book' }
      ];
      
      for (const tagData of sampleTags) {
        await prisma.tag.create({
          data: {
            name: tagData.name,
            description: tagData.description,
            color: tagData.color,
            icon: tagData.icon,
            featured: true,
            priority: 1,
            slug: tagData.name.toLowerCase().replace(/\s+/g, '-')
          }
        });
        console.log(`  Created tag: ${tagData.name}`);
      }
      
      console.log('✅ Sample tags created');
    } else {
      console.log('✅ Tags found in database:');
      tags.forEach((tag, index) => {
        console.log(`  ${index + 1}. ${tag.name} (${tag.id})`);
        console.log(`     Color: ${tag.color}, Icon: ${tag.icon}`);
      });
    }
    
    // 2. Check course tags relationships
    console.log('\n=== 2. COURSE TAGS RELATIONSHIPS ===');
    const courseTags = await prisma.courseTag.findMany({
      include: {
        course: {
          select: {
            id: true,
            title: true,
            institutionId: true
          }
        },
        tag: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    
    console.log(`Total course-tag relationships: ${courseTags.length}`);
    
    if (courseTags.length > 0) {
      console.log('Course-tag relationships:');
      courseTags.forEach((ct, index) => {
        console.log(`  ${index + 1}. Course: ${ct.course.title} -> Tag: ${ct.tag.name}`);
      });
    } else {
      console.log('No course-tag relationships found');
    }
    
    // 3. Test API endpoint simulation
    console.log('\n=== 3. API ENDPOINT SIMULATION ===');
    
    // Simulate the API logic
    const apiTags = await prisma.tag.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        color: true,
        icon: true,
        featured: true,
        priority: true
      },
      orderBy: [
        { priority: 'desc' },
        { name: 'asc' }
      ]
    });
    
    // Add counts
    const tagsWithCounts = await Promise.all(
      apiTags.map(async (tag) => {
        const [courseTagsCount, childCount] = await Promise.all([
          prisma.courseTag.count({ where: { tagId: tag.id } }),
          prisma.tag.count({ where: { parentId: tag.id } })
        ]);

        return {
          ...tag,
          _count: {
            courseTags: courseTagsCount,
            children: childCount
          }
        };
      })
    );
    
    console.log(`API would return ${tagsWithCounts.length} tags`);
    if (tagsWithCounts.length > 0) {
      console.log('Sample API response:');
      console.log(JSON.stringify(tagsWithCounts[0], null, 2));
    }
    
    // 4. Check institution-specific tags
    console.log('\n=== 4. INSTITUTION-SPECIFIC TAGS ===');
    
    const institutions = await prisma.institution.findMany({
      select: {
        id: true,
        name: true
      }
    });
    
    for (const institution of institutions) {
      const institutionTags = await prisma.tag.findMany({
        where: {
          courseTags: {
            some: {
              course: {
                institutionId: institution.id
              }
            }
          }
        },
        select: {
          id: true,
          name: true
        }
      });
      
      console.log(`${institution.name}: ${institutionTags.length} tags`);
      institutionTags.forEach(tag => {
        console.log(`  - ${tag.name}`);
      });
    }
    
    console.log('\n✅ Tags API test completed!');
    
  } catch (error) {
    console.error('Error testing tags API:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testTagsAPI(); 