# Live Conversations — Complete Implementation Plan

## Feature Goal

Enable real-time language practice via scheduled conversation sessions (group, private, cultural, practice), backed by bookings, messaging, and phased video support, with subscription- and institution-aware access controls.

## Data Model

- LiveConversation
  - title, description, conversationType (GROUP, PRIVATE, PRACTICE, CULTURAL), language, level, startTime, endTime, duration, maxParticipants, status, hostId, instructorId
  - learning materials metadata: conversationPrompts, vocabularyList, grammarPoints, culturalNotes
- LiveConversationParticipant
  - conversationId, userId, joinedAt/leftAt, duration, flags: isInstructor, isHost; metrics: speakingTime, messageCount; feedback JSON
- LiveConversationMessage
  - conversationId, senderId, optional recipientId, content, messageType, language, isTranslation, originalMessage, timestamp, read status
- LiveConversationBooking
  - conversationId, userId, status (CONFIRMED/…); bookedAt/cancelledAt; paymentStatus (PAID/…); amount/currency
- Integrity and performance
  - Foreign keys; UNIQUE (conversationId, userId) for participants/bookings; indexes on language, level, type, isFree/isPublic, startTime

```sql
-- Representative schema (see also docs/LIVE_CONVERSATIONS_IMPLEMENTATION.md)
CREATE TABLE live_conversations (...);
CREATE TABLE live_conversation_participants (...);
CREATE TABLE live_conversation_messages (...);
CREATE TABLE live_conversation_bookings (...);
```

## API Endpoints

- GET /api/live-conversations
  - Purpose: List conversations
  - Filters: language, level, type, isFree, search, page, limit
  - Returns: Paginated list with availability/booking state
- POST /api/live-conversations
  - Purpose: Create session
  - Permissions: Students (free peer sessions), Instructors (paid sessions)
  - Validations: scheduling, capacity, required fields, role checks
- POST /api/live-conversations/[id]/book
  - Purpose: Book session
  - Validations: capacity, user eligibility, subscription entitlements, payment for paid sessions
- DELETE /api/live-conversations/[id]/book
  - Purpose: Cancel booking (pre-start)
  - Side-effects: optional refund/credit per policy
- Phase 2 (realtime)
  - WebSocket channels for chat/presence and session state events

## Frontend (Next.js/React)

- Marketing & discovery
  - Feature page (`/features/live-conversations`): benefits, Free Trial card, unified tier cards from source-of-truth pricing
  - Public browser (`/live-conversations`): search/filter, availability badges, language/level chips, pricing indicators
- App flows
  - Create session: validated form (type, language, level, schedule, duration, capacity, visibility, price) + learning materials
  - Book/cancel: one-click for free, payment for paid; booking management UI
  - Session detail: schedule, host/instructor panel, materials (prompts/vocab/grammar), join CTA
  - Access banners: Free Trial CTA for authenticated users without active subscription
- UX
  - Responsive, loading states, error handling, toasts; “Most Popular” highlights; participant counts live in Phase 2

## Realtime & Media (Phased)

- Phase 1 (current):
  - Scheduled sessions, bookings, persisted messages (optional), email notifications
- Phase 2:
  - WebSocket chat/presence, live participant counts
  - Video conferencing (WebRTC/provider), join/leave, basic host moderation; optional recording
  - Single shared MediaSession service reused by both Live Classes and Live Conversations. Differentiate via a `sessionType` enum (CLASS | CONVERSATION) and foreign keys (`classId` or `conversationId`).
- Phase 3:
  - AI translation overlays, speech recognition/pronunciation feedback, live transcripts, learning signals
- Phase 4 (enterprise):
  - Institution-linked scheduling, advanced analytics, white-label branding, external API access

## Access Control & Subscriptions

- Roles
  - Student: create free peer sessions; book any allowed session
  - Instructor: create/host paid sessions
  - Host: manage own session (start/end, moderate participants)
- Subscription integration (single source-of-truth tiers)
  - Free Trial: limited entry path
  - PREMIUM: access per policy (e.g., limited live access)
  - PRO: expanded/unlimited live access
  - Limits per tier: concurrent bookings, max capacity/session length, feature use (e.g., recordings)
- Institution-linked access
  - Hybrid users: institution sessions vs platform sessions; enforce institution plan features

### Platform Creators Institution & Per‑Instructor Overrides

- Group independent instructors under a single "Platform Creators" Institution to reuse existing commission and payout rails.
- Defaults come from the Institution's CommissionTier; allow minimal per‑instructor overrides:
  - commissionRateOverride (percentage)
  - payoutMethod / payoutSchedule
  - priceFloor, maxDiscountPercent (safety rails)
  - recordingAllowedOverride
  - capacity/duration overrides (bounded)
- Precedence: Instructor override → Platform Creators CommissionTier → Global default.

### Tiered Entitlements for Live Conversations (Students)

- BASIC:
  - Browse + 1 free trial session
  - No booked group/1:1 sessions; no recordings
  - Booking horizon: n/a
- PREMIUM:
  - Group sessions: 4 per month
  - 1:1 sessions: 0 per month (top-ups optional)
  - Booking horizon: 7 days; recording access: 30 days
  - Fair-use minutes: e.g., 600/month (optional)
- PRO:
  - Group sessions: unlimited (fair-use minutes e.g., 1000/month)
  - 1:1 sessions: 4 per month
  - Booking horizon: 14 days; recording access: 90 days

Institution mapping (per student defaults):
- STARTER: none
- PROFESSIONAL: 4 group / 0 1:1; 30d retention
- ENTERPRISE: unlimited group (fair-use), 2 1:1; 90d retention

Enforcement:
- Booking API gates: verify plan entitlements (per session type) and current cycle usage; redirect to trial/sign-up or top-ups when exceeded.
- Usage tracking table (per user, per cycle): sessionsBooked, oneToOneBooked, minutesConsumed, lastReset.
- Optional top-ups (Stripe products): add session packs.

## Payments & Pricing

- Free sessions: instant booking
- Paid sessions: Stripe (or provider) products/prices; attach receipt to booking; cancellation/refund policy integration
- Commissions: platform share for instructor-led sessions; configurable per tier/instructor

Implementation note: Instructor-led sessions settle through the Platform Creators Institution; apply CommissionTier unless a per‑instructor override exists.

## Notifications & Lifecycle

- Pre-session reminders; start notifications; post-session feedback prompts
- Host dashboard: participant list, join/leave events, recording controls (Phase 2)
- Audit logs: session creation/updates/bookings/attendance

## Analytics

- Session metrics: participants, engagement (speaking time, message count), completion
- Business KPIs: bookings, paid session revenue, Trial→paid conversions, popular languages/levels
- Exports & reports for enterprise (Phase 4)

## Testing Strategy

- Unit: model validation, API handlers, permission and subscription checks
- Integration: booking flow (free/paid), payment callbacks, role gating
- E2E: browse→book→join flow (media mocked); cancellation flows
- Performance: indexed listings, WS fan-out, API latency thresholds

## Deployment Checklist

- [ ] DB migrations applied (tables, FKs, indexes)
- [ ] API endpoints validated (authn/z, inputs, error handling)
- [ ] Frontend flows responsive and accessible (keyboard, ARIA)
- [ ] Subscription and payment configs in env/secrets
- [ ] Logging/monitoring (API latency, error rates, WS health)
- [ ] Email/notification services configured
- [ ] Documentation/user guides published
- [ ] Test suites (unit/integration/E2E) green

## Rollout Plan

- Phase 1: Listings, creation, bookings, Free Trial gating, minimal paid booking
- Phase 2: WebSocket chat/presence and basic video rooms (pilot cohorts)
- Phase 3: AI speech/translation, transcripts, learning analytics
- Phase 4: Enterprise features (institutional integration, advanced analytics, white-label)

## References

- See also:
  - `docs/LIVE_CONVERSATIONS_IMPLEMENTATION.md`
  - `docs/VIDEO_CONFERENCING_SETUP.md`
  - `docs/VIDEO_CONFERENCING_IMPLEMENTATION_COMPLETE.md`
  - `docs/VIDEO_CONFERENCING_REVENUE_OPTIMIZATION.md`
  - `docs/COMPLETE_SYSTEM_OVERVIEW.md`

## Media Engine and Product Differentiation

- Shared real-time stack: Both Live Classes and Live Conversations use the same underlying RTC/media engine (WebRTC or provider SDK such as Zoom/Twilio) to minimize duplication and ensure a single investment in reliability and UX components (chat, presence, device controls, recording hooks).
- Differentiation layer: Behavior differences live above the media layer via a `sessionType` discriminator and policy gates.
  - sessionType: `CLASS | CONVERSATION`
  - Data linkage: classes reference `videoSession` or class-bound sessions; conversations reference `LiveConversation` rows.
- Policy differences:
  - Capacity: Conversations are small-group or 1:1; Classes support larger cohorts.
  - Scheduling: Conversations are booking-led (ad‑hoc/slots) with `bookingHorizonDays`; Classes follow course timetables/enrollments.
  - Entitlements: Conversations enforce monthly caps from `lib/subscription-pricing.ts` (group/1:1/fair-use minutes); Classes are gated by course access and plan level.
  - Recording: Conversations optional, shorter `recordingRetentionDays`; Classes often default to recording with longer retention.
  - Moderation: Conversations use lightweight host controls; Classes include richer classroom tooling (materials/attendance).
- Implementation note: A single MediaSession service is reused; features like chat/presence are shared modules toggled by policy (allowChat, allowRecording, etc.).

## Future Improvements & Enhancements

### Near-term (1–2 sprints)
- In-room chat/presence for Conversations (shared module with Classes)
- Session reminders and calendar invites (ICS)
- Booking waitlists and auto-fill from waitlist
- Host quick tools: mute-all, admit/ban, end-for-all
- Top-up packs for 1:1 sessions; Stripe products
- Usage reset cron + “cycle remaining” widgets everywhere

### Mid-term (quarter)
- Reusable MediaSession UI kit (devices, screen share, reactions)
- Recording pipeline unification; transcripts gated by retention policy
- Conversation templates (language/level prompts) for fast creation
- Improved discovery: popularity, personalized recommendations
- Institution overrides: capacity/duration/recording policy bounds
- Exportable reports for bookings/attendance/usage

### Long-term
- AI assist: live translation captions, pronunciation feedback, topic suggestions
- Skill signals: speaking time, vocabulary coverage, CEFR-aligned rubrics
- Federation: external provider rooms bridged into platform policy/analytics
- Enterprise admin: SLA dashboards, white-label media domains
- Public APIs for scheduling and booking integrations
