# Language Learning Platform

A comprehensive language learning platform with subscription management, live classes, and institutional features.

## Documentation

### Architecture
- [Subscription Architecture](./docs/SUBSCRIPTION_ARCHITECTURE.md) - Current subscription system design and usage
- [Future Migration Plan](./docs/FUTURE_MIGRATION_PLAN.md) - Planned migration from StudentSubscription to UserSubscription

### Key Features
- Multi-user subscription system (students, admins, institution staff, regular users)
- Live class management
- Institution enrollment
- Payment processing
- Real-time notifications

## Quick Start

```bash
npm install
npm run dev
```

## Architecture Notes

The subscription system is designed to handle **ALL user types**, not just students. While the naming suggests student-specific usage, the architecture is actually flexible and supports various user roles. See the [Subscription Architecture](./docs/SUBSCRIPTION_ARCHITECTURE.md) documentation for details.

