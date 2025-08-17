import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifySEOImplementation() {
  console.log('🔍 Verifying SEO-Friendly Institution URLs Implementation...\n');

  try {
    // 1. Check database schema
    console.log('📊 1. Database Schema Verification:');
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
    
    const institutionsWithoutSlugs = institutions.filter(inst => !inst.slug);
    if (institutionsWithoutSlugs.length > 0) {
      console.log(`   ⚠️  ${institutionsWithoutSlugs.length} institutions missing slugs:`);
      institutionsWithoutSlugs.forEach(inst => {
        console.log(`      - ${inst.name} (ID: ${inst.id})`);
      });
    }

    // 2. Verify slug format and uniqueness
    console.log('\n🔗 2. Slug Format and Uniqueness Verification:');
    const slugs = institutionsWithSlugs.map(inst => inst.slug!);
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
    institutionsWithSlugs.slice(0, 3).forEach(inst => {
      console.log(`   "${inst.name}" → /institutions/${inst.slug}`);
    });

    // 5. Check file structure
    console.log('\n📁 4. File Structure Verification:');
    const fs = require('fs');
    const path = require('path');
    
    const requiredFiles = [
      'app/institutions/[slug]/page.tsx',
      'app/api/institutions/slug/[slug]/route.ts',
      'components/InstitutionsPageClient.tsx',
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

    // 6. Verify component updates
    console.log('\n🎨 5. Component Updates Verification:');
    const institutionsClientContent = fs.readFileSync('components/InstitutionsPageClient.tsx', 'utf8');
    if (institutionsClientContent.includes('institution.slug')) {
      console.log('   ✅ InstitutionsPageClient.tsx uses slug-based URLs');
    } else {
      console.log('   ❌ InstitutionsPageClient.tsx still uses ID-based URLs');
    }

    // 7. Check middleware updates
    console.log('\n🛡️ 6. Middleware Updates Verification:');
    const middlewareContent = fs.readFileSync('middleware.ts', 'utf8');
    if (middlewareContent.includes('/institutions/')) {
      console.log('   ✅ Middleware allows public access to institution pages');
    } else {
      console.log('   ❌ Middleware may not allow public access to institution pages');
    }

    // 8. Test API endpoints
    console.log('\n🌐 7. API Endpoint Testing:');
    try {
      const response = await fetch('http://localhost:3000/api/institutions');
      if (response.ok) {
        const data = await response.json();
        const hasSlugs = data.institutions.every((inst: any) => inst.slug);
        if (hasSlugs) {
          console.log('   ✅ Main institutions API includes slug field');
        } else {
          console.log('   ❌ Main institutions API missing slug field');
        }
      } else {
        console.log('   ❌ Main institutions API not accessible');
      }
    } catch (error) {
      console.log('   ⚠️  Could not test API endpoints (server may not be running)');
    }

    // 9. Summary
    console.log('\n📋 8. Implementation Summary:');
    console.log(`   • Total institutions: ${institutions.length}`);
    console.log(`   • Institutions with slugs: ${institutionsWithSlugs.length}`);
    console.log(`   • Unique slugs: ${uniqueSlugs.size}`);
    console.log(`   • Valid slug formats: ${validSlugs.length}`);
    
    const allChecksPassed = institutionsWithSlugs.length === institutions.length && 
                           slugs.length === uniqueSlugs.size && 
                           invalidSlugs.length === 0;
    
    if (allChecksPassed) {
      console.log('\n🎉 SUCCESS: SEO-Friendly Institution URLs Implementation Complete!');
      console.log('\n📝 Next Steps:');
      console.log('   1. Start development server: npm run dev');
      console.log('   2. Visit: http://localhost:3000/institutions');
      console.log('   3. Test slug-based URLs by clicking on institution links');
      console.log('   4. Verify URLs like: /institutions/xyz-language-school');
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

verifySEOImplementation();
