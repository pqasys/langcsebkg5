# Access Hierarchy Rationalization

## **User Types & Access Levels**

### **1. Free Users (No Subscription, No Institution)**
- **Access**: Basic platform features
- **Content**: Limited free courses, basic language tests
- **Live Classes**: None
- **Features**: Basic search, community forum (read-only)

### **2. Subscribed Users (Premium/Pro Plan, No Institution)**
- **Access**: Platform-wide premium features
- **Content**: 
  - All platform-wide courses and materials
  - Premium language tests
  - Platform-wide live classes (like the ones we implemented)
  - Study groups and community features
- **Live Classes**: Platform-hosted classes with certified instructors
- **Features**: 
  - HD video quality
  - Advanced screen sharing
  - Class recordings (30 days)
  - Breakout rooms
  - File sharing
  - Advanced analytics
  - Study group access

### **3. Institution-Enrolled Students (No Personal Subscription)**
- **Access**: Institution-specific content + basic platform features
- **Content**: 
  - Institution's courses and materials
  - Institution's live classes and sessions
  - Institution-specific assessments and progress tracking
  - Basic platform features (limited)
- **Live Classes**: Institution-hosted classes only
- **Features**: 
  - Institution's learning management system
  - Institution-specific analytics
  - Institution's communication tools

### **4. Institution-Enrolled Students (WITH Personal Subscription)**
- **Access**: Institution content + Platform premium features
- **Content**: 
  - Institution's courses and materials
  - Institution's live classes
  - PLUS all platform-wide premium content
  - Platform-wide live classes
- **Live Classes**: Both institution-hosted AND platform-hosted
- **Features**: 
  - Institution's features
  - PLUS all platform premium features
  - Best of both worlds

### **5. Institution Staff/Instructors**
- **Access**: Institution admin + teaching tools
- **Content**: 
  - Create and manage institution courses
  - Access to institution's student data
  - Institution's teaching materials
- **Live Classes**: Create and host institution classes
- **Features**: 
  - Course creation tools
  - Student management
  - Institution analytics
  - Teaching tools

## **Content Overlap Strategy**

### **Platform-Wide Content (For Subscribers)**
- General language learning courses
- Standardized proficiency tests
- Platform-hosted live classes
- Community learning features
- Study materials and resources

### **Institution-Specific Content**
- Custom courses designed by the institution
- Institution-specific assessments
- Institution-hosted live classes
- Institution's proprietary materials
- Institution's curriculum and syllabus

### **Premium Platform Features (For Subscribers)**
- Advanced video quality
- Extended recording storage
- Advanced analytics
- Priority booking
- Enhanced study tools

## **Implementation Recommendations**

### **1. Clear Feature Differentiation**
- Platform features: Available to all subscribers
- Institution features: Available to institution-enrolled students
- Premium features: Available to subscribers regardless of institution status

### **2. Content Access Logic**
```typescript
// Pseudo-code for access determination
function getUserAccess(user) {
  const hasSubscription = user.subscription?.status === 'ACTIVE';
  const hasInstitution = user.institutionEnrollment?.status === 'ACTIVE';
  
  return {
    platformContent: hasSubscription,
    institutionContent: hasInstitution,
    premiumFeatures: hasSubscription,
    liveClasses: hasSubscription || hasInstitution,
    adminAccess: user.role === 'INSTITUTION_STAFF'
  };
}
```

### **3. UI/UX Considerations**
- Clear indication of content source (Platform vs Institution)
- Different navigation for different access levels
- Seamless switching between platform and institution content
- Clear upgrade paths for different user types

## **Benefits of This Model**

1. **Clear Value Proposition**: Each user type knows exactly what they get
2. **Flexible Access**: Users can have both institution and platform access
3. **Scalable**: Easy to add new features to specific access levels
4. **Revenue Optimization**: Multiple subscription paths
5. **Institution Partnership**: Institutions maintain their unique value while benefiting from platform features

## **Migration Strategy**

1. **Audit Current Users**: Categorize existing users by access level
2. **Feature Mapping**: Map existing features to new access levels
3. **UI Updates**: Update interfaces to reflect new access hierarchy
4. **User Communication**: Clearly communicate changes to users
5. **Testing**: Test access controls across all user types 