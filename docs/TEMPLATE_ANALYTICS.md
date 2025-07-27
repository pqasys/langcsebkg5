# Template Analytics System

This document describes the enhanced template analytics system that provides comprehensive insights into question template usage, version control, and improvement suggestions.

## Features Overview

### 1. Template Usage Analytics
- **Usage Tracking**: Automatically tracks when templates are used
- **Customization Analysis**: Monitors how much users modify templates
- **Success Rate Tracking**: Measures performance of questions created from templates
- **Usage Trends**: Visualizes usage patterns over time

### 2. Template Version Control
- **Version History**: Complete audit trail of template changes
- **Change Logging**: Detailed records of what changed in each version
- **Rollback Capability**: Ability to revert to previous versions
- **Version Comparison**: Compare different versions side-by-side

### 3. Intelligent Suggestions
- **Performance-Based**: Suggests improvements based on success rates
- **Usage-Based**: Recommends changes based on usage patterns
- **Popularity Analysis**: Identifies templates that could benefit from being public
- **Customization Insights**: Suggests template improvements based on user modifications

## Database Schema

### New Tables

#### `question_template_versions`
Stores version history for templates:
- `id`: Unique identifier
- `template_id`: Reference to the template
- `version_number`: Sequential version number
- `name`, `description`: Version-specific metadata
- `template_config`: JSON configuration for this version
- `change_log`: Description of changes made
- `created_by`, `created_at`: Audit information

#### `question_template_usage`
Tracks template usage patterns:
- `id`: Unique identifier
- `template_id`: Reference to the template
- `used_by`: User who used the template
- `institution_id`: Institution context
- `usage_context`: Where the template was used (quiz, question_bank, etc.)
- `customization_level`: How much the template was modified
- `success_rate`: Performance metric
- `created_at`: When the template was used

#### `question_template_suggestions`
Stores improvement suggestions:
- `id`: Unique identifier
- `template_id`: Reference to the template
- `suggestion_type`: Type of suggestion (improvement, optimization, popularity)
- `title`, `description`: Suggestion details
- `suggested_changes`: JSON with specific recommendations
- `priority`: Importance level (LOW, MEDIUM, HIGH)
- `confidence_score`: How confident the system is in the suggestion
- `status`: Current status (PENDING, REVIEWED, IMPLEMENTED, REJECTED)

### Updated Tables

#### `question_templates`
Added `version` field to track current version number.

## API Endpoints

### Analytics
- `GET /api/institution/question-templates/[id]/analytics` - Get comprehensive analytics
- `POST /api/institution/question-templates/[id]/analytics` - Generate suggestions or track usage

### Version Management
- `GET /api/institution/question-templates/[id]/versions` - Get version history
- `POST /api/institution/question-templates/[id]/versions` - Create new version

### Suggestions
- `GET /api/institution/question-templates/[id]/suggestions` - Get improvement suggestions
- `POST /api/institution/question-templates/[id]/suggestions` - Review or implement suggestions

## Usage Examples

### Tracking Template Usage
```typescript
import { TemplateAnalyticsService } from '@/lib/template-analytics';

// Track when a template is used
await TemplateAnalyticsService.trackUsage({
  templateId: 'template-id',
  usedBy: 'user-id',
  institutionId: 'institution-id',
  usageContext: 'question_bank',
  targetQuestionBankId: 'bank-id',
  customizationLevel: 'minor',
  successRate: 0.85
});
```

### Creating a New Version
```typescript
await TemplateAnalyticsService.createVersion({
  templateId: 'template-id',
  versionNumber: 2,
  name: 'Improved Template',
  description: 'Enhanced with better explanations',
  templateConfig: { /* updated config */ },
  category: 'Grammar',
  difficulty: 'MEDIUM',
  changeLog: 'Added detailed explanations for each option',
  createdBy: 'user-id'
});
```

### Generating Suggestions
```typescript
const suggestions = await TemplateAnalyticsService.generateSuggestions('template-id');
// Returns array of improvement suggestions based on usage patterns
```

## Analytics Dashboard

The analytics dashboard provides:

### Key Metrics
- **Total Usage**: Number of times template has been used
- **Success Rate**: Average performance of questions from this template
- **Version Count**: Number of template iterations
- **Pending Suggestions**: Number of improvement recommendations

### Detailed Views
1. **Overview**: Usage by context and recent activity
2. **Usage Trends**: Daily usage charts and patterns
3. **Version History**: Complete change history with comparisons
4. **Suggestions**: AI-generated improvement recommendations

### Interactive Features
- **Time Period Selection**: View data for 7, 30, or 90 days
- **Suggestion Generation**: Manually trigger AI analysis
- **Version Management**: Create new versions with change tracking
- **Suggestion Review**: Review and implement improvement suggestions

## Implementation Notes

### Automatic Usage Tracking
Usage is automatically tracked when:
- Templates are copied to question banks
- Templates are used in quiz creation
- Templates are applied to assessments

### Suggestion Generation
Suggestions are generated based on:
- **Usage Patterns**: High usage suggests popularity
- **Performance Data**: Low success rates suggest needed improvements
- **Customization Analysis**: High modification rates suggest template flexibility needs

### Performance Considerations
- Analytics queries are optimized with proper indexing
- Usage tracking is asynchronous to avoid blocking user actions
- Suggestion generation runs in background to avoid UI delays

## Migration

To implement this system:

1. **Run Database Migration**:
   ```sql
   -- Execute the migration script
   source scripts/migrate-template-analytics.sql
   ```

2. **Update Prisma Schema**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Deploy New API Routes**:
   - Analytics endpoints
   - Version management endpoints
   - Suggestion management endpoints

4. **Update Frontend**:
   - Add analytics dashboard
   - Integrate usage tracking
   - Add version management UI

## Benefits

### For Institutions
- **Data-Driven Decisions**: Make informed choices about template improvements
- **Quality Assurance**: Monitor template performance and success rates
- **Collaboration**: Share successful templates across the platform
- **Efficiency**: Identify and fix underperforming templates quickly

### For Platform
- **Quality Improvement**: Systematically improve template quality
- **User Engagement**: Provide valuable insights to encourage template usage
- **Scalability**: Automated suggestion system reduces manual review burden
- **Analytics**: Rich data for platform optimization and feature development

## Future Enhancements

### Planned Features
- **A/B Testing**: Compare template variants
- **Machine Learning**: More sophisticated suggestion algorithms
- **Collaborative Filtering**: Suggest templates based on similar institutions
- **Performance Prediction**: Predict template success before deployment
- **Template Marketplace**: Public template sharing with ratings and reviews

### Integration Opportunities
- **Learning Analytics**: Connect template performance to student outcomes
- **Content Optimization**: Use template data to improve course content
- **Institutional Insights**: Provide institution-level analytics dashboards
- **API Integration**: Allow external systems to access template analytics 