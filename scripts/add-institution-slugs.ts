import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateSlug(name: string): string {
  return name
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
    const existing = await prisma.institution.findFirst({
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

async function addInstitutionSlugs() {
  console.log('🔗 Adding SEO-friendly slugs to institutions...\n');

  try {
    // Get all institutions without slugs
    const institutions = await prisma.institution.findMany({
      where: {
        slug: null
      },
      select: {
        id: true,
        name: true,
        slug: true
      }
    });

    console.log(`📋 Found ${institutions.length} institutions without slugs`);

    if (institutions.length === 0) {
      console.log('✅ All institutions already have slugs!');
      return;
    }

    // Generate and assign slugs
    for (const institution of institutions) {
      const baseSlug = generateSlug(institution.name);
      const uniqueSlug = await ensureUniqueSlug(baseSlug, institution.id);
      
      await prisma.institution.update({
        where: { id: institution.id },
        data: { slug: uniqueSlug }
      });

      console.log(`✅ "${institution.name}" → ${uniqueSlug}`);
    }

    console.log('\n🎉 Successfully added slugs to all institutions!');

    // Verify the results
    const allInstitutions = await prisma.institution.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        isApproved: true,
        status: true
      }
    });

    console.log('\n📋 Final institution slugs:');
    allInstitutions.forEach(inst => {
      console.log(`   "${inst.name}" → /institutions/${inst.slug}`);
      console.log(`     Status: ${inst.status}, Approved: ${inst.isApproved}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error adding institution slugs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addInstitutionSlugs();
