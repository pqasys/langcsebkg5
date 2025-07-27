const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Define institution data
  const institutionData = [
    {
      name: 'Tech University',
      email: 'contact@techuniversity.edu',
      institutionEmail: 'info@techuniversity.edu',
      description: 'Leading institution in technology and innovation',
      country: 'United States',
      city: 'San Francisco',
      state: 'CA',
      address: '123 Tech Street',
      telephone: '+1-555-0123',
      contactName: 'John Smith',
      contactJobTitle: 'Admissions Director',
      contactPhone: '+1-555-0124',
      contactEmail: 'john.smith@techuniversity.edu',
      status: 'ACTIVE',
      isApproved: true
    },
    {
      name: 'Business Academy',
      email: 'contact@businessacademy.edu',
      institutionEmail: 'info@businessacademy.edu',
      description: 'Premier business education institution',
      country: 'United Kingdom',
      city: 'London',
      state: 'Greater London',
      address: '456 Business Avenue',
      telephone: '+44-20-1234-5678',
      contactName: 'Sarah Johnson',
      contactJobTitle: 'Academic Director',
      contactPhone: '+44-20-1234-5679',
      contactEmail: 'sarah.johnson@businessacademy.edu',
      status: 'ACTIVE',
      isApproved: true
    }
  ];

  // Create or get existing institutions
  const institutions = await Promise.all(
    institutionData.map(async (data) => {
      const existingInstitution = await prisma.institution.findUnique({
        where: { email: data.email }
      });

      if (existingInstitution) {
        return existingInstitution;
      }

      return prisma.institution.create({
        data
      });
    })
  );

  console.log('Created/Retrieved institutions:', institutions);

  // Create departments for each institution
  const departments = await Promise.all(
    institutions.flatMap(async (institution) => {
      const departmentData = [
        {
          name: 'Computer Science',
          description: 'Computer Science and Software Engineering',
          institutionId: institution.id
        },
        {
          name: 'Business Administration',
          description: 'Business and Management Studies',
          institutionId: institution.id
        },
        {
          name: 'Design',
          description: 'Design and Creative Arts',
          institutionId: institution.id
        }
      ];

      return Promise.all(
        departmentData.map(async (data) => {
          const existingDepartment = await prisma.department.findFirst({
            where: {
              name: data.name,
              institutionId: institution.id
            }
          });

          if (existingDepartment) {
            return existingDepartment;
          }

          return prisma.department.create({
            data
          });
        })
      );
    })
  );

  console.log('Created/Retrieved departments:', departments);

  // Define tag data
  const tagData = [
    {
      name: 'Programming',
      description: 'Programming and software development courses'
    },
    {
      name: 'Business',
      description: 'Business and management courses'
    },
    {
      name: 'Design',
      description: 'Design and creative courses'
    },
    {
      name: 'Language',
      description: 'Language learning courses'
    },
    {
      name: 'Science',
      description: 'Science and technology courses'
    },
    {
      name: 'Data Science',
      description: 'Data analysis and machine learning courses'
    },
    {
      name: 'Web Development',
      description: 'Web development and design courses'
    },
    {
      name: 'Marketing',
      description: 'Digital marketing and business strategy courses'
    }
  ];

  // Create or update tags
  const tags = await Promise.all(
    tagData.map(async (tag) => {
      const existingTag = await prisma.tag.findUnique({
        where: { name: tag.name }
      });

      if (existingTag) {
        return existingTag;
      }

      return prisma.tag.create({
        data: tag
      });
    })
  );

  console.log('Created/Retrieved tags:', tags);

  // Create sample courses
  const courses = await Promise.all(
    departments.flatMap(async (departmentGroup) => {
      const courses = [];
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 30); // Start 30 days from now
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 90); // 90 days duration

      for (const department of departmentGroup) {
        const courseData = [];
        
        if (department.name === 'Computer Science') {
          courseData.push(
            {
              title: 'Introduction to Programming',
              description: 'Learn the fundamentals of programming with Python',
              price: 999.99,
              duration: 40,
              category: 'Programming',
              level: 'Beginner',
              startDate,
              endDate,
              maxStudents: 30,
              institutionId: department.institutionId,
              departmentId: department.id
            },
            {
              title: 'Web Development Bootcamp',
              description: 'Comprehensive web development course covering frontend and backend',
              price: 1499.99,
              duration: 60,
              category: 'Web Development',
              level: 'Intermediate',
              startDate,
              endDate,
              maxStudents: 25,
              institutionId: department.institutionId,
              departmentId: department.id
            }
          );
        } else if (department.name === 'Business Administration') {
          courseData.push(
            {
              title: 'Business Strategy',
              description: 'Learn strategic business planning and execution',
              price: 1299.99,
              duration: 45,
              category: 'Business',
              level: 'Advanced',
              startDate,
              endDate,
              maxStudents: 20,
              institutionId: department.institutionId,
              departmentId: department.id
            },
            {
              title: 'Digital Marketing',
              description: 'Master digital marketing strategies and tools',
              price: 899.99,
              duration: 30,
              category: 'Marketing',
              level: 'Intermediate',
              startDate,
              endDate,
              maxStudents: 35,
              institutionId: department.institutionId,
              departmentId: department.id
            }
          );
        } else if (department.name === 'Design') {
          courseData.push(
            {
              title: 'UI/UX Design',
              description: 'Learn user interface and experience design principles',
              price: 1199.99,
              duration: 50,
              category: 'Design',
              level: 'Intermediate',
              startDate,
              endDate,
              maxStudents: 25,
              institutionId: department.institutionId,
              departmentId: department.id
            },
            {
              title: 'Graphic Design Fundamentals',
              description: 'Master the basics of graphic design and visual communication',
              price: 799.99,
              duration: 35,
              category: 'Design',
              level: 'Beginner',
              startDate,
              endDate,
              maxStudents: 30,
              institutionId: department.institutionId,
              departmentId: department.id
            }
          );
        }

        for (const data of courseData) {
          const existingCourse = await prisma.course.findFirst({
            where: {
              title: data.title,
              institutionId: department.institutionId
            }
          });

          if (!existingCourse) {
            const newCourse = await prisma.course.create({
              data
            });
            courses.push(newCourse);
          } else {
            courses.push(existingCourse);
          }
        }
      }
      return courses;
    })
  );

  console.log('Created/Retrieved courses:', courses);

  // Assign relevant tags to each course
  for (const courseGroup of courses) {
    for (const course of courseGroup) {
      const relevantTags = tags.filter(tag => {
        const courseTitle = course.title.toLowerCase();
        const courseDescription = course.description.toLowerCase();
        const tagName = tag.name.toLowerCase();
        return courseTitle.includes(tagName) || courseDescription.includes(tagName);
      });

      // If no relevant tags found, assign 2 random tags
      const tagsToAssign = relevantTags.length > 0 
        ? relevantTags 
        : tags.sort(() => 0.5 - Math.random()).slice(0, 2);

      // Check for existing tag assignments
      const existingTags = await prisma.courseTag.findMany({
        where: { courseId: course.id }
      });

      const existingTagIds = new Set(existingTags.map(et => et.tagId));

      // Only create new tag assignments
      await Promise.all(
        tagsToAssign
          .filter(tag => !existingTagIds.has(tag.id))
          .map(tag =>
            prisma.courseTag.create({
              data: {
                courseId: course.id,
                tagId: tag.id
              }
            })
          )
      );
    }
  }

  console.log('Assigned tags to courses');
}

main()
  .catch((e) => {
    logger.error('An error occurred');
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 