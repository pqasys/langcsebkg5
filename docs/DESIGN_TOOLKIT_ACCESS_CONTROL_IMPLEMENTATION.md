# Design Toolkit Access Control Implementation

## Overview

This implementation adds access control to the Design Toolkit at `/courses` to restrict it to site admins and institution users with an approval workflow. The system ensures that only approved design configurations are displayed on the live site.

## Key Features

### 1. Access Control
- **Site Admins**: Full access to create, edit, and approve design configurations
- **Institution Users**: Can create and edit design configurations, but require admin approval
- **Students/Public**: No access to design toolkit functionality
- **Pending Institution Users**: Can view but not create design configurations

### 2. Approval Workflow
- Design configurations created by institutions start with `PENDING` status
- Admins can approve or reject configurations with optional notes
- Only approved configurations are displayed on the live site
- Previously approved configurations continue to be displayed

### 3. Database Changes

#### New Fields Added to `design_configs` Table:
```sql
ALTER TABLE design_configs 
ADD COLUMN isApproved BOOLEAN DEFAULT FALSE,
ADD COLUMN approvedBy VARCHAR(36) NULL,
ADD COLUMN approvedAt DATETIME NULL,
ADD COLUMN approvalStatus VARCHAR(20) DEFAULT 'PENDING',
ADD COLUMN approvalNotes TEXT NULL;
```

#### Indexes for Performance:
```sql
CREATE INDEX idx_design_configs_approval_status ON design_configs(approvalStatus);
CREATE INDEX idx_design_configs_created_by ON design_configs(createdBy);
CREATE INDEX idx_design_configs_approved_by ON design_configs(approvedBy);
```

## Implementation Details

### 1. API Routes

#### Admin Approval API (`/api/admin/design-configs/approve`)
- **GET**: Fetch design configurations by status (PENDING, APPROVED, REJECTED)
- **POST**: Approve or reject design configurations
- **Access**: Admin only

#### Institution Design Configs API (`/api/institution/design-configs`)
- **GET**: Fetch design configurations for the institution
- **POST**: Create new design configurations (requires approval)
- **Access**: Institution users only

### 2. Components

#### Admin Components
- **Design Approvals Page** (`/admin/design-approvals`): Admin interface for reviewing and approving design configurations
- **Admin Sidebar**: Added "Design Approvals" link with pending count badge

#### Institution Components
- **Design Approval Status** (`DesignApprovalStatus.tsx`): Shows approval status to institution users
- **Enhanced Promotional Sidebar**: Updated to show design toolkit only to authorized users

#### Access Control Hook
- **useDesignConfigAccess**: Custom hook for managing access control logic
- **useDesignConfigApproval**: Hook for admin approval functionality

### 3. Access Control Logic

```typescript
// Access levels by user role
ADMIN: {
  canAccess: true,
  canCreate: true,
  canEdit: true,
  canApprove: true,
  requiresApproval: false
}

INSTITUTION (approved): {
  canAccess: true,
  canCreate: true,
  canEdit: true,
  canApprove: false,
  requiresApproval: true
}

INSTITUTION (pending): {
  canAccess: true,
  canCreate: false,
  canEdit: false,
  canApprove: false,
  requiresApproval: true
}

STUDENT/PUBLIC: {
  canAccess: false,
  canCreate: false,
  canEdit: false,
  canApprove: false,
  requiresApproval: true
}
```

## Usage

### For Admins
1. Navigate to `/admin/design-approvals`
2. Review pending design configurations
3. Approve or reject with optional notes
4. Monitor approval status in real-time

### For Institution Users
1. Access design toolkit through `/courses` page (if authorized)
2. Create and save design configurations
3. View approval status in the Design Approval Status component
4. Wait for admin approval before configurations go live

### For Students/Public
- Design toolkit is hidden from the interface
- Only approved configurations are displayed on the live site

## Migration

Run the migration script to add the new database fields:

```bash
# Apply the migration
mysql -u username -p database_name < migrations/add_design_config_approval_fields.sql
```

## Security Considerations

1. **Role-based Access**: All API endpoints check user roles and permissions
2. **Institution Approval**: Institution users must be approved before creating designs
3. **Admin-only Approval**: Only admins can approve/reject design configurations
4. **Audit Trail**: All approval actions are logged with timestamps and user IDs

## Future Enhancements

1. **Email Notifications**: Send notifications to institutions when designs are approved/rejected
2. **Bulk Operations**: Allow admins to approve/reject multiple designs at once
3. **Design Templates**: Pre-approved templates for institutions to use
4. **Version Control**: Track changes to design configurations over time
5. **Analytics**: Track usage and approval metrics

## Testing

### Test Cases
1. **Admin Access**: Verify admins can access all functionality
2. **Institution Access**: Verify approved institutions can create designs
3. **Pending Institution**: Verify pending institutions cannot create designs
4. **Student Access**: Verify students cannot access design toolkit
5. **Approval Workflow**: Verify approval/rejection process works correctly
6. **Live Display**: Verify only approved designs are shown on live site

### Manual Testing Steps
1. Login as admin and navigate to design approvals
2. Login as institution user and try to access design toolkit
3. Create a design configuration as institution user
4. Approve/reject the configuration as admin
5. Verify the configuration appears/disappears on live site accordingly
