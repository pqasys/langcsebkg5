# Community Quiz Implementation

## Overview

This implementation provides limited exposure to admin quizzes for free Community members, following a freemium model that balances user experience with revenue generation.

## Features Implemented

### Free Community Members
- **1 free quiz per month** from any available admin quiz
- **Limited to 10 questions** per quiz
- **Basic results only** (pass/fail, no detailed explanations)
- **No retry attempts**
- **No progress tracking**

### Premium Community Members
- **Unlimited quiz access**
- **Full question sets**
- **Detailed explanations and feedback**
- **Progress tracking and analytics**
- **Retry attempts allowed**

## Technical Implementation

### Database Schema

#### New Fields Added to `user` Model
```prisma
// Community quiz usage tracking
monthlyQuizUsage  Int       @default(0)
lastQuizReset     DateTime?
```

#### New Model: `CommunityQuizAttempt`
```prisma
model CommunityQuizAttempt {
  id                String   @id @default(cuid())
  userId            String   @db.VarChar(36)
  quizId            String   @db.VarChar(36)
  circleId          String?  @db.VarChar(36)
  attemptNumber     Int      @default(1)
  score             Int
  percentage        Float
  passed            Boolean
  questionsAnswered Int
  timeSpent         Int      // in seconds
  startedAt         DateTime @default(now())
  completedAt       DateTime?
  status            String   @default("IN_PROGRESS") // IN_PROGRESS, COMPLETED, ABANDONED
  
  // Relations
  user   user @relation(fields: [userId], references: [id], onDelete: Cascade)
  quiz   quizzes @relation(fields: [quizId], references: [id], onDelete: Cascade)
  circle CommunityCircle? @relation(fields: [circleId], references: [id], onDelete: SetNull)
  
  @@unique([userId, quizId, attemptNumber])
  @@index([userId])
  @@index([quizId])
  @@index([circleId])
  @@index([status])
  @@map("community_quiz_attempts")
}
```

### Access Control Service

#### `lib/community-quiz-access.ts`
- **`checkQuizAccess()`**: Validates user access based on subscription tier
- **`getUserQuizUsage()`**: Tracks monthly usage and statistics
- **`getAvailableQuizzes()`**: Fetches quizzes from active institutions

### API Endpoints

#### `app/api/community/quizzes/route.ts`
- **GET**: Fetches available quizzes for community members

#### `app/api/community/quizzes/[quizId]/start/route.ts`
- **POST**: Starts a quiz with access control and restrictions

#### `app/api/community/quizzes/[quizId]/submit/route.ts`
- **POST**: Submits quiz answers and calculates results

#### `app/api/community/quizzes/usage/route.ts`
- **GET**: Returns user's quiz usage statistics

### Frontend Components

#### `components/community/CommunityQuizCard.tsx`
- Displays quiz information and access controls
- Shows monthly usage limits
- Handles quiz start with restrictions

#### `components/community/CommunityQuizInterface.tsx`
- Interactive quiz interface
- Enforces restrictions for free users
- Shows results with tier-appropriate detail

### Integration

#### Community Circles Page
- Added "Practice Quizzes" tab to community circles
- Integrated quiz functionality with existing circle structure
- Shows usage statistics and available quizzes

## Business Benefits

### Lead Generation
- Free users get exposure to institution content
- Natural funnel to course enrollment
- Showcase institution quality

### Revenue Protection
- Limited access prevents cannibalization
- Clear upgrade path to premium features
- Maintains value proposition

### Community Engagement
- Additional activity for community members
- Learning validation and progress tracking
- Gamification element

## Usage Flow

1. **User visits Community Circle**
2. **Clicks "Practice Quizzes" tab**
3. **Sees available quizzes with usage info**
4. **Starts quiz (with access control)**
5. **Completes quiz with restrictions**
6. **Views results (tier-appropriate)**
7. **Gets upgrade prompts when limits reached**

## Configuration

### Access Control Rules
- **Free Users**: 1 quiz/month, 10 questions max, no explanations
- **Premium Users**: Unlimited access, full features
- **Monthly Reset**: Automatic reset on 1st of each month

### Quiz Restrictions
- **Question Limit**: 10 questions for free users
- **Explanations**: Disabled for free users
- **Retry**: Disabled for free users
- **Progress Tracking**: Disabled for free users

## Future Enhancements

### Phase 2 (Medium Priority)
1. Enhanced quiz interface with restrictions
2. Progress tracking for premium users
3. Analytics and reporting
4. Integration with community circles

### Phase 3 (Low Priority)
1. Advanced features (adaptive quizzes)
2. Social features (quiz sharing, leaderboards)
3. Mobile optimization
4. Advanced analytics

## Testing

### Manual Testing Checklist
- [ ] Free user can access 1 quiz per month
- [ ] Premium user has unlimited access
- [ ] Restrictions are properly enforced
- [ ] Upgrade prompts appear when limits reached
- [ ] Monthly usage resets correctly
- [ ] Quiz results show appropriate detail level
- [ ] Integration with community circles works

### API Testing
- [ ] Quiz access control works
- [ ] Usage tracking functions correctly
- [ ] Quiz submission calculates scores properly
- [ ] Error handling for unauthorized access

## Deployment Notes

1. **Database Migration**: Run `npx prisma db push` to apply schema changes
2. **Environment Variables**: No additional variables required
3. **Dependencies**: No new dependencies added
4. **Backward Compatibility**: Fully compatible with existing features

## Monitoring

### Key Metrics to Track
- Quiz completion rates by user tier
- Upgrade conversion rates after quiz limits
- User engagement with quiz features
- Institution content exposure through quizzes

### Error Monitoring
- Access control failures
- Quiz submission errors
- Usage tracking issues
- API endpoint failures
