export interface CourseCategory {
  id: string;
  name: string;
  description: string;
  slug: string;
}

export const courseCategories: CourseCategory[] = [
  {
    id: 'general-language',
    name: 'General Language',
    description: 'Comprehensive language courses covering all aspects of the target language',
    slug: 'general-language'
  },
  {
    id: 'business-language',
    name: 'Business Language',
    description: 'Language courses focused on business communication and professional contexts',
    slug: 'business-language'
  },
  {
    id: 'academic-language',
    name: 'Academic Language',
    description: 'Language courses designed for academic study and research',
    slug: 'academic-language'
  },
  {
    id: 'exam-preparation',
    name: 'Exam Preparation',
    description: 'Courses preparing students for language proficiency exams (IELTS, TOEFL, Cambridge, DELF, DELE, etc.)',
    slug: 'exam-preparation'
  },
  {
    id: 'conversation',
    name: 'Conversation',
    description: 'Focus on speaking and listening skills for everyday communication',
    slug: 'conversation'
  },
  {
    id: 'grammar',
    name: 'Grammar',
    description: 'In-depth study of language grammar rules and structures',
    slug: 'grammar'
  },
  {
    id: 'pronunciation',
    name: 'Pronunciation',
    description: 'Courses focusing on correct pronunciation and accent reduction',
    slug: 'pronunciation'
  },
  {
    id: 'writing',
    name: 'Writing Skills',
    description: 'Development of writing skills for various purposes and contexts',
    slug: 'writing-skills'
  },
  {
    id: 'reading',
    name: 'Reading Comprehension',
    description: 'Improving reading skills and comprehension strategies',
    slug: 'reading-comprehension'
  },
  {
    id: 'listening',
    name: 'Listening Skills',
    description: 'Enhancing listening comprehension and note-taking abilities',
    slug: 'listening-skills'
  },
  {
    id: 'vocabulary',
    name: 'Vocabulary Building',
    description: 'Expanding vocabulary knowledge and usage',
    slug: 'vocabulary-building'
  },
  {
    id: 'young-learners',
    name: 'Young Learners',
    description: 'Language courses designed specifically for children and teenagers',
    slug: 'young-learners'
  },
  {
    id: 'one-to-one',
    name: 'One-to-One',
    description: 'Personalized individual language lessons',
    slug: 'one-to-one'
  },
  {
    id: 'group-classes',
    name: 'Group Classes',
    description: 'Language courses taught in small group settings',
    slug: 'group-classes'
  },
  {
    id: 'intensive',
    name: 'Intensive Courses',
    description: 'Fast-paced language courses for rapid progress',
    slug: 'intensive-courses'
  },
  {
    id: 'summer-courses',
    name: 'Summer Courses',
    description: 'Seasonal language courses with cultural activities',
    slug: 'summer-courses'
  },
  {
    id: 'online-courses',
    name: 'Online Courses',
    description: 'Virtual language learning programs',
    slug: 'online-courses'
  },
  {
    id: 'specialized',
    name: 'Specialized Language',
    description: 'Language courses for specific industries or purposes',
    slug: 'specialized-language'
  }
]; 