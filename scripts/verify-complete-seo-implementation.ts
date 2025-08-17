import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyCompleteSEOImplementation() {
  console.log('🔍 Verifying Complete SEO-Friendly URLs Implementation...\n');

  try {
    // 1. Check Institution SEO Implementation
    console.log('🏫 1. Institution SEO Implementation:');
    const institutions = await prisma.institution.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        isApproved: true,
        status: true
      }
    });

    console.log(`   ✅ Found ${institutions.length} institutions in database`);
    const institutionsWithSlugs = institutions.filter(inst => inst.slug);
    console.log(`   ✅ ${institutionsWithSlugs.length} institutions have slugs`);
    
    // 2. Check Course SEO Implementation
    console.log('\n📚 2. Course SEO Implementation:');
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

    // 3. Verify all slugs are unique and properly formatted
    console.log('\n🔗 3. Slug Verification:');
    const allSlugs = [
      ...institutionsWithSlugs.map(inst => ({ type: 'institution', slug: inst.slug!, name: inst.name })),
      ...coursesWithSlugs.map(course => ({ type: 'course', slug: course.slug!, name: course.title }))
    ];
    
    const slugValues = allSlugs.map(item => item.slug);
    const uniqueSlugs = new Set(slugValues);
    
    if (slugValues.length === uniqueSlugs.size) {
      console.log('   ✅ All slugs are unique across institutions and courses');
    } else {
      console.log('   ❌ Duplicate slugs found!');
      const duplicates = slugValues.filter((slug, index) => slugValues.indexOf(slug) !== index);
      console.log(`      Duplicates: ${duplicates.join(', ')}`);
    }

    // 4. Check file structure
    console.log('\n📁 4. File Structure Verification:');
    const fs = require('fs');
    
    const requiredFiles = [
      'app/institutions/[slug]/page.tsx',
      'app/api/institutions/slug/[slug]/route.ts',
      'app/courses/[slug]/page.tsx',
      'app/api/courses/slug/[slug]/route.ts',
      'app/api/courses/public/route.ts',
      'middleware.ts',
      'app/sitemap.ts'
    ];

    let allFilesExist = true;
    requiredFiles.forEach(file => {
      if (fs.existsSync(file)) {
        console.log(`   ✅ ${file} exists`);
      } else {
        console.log(`   ❌ ${file} missing`);
        allFilesExist = false;
      }
    });

    // 5. Check middleware configuration
    console.log('\n🛡️ 5. Middleware Configuration:');
    const middlewareContent = fs.readFileSync('middleware.ts', 'utf8');
    
    const middlewareChecks = [
      { check: '/institutions/', name: 'Institution pages' },
      { check: '/api/institutions/slug', name: 'Institution slug API' },
      { check: '/courses/', name: 'Course pages' },
      { check: '/api/courses/slug', name: 'Course slug API' },
      { check: '/api/courses/public', name: 'Public courses API' }
    ];

    middlewareChecks.forEach(({ check, name }) => {
      if (middlewareContent.includes(check)) {
        console.log(`   ✅ ${name} - Public access allowed`);
      } else {
        console.log(`   ❌ ${name} - Public access may be restricted`);
      }
    });

    // 6. Check sitemap configuration
    console.log('\n🗺️ 6. Sitemap Configuration:');
    const sitemapContent = fs.readFileSync('app/sitemap.ts', 'utf8');
    
    const sitemapChecks = [
      { check: '/institutions/xyz-language-school', name: 'Institution detail pages' },
      { check: '/courses/general-english', name: 'Course detail pages' }
    ];

    sitemapChecks.forEach(({ check, name }) => {
      if (sitemapContent.includes(check)) {
        console.log(`   ✅ ${name} - Included in sitemap`);
      } else {
        console.log(`   ❌ ${name} - May not be included in sitemap`);
      }
    });

    // 7. Show example URLs
    console.log('\n🌐 7. Example SEO-Friendly URLs:');
    console.log('   Institutions:');
    institutionsWithSlugs.slice(0, 3).forEach(inst => {
      console.log(`      "${inst.name}" → /institutions/${inst.slug}`);
    });
    
    console.log('   Courses:');
    coursesWithSlugs.slice(0, 3).forEach(course => {
      console.log(`      "${course.title}" → /courses/${course.slug}`);
    });

    // 8. Summary
    console.log('\n📋 8. Complete Implementation Summary:');
    console.log(`   • Total institutions: ${institutions.length}`);
    console.log(`   • Institutions with slugs: ${institutionsWithSlugs.length}`);
    console.log(`   • Total courses: ${courses.length}`);
    console.log(`   • Courses with slugs: ${coursesWithSlugs.length}`);
    console.log(`   • Total unique slugs: ${uniqueSlugs.size}`);
    console.log(`   • All required files exist: ${allFilesExist ? 'Yes' : 'No'}`);
    
    const allChecksPassed = 
      institutionsWithSlugs.length === institutions.length &&
      coursesWithSlugs.length === courses.length &&
      slugValues.length === uniqueSlugs.size &&
      allFilesExist;
    
    if (allChecksPassed) {
      console.log('\n🎉 SUCCESS: Complete SEO-Friendly URLs Implementation!');
      console.log('\n📝 Next Steps:');
      console.log('   1. Start development server: npm run dev');
      console.log('   2. Visit: http://localhost:3000/institutions');
      console.log('   3. Visit: http://localhost:3000/courses');
      console.log('   4. Test slug-based URLs by clicking on links');
      console.log('   5. Verify URLs like:');
      console.log('      - /institutions/xyz-language-school');
      console.log('      - /courses/general-english');
      console.log('   6. Check that old UUID URLs are handled gracefully');
    } else {
      console.log('\n⚠️  WARNING: Some issues found. Please review and fix before proceeding.');
    }

  } catch (error) {
    console.error('❌ Error during verification:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyCompleteSEOImplementation();
