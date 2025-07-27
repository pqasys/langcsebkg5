const fetch = require('node-fetch');

async function createCourse() {
  try {
    // First, create the course
    const courseResponse = await fetch('http://localhost:3000/api/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.ADMIN_TOKEN // Add authentication token
      },
      body: JSON.stringify({
        title: 'Web Development Fundamentals',
        description: 'Learn the basics of web development including HTML, CSS, and JavaScript',
        price: 299.99,
        duration: 40,
        level: 'beginner',
        status: 'published',
        categoryId: '963017ff-b9e2-42eb-914a-cb4f84535225',
        departmentId: '5366c523-6fdd-4f4d-8c16-e38dca5dc583',
        institutionId: '0fc20433-04a8-492a-980f-2f36272d3952',
        startDate: '2024-04-01',
        endDate: '2024-05-01',
        maxStudents: 20
      })
    });

    if (!courseResponse.ok) {
      const errorData = await courseResponse.json().catch(() => null);
      throw new Error(`Failed to create course: ${courseResponse.statusText}${errorData ? ` - ${JSON.stringify(errorData)}` : ''}`);
    }

    const course = await courseResponse.json();
    console.log('Created course:', course);

    // Get available tags
    const tagsResponse = await fetch('http://localhost:3000/api/tags', {
      headers: {
        'Authorization': 'Bearer ' + process.env.ADMIN_TOKEN
      }
    });
    
    if (!tagsResponse.ok) {
      const errorData = await tagsResponse.json().catch(() => null);
      throw new Error(`Failed to fetch tags: ${tagsResponse.statusText}${errorData ? ` - ${JSON.stringify(errorData)}` : ''}`);
    }

    const tags = await tagsResponse.json();
    console.log('Available tags:', tags);

    // Find Web Development and Programming tags
    const webDevTag = tags.find(t => t.name === 'Web Development');
    const programmingTag = tags.find(t => t.name === 'Programming');

    if (!webDevTag || !programmingTag) {
      throw new Error('Required tags not found');
    }

    // Add tags to the course
    const addTagPromises = [webDevTag, programmingTag].map(tag =>
      fetch(`http://localhost:3000/api/courses/${course.id}/tags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + process.env.ADMIN_TOKEN
        },
        body: JSON.stringify({ tagId: tag.id })
      })
    );

    const tagResponses = await Promise.all(addTagPromises);
    const tagResults = await Promise.all(tagResponses.map(async r => {
      if (!r.ok) {
        const errorData = await r.json().catch(() => null);
        throw new Error(`Failed to add tag: ${r.statusText}${errorData ? ` - ${JSON.stringify(errorData)}` : ''}`);
      }
      return r.json();
    }));

    console.log('Added tags to course:', tagResults);

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Check if ADMIN_TOKEN is set
if (!process.env.ADMIN_TOKEN) {
  console.error('Error: ADMIN_TOKEN environment variable is not set');
  process.exit(1);
}

createCourse(); 