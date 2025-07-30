# Complete System Overview: Live Classes & Live Conversations

## **🏗️ System Architecture Overview**

This document provides a complete understanding of how Live Classes and Live Conversations work together in your language learning platform, including database structure, access control, and user experience.

---

## **📊 Database Structure**

### **Live Classes (Video Sessions)**

#### **Main Table: `video_sessions`**
```sql
CREATE TABLE video_sessions (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  sessionType VARCHAR(50), -- GROUP, PRIVATE, WORKSHOP
  language VARCHAR(50),
  level VARCHAR(20),
  startTime DATETIME,
  endTime DATETIME,
  duration INT, -- minutes
  maxParticipants INT DEFAULT 10,
  currentParticipants INT DEFAULT 0,
  price FLOAT DEFAULT 0,
  isPublic BOOLEAN DEFAULT true,
  isRecorded BOOLEAN DEFAULT false,
  recordingUrl VARCHAR(500),
  status VARCHAR(20) DEFAULT 'SCHEDULED', -- SCHEDULED, ACTIVE, COMPLETED, CANCELLED
  meetingUrl VARCHAR(500),
  meetingId VARCHAR(100),
  meetingPassword VARCHAR(100),
  instructorId VARCHAR(36), -- REQUIRED
  courseId VARCHAR(36), -- OPTIONAL: linked to institution course
  moduleId VARCHAR(36), -- OPTIONAL: linked to course module
  institutionId VARCHAR(36), -- REQUIRED: always linked to institution
  createdAt DATETIME DEFAULT NOW(),
  updatedAt DATETIME DEFAULT NOW(),
  metadata JSON
);
```

#### **Related Tables:**
- **`video_session_participants`**: Track who joins/leaves sessions
- **`video_session_messages`**: Real-time chat during sessions

#### **Key Characteristics:**
- ✅ **Institution-Driven**: Always linked to an institution
- ✅ **Professional**: Instructor-led with structured curriculum
- ✅ **Recording**: Built-in recording capabilities
- ✅ **Course Integration**: Can link to specific courses/modules
- ✅ **Advanced Features**: Screen sharing, breakout rooms, HD video

---

### **Live Conversations**

#### **Main Table: `live_conversations`**
```sql
CREATE TABLE live_conversations (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  conversationType VARCHAR(50), -- GROUP, PRIVATE, PRACTICE, CULTURAL
  language VARCHAR(50),
  level VARCHAR(20),
  startTime DATETIME,
  endTime DATETIME,
  duration INT, -- minutes
  maxParticipants INT DEFAULT 8,
  currentParticipants INT DEFAULT 0,
  price FLOAT DEFAULT 0,
  isPublic BOOLEAN DEFAULT true,
  isFree BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'SCHEDULED',
  meetingUrl VARCHAR(500),
  meetingId VARCHAR(100),
  meetingPassword VARCHAR(100),
  instructorId VARCHAR(36), -- OPTIONAL: can be peer-to-peer
  hostId VARCHAR(36), -- REQUIRED: always has a host
  topic VARCHAR(255),
  culturalNotes TEXT,
  vocabularyList JSON, -- Array of vocabulary words
  grammarPoints JSON, -- Array of grammar points
  conversationPrompts JSON, -- Array of conversation prompts
  createdAt DATETIME DEFAULT NOW(),
  updatedAt DATETIME DEFAULT NOW(),
  metadata JSON
);
```

#### **Related Tables:**
- **`live_conversation_participants`**: Track participants and their engagement
- **`live_conversation_messages`**: Real-time messaging with translation support
- **`live_conversation_bookings`**: Booking and payment tracking

#### **Key Characteristics:**
- ✅ **Community-Driven**: Users can create their own sessions
- ✅ **Flexible Hosting**: Instructor-led OR peer-to-peer
- ✅ **Learning Materials**: Built-in vocabulary, grammar, cultural notes
- ✅ **Booking System**: Dedicated booking and payment tracking
- ✅ **Language Practice**: Focus on conversation and cultural exchange

---

## **👥 Access Hierarchy & User Types**

### **User Type Definitions**

#### **1. FREE Users**
```typescript
userType: 'FREE'
canAccessLiveClasses: false
canAccessLiveConversations: false (limited free sessions only)
canAccessPlatformContent: false
canAccessInstitutionContent: false
```

#### **2. SUBSCRIBER Users**
```typescript
userType: 'SUBSCRIBER'
canAccessLiveClasses: true (platform content only)
canAccessLiveConversations: true (full access)
canAccessPlatformContent: true
canAccessInstitutionContent: false
canUseHDVideo: true
canAccessRecordings: true
canUseBreakoutRooms: true
```

#### **3. INSTITUTION_STUDENT Users**
```typescript
userType: 'INSTITUTION_STUDENT'
canAccessLiveClasses: true (institution content only)
canAccessLiveConversations: true (platform content)
canAccessPlatformContent: false
canAccessInstitutionContent: true
canUseHDVideo: false
canAccessRecordings: false
canUseBreakoutRooms: false
```

#### **4. HYBRID Users**
```typescript
userType: 'HYBRID'
canAccessLiveClasses: true (both platform AND institution)
canAccessLiveConversations: true (full access)
canAccessPlatformContent: true
canAccessInstitutionContent: true
canUseHDVideo: true
canAccessRecordings: true
canUseBreakoutRooms: true
```

#### **5. INSTITUTION_STAFF Users**
```typescript
userType: 'INSTITUTION_STAFF'
canAccessLiveClasses: true (can create/manage institution classes)
canAccessLiveConversations: true (for professional development)
canAccessPlatformContent: false
canAccessInstitutionContent: true
canCreateClasses: true
canManageStudents: true
canViewAnalytics: true
```

---

## **🔧 Technical Implementation**

### **Access Control Hook: `useSubscription`**

The `useSubscription` hook centralizes all access logic:

```typescript
const {
  // User type and access levels
  userType, // 'FREE' | 'SUBSCRIBER' | 'INSTITUTION_STUDENT' | 'HYBRID' | 'INSTITUTION_STAFF'
  canAccessLiveClasses,
  canAccessLiveConversations,
  canAccessPlatformContent,
  canAccessInstitutionContent,
  
  // Feature access
  canUseHDVideo,
  canAccessRecordings,
  canUseBreakoutRooms,
  
  // Data
  subscriptionStatus,
  institutionEnrollment,
  userAccessLevel,
  
  // Utilities
  loading,
  error,
  refreshUserAccess
} = useSubscription();
```

### **API Endpoints**

#### **Live Classes (Video Sessions)**
```typescript
// Create Live Class (Institution Staff Only)
POST /api/video-sessions/create
{
  title: string,
  description?: string,
  sessionType: 'GROUP' | 'PRIVATE' | 'WORKSHOP',
  language: string,
  level: string,
  startTime: Date,
  endTime: Date,
  institutionId: string, // REQUIRED
  courseId?: string, // OPTIONAL
  moduleId?: string, // OPTIONAL
  price?: number,
  isRecorded?: boolean
}

// Join Live Class
POST /api/video-sessions/[id]/join

// Get Session Messages
GET /api/video-sessions/[id]/messages

// Send Message
POST /api/video-sessions/[id]/messages

// Get Participants
GET /api/video-sessions/[id]/participants

// Leave Session
POST /api/video-sessions/[id]/leave
```

#### **Live Conversations**
```typescript
// List Conversations (with filtering)
GET /api/live-conversations?language=es&level=B1&type=GROUP&isFree=true

// Create Conversation (Any user with subscription)
POST /api/live-conversations
{
  title: string,
  description?: string,
  conversationType: 'GROUP' | 'PRIVATE' | 'PRACTICE' | 'CULTURAL',
  language: string,
  level: string,
  startTime: Date,
  endTime: Date,
  isFree: boolean,
  topic?: string,
  vocabularyList?: string[],
  grammarPoints?: string[],
  conversationPrompts?: string[]
}

// Book Conversation
POST /api/live-conversations/[id]/book

// Cancel Booking
DELETE /api/live-conversations/[id]/book

// Join Conversation
POST /api/live-conversations/[id]/join

// Send Message
POST /api/live-conversations/[id]/messages
```

---

## **🎯 Business Logic & User Experience**

### **Live Classes Flow**

#### **For Institution Staff:**
1. **Create Class**: Institution staff creates structured classes
2. **Link to Course**: Can link to specific institution courses/modules
3. **Manage Students**: Control enrollment and access
4. **Professional Features**: HD video, recording, screen sharing
5. **Analytics**: Track student engagement and progress

#### **For Students:**
1. **Browse Classes**: See institution-specific classes
2. **Join Classes**: Access based on enrollment status
3. **Participate**: Join with video/audio/chat
4. **Review**: Access recordings (if available)
5. **Progress**: Track completion and performance

### **Live Conversations Flow**

#### **For All Users (with subscription):**
1. **Browse Conversations**: Filter by language, level, type
2. **Create Sessions**: Host their own conversation sessions
3. **Join Sessions**: Participate in peer-to-peer or instructor-led
4. **Practice**: Use built-in learning materials
5. **Book Sessions**: Reserve paid sessions with instructors

#### **For Instructors:**
1. **Create Sessions**: Host paid conversation sessions
2. **Set Materials**: Add vocabulary, grammar, cultural notes
3. **Manage Bookings**: Handle student reservations
4. **Earn Income**: Receive payments for sessions

---

## **🔐 Access Control Matrix**

| User Type | Live Classes | Live Conversations | Platform Content | Institution Content | Create Classes | Create Conversations |
|-----------|-------------|-------------------|------------------|-------------------|----------------|---------------------|
| **FREE** | ❌ | ❌ (limited free) | ❌ | ❌ | ❌ | ❌ |
| **SUBSCRIBER** | ✅ (platform) | ✅ (full) | ✅ | ❌ | ❌ | ✅ |
| **INSTITUTION_STUDENT** | ✅ (institution) | ✅ (platform) | ❌ | ✅ | ❌ | ✅ |
| **HYBRID** | ✅ (both) | ✅ (full) | ✅ | ✅ | ❌ | ✅ |
| **INSTITUTION_STAFF** | ✅ (create/manage) | ✅ (professional) | ❌ | ✅ | ✅ | ✅ |

---

## **📱 Frontend Implementation**

### **Page Structure**

#### **Live Classes Pages:**
- `/features/live-classes` - Main showcase page
- `/live-classes` - Browse and join classes
- `/live-classes/create` - Create new classes (staff only)
- `/live-classes/[id]` - Individual class details

#### **Live Conversations Pages:**
- `/features/live-conversations` - Main showcase page
- `/live-conversations` - Browse and join conversations
- `/live-conversations/create` - Create new conversations
- `/live-conversations/[id]` - Individual conversation details

### **Dynamic Content Based on User Type**

Each page dynamically renders content based on `userType`:

```typescript
// Example from Live Classes page
const { userType, canAccessLiveClasses } = useSubscription();

// Different banners for different user types
if (userType === 'FREE') {
  return <FreeUserBanner />;
} else if (userType === 'INSTITUTION_STAFF') {
  return <StaffBanner />;
} else if (userType === 'INSTITUTION_STUDENT') {
  return <InstitutionStudentBanner />;
}

// Different button text and actions
const buttonText = userType === 'INSTITUTION_STAFF' 
  ? 'Host Live Classes' 
  : 'Access Live Classes';

const buttonAction = userType === 'INSTITUTION_STAFF'
  ? '/live-classes/create'
  : '/live-classes';
```

---

## **🔄 Data Flow**

### **1. User Authentication**
```typescript
// User logs in
const session = await getServerSession(authOptions);
// Session contains: user.id, user.role, user.institutionId
```

### **2. Access Level Calculation**
```typescript
// useSubscription hook fetches data
const subscriptionData = await fetch('/api/student/subscription');
const institutionData = await fetch('/api/student/institution-enrollment');

// Calculate user type and access levels
const userAccessLevel = calculateUserAccessLevel(
  subscriptionData, 
  institutionData, 
  session.user
);
```

### **3. Content Filtering**
```typescript
// API endpoints filter content based on access
const whereClause = {
  // For Live Classes
  institutionId: userType === 'SUBSCRIBER' ? null : user.institutionId,
  
  // For Live Conversations
  isPublic: true,
  // Additional filters based on user access
};
```

### **4. Feature Gating**
```typescript
// UI components check access before rendering
if (!canAccessLiveClasses) {
  return <UpgradePrompt />;
}

if (userType === 'INSTITUTION_STAFF') {
  return <StaffDashboard />;
}
```

---

## **🎯 Key Benefits of This Architecture**

### **1. Clear Separation of Concerns**
- **Live Classes**: Professional, institution-driven learning
- **Live Conversations**: Community-driven language practice

### **2. Flexible Access Control**
- Multiple user types with different access levels
- Seamless switching between platform and institution content
- Clear upgrade paths for users

### **3. Scalable Business Model**
- Institution partnerships (Live Classes)
- Community-driven growth (Live Conversations)
- Multiple revenue streams

### **4. Technical Excellence**
- Separate database tables for different use cases
- Centralized access control via `useSubscription` hook
- Dynamic UI based on user type
- Comprehensive API endpoints

### **5. User Experience**
- Clear indication of content source (Platform vs Institution)
- Appropriate features for each user type
- Seamless navigation between different content types

---

## **🚀 Next Steps**

1. **Test Access Controls**: Verify all user types have appropriate access
2. **Monitor Usage**: Track which features are most popular
3. **Optimize Performance**: Ensure API endpoints are efficient
4. **Add Analytics**: Track user engagement and conversion
5. **Expand Features**: Add more advanced features based on user feedback

This architecture provides a solid foundation for a comprehensive language learning platform that serves both institutions and individual learners effectively. 