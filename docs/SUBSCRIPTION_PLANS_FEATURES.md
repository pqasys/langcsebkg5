# Subscription Plans & Commission Tiers Feature System

## Overview

This document explains the relationship between Commission Tiers and Subscription Plans, and how the feature selection system works in the admin interface.

## Database Relationship

### CommissionTier Table
- **Purpose**: Defines commission rates and available features for each plan type (STARTER, PROFESSIONAL, ENTERPRISE)
- **Features Field**: JSON object where keys are feature identifiers and values are boolean flags
- **Example**:
```json
{
  "maxStudents": true,
  "maxCourses": true,
  "basicAnalytics": true,
  "emailSupport": true,
  "advancedAnalytics": false,
  "customBranding": false
}
```

### SubscriptionPlan Table
- **Purpose**: Defines specific subscription plans with pricing, limits, and features
- **Features Field**: Array of feature keys that are enabled for this plan
- **Example**:
```json
["maxStudents", "maxCourses", "basicAnalytics", "emailSupport"]
```

### InstitutionSubscription Table
- **Purpose**: Links institutions to their subscription plans
- **Relationship**: Links to SubscriptionPlan via `subscriptionPlanId`
- **Features Field**: Inherits features from the linked SubscriptionPlan

## Feature System Architecture

### Available Features
The system supports the following features:

| Feature Key | Name | Description |
|-------------|------|-------------|
| `maxStudents` | Max Students | Maximum number of students allowed |
| `maxCourses` | Max Courses | Maximum number of courses allowed |
| `maxTeachers` | Max Teachers | Maximum number of teachers allowed |
| `basicAnalytics` | Basic Analytics | Basic reporting and analytics |
| `advancedAnalytics` | Advanced Analytics | Advanced reporting and insights |
| `emailSupport` | Email Support | Email-based customer support |
| `prioritySupport` | Priority Support | Priority customer support |
| `customBranding` | Custom Branding | Custom branding options |
| `apiAccess` | API Access | API access for integrations |
| `whiteLabel` | White Label | White label platform options |
| `marketingTools` | Marketing Tools | Marketing and promotion tools |
| `dedicatedAccountManager` | Dedicated Account Manager | Personal account manager |
| `customIntegrations` | Custom Integrations | Custom system integrations |
| `advancedSecurity` | Advanced Security | Enhanced security features |
| `multiLocationSupport` | Multi-Location Support | Support for multiple locations |
| `customReporting` | Custom Reporting | Custom report generation |

### Commission Tier Feature Mapping

#### STARTER Tier (25% Commission)
- Basic features for new institutions
- **Features**: `emailSupport`, `basicAnalytics`

#### PROFESSIONAL Tier (15% Commission)
- Enhanced features for growing institutions
- **Features**: `emailSupport`, `basicAnalytics`, `customBranding`, `marketingTools`, `prioritySupport`, `advancedAnalytics`

#### ENTERPRISE Tier (10% Commission)
- Full feature set for large institutions
- **Features**: All available features enabled

## Admin Interface Features

### Subscription Plans Management

#### Create New Plan
1. **Basic Information**: Name, description, price, currency, billing cycle
2. **Limits**: Max students, courses, and teachers
3. **Feature Selection**: Checkbox-based feature selection with three options:
   - **Manual Selection**: Check/uncheck individual features
   - **Load from STARTER**: Pre-selects STARTER tier features
   - **Load from PROFESSIONAL**: Pre-selects PROFESSIONAL tier features
   - **Load from ENTERPRISE**: Pre-selects ENTERPRISE tier features

#### Edit Existing Plan
- Modify basic information and limits
- Add/remove features using checkboxes
- Real-time updates to the database

#### Plan Display
- Shows all plan information including features
- Features displayed with checkmarks and proper names
- Status indicators (Active/Inactive)

### Commission Tiers Management

#### Feature Management
- Commission tiers define the feature sets available for each plan type
- Features are stored as JSON objects with boolean values
- Admin can modify which features are available per tier

#### Commission Rate Management
- Set commission rates per tier (STARTER: 25%, PROFESSIONAL: 15%, ENTERPRISE: 10%)
- Toggle tier activation status

## Implementation Details

### Frontend Components

#### Feature Selection Interface
```tsx
// Available features configuration
const availableFeatures = [
  { key: 'maxStudents', name: 'Max Students', description: 'Maximum number of students allowed' },
  { key: 'maxCourses', name: 'Max Courses', description: 'Maximum number of courses allowed' },
  // ... more features
];

// Feature loading from commission tiers
const loadFeaturesFromTier = (planType: string) => {
  const tier = commissionTiers.find(t => t.planType === planType);
  if (tier && tier.features) {
    const tierFeatures = Object.keys(tier.features).filter(key => tier.features[key] === true);
    setCreateFormData(prev => ({
      ...prev,
      features: tierFeatures
    }));
  }
};
```

#### Checkbox-based Feature Selection
```tsx
{availableFeatures.map((feature) => (
  <div key={feature.key} className="flex items-center space-x-2 p-3 border rounded-lg">
    <Checkbox
      id={`feature-${feature.key}`}
      checked={createFormData.features.includes(feature.key)}
      onCheckedChange={() => handleFeatureToggle(feature.key)}
    />
    <div className="flex-1">
      <Label htmlFor={`feature-${feature.key}`} className="text-sm font-medium">
        {feature.name}
      </Label>
      <p className="text-xs text-muted-foreground">{feature.description}</p>
    </div>
  </div>
))}
```

### Backend API

#### Commission Tiers API
- `GET /api/admin/settings/commission-tiers` - Fetch all commission tiers
- `POST /api/admin/settings/commission-tiers` - Create new commission tier
- `PUT /api/admin/settings/commission-tiers` - Update existing commission tier

#### Subscription Plans API
- `GET /api/admin/settings/subscription-plans` - Fetch all subscription plans
- `POST /api/admin/settings/subscription-plans` - Create new subscription plan
- `PUT /api/admin/settings/subscription-plans/:id` - Update existing subscription plan
- `DELETE /api/admin/settings/subscription-plans/:id` - Delete subscription plan

## Usage Workflow

### Creating a New Subscription Plan

1. **Navigate** to Admin → Settings → Subscription Plans
2. **Click** "Add Plan" button
3. **Fill** in basic information (name, description, price, etc.)
4. **Set** limits (max students, courses, teachers)
5. **Select** features using one of these methods:
   - **Manual**: Check individual feature checkboxes
   - **Quick Load**: Click "Load from [TIER]" buttons to pre-select features from commission tiers
6. **Review** selected features
7. **Save** the plan

### Editing an Existing Plan

1. **Find** the plan in the list
2. **Click** the edit button (pencil icon)
3. **Modify** basic information or limits
4. **Toggle** features using checkboxes
5. **Save** changes

### Managing Commission Tiers

1. **Navigate** to Admin → Settings → Commission Tiers
2. **View** existing tiers and their features
3. **Edit** tier features or commission rates
4. **Toggle** tier activation status

## Benefits of This System

### For Administrators
- **Consistency**: Features are standardized across plan types
- **Flexibility**: Can create custom plans while maintaining tier structure
- **Efficiency**: Quick feature loading from existing tiers
- **Scalability**: Easy to add new features to the system

### For Institutions
- **Transparency**: Clear feature sets for each plan type
- **Predictability**: Consistent feature availability
- **Flexibility**: Can choose from predefined or custom plans

### For the Platform
- **Maintainability**: Centralized feature management
- **Data Integrity**: Consistent feature definitions
- **Performance**: Efficient feature checking and validation

## Future Enhancements

### Planned Features
1. **Feature Dependencies**: Some features may require others
2. **Feature Limits**: Numeric limits for certain features
3. **Feature Groups**: Group related features together
4. **Feature Templates**: Predefined feature sets for common use cases
5. **Feature Analytics**: Track feature usage across institutions

### Technical Improvements
1. **Feature Validation**: Server-side validation of feature combinations
2. **Feature Migration**: Tools to migrate institutions between feature sets
3. **Feature Rollout**: Gradual feature rollout capabilities
4. **Feature A/B Testing**: Test feature combinations with institutions

## Troubleshooting

### Common Issues

#### Feature Not Appearing
- Check if the feature is enabled in the commission tier
- Verify the feature key matches the available features list
- Ensure the subscription plan is properly linked

#### Commission Tier Not Loading
- Verify the commission tier exists for the plan type
- Check if the tier is active
- Ensure the features JSON is properly formatted

#### API Errors
- Check authentication (admin role required)
- Verify API endpoint URLs
- Check database connectivity

### Debug Commands

```bash
# Test the enhanced subscription plans system
npx tsx scripts/test-enhanced-subscription-plans.ts

# Check database schema
npx prisma db pull

# Generate Prisma client
npx prisma generate
```

## Conclusion

The subscription plans and commission tiers feature system provides a robust, flexible, and user-friendly way to manage institution subscriptions. The checkbox-based feature selection with commission tier integration ensures consistency while maintaining flexibility for custom plans.

The system is designed to scale with the platform's growth and can easily accommodate new features and plan types as needed. 