export interface LiveClass {
  id: string;
  title: string;
  language: string;
  instructor: {
    id: string;
    name: string;
    avatar?: string;
  };
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  maxParticipants: number;
  currentParticipants: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  type: 'Group Session' | 'Workshop' | 'One-on-One' | 'Masterclass';
  price: number;
  currency: string;
  rating: number;
  reviews: number;
  features: string[];
  description: string;
  meetingLink?: string;
  recordingUrl?: string;
  materials?: {
    id: string;
    title: string;
    type: 'pdf' | 'video' | 'link';
    url: string;
  }[];
  tags: string[];
  isBooked: boolean;
  isCompleted: boolean;
  isCancelled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpcomingClass {
  id: string;
  title: string;
  startTime: string;
  duration: number;
  instructor: {
    name: string;
    avatar?: string;
  };
  meetingLink?: string;
  isReady: boolean; // whether the class is ready to join
}

export const upcomingClasses: UpcomingClass[] = [
  {
    id: "lc-001",
    title: "Advanced Spanish Conversation",
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    duration: 60,
    instructor: {
      name: "Dr. María González",
      avatar: "/avatars/maria-gonzalez.jpg"
    },
    meetingLink: "https://meet.google.com/abc-defg-hij",
    isReady: true
  },
  {
    id: "lc-002", 
    title: "Business English Masterclass",
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
    duration: 90,
    instructor: {
      name: "Prof. Sarah Johnson",
      avatar: "/avatars/sarah-johnson.jpg"
    },
    meetingLink: "https://meet.google.com/xyz-uvw-rst",
    isReady: false
  }
];

export const liveClasses: LiveClass[] = [
  {
    id: "lc-001",
    title: "Advanced Spanish Conversation",
    language: "Spanish",
    instructor: {
      id: "inst-001",
      name: "Dr. María González",
      avatar: "/avatars/maria-gonzalez.jpg"
    },
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    duration: 60,
    maxParticipants: 8,
    currentParticipants: 6,
    level: "Advanced",
    type: "Group Session",
    price: 29.99,
    currency: "USD",
    rating: 4.9,
    reviews: 234,
    features: ["Screen Sharing", "Recording", "Chat", "Breakout Rooms"],
    description: "Practice advanced Spanish conversation skills with native speakers. Topics include current events, business, and cultural discussions.",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    recordingUrl: "https://recordings.example.com/lc-001",
    materials: [
      {
        id: "mat-001",
        title: "Conversation Topics",
        type: "pdf",
        url: "/materials/spanish-conversation-topics.pdf"
      },
      {
        id: "mat-002", 
        title: "Vocabulary List",
        type: "pdf",
        url: "/materials/advanced-spanish-vocab.pdf"
      }
    ],
    tags: ["conversation", "advanced", "group", "spanish"],
    isBooked: true,
    isCompleted: false,
    isCancelled: false,
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-15T14:30:00Z"
  },
  {
    id: "lc-002",
    title: "Business English Masterclass",
    language: "English", 
    instructor: {
      id: "inst-002",
      name: "Prof. Sarah Johnson",
      avatar: "/avatars/sarah-johnson.jpg"
    },
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 25.5 * 60 * 60 * 1000).toISOString(),
    duration: 90,
    maxParticipants: 6,
    currentParticipants: 4,
    level: "Professional",
    type: "Masterclass",
    price: 49.99,
    currency: "USD",
    rating: 4.8,
    reviews: 156,
    features: ["Presentation Mode", "Recording", "Chat", "File Sharing"],
    description: "Master business English communication skills for professional environments. Learn presentation techniques, negotiation language, and corporate vocabulary.",
    meetingLink: "https://meet.google.com/xyz-uvw-rst",
    recordingUrl: "https://recordings.example.com/lc-002",
    materials: [
      {
        id: "mat-003",
        title: "Business Presentation Guide",
        type: "pdf", 
        url: "/materials/business-presentation-guide.pdf"
      },
      {
        id: "mat-004",
        title: "Corporate Vocabulary",
        type: "pdf",
        url: "/materials/corporate-vocabulary.pdf"
      }
    ],
    tags: ["business", "professional", "masterclass", "english"],
    isBooked: true,
    isCompleted: false,
    isCancelled: false,
    createdAt: "2024-01-12T09:00:00Z",
    updatedAt: "2024-01-16T13:45:00Z"
  }
];

// Helper functions
export const getUpcomingClasses = (): UpcomingClass[] => {
  return upcomingClasses.filter(cls => {
    const startTime = new Date(cls.startTime);
    const now = new Date();
    return startTime > now && !cls.isReady; // Only show future classes that aren't ready yet
  });
};

export const getReadyToJoinClasses = (): UpcomingClass[] => {
  return upcomingClasses.filter(cls => {
    const startTime = new Date(cls.startTime);
    const now = new Date();
    const timeDiff = startTime.getTime() - now.getTime();
    const minutesUntilStart = timeDiff / (1000 * 60);
    
    // Class is ready to join if it starts within 15 minutes
    return minutesUntilStart <= 15 && minutesUntilStart >= -cls.duration;
  });
};

export const getLiveClassById = (id: string): LiveClass | undefined => {
  return liveClasses.find(cls => cls.id === id);
};

export const getUpcomingClassById = (id: string): UpcomingClass | undefined => {
  return upcomingClasses.find(cls => cls.id === id);
}; 