import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testSlugAPI() {
  console.log('🧪 Testing slug-based institution API...\n');

  try {
    // Get all institutions with their slugs
    const institutions = await prisma.institution.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        isApproved: true,
        status: true
      }
    });

    console.log('📋 Current institutions with slugs:');
    institutions.forEach(inst => {
      console.log(`   "${inst.name}" → /institutions/${inst.slug}`);
      console.log(`     ID: ${inst.id}`);
      console.log(`     Status: ${inst.status}, Approved: ${inst.isApproved}`);
      console.log('');
    });

    // Test the slug-based API endpoint
    console.log('🌐 Testing API endpoints...');
    
    for (const institution of institutions) {
      try {
        const response = await fetch(`http://localhost:3000/api/institutions/slug/${institution.slug}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ /api/institutions/slug/${institution.slug} - SUCCESS`);
          console.log(`   Name: ${data.name}`);
          console.log(`   Courses: ${data.courses?.length || 0}`);
        } else {
          console.log(`❌ /api/institutions/slug/${institution.slug} - FAILED (${response.status})`);
        }
      } catch (error) {
        console.log(`❌ /api/institutions/slug/${institution.slug} - ERROR: ${error}`);
      }
    }

    console.log('\n🎉 Slug-based API testing completed!');
    console.log('\n📝 Next steps:');
    console.log('   1. Start the development server: npm run dev');
    console.log('   2. Visit: http://localhost:3000/institutions');
    console.log('   3. Click on institution links to test slug-based URLs');
    console.log('   4. Verify SEO-friendly URLs are working correctly');

  } catch (error) {
    console.error('❌ Error testing slug API:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testSlugAPI();
