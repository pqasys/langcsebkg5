import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting tag population...');

    // Define tag data from various sources
    const tagData = [
      // Institution Types
      {
        name: 'College',
        description: 'Post-secondary institutions offering undergraduate degrees and certificates'
      },
      {
        name: 'Community College',
        description: 'Two-year institutions offering associate degrees and vocational training'
      },
      {
        name: 'Technical Institute',
        description: 'Institutions focused on technical and vocational education'
      },
      {
        name: 'Business School',
        description: 'Institutions specializing in business and management education'
      },
      {
        name: 'Language School',
        description: 'Institutions focused on language learning and cultural education'
      },
      {
        name: 'Art School',
        description: 'Institutions specializing in visual and performing arts education'
      },
      {
        name: 'Music School',
        description: 'Institutions focused on music education and performance'
      },
      {
        name: 'Culinary School',
        description: 'Institutions specializing in culinary arts and hospitality education'
      },
      {
        name: 'Professional Training Center',
        description: 'Institutions offering professional certification and skill development'
      },
      {
        name: 'Online Learning Platform',
        description: 'Digital platforms offering online courses and educational content'
      },
      {
        name: 'Research Institute',
        description: 'Institutions focused on research and advanced studies'
      },
      {
        name: 'Vocational School',
        description: 'Institutions providing hands-on training for specific trades and careers'
      },
      {
        name: 'Adult Education Center',
        description: 'Institutions offering continuing education and adult learning programs'
      },
      {
        name: 'International School',
        description: 'Institutions offering international curriculum and multicultural education'
      },

      // Course Categories and Subcategories
      {
        name: 'Technology',
        description: 'Courses related to technology, programming, and digital skills'
      },
      {
        name: 'Web Development',
        description: 'Web development and design courses'
      },
      {
        name: 'Mobile Development',
        description: 'Mobile app development courses'
      },
      {
        name: 'Data Science',
        description: 'Data analysis and machine learning courses'
      },
      {
        name: 'Artificial Intelligence',
        description: 'AI and machine learning courses'
      },
      {
        name: 'Cloud Computing',
        description: 'Cloud platforms and services courses'
      },
      {
        name: 'Cybersecurity',
        description: 'Information security and network protection courses'
      },
      {
        name: 'DevOps',
        description: 'Development operations and deployment courses'
      },
      {
        name: 'Game Development',
        description: 'Video game design and development courses'
      },
      {
        name: 'Blockchain',
        description: 'Blockchain technology and cryptocurrency courses'
      },
      {
        name: 'IoT',
        description: 'Internet of Things and connected devices courses'
      },
      {
        name: 'Business',
        description: 'Business and management courses'
      },
      {
        name: 'Business Administration',
        description: 'General business management courses'
      },
      {
        name: 'Marketing',
        description: 'Marketing and advertising courses'
      },
      {
        name: 'Finance',
        description: 'Financial management and accounting courses'
      },
      {
        name: 'Human Resources',
        description: 'HR management and organizational behavior courses'
      },
      {
        name: 'Project Management',
        description: 'Project planning and execution courses'
      },
      {
        name: 'Entrepreneurship',
        description: 'Business startup and innovation courses'
      },
      {
        name: 'Digital Marketing',
        description: 'Online marketing and social media courses'
      },
      {
        name: 'Business Analytics',
        description: 'Data analysis for business decision making'
      },
      {
        name: 'Supply Chain',
        description: 'Supply chain and logistics management courses'
      },
      {
        name: 'International Business',
        description: 'Global business and trade courses'
      },
      {
        name: 'Design',
        description: 'Design and creative courses'
      },
      {
        name: 'Graphic Design',
        description: 'Visual design and communication courses'
      },
      {
        name: 'UI/UX Design',
        description: 'User interface and experience design courses'
      },
      {
        name: 'Interior Design',
        description: 'Space planning and interior decoration courses'
      },
      {
        name: 'Fashion Design',
        description: 'Fashion and textile design courses'
      },
      {
        name: 'Industrial Design',
        description: 'Product and industrial design courses'
      },
      {
        name: 'Architecture',
        description: 'Building design and construction courses'
      },
      {
        name: 'Digital Art',
        description: 'Digital media and art creation courses'
      },
      {
        name: 'Animation',
        description: 'Motion graphics and animation courses'
      },
      {
        name: 'Photography',
        description: 'Photography and image editing courses'
      },
      {
        name: 'Video Production',
        description: 'Video creation and editing courses'
      },
      {
        name: 'Language',
        description: 'Language learning courses'
      },
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
        name: 'Chinese',
        description: 'Chinese language courses'
      },
      {
        name: 'Japanese',
        description: 'Japanese language courses'
      },
      {
        name: 'Arabic',
        description: 'Arabic language courses'
      },
      {
        name: 'Business Communication',
        description: 'Professional communication skills courses'
      },
      {
        name: 'Public Speaking',
        description: 'Presentation and public speaking courses'
      },
      {
        name: 'Academic Writing',
        description: 'Research and academic writing courses'
      },
      {
        name: 'Science',
        description: 'Scientific and technical courses'
      },
      {
        name: 'Biology',
        description: 'Biological sciences courses'
      },
      {
        name: 'Chemistry',
        description: 'Chemical sciences courses'
      },
      {
        name: 'Physics',
        description: 'Physical sciences courses'
      },
      {
        name: 'Mathematics',
        description: 'Mathematical and statistical courses'
      },
      {
        name: 'Environmental Science',
        description: 'Environmental studies courses'
      },
      {
        name: 'Astronomy',
        description: 'Space and astronomical studies courses'
      },
      {
        name: 'Geology',
        description: 'Earth sciences courses'
      },
      {
        name: 'Psychology',
        description: 'Psychological studies courses'
      },
      {
        name: 'Neuroscience',
        description: 'Brain and nervous system studies courses'
      },
      {
        name: 'Computer Science',
        description: 'Computer and information science courses'
      },
      {
        name: 'Arts',
        description: 'Creative arts courses'
      },
      {
        name: 'Fine Arts',
        description: 'Traditional and contemporary art courses'
      },
      {
        name: 'Music',
        description: 'Musical performance and theory courses'
      },
      {
        name: 'Dance',
        description: 'Dance and choreography courses'
      },
      {
        name: 'Theater',
        description: 'Drama and theatrical arts courses'
      },
      {
        name: 'Film Studies',
        description: 'Cinema and film production courses'
      },
      {
        name: 'Creative Writing',
        description: 'Writing and composition courses'
      },
      {
        name: 'Digital Media',
        description: 'Digital content creation courses'
      },
      {
        name: 'Art History',
        description: 'Historical art studies courses'
      },
      {
        name: 'Culinary Arts',
        description: 'Cooking and food preparation courses'
      },
      {
        name: 'Crafts',
        description: 'Traditional and modern crafts courses'
      },
      {
        name: 'Health',
        description: 'Health and wellness courses'
      },
      {
        name: 'Public Health',
        description: 'Community health studies courses'
      },
      {
        name: 'Nutrition',
        description: 'Diet and nutrition courses'
      },
      {
        name: 'Fitness',
        description: 'Physical fitness and exercise courses'
      },
      {
        name: 'Mental Health',
        description: 'Psychological well-being courses'
      },
      {
        name: 'Alternative Medicine',
        description: 'Complementary and alternative healing courses'
      },
      {
        name: 'Healthcare Management',
        description: 'Healthcare administration courses'
      },
      {
        name: 'Medical Technology',
        description: 'Medical equipment and technology courses'
      },
      {
        name: 'Sports Medicine',
        description: 'Athletic health and performance courses'
      },
      {
        name: 'Yoga and Meditation',
        description: 'Mind-body wellness courses'
      },
      {
        name: 'Health Informatics',
        description: 'Healthcare information systems courses'
      },
      {
        name: 'Social Sciences',
        description: 'Social and behavioral sciences courses'
      },
      {
        name: 'Sociology',
        description: 'Social behavior and society courses'
      },
      {
        name: 'Anthropology',
        description: 'Human culture and evolution courses'
      },
      {
        name: 'Political Science',
        description: 'Government and politics courses'
      },
      {
        name: 'Economics',
        description: 'Economic theory and practice courses'
      },
      {
        name: 'History',
        description: 'Historical studies courses'
      },
      {
        name: 'Philosophy',
        description: 'Philosophical thought and ethics courses'
      },
      {
        name: 'Cultural Studies',
        description: 'Cultural analysis and theory courses'
      },
      {
        name: 'Gender Studies',
        description: 'Gender and sexuality studies courses'
      },
      {
        name: 'International Relations',
        description: 'Global politics and diplomacy courses'
      },
      {
        name: 'Public Policy',
        description: 'Policy analysis and development courses'
      },
      {
        name: 'Education',
        description: 'Teaching and educational studies courses'
      },
      {
        name: 'Early Childhood Education',
        description: 'Early learning and development courses'
      },
      {
        name: 'Special Education',
        description: 'Specialized teaching methods courses'
      },
      {
        name: 'Educational Technology',
        description: 'Technology in education courses'
      },
      {
        name: 'Curriculum Development',
        description: 'Course and program design courses'
      },
      {
        name: 'Educational Leadership',
        description: 'School administration and leadership courses'
      },
      {
        name: 'Adult Education',
        description: 'Adult learning and development courses'
      },
      {
        name: 'Online Teaching',
        description: 'Digital education and e-learning courses'
      },
      {
        name: 'Educational Psychology',
        description: 'Learning and development psychology courses'
      },
      {
        name: 'Assessment and Evaluation',
        description: 'Educational measurement and testing courses'
      },
      {
        name: 'Educational Research',
        description: 'Research methods in education courses'
      },
      {
        name: 'Professional Development',
        description: 'Career advancement and skill development courses'
      },
      {
        name: 'Leadership',
        description: 'Leadership and management skills courses'
      },
      {
        name: 'Communication Skills',
        description: 'Professional communication courses'
      },
      {
        name: 'Time Management',
        description: 'Productivity and organization courses'
      },
      {
        name: 'Conflict Resolution',
        description: 'Problem-solving and mediation courses'
      },
      {
        name: 'Team Building',
        description: 'Team dynamics and collaboration courses'
      },
      {
        name: 'Career Planning',
        description: 'Career development and advancement courses'
      },
      {
        name: 'Personal Development',
        description: 'Self-improvement and growth courses'
      },
      {
        name: 'Workplace Skills',
        description: 'Essential professional skills courses'
      },
      {
        name: 'Professional Ethics',
        description: 'Business ethics and conduct courses'
      },
      {
        name: 'Digital Literacy',
        description: 'Digital skills and technology courses'
      }
    ];

    // Create or update tags
    console.log('Creating/updating tags...');
    const tags = await Promise.all(
      tagData.map(async (tag) => {
        const existingTag = await prisma.tag.findUnique({
          where: { name: tag.name }
        });

        if (existingTag) {
          return prisma.tag.update({
            where: { id: existingTag.id },
            data: {
              description: tag.description,
              updatedAt: new Date()
            }
          });
        }

        return prisma.tag.create({
          data: {
            id: uuidv4(),
            name: tag.name,
            description: tag.description,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
      })
    );

    console.log(`Successfully created/updated ${tags.length} tags`);
  } catch (error) {
    logger.error('Error populating tags:');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 