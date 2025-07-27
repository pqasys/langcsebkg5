import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

const languageCategories = [
  {
    name: 'English',
    description: 'English language courses'
  },
  {
    name: 'Spanish',
    description: 'Spanish language courses'
  },
  {
    name: 'French',
    description: 'French language courses'
  },
  {
    name: 'German',
    description: 'German language courses'
  },
  {
    name: 'Italian',
    description: 'Italian language courses'
  },
  {
    name: 'Portuguese',
    description: 'Portuguese language courses'
  },
  {
    name: 'Russian',
    description: 'Russian language courses'
  },
  {
    name: 'Chinese',
    description: 'Chinese language courses'
  },
  {
    name: 'Japanese',
    description: 'Japanese language courses'
  },
  {
    name: 'Korean',
    description: 'Korean language courses'
  },
  {
    name: 'Arabic',
    description: 'Arabic language courses'
  },
  {
    name: 'Hindi',
    description: 'Hindi language courses'
  },
  {
    name: 'Dutch',
    description: 'Dutch language courses'
  },
  {
    name: 'Turkish',
    description: 'Turkish language courses'
  }
];

async function updateCategories() {
  try {
    console.log('Starting category update...');

    // First, create new categories
    console.log('Creating new language categories...');
    const categories = await Promise.all(
      languageCategories.map(category =>
        prisma.category.create({
          data: {
            id: uuidv4(),
            name: category.name,
            description: category.description,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })
      )
    );
    console.log('Created new language categories:', categories.map(c => c.name));

    // Update existing courses to use appropriate language category
    console.log('Updating courses with new categories...');
    const courses = await prisma.course.findMany({
      include: {
        coursetag: {
          include: {
            tag: true
          }
        }
      }
    });

    for (const course of courses) {
      // Find the primary language tag
      const languageTag = course.coursetag.find(ct => 
        languageCategories.map(lc => lc.name).includes(ct.tag.name)
      );

      if (languageTag) {
        const category = categories.find(c => c.name === languageTag.tag.name);
        if (category) {
          await prisma.course.update({
            where: { id: course.id },
            data: {
              category: {
                connect: {
                  id: category.id
                }
              }
            }
          });
          console.log(`Updated course ${course.title} to category ${category.name}`);
        }
      }
    }

    // Now we can safely delete unused categories
    console.log('Deleting unused categories...');
    const oldCategories = await prisma.category.findMany({
      where: {
        id: {
          notIn: categories.map(c => c.id)
        }
      }
    });

    for (const oldCategory of oldCategories) {
      // Check if any courses are still using this category
      const coursesUsingCategory = await prisma.course.findFirst({
        where: { categoryId: oldCategory.id }
      });

      if (!coursesUsingCategory) {
        await prisma.category.delete({
          where: { id: oldCategory.id }
        });
        console.log(`Deleted unused category: ${oldCategory.name}`);
      } else {
        console.log(`Category ${oldCategory.name} is still in use, skipping deletion`);
      }
    }

    console.log('Category update completed successfully');
  } catch (error) {
    logger.error('Error during category update:');
  } finally {
    await prisma.$disconnect();
  }
}

updateCategories(); 