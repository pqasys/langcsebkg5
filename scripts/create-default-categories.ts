import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultCategories = [
  {
    name: 'General English',
    description: 'General English language courses for all levels',
    slug: 'general-english'
  },
  {
    name: 'Business English',
    description: 'English courses focused on business communication',
    slug: 'business-english'
  },
  {
    name: 'Academic English',
    description: 'English for academic purposes and study',
    slug: 'academic-english'
  },
  {
    name: 'Exam Preparation',
    description: 'Courses preparing for English proficiency exams',
    slug: 'exam-preparation'
  },
  {
    name: 'Conversation & Speaking',
    description: 'Focused on speaking and conversation skills',
    slug: 'conversation-speaking'
  },
  {
    name: 'Grammar & Writing',
    description: 'Grammar and writing skills development',
    slug: 'grammar-writing'
  },
  {
    name: 'Pronunciation',
    description: 'Pronunciation and accent training',
    slug: 'pronunciation'
  },
  {
    name: 'Young Learners',
    description: 'English courses designed for children and teenagers',
    slug: 'young-learners'
  }
];

async function createDefaultCategories() {
  try {
    console.log('Checking for existing categories...');
    
    // Check if categories already exist
    const existingCategories = await prisma.category.findMany();
    
    if (existingCategories.length > 0) {
      console.log(`Found ${existingCategories.length} existing categories. Skipping creation.`);
      console.log('Existing categories:', existingCategories.map(c => c.name));
      return;
    }
    
    console.log('No categories found. Creating default categories...');
    
    // Create default categories
    const createdCategories = await Promise.all(
      defaultCategories.map(async (category) => {
        const now = new Date();
        return await prisma.category.create({
          data: {
            name: category.name,
            description: category.description,
            slug: category.slug,
            createdAt: now,
            updatedAt: now,
          },
        });
      })
    );
    
    console.log(`Successfully created ${createdCategories.length} default categories:`);
    createdCategories.forEach(category => {
      console.log(`- ${category.name}: ${category.description}`);
    });
    
  } catch (error) {
    console.error('Error creating default categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
createDefaultCategories(); 