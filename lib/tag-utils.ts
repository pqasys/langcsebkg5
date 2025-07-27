import { prisma } from './prisma';

interface CourseData {
  title: string;
  description: string;
  category: string | { id: string; name: string };
}

// Map of category to potential tags
const categoryTagMap: { [key: string]: string[] } = {
  'Technology': ['Programming', 'Web Development', 'Data Science'],
  'Business': ['Business', 'Marketing'],
  'Design': ['Design'],
  'Language': ['Language'],
  'Science': ['Science'],
  'Arts': ['Arts'],
  'Health': ['Health']
};

// Add keyword mappings for technology-related courses
const keywordTagMap: Record<string, string[]> = {
  'cyber': ['Technology', 'Cybersecurity'],
  'security': ['Technology', 'Cybersecurity'],
  'cybersecurity': ['Technology', 'Cybersecurity'],
  'programming': ['Technology', 'Programming'],
  'coding': ['Technology', 'Programming'],
  'software': ['Technology', 'Software Development'],
  'web': ['Technology', 'Web Development'],
  'mobile': ['Technology', 'Mobile Development'],
  'data': ['Technology', 'Data Science'],
  'ai': ['Technology', 'Artificial Intelligence'],
  'machine learning': ['Technology', 'Artificial Intelligence'],
  'cloud': ['Technology', 'Cloud Computing'],
  'devops': ['Technology', 'DevOps'],
  'game': ['Technology', 'Game Development'],
  'blockchain': ['Technology', 'Blockchain'],
  'iot': ['Technology', 'IoT'],
  'business': ['Business'],
  'marketing': ['Marketing'],
  'design': ['Design'],
  'language': ['Language'],
  'science': ['Science'],
  'art': ['Arts'],
  'health': ['Health'],
  'python': ['Programming'],
  'javascript': ['Programming', 'Web Development'],
  'html': ['Web Development'],
  'css': ['Web Development'],
  'react': ['Web Development'],
  'node': ['Web Development'],
  'database': ['Data Science'],
  'analytics': ['Data Science'],
  'strategy': ['Business'],
  'management': ['Business'],
  'digital': ['Marketing'],
  'social media': ['Marketing'],
  'ui': ['Design'],
  'ux': ['Design'],
  'graphic': ['Design'],
  'english': ['Language', 'English'],
  'spanish': ['Language', 'Spanish'],
  'french': ['Language', 'French'],
  'biology': ['Science'],
  'chemistry': ['Science'],
  'physics': ['Science'],
  'drawing': ['Arts'],
  'painting': ['Arts'],
  'music': ['Arts'],
  'fitness': ['Health'],
  'nutrition': ['Health'],
  'wellness': ['Health']
};

export async function assignTagsToCourse(courseData: CourseData): Promise<string[]> {
  const { title, description, category } = courseData;
  const textToSearch = `${title} ${description}`.toLowerCase();
  
  // Get all existing tags
  const allTags = await prisma.tag.findMany();
  const tagMap = new Map(allTags.map(tag => [tag.name.toLowerCase(), tag.id]));
  
  // Set to store unique tag IDs
  const tagIds = new Set<string>();
  
  // First, add the category as a top-level tag
  if (category) {
    const categoryName = typeof category === 'string' ? category : category.name;
    const categoryTag = allTags.find(tag => 
      tag.name.toLowerCase() === categoryName.toLowerCase() || 
      tag.slug.toLowerCase() === categoryName.toLowerCase()
    );
    if (categoryTag) {
      tagIds.add(categoryTag.id);
    }
  }
  
  // Add tags based on category mapping
  const categoryName = typeof category === 'string' ? category : category.name;
  if (categoryTagMap[categoryName]) {
    categoryTagMap[categoryName].forEach(tagName => {
      const tagId = tagMap.get(tagName.toLowerCase());
      if (tagId) tagIds.add(tagId);
    });
  }
  
  // Add tags based on keywords in title and description
  Object.entries(keywordTagMap).forEach(([keyword, tagNames]) => {
    if (textToSearch.includes(keyword.toLowerCase())) {
      tagNames.forEach(tagName => {
        const tagId = tagMap.get(tagName.toLowerCase());
        if (tagId) tagIds.add(tagId);
      });
    }
  });
  
  // If no tags were found, assign some default tags based on category
  if (tagIds.size === 0 && categoryTagMap[categoryName]) {
    categoryTagMap[categoryName].slice(0, 2).forEach(tagName => {
      const tagId = tagMap.get(tagName.toLowerCase());
      if (tagId) tagIds.add(tagId);
    });
  }
  
  return Array.from(tagIds);
} 