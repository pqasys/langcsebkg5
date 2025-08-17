import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyCourseSEOImplementation() {
  console.log('🔍 Verifying Course SEO-Friendly URLs Implementation...\n');

  try {
    // 1. Check database schema
    console.log('📊 1. Database Schema Verification:');
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        institutionId: true
      }
    });

    console.log(`   ✅ Found ${courses.length} courses in database`);
    
    const coursesWithSlugs = courses.filter(course => course.slug);
    console.log(`   ✅ ${coursesWithSlugs.length} courses have slugs`);
    
    const coursesWithoutSlugs = courses.filter(course => !course.slug);
    if (coursesWithoutSlugs.length > 0) {
      console.log(`   ⚠️  ${coursesWithoutSlugs.length} courses missing slugs:`);
      coursesWithoutSlugs.forEach(course => {
        console.log(`      - ${course.title} (ID: ${course.id})`);
      });
    }

    // 2. Verify slug format and uniqueness
    console.log('\n🔗 2. Slug Format and Uniqueness Verification:');
    const slugs = coursesWithSlugs.map(course => course.slug!);
    const uniqueSlugs = new Set(slugs);
    
    if (slugs.length === uniqueSlugs.size) {
      console.log('   ✅ All slugs are unique');
    } else {
      console.log('   ❌ Duplicate slugs found!');
      const duplicates = slugs.filter((slug, index) => slugs.indexOf(slug) !== index);
      console.log(`      Duplicates: ${duplicates.join(', ')}`);
    }

    // 3. Verify slug format
    const slugRegex = /^[a-z0-9-]+$/;
    const validSlugs = slugs.filter(slug => slugRegex.test(slug));
    const invalidSlugs = slugs.filter(slug => !slugRegex.test(slug));
    
    if (invalidSlugs.length === 0) {
      console.log('   ✅ All slugs follow correct format (lowercase, hyphens, no special chars)');
    } else {
      console.log('   ❌ Invalid slug formats found:');
      invalidSlugs.forEach(slug => console.log(`      - ${slug}`));
    }

    // 4. Show example URLs
    console.log('\n🌐 3. Example SEO-Friendly URLs:');
    coursesWithSlugs.slice(0, 5).forEach(course => {
      console.log(`   "${course.title}" → /courses/${course.slug}`);
    });

    // 5. Check file structure
    console.log('\n📁 4. File Structure Verification:');
    const fs = require('fs');
    const path = require('path');
    
    const requiredFiles = [
      'app/courses/[slug]/page.tsx',
      'app/api/courses/slug/[slug]/route.ts',
      'app/api/courses/public/route.ts',
      'middleware.ts',
      'app/sitemap.ts'
    ];

    requiredFiles.forEach(file => {
      if (fs.existsSync(file)) {
        console.log(`   ✅ ${file} exists`);
      } else {
        console.log(`   ❌ ${file} missing`);
      }
    });

    // 6. Check middleware updates
    console.log('\n🛡️ 5. Middleware Updates Verification:');
    const middlewareContent = fs.readFileSync('middleware.ts', 'utf8');
    if (middlewareContent.includes('/courses/')) {
      console.log('   ✅ Middleware allows public access to course pages');
    } else {
      console.log('   ❌ Middleware may not allow public access to course pages');
    }

    if (middlewareContent.includes('/api/courses/slug')) {
      console.log('   ✅ Middleware allows public access to course slug API');
    } else {
      console.log('   ❌ Middleware may not allow public access to course slug API');
    }

    // 7. Check sitemap updates
    console.log('\n🗺️ 6. Sitemap Updates Verification:');
    const sitemapContent = fs.readFileSync('app/sitemap.ts', 'utf8');
    if (sitemapContent.includes('/courses/general-english')) {
      console.log('   ✅ Sitemap includes course detail pages');
    } else {
      console.log('   ❌ Sitemap may not include course detail pages');
    }

    // 8. Summary
    console.log('\n📋 7. Implementation Summary:');
    console.log(`   • Total courses: ${courses.length}`);
    console.log(`   • Courses with slugs: ${coursesWithSlugs.length}`);
    console.log(`   • Unique slugs: ${uniqueSlugs.size}`);
    console.log(`   • Valid slug formats: ${validSlugs.length}`);
    
    const allChecksPassed = coursesWithSlugs.length === courses.length && 
                           slugs.length === uniqueSlugs.size && 
                           invalidSlugs.length === 0;
    
    if (allChecksPassed) {
      console.log('\n🎉 SUCCESS: Course SEO-Friendly URLs Implementation Complete!');
      console.log('\n📝 Next Steps:');
      console.log('   1. Start development server: npm run dev');
      console.log('   2. Visit: http://localhost:3000/courses');
      console.log('   3. Test slug-based URLs by clicking on course links');
      console.log('   4. Verify URLs like: /courses/general-english');
      console.log('   5. Check that old UUID URLs are handled gracefully');
    } else {
      console.log('\n⚠️  WARNING: Some issues found. Please review and fix before proceeding.');
    }

  } catch (error) {
    console.error('❌ Error during verification:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyCourseSEOImplementation();
