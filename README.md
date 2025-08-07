# Language Learning Platform

A comprehensive language learning platform with subscription management, live classes, institutional features, and simplified course classification.

## 🚀 Features

- **Course Management**: Create, edit, and manage courses with simplified classification
- **Live Classes**: WebRTC-powered live interactive sessions with recurring scheduling
- **Subscription System**: Tier-based subscription management with governance
- **Multi-Institution Support**: Support for multiple educational institutions
- **Admin Dashboard**: Comprehensive admin interface
- **Student Portal**: Student enrollment and course access
- **Marketing Flexibility**: Separate marketing fields for presentation strategies

## 📚 Documentation

### Architecture
- [Subscription Architecture](./docs/SUBSCRIPTION_ARCHITECTURE.md) - Current subscription system design and usage
- [Future Migration Plan](./docs/FUTURE_MIGRATION_PLAN.md) - Planned migration from StudentSubscription to UserSubscription
- [Live Classes Architecture](./docs/LIVE_CLASSES_ARCHITECTURE.md) - Three-scenario live classes support
- [Course Enrollment Architecture](./docs/COURSE_ENROLLMENT_ARCHITECTURE.md) - Course discovery and enrollment flows
- [Subscription Enrollment Governance](./docs/SUBSCRIPTION_ENROLLMENT_GOVERNANCE.md) - Platform-wide enrollment governance
- [Implementation Summary](./docs/IMPLEMENTATION_SUMMARY.md) - Summary of completed implementation
- [Governance Implementation Guide](./docs/GOVERNANCE_IMPLEMENTATION_GUIDE.md) - Subscription governance implementation
- [Live Class Implementation Summary](./docs/LIVE_CLASS_IMPLEMENTATION_SUMMARY.md) - Live class system overview
- [Course Classification Simplification](./docs/COURSE_CLASSIFICATION_SIMPLIFICATION_SUMMARY.md) - Simplified course classification system

### Key Features
- Multi-user subscription system (students, admins, institution staff, regular users)
- Live class management with WebRTC integration
- Institution enrollment and course management
- Payment processing and pricing management
- Real-time notifications and scheduling
- Simplified course classification with marketing flexibility

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: MySQL
- **Real-time**: WebRTC, Socket.io
- **Styling**: Tailwind CSS
- **Bundler**: Turbopack (experimental)

## 🏃‍♂️ Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Set up the database**:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Access the application**:
   - Main app: http://localhost:3000
   - Admin dashboard: http://localhost:3000/admin
   - Institution dashboard: http://localhost:3000/institution

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── institution/       # Institution dashboard
│   └── student/           # Student portal
├── prisma/                # Database schema and migrations
├── lib/                   # Utility functions and services
├── scripts/               # Database scripts and utilities
├── migrations/            # Database migration scripts
└── docs/                  # Documentation
```

## 🎯 Key Features

### Simplified Course Classification
- **Essential Fields Only**: `hasLiveClasses`, `liveClassType`, `liveClassFrequency`, `liveClassSchedule`
- **Platform Support**: `isPlatformCourse`, `requiresSubscription`, `subscriptionTier`
- **Marketing Flexibility**: `marketingType`, `marketingDescription`
- **Three Scenarios Supported**: Institution live classes, platform-wide live classes, regular courses

### Live Classes
- **WebRTC Integration**: Real-time video sessions with custom server
- **Recurring Sessions**: Timezone-aware scheduling with patterns
- **Subscription Governance**: Usage limits and attendance quotas
- **Access Control**: Role-based permissions and enrollment validation

### Subscription System
- **Tier-based Plans**: StudentTier with flexible limits
- **Usage Tracking**: Enrollment and attendance quotas
- **Governance Services**: Automated limit enforcement
- **Plan Management**: Downgrade handling and quota adjustments

### Multi-Institution Support
- **Institution Management**: Registration and administration
- **Course Catalogs**: Institution-specific course listings
- **Role-based Access**: Admin, institution, and student roles

## 🔧 Development

### Database Management
```bash
# Generate Prisma client
npx prisma generate

# Push schema changes
npx prisma db push

# View database
npx prisma studio
```

### Scripts
```bash
# Create live class courses
npx tsx scripts/create-live-class-courses.ts

# Verify live class setup
npx tsx scripts/verify-live-class-courses.ts

# Test admin access
npx tsx scripts/test-live-class-admin-access.ts

# Update marketing fields
npx tsx scripts/update-marketing-fields.ts

# Verify simplified classification
npx tsx scripts/verify-simplified-classification.ts
```

## 📊 Current Status

### ✅ **Completed Features**
- **Core Platform**: Fully functional with simplified course classification
- **Live Classes**: WebRTC integration with 20 scheduled sessions
- **Subscription System**: Governance with usage tracking and limits
- **Multi-Institution**: Complete support with role-based access
- **Admin Dashboard**: Comprehensive interface for all features
- **Database Schema**: Optimized and simplified (60% complexity reduction)

### 📈 **Statistics**
- **Total Courses**: 11 (2 live class courses, 9 regular courses)
- **Live Sessions**: 20 scheduled sessions across 2 courses
- **Marketing Types**: LIVE_ONLINE (2), SELF_PACED (9)
- **Schema Fields**: Removed 3 redundant fields, added 2 marketing fields

### 🎯 **Three Live Class Scenarios**
1. **Institution Live Classes**: Course-based enrollment with conversation practice
2. **Platform-Wide Live Classes**: Subscription-based enrollment with comprehensive learning
3. **Regular Courses**: Self-paced learning with marketing flexibility

## 🚀 **Recent Achievements**

### **Course Classification Simplification**
- ✅ Eliminated redundant fields (`courseType`, `deliveryMode`, `enrollmentType`)
- ✅ Added marketing flexibility (`marketingType`, `marketingDescription`)
- ✅ Maintained all live class functionality
- ✅ Improved maintainability and clarity
- ✅ Future-proof design for scalability

### **Live Class Implementation**
- ✅ WebRTC integration with custom server
- ✅ Recurring session scheduling
- ✅ Subscription governance
- ✅ Access control and permissions
- ✅ Timezone-aware scheduling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Last Updated**: January 2024  
**Status**: ✅ Production Ready  
**Live Classes**: ✅ Fully Functional  
**Simplified Classification**: ✅ Completed

