import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

async function ensureUniqueSlug(baseSlug: string, existingId?: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    const existing = await prisma.course.findFirst({
      where: {
        slug: slug,
        ...(existingId && { id: { not: existingId } })
      }
    });
    
    if (!existing) {
      return slug;
    }
    
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

async function addCourseSlugs() {
  console.log('🔗 Adding SEO-friendly slugs to courses...\n');

  try {
    // Get all courses without slugs
    const courses = await prisma.course.findMany({
      where: {
        slug: null
      },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        institutionId: true
      }
    });

    console.log(`📋 Found ${courses.length} courses without slugs`);

    if (courses.length === 0) {
      console.log('✅ All courses already have slugs!');
      return;
    }

    // Generate and assign slugs
    for (const course of courses) {
      const baseSlug = generateSlug(course.title);
      const uniqueSlug = await ensureUniqueSlug(baseSlug, course.id);
      
      await prisma.course.update({
        where: { id: course.id },
        data: { slug: uniqueSlug }
      });

      console.log(`✅ "${course.title}" → ${uniqueSlug}`);
    }

    console.log('\n🎉 Successfully added slugs to all courses!');

    // Verify the results
    const allCourses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        institutionId: true
      },
      take: 10 // Show first 10 for verification
    });

    console.log('\n📋 Sample course slugs:');
    allCourses.forEach(course => {
      console.log(`   "${course.title}" → /courses/${course.slug}`);
      console.log(`     Status: ${course.status}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error adding course slugs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addCourseSlugs();
