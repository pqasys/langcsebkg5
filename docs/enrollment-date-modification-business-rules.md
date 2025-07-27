# Business Rules for Enrollment Date Modifications

## Core Principles

### 1. **Data Integrity Preservation**
- **Historical records must remain immutable** - original enrollment dates cannot be deleted or overwritten
- **All modifications must be auditable** - complete trail of who, what, when, and why
- **Version control** - maintain original dates alongside modified dates

### 2. **Financial Safeguards**
- **No retroactive billing changes** - modifications cannot affect completed payment periods
- **Commission protection** - institution commissions cannot be reduced retroactively
- **Refund policy compliance** - changes must align with established refund terms

### 3. **Academic Integrity**
- **Learning time validation** - minimum and maximum course duration limits
- **Progress alignment** - dates must align with actual student progress
- **Certification validity** - ensure modified dates don't invalidate certifications

## Specific Business Rules

### **Rule 1: Modification Window Restrictions**
```
- Only allow modifications within 30 days of enrollment start date
- No modifications allowed after course completion
- No modifications for enrollments older than 90 days
- Weekend and holiday restrictions for modifications
```

### **Rule 2: Date Validation Constraints**
```
- End date must be at least 7 days after start date
- Maximum extension: 50% of original course duration
- Cannot set dates in the past
- Cannot overlap with other active enrollments for same student
```

### **Rule 3: Approval Workflow Requirements**
```
- Automatic approval: Date changes within ±3 days of original
- Manager approval: Date changes of ±4-7 days
- Admin approval: Date changes of ±8+ days or any retroactive changes
- Financial review: Any changes affecting billing periods
```

### **Rule 4: Financial Impact Limitations**
```
- No changes affecting completed payment periods
- Maximum 2 modifications per enrollment
- Fee for modifications after 14 days: $25 per change
- Automatic notification to finance team for any changes
```

### **Rule 5: Audit and Compliance**
```
- All changes logged with timestamp, user, and reason
- Email notifications to student and institution
- Monthly audit reports for all modifications
- Annual compliance review of modification patterns
```

### **Rule 6: Student Protection**
```
- Student must be notified 48 hours before any date changes
- Student can dispute changes within 7 days
- Automatic refund calculation for any financial impact
- Right to cancel enrollment if dates are modified without consent
```

### **Rule 7: Institution Safeguards**
```
- Institution must approve changes affecting their courses
- Commission calculations locked for completed periods
- Performance metrics unaffected by date modifications
- Reputation protection through transparent communication
```

## Implementation Guidelines

### **Technical Requirements**
```typescript
interface EnrollmentModificationPolicy {
  maxModificationWindow: number; // days from enrollment start
  maxExtensionPercentage: number; // % of original duration
  requiresApproval: boolean;
  approvalLevel: 'automatic' | 'manager' | 'admin' | 'financial';
  auditRequired: boolean;
  notificationRequired: boolean;
  financialImpactAssessment: boolean;
}
```

### **Database Schema Changes**
```sql
-- Track original dates separately
ALTER TABLE student_course_enrollments 
ADD COLUMN original_start_date DATE,
ADD COLUMN original_end_date DATE,
ADD COLUMN modification_count INT DEFAULT 0,
ADD COLUMN last_modified_by VARCHAR(36),
ADD COLUMN last_modified_at TIMESTAMP;

-- Audit table for all modifications
CREATE TABLE enrollment_modifications (
  id VARCHAR(36) PRIMARY KEY,
  enrollment_id VARCHAR(36),
  original_start_date DATE,
  original_end_date DATE,
  new_start_date DATE,
  new_end_date DATE,
  reason TEXT,
  modified_by VARCHAR(36),
  modified_at TIMESTAMP,
  approval_status ENUM('pending', 'approved', 'rejected'),
  approved_by VARCHAR(36),
  approved_at TIMESTAMP,
  financial_impact DECIMAL(10,2),
  notification_sent BOOLEAN DEFAULT FALSE
);
```

### **User Interface Requirements**
```typescript
interface ModificationForm {
  reason: string; // Required field with predefined options
  justification: string; // Detailed explanation
  financialImpact: boolean; // Checkbox acknowledging financial implications
  studentNotification: boolean; // Checkbox for student notification
  approvalRequired: boolean; // Auto-determined based on rules
}
```

### **Notification Requirements**
```typescript
interface NotificationTriggers {
  student: {
    beforeModification: boolean; // 48-hour notice
    afterModification: boolean; // Immediate notification
    disputeWindow: number; // 7 days to dispute
  };
  institution: {
    approvalRequired: boolean; // For their courses
    notificationRequired: boolean; // For all changes
  };
  finance: {
    automaticNotification: boolean; // For any financial impact
    monthlyReport: boolean; // Summary of all changes
  };
}
```

## Risk Mitigation Strategies

### **1. Gradual Rollout**
- Phase 1: Read-only with approval workflow
- Phase 2: Limited modifications with strict rules
- Phase 3: Full functionality with all safeguards

### **2. Monitoring and Alerts**
- Real-time alerts for unusual modification patterns
- Weekly reports on modification frequency and reasons
- Automated flagging of potential abuse

### **3. Training and Documentation**
- Comprehensive training for authorized users
- Clear documentation of business rules
- Regular review and updates of policies

### **4. Legal Protection**
- Terms of service updates to cover modifications
- Liability limitations for date changes
- Dispute resolution procedures

## Predefined Reason Codes

### **Student-Initiated Reasons**
- `STUDENT_ILLNESS` - Medical documentation required
- `STUDENT_EMERGENCY` - Emergency documentation required
- `STUDENT_SCHEDULE_CONFLICT` - Work/school schedule change
- `STUDENT_TECHNICAL_ISSUES` - Platform access problems

### **Institution-Initiated Reasons**
- `INSTITUTION_COURSE_UPDATE` - Course content or structure changes
- `INSTITUTION_INSTRUCTOR_CHANGE` - Instructor availability issues
- `INSTITUTION_SYSTEM_MAINTENANCE` - Platform maintenance affecting access
- `INSTITUTION_ACCOMMODATION` - Disability or accessibility accommodation

### **System-Initiated Reasons**
- `SYSTEM_ERROR_CORRECTION` - Fix for system-generated errors
- `SYSTEM_DATA_MIGRATION` - Data migration or cleanup
- `SYSTEM_COMPLIANCE_UPDATE` - Regulatory compliance requirements

## Approval Matrix

| Change Type | Approval Level | Required Documentation |
|-------------|----------------|----------------------|
| ±1-3 days | Automatic | Reason code only |
| ±4-7 days | Manager | Reason + justification |
| ±8-14 days | Admin | Reason + justification + impact assessment |
| ±15+ days | Financial Review | All above + financial impact analysis |
| Retroactive changes | Executive | All above + legal review |

## Financial Impact Assessment

### **Calculation Factors**
- Days added/removed from enrollment period
- Per-day course cost
- Payment schedule adjustments
- Commission impact on institution
- Refund calculations if applicable

### **Thresholds**
- < $50 impact: Automatic approval
- $50-$200 impact: Manager approval
- $200-$500 impact: Admin approval
- > $500 impact: Financial review required

## Compliance Requirements

### **Data Retention**
- All modification records retained for 7 years
- Original dates preserved indefinitely
- Audit logs maintained for regulatory compliance

### **Reporting Requirements**
- Monthly modification summary reports
- Quarterly compliance reviews
- Annual policy effectiveness assessment

### **Documentation Standards**
- All modifications must include business justification
- Financial impact must be calculated and documented
- Student consent must be recorded for any changes

---

**Document Version:** 1.0  
**Last Updated:** [Current Date]  
**Next Review:** [6 months from current date]  
**Approved By:** [To be filled]  
**Implementation Deadline:** [To be determined] 