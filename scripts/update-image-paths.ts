import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function updateImagePaths() {
  try {
    // Get all institutions
    const institutions = await prisma.institution.findMany({
      select: {
        id: true,
        logoUrl: true,
        facilities: true,
      },
    });

    console.log(`Found ${institutions.length} institutions to update`);

    for (const institution of institutions) {
      const updates: any = {};

      // Update logo URL if it exists
      if (institution.logoUrl && institution.logoUrl.startsWith('/api/images/')) {
        updates.logoUrl = institution.logoUrl.replace('/api/images/', '/uploads/');
      }

      // Update facilities URLs if they exist
      if (institution.facilities) {
        try {
          const facilities = JSON.parse(institution.facilities as string);
          if (Array.isArray(facilities)) {
            const updatedFacilities = facilities.map((url: string) => 
              url.startsWith('/api/images/') ? url.replace('/api/images/', '/uploads/') : url
            );
            updates.facilities = JSON.stringify(updatedFacilities);
          }
        } catch (error) {
          logger.error('Error parsing facilities for institution ${institution.id}:');
        }
      }

      // Only update if there are changes
      if (Object.keys(updates).length > 0) {
        await prisma.institution.update({
          where: { id: institution.id },
          data: updates,
        });
        console.log(`Updated institution ${institution.id}`);
      }
    }

    console.log('Image path update completed successfully');
  } catch (error) {
    logger.error('Error updating image paths:');
  } finally {
    await prisma.$disconnect();
  }
}

updateImagePaths(); 