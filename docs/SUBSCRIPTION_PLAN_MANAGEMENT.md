# Subscription Plan Management

## Overview

Admins can modify subscription plan features including lesson limits through the admin dashboard. This allows for flexible pricing and feature management based on business needs.

## Accessing Subscription Plan Management

1. Navigate to **Admin Dashboard** → **Settings** → **Subscription Plans**
2. You can view, create, edit, and delete subscription plans

## Key Features That Can Be Modified

### Lesson Limits
- **Max Live Classes per Month**: Number of live classes a subscriber can attend per month
- **Attendance Quota**: Maximum number of hours a subscriber can attend live classes per month
- **Enrollment Quota**: Maximum number of courses a subscriber can enroll in per month

### Traditional Limits
- **Max Students**: Maximum number of students allowed (for institutions)
- **Max Courses**: Maximum number of courses allowed (for institutions)
- **Max Teachers**: Maximum number of teachers allowed (for institutions)

### Features
- Basic Analytics
- Advanced Analytics
- Email Support
- Priority Support
- Custom Branding
- API Access
- White Label
- Marketing Tools
- Dedicated Account Manager
- Custom Integrations
- Advanced Security
- Multi-Location Support
- Custom Reporting

## How to Modify Lesson Limits

### Example: Changing Premium Plan from 4 to 2 Lessons per Month

1. **Navigate to Subscription Plans**
   - Go to Admin Dashboard → Settings → Subscription Plans

2. **Find the Premium Plan**
   - Look for the plan you want to modify (e.g., "Premium")

3. **Edit the Plan**
   - Click the **Edit** button (pencil icon) next to the plan

4. **Modify Lesson Limits**
   - Change "Max Live Classes per Month" from 4 to 2
   - Optionally adjust "Attendance Quota" if needed
   - Optionally adjust "Enrollment Quota" if needed

5. **Save Changes**
   - The changes are automatically saved as you type
   - Click "Done" when finished

## Impact of Changes

### Immediate Effects
- **New Subscribers**: Will immediately get the new limits
- **Existing Subscribers**: May continue with their current limits until renewal (depending on implementation)

### Business Considerations
- **Revenue Impact**: Reducing limits may affect pricing strategy
- **User Experience**: Changes should be communicated to users
- **Support**: Be prepared for questions about limit changes

## Best Practices

### Before Making Changes
1. **Analyze Usage**: Check current usage patterns
2. **Plan Communication**: Prepare user notifications
3. **Test Changes**: Consider testing on a small group first

### When Making Changes
1. **Document Changes**: Keep records of what was changed
2. **Monitor Impact**: Watch for user feedback and usage changes
3. **Be Consistent**: Apply similar logic across related plans

### After Making Changes
1. **Monitor Metrics**: Track subscription changes and cancellations
2. **Gather Feedback**: Listen to user concerns
3. **Adjust if Needed**: Be prepared to revert or further modify

## Technical Implementation

### Database Fields
- `maxLiveClasses`: Maximum live classes per month
- `attendanceQuota`: Maximum attendance hours per month
- `enrollmentQuota`: Maximum enrollments per month

### API Endpoints
- `GET /api/admin/settings/subscription-plans` - List all plans
- `POST /api/admin/settings/subscription-plans` - Create new plan
- `PUT /api/admin/settings/subscription-plans/[id]` - Update existing plan
- `DELETE /api/admin/settings/subscription-plans/[id]` - Delete plan

### Frontend Components
- Subscription plan management interface
- Real-time editing capabilities
- Validation and error handling

## Troubleshooting

### Common Issues
1. **Changes Not Saving**: Check network connection and permissions
2. **Validation Errors**: Ensure all required fields are filled
3. **Permission Denied**: Verify admin role and session

### Support
- Check admin logs for error details
- Verify database connectivity
- Ensure proper authentication

## Future Enhancements

### Planned Features
- **Bulk Updates**: Modify multiple plans at once
- **Version History**: Track changes over time
- **A/B Testing**: Test different limit configurations
- **Automated Notifications**: Alert users of plan changes
- **Usage Analytics**: Detailed usage reporting per plan
